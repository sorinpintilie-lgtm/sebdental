import csv
import json
import re
import unicodedata
from pathlib import Path

import fitz


CODE_RE = re.compile(r"\b\d{3}\s\d{3}\s\d{3}A?\s\d{3}\s\d{3}\b")
ALPHA_CODE_RE = re.compile(r"\b[A-Z]\d\s\dR\d\sU\d{2}\b", re.IGNORECASE)
YT_RE = re.compile(r"\bYT\d{3}\b", re.IGNORECASE)
DIAM_RE = re.compile(r"\b\d[\.,]\d\b")


def normalize_code(code: str) -> str:
    return " ".join(code.split())


def find_product_codes(text: str):
    matches = []
    for m in CODE_RE.finditer(text):
        matches.append((m.start(), normalize_code(m.group(0))))
    for m in ALPHA_CODE_RE.finditer(text):
        matches.append((m.start(), normalize_code(m.group(0).upper())))

    matches.sort(key=lambda x: x[0])
    seen = set()
    ordered = []
    for _, code in matches:
        if code not in seen:
            seen.add(code)
            ordered.append(code)
    return ordered


def is_numeric_code(code: str) -> bool:
    return bool(CODE_RE.fullmatch(code))


def is_alpha_code(code: str) -> bool:
    return bool(ALPHA_CODE_RE.fullmatch(code))


def parse_lines(page: fitz.Page):
    raw_words = page.get_text("words")
    buckets = {}
    for x0, y0, x1, y1, text, block_no, line_no, word_no in raw_words:
        key = (block_no, line_no)
        if key not in buckets:
            buckets[key] = {
                "y0": y0,
                "y1": y1,
                "x0": x0,
                "x1": x1,
                "words": [],
            }
        buckets[key]["words"].append((word_no, text))
        buckets[key]["y0"] = min(buckets[key]["y0"], y0)
        buckets[key]["y1"] = max(buckets[key]["y1"], y1)
        buckets[key]["x0"] = min(buckets[key]["x0"], x0)
        buckets[key]["x1"] = max(buckets[key]["x1"], x1)

    lines = []
    for value in buckets.values():
        words = [w for _, w in sorted(value["words"], key=lambda x: x[0])]
        text = " ".join(words).strip()
        if text:
            lines.append(
                {
                    "text": text,
                    "y": (value["y0"] + value["y1"]) / 2,
                    "x": (value["x0"] + value["x1"]) / 2,
                }
            )

    lines.sort(key=lambda x: x["y"])
    return lines


def decode_product_code(code: str):
    if is_alpha_code(code):
        parts = code.split()
        if len(parts) != 3:
            return {}

        system_code, profile_code, variant_code = parts
        blades = int(profile_code[0]) if profile_code and profile_code[0].isdigit() else None
        diameter = None
        if len(variant_code) >= 2 and variant_code[1:].isdigit():
            diameter = float(variant_code[1:]) / 10.0

        return {
            "material": None,
            "coating": None,
            "shank_diameter_mm": None,
            "overall_length_mm": None,
            "form": None,
            "blades_from_code": blades,
            "extra_length_mm": None,
            "working_diameter_mm_from_code": diameter,
            "system_code": system_code,
            "profile_code": profile_code,
        }

    parts = code.split()
    if len(parts) != 5:
        return {}

    p1, p2, p3, p4, p5 = parts

    coating_map = {
        "0": "without coating",
        "3": "ac-blue",
        "4": "ac-fire",
        "5": "ac-crystal",
    }
    form_map = {
        "1": "cutter cylindric blunt-edged",
        "2": "cylindric radial cutter",
        "3": "radial cutter conical",
        "4": "cylindric torus cutter",
    }

    p3_digits = "".join(ch for ch in p3 if ch.isdigit())
    decoded = {
        "material": "tungsten carbide" if p1[0] == "5" else None,
        "coating": coating_map.get(p1[1]),
        "shank_diameter_mm": float(p2[0]) if p2 and p2[0].isdigit() else None,
        "overall_length_mm": float(p2[1:]) if len(p2) == 3 and p2[1:].isdigit() else None,
        "form": form_map.get(p3_digits[0]) if len(p3_digits) >= 1 else None,
        "blades_from_code": int(p3_digits[2]) if len(p3_digits) >= 3 else None,
        "extra_length_mm": (float(p4) / 10.0) if p4.isdigit() else None,
        "working_diameter_mm_from_code": (float(p5) / 10.0) if p5.isdigit() else None,
    }
    return decoded


def extract_products_from_page(lines, page_number):
    products = []
    cluster_id = 0

    for line in lines:
        line_text = line["text"]
        line_codes = find_product_codes(line_text)
        if not line_codes:
            continue

        yts = [x.upper() for x in YT_RE.findall(line_text)]
        for idx, code in enumerate(line_codes):
            decoded = decode_product_code(code)
            products.append(
                {
                    "product_code": code,
                    "code_type": "numeric" if is_numeric_code(code) else "alpha",
                    "page": page_number,
                    "y": line["y"],
                    "x": line["x"],
                    "yt_reference": yts[idx] if idx < len(yts) else None,
                    "working_diameter_mm_detected": None,
                    **decoded,
                    "image_file": None,
                    "image_width_px": None,
                    "image_height_px": None,
                    "cluster_id": cluster_id,
                    "cluster_pos": idx,
                    "assign_image": True,
                }
            )

        cluster_id += 1

    return products


def extract_page_images(
    doc: fitz.Document,
    page: fitz.Page,
    image_dir: Path,
    page_number: int,
    page_products,
):
    image_dir.mkdir(parents=True, exist_ok=True)
    results = []
    seen = set()
    code_points = [
        (p.get("x"), p.get("y"))
        for p in page_products
        if p.get("x") is not None and p.get("y") is not None
    ]

    for img in page.get_images(full=True):
        xref = img[0]
        if xref in seen:
            continue
        seen.add(xref)

        rects = page.get_image_rects(xref)
        if not rects:
            continue
        rect = rects[0]
        width = rect.width
        height = rect.height
        page_w = page.rect.width
        page_h = page.rect.height

        # Skip tiny assets and very large hero/marketing images.
        if width < 90 or height < 90:
            continue
        if width > page_w * 0.55 or height > page_h * 0.45:
            continue
        aspect = width / height if height else 0
        if aspect < 0.4 or aspect > 2.6:
            continue

        pix = fitz.Pixmap(doc, xref)
        # Reject low-resolution raster images.
        if pix.width < 100 or pix.height < 100:
            pix = None
            continue
        # Normalize to RGB to ensure PNG export compatibility.
        if pix.colorspace is None or pix.colorspace.n not in (1, 3) or pix.alpha:
            pix = fitz.Pixmap(fitz.csRGB, pix)

        # Keep only images near at least one detected product code on this page.
        if code_points:
            cx = (rect.x0 + rect.x1) / 2
            cy = (rect.y0 + rect.y1) / 2
            nearest_code_dist = min((((cx - x) ** 2 + (cy - y) ** 2) ** 0.5) for x, y in code_points)
            if nearest_code_dist > 200:
                pix = None
                continue

        filename = f"page{page_number:02d}_xref{xref}.png"
        out_path = image_dir / filename
        pix_w, pix_h = pix.width, pix.height
        pix.save(out_path)
        pix = None

        results.append(
            {
                "file": str(out_path.as_posix()),
                "x_center": (rect.x0 + rect.x1) / 2,
                "y_center": (rect.y0 + rect.y1) / 2,
                "width": rect.width,
                "height": rect.height,
                "pixel_width": pix_w,
                "pixel_height": pix_h,
            }
        )

    results.sort(key=lambda x: (x["y_center"], x["x_center"]))
    return results


def assign_code_positions_from_search(page: fitz.Page, products):
    code_rect_cache = {}

    for p in products:
        code = p["product_code"]
        if code in code_rect_cache:
            continue

        rects = page.search_for(code)
        code_rect_cache[code] = [
            {
                "x": (r.x0 + r.x1) / 2,
                "y": (r.y0 + r.y1) / 2,
                "used": False,
            }
            for r in rects
        ]

    for p in products:
        rects = code_rect_cache.get(p["product_code"], [])
        available = [r for r in rects if not r["used"]]
        if not available:
            continue

        px = p.get("x") if p.get("x") is not None else 0.0
        py = p.get("y") if p.get("y") is not None else 0.0

        best = min(available, key=lambda r: ((r["x"] - px) ** 2 + (r["y"] - py) ** 2))
        best["used"] = True
        p["x"] = best["x"]
        p["y"] = best["y"]


def assign_images_to_products(products, images_by_page):
    grouped = {}
    for p in products:
        grouped.setdefault(p["page"], []).append(p)

    for page, page_products in grouped.items():
        page_products.sort(
            key=lambda x: (
                x.get("cluster_id", 10**9),
                x.get("cluster_pos", 10**9),
                x["y"] if x["y"] is not None else 10**9,
            )
        )
        page_images = images_by_page.get(page, [])

        candidates = [p for p in page_products if p.get("assign_image")]
        unused_image_idx = set(range(len(page_images)))

        for product in candidates:
            if not unused_image_idx:
                break

            px = product.get("x") if product.get("x") is not None else 0.0
            py = product.get("y") if product.get("y") is not None else 0.0

            best_idx = min(
                unused_image_idx,
                key=lambda idx: (
                    (page_images[idx]["x_center"] - px) ** 2
                    + (page_images[idx]["y_center"] - py) ** 2
                ),
            )

            dist = (
                (page_images[best_idx]["x_center"] - px) ** 2
                + (page_images[best_idx]["y_center"] - py) ** 2
            ) ** 0.5

            # Distance threshold prevents very unlikely pairings.
            if dist <= 260:
                product["image_file"] = page_images[best_idx]["file"]
                product["image_width_px"] = page_images[best_idx].get("pixel_width")
                product["image_height_px"] = page_images[best_idx].get("pixel_height")
                unused_image_idx.remove(best_idx)


def propagate_family_images(products):
    grouped = {}
    for p in products:
        family = family_code_from_variant(p.get("product_code", ""))
        key = (p.get("page"), family)
        grouped.setdefault(key, []).append(p)

    for group in grouped.values():
        with_image = [p for p in group if p.get("image_file")]
        if not with_image:
            continue

        unique_images = sorted({p["image_file"] for p in with_image})
        if len(unique_images) == 1:
            source = with_image[0]
            for p in group:
                if not p.get("image_file"):
                    p["image_file"] = unique_images[0]
                    p["image_width_px"] = source.get("image_width_px")
                    p["image_height_px"] = source.get("image_height_px")
            continue

        for p in group:
            if p.get("image_file"):
                continue
            py = p.get("y") if p.get("y") is not None else 0.0
            nearest = min(
                with_image,
                key=lambda src: abs((src.get("y") if src.get("y") is not None else 0.0) - py),
            )
            p["image_file"] = nearest.get("image_file")
            p["image_width_px"] = nearest.get("image_width_px")
            p["image_height_px"] = nearest.get("image_height_px")


def dedupe_products(products):
    by_code = {}
    for p in products:
        code = p["product_code"]
        if code not in by_code:
            by_code[code] = p
            continue

        # Merge metadata, preferring non-null values.
        merged = dict(by_code[code])
        for key, value in p.items():
            if merged.get(key) is None and value is not None:
                merged[key] = value

        # Prefer record with image if one exists.
        if merged.get("image_file") is None and p.get("image_file") is not None:
            merged["image_file"] = p["image_file"]

        by_code[code] = merged

    return sorted(by_code.values(), key=lambda x: x["product_code"])


def build_fallback_maps(page: fitz.Page):
    yt_map = {}
    diam_map = {}
    lines = [ln.strip() for ln in page.get_text("text").splitlines() if ln.strip()]

    def is_diameter_header(text: str) -> bool:
        compact = text.upper().replace(" ", "")
        return compact in {"ØMM", "ØMMMM", "ØMM\u2009\u2009"} or ("Ø" in text and "MM" in text.upper())

    def looks_like_diameter_line(text: str) -> bool:
        values = DIAM_RE.findall(text)
        if not values:
            return False
        remainder = DIAM_RE.sub("", text)
        remainder = re.sub(r"[\s,;|/•·\-]", "", remainder)
        return remainder == ""

    i = 0
    while i < len(lines):
        line = lines[i]
        found_codes = find_product_codes(line)
        if not found_codes:
            i += 1
            continue

        block_codes = []
        while i < len(lines):
            codes_here = find_product_codes(lines[i])
            if not codes_here:
                break
            block_codes.extend(codes_here)
            i += 1

        # Detect YT references in local window after code block.
        window_lines = []
        w = i
        while w < len(lines) and w < i + 6 and not find_product_codes(lines[w]):
            window_lines.append(lines[w])
            w += 1
        yts = [x.upper() for x in YT_RE.findall(" ".join(window_lines))]
        for idx, code in enumerate(block_codes):
            if idx < len(yts) and code not in yt_map:
                yt_map[code] = yts[idx]

        # Detect diameter table directly following the code block.
        j = i
        header_skips = 0
        while j < len(lines) and header_skips < 2 and is_diameter_header(lines[j]):
            j += 1
            header_skips += 1

        diam_values = []
        k = j
        while k < len(lines):
            if find_product_codes(lines[k]):
                break
            if looks_like_diameter_line(lines[k]):
                diam_values.extend(DIAM_RE.findall(lines[k]))
                k += 1
                continue
            if not diam_values and is_diameter_header(lines[k]):
                k += 1
                continue
            break

        if diam_values:
            for idx, code in enumerate(block_codes):
                if idx >= len(diam_values):
                    break
                value = float(diam_values[idx].replace(",", "."))
                from_code = decode_product_code(code).get("working_diameter_mm_from_code")
                # Keep only plausible matches to avoid cross-row misalignment.
                if from_code is None or abs(value - from_code) <= 0.051:
                    if code not in diam_map:
                        diam_map[code] = value

    return yt_map, diam_map


def apply_fallback_maps(products, yt_map, diam_map):
    for product in products:
        code = product["product_code"]
        if product.get("yt_reference") is None and code in yt_map:
            product["yt_reference"] = yt_map[code]
        if product.get("working_diameter_mm_detected") is None and code in diam_map:
            mapped = diam_map[code]
            from_code = product.get("working_diameter_mm_from_code")
            if from_code is None or abs(mapped - from_code) <= 0.051:
                product["working_diameter_mm_detected"] = mapped


def write_outputs(products, out_dir: Path):
    out_dir.mkdir(parents=True, exist_ok=True)

    json_path = out_dir / "products.json"
    csv_path = out_dir / "products.csv"

    for p in products:
        p.pop("cluster_id", None)
        p.pop("cluster_pos", None)
        p.pop("assign_image", None)

    with json_path.open("w", encoding="utf-8") as f:
        json.dump(products, f, indent=2, ensure_ascii=False)

    if products:
        headers = sorted({k for row in products for k in row.keys()})
        with csv_path.open("w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            writer.writerows(products)

    return json_path, csv_path


def safe_slug(name: str) -> str:
    normalized = unicodedata.normalize("NFKD", name)
    ascii_name = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", ascii_name).strip("-").lower()
    return slug or "catalog"


def family_code_from_variant(code: str) -> str:
    if is_alpha_code(code):
        parts = code.split()
        if len(parts) >= 2:
            return " ".join(parts[:2])

    parts = code.split()
    if len(parts) >= 3:
        return " ".join(parts[:3])
    return code


def build_products_with_variants(variant_rows):
    grouped = {}
    for row in variant_rows:
        family_code = family_code_from_variant(row["product_code"])
        key = (row.get("catalog_file"), family_code)
        if key not in grouped:
            grouped[key] = {
                "catalog_file": row.get("catalog_file"),
                "product_family_code": family_code,
                "material": row.get("material"),
                "coating": row.get("coating"),
                "shank_diameter_mm": row.get("shank_diameter_mm"),
                "overall_length_mm": row.get("overall_length_mm"),
                "form": row.get("form"),
                "blades_from_code": row.get("blades_from_code"),
                "system_code": row.get("system_code"),
                "profile_code": row.get("profile_code"),
                "variants": [],
            }

        detected = row.get("working_diameter_mm_detected")
        from_code = row.get("working_diameter_mm_from_code")
        final_diameter = from_code if from_code is not None else detected
        diameter_match = None
        if detected is not None and from_code is not None:
            diameter_match = abs(detected - from_code) < 0.051
        needs_review = bool(detected is not None and from_code is not None and not diameter_match)

        grouped[key]["variants"].append(
            {
                "variant_code": row.get("product_code"),
                "code_type": row.get("code_type"),
                "page": row.get("page"),
                "yt_reference": row.get("yt_reference"),
                "extra_length_mm": row.get("extra_length_mm"),
                "working_diameter_mm_from_code": from_code,
                "working_diameter_mm_detected": detected,
                "working_diameter_mm_final": final_diameter,
                "diameter_match": diameter_match,
                "needs_review": needs_review,
                "image_file": row.get("image_file"),
                "image_assigned": bool(row.get("image_file")),
                "image_width_px": row.get("image_width_px"),
                "image_height_px": row.get("image_height_px"),
            }
        )

    products = []
    for product in grouped.values():
        product["variant_count"] = len(product["variants"])
        products.append(product)

    products.sort(key=lambda p: (p.get("catalog_file") or "", p.get("product_family_code") or ""))
    return products


def extract_catalog(pdf_path: Path, output_root: Path):
    catalog_slug = safe_slug(pdf_path.stem)
    output_dir = output_root / catalog_slug
    image_dir = output_dir / "images"

    doc = fitz.open(str(pdf_path))
    all_products = []
    images_by_page = {}
    yt_fallback_map = {}
    diam_fallback_map = {}

    for page_index in range(len(doc)):
        page = doc[page_index]
        page_number = page_index + 1
        lines = parse_lines(page)

        page_products = extract_products_from_page(lines, page_number)
        assign_code_positions_from_search(page, page_products)
        for p in page_products:
            p["catalog_file"] = pdf_path.name
        all_products.extend(page_products)

        page_yt_map, page_diam_map = build_fallback_maps(page)
        yt_fallback_map.update(page_yt_map)
        diam_fallback_map.update(page_diam_map)

        if page_products:
            images_by_page[page_number] = extract_page_images(
                doc,
                page,
                image_dir,
                page_number,
                page_products,
            )

    assign_images_to_products(all_products, images_by_page)
    products = dedupe_products(all_products)
    apply_fallback_maps(products, yt_fallback_map, diam_fallback_map)
    propagate_family_images(products)
    write_outputs(products, output_dir)

    return products, output_dir


def main():
    pdf_files = sorted(Path(".").glob("*.pdf"))
    if not pdf_files:
        raise SystemExit("No PDF files found in current directory.")

    output_root = Path("all_catalogs_products")
    output_root.mkdir(parents=True, exist_ok=True)

    all_products = []
    per_catalog_summary = []

    for pdf_path in pdf_files:
        products, catalog_output_dir = extract_catalog(pdf_path, output_root)
        all_products.extend(products)
        per_catalog_summary.append(
            {
                "catalog_file": pdf_path.name,
                "products_extracted": len(products),
                "output_dir": str(catalog_output_dir.as_posix()),
            }
        )

    consolidated_json = output_root / "all_products.json"
    consolidated_csv = output_root / "all_products.csv"
    products_with_variants_json = output_root / "products_with_variants.json"
    summary_json = output_root / "summary.json"
    qa_summary_json = output_root / "qa_summary.json"

    with consolidated_json.open("w", encoding="utf-8") as f:
        json.dump(all_products, f, indent=2, ensure_ascii=False)

    if all_products:
        headers = sorted({k for row in all_products for k in row.keys()})
        with consolidated_csv.open("w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            writer.writerows(all_products)

    products_with_variants = build_products_with_variants(all_products)
    with products_with_variants_json.open("w", encoding="utf-8") as f:
        json.dump(products_with_variants, f, indent=2, ensure_ascii=False)

    variant_rows = [v for p in products_with_variants for v in p["variants"]]
    qa_summary = {
        "variants_total": len(variant_rows),
        "variants_with_image": sum(1 for v in variant_rows if v.get("image_file")),
        "variants_with_image_min_100px": sum(
            1
            for v in variant_rows
            if v.get("image_file")
            and (v.get("image_width_px") or 0) >= 100
            and (v.get("image_height_px") or 0) >= 100
        ),
        "variants_with_yt_reference": sum(1 for v in variant_rows if v.get("yt_reference")),
        "variants_with_diameter_from_code": sum(
            1 for v in variant_rows if v.get("working_diameter_mm_from_code") is not None
        ),
        "variants_with_detected_diameter": sum(
            1 for v in variant_rows if v.get("working_diameter_mm_detected") is not None
        ),
        "variants_with_final_diameter": sum(
            1 for v in variant_rows if v.get("working_diameter_mm_final") is not None
        ),
        "variants_with_diameter_match": sum(1 for v in variant_rows if v.get("diameter_match") is True),
        "variants_needing_review": sum(1 for v in variant_rows if v.get("needs_review") is True),
        "products_total": len(products_with_variants),
    }
    with qa_summary_json.open("w", encoding="utf-8") as f:
        json.dump(qa_summary, f, indent=2, ensure_ascii=False)

    with summary_json.open("w", encoding="utf-8") as f:
        json.dump(
            {
                "catalogs_processed": len(pdf_files),
                "total_products_extracted": len(all_products),
                "catalogs": per_catalog_summary,
            },
            f,
            indent=2,
            ensure_ascii=False,
        )

    print(f"Processed {len(pdf_files)} PDF catalogs.")
    print(f"Total extracted products: {len(all_products)}")
    print(f"Consolidated JSON: {consolidated_json}")
    print(f"Consolidated CSV: {consolidated_csv}")
    print(f"Products with variants JSON: {products_with_variants_json}")
    print(f"Summary: {summary_json}")
    print(f"QA summary: {qa_summary_json}")


if __name__ == "__main__":
    main()
