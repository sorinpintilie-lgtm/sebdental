import json
import re
from collections import Counter, defaultdict
from pathlib import Path

import fitz


NUMERIC_CODE_RE = re.compile(r"\b\d{3}\s\d{3}\s\d{3}A?\s\d{3}\s\d{3}\b")
ALPHA_CODE_RE = re.compile(r"\b[A-Z]\d\s\dR\d\sU\d{2}\b", re.IGNORECASE)


def normalize_code(code: str) -> str:
    return " ".join(code.split()).upper()


def find_codes_in_text(text: str):
    codes = set()
    for m in NUMERIC_CODE_RE.finditer(text):
        codes.add(normalize_code(m.group(0)))
    for m in ALPHA_CODE_RE.finditer(text):
        codes.add(normalize_code(m.group(0)))
    return codes


def parse_line_texts(page: fitz.Page):
    raw_words = page.get_text("words")
    buckets = {}
    for x0, y0, x1, y1, text, block_no, line_no, word_no in raw_words:
        key = (block_no, line_no)
        buckets.setdefault(key, []).append((word_no, text))

    lines = []
    for words in buckets.values():
        words = [w for _, w in sorted(words, key=lambda x: x[0])]
        text = " ".join(words).strip()
        if text:
            lines.append(text)
    return lines


def find_codes_in_page_lines(page: fitz.Page):
    codes = set()
    for line in parse_line_texts(page):
        codes.update(find_codes_in_text(line))
    return codes


def family_code(code: str):
    parts = code.split()
    if len(parts) == 3 and parts[0].startswith("W"):
        return " ".join(parts[:2])
    if len(parts) >= 3:
        return " ".join(parts[:3])
    return code


def main():
    root = Path(".")
    products_path = root / "all_catalogs_products" / "all_products.json"
    out_json = root / "all_catalogs_products" / "audit_report.json"
    out_md = root / "all_catalogs_products" / "audit_report.md"

    products = json.loads(products_path.read_text(encoding="utf-8"))

    by_catalog = defaultdict(list)
    for p in products:
        by_catalog[p.get("catalog_file", "unknown")].append(p)

    catalog_checks = []
    missing_code_examples = {}

    for catalog_file, rows in sorted(by_catalog.items()):
        pdf_path = root / catalog_file
        if not pdf_path.exists():
            # Keep compatibility with encoded file names in JSON (e.g. &amp;)
            candidates = list(root.glob(catalog_file.replace("&amp;", "*")[:40] + "*.pdf"))
            if candidates:
                pdf_path = candidates[0]

        pdf_codes = set()
        if pdf_path.exists():
            doc = fitz.open(str(pdf_path))
            for page in doc:
                pdf_codes.update(find_codes_in_page_lines(page))

        extracted_codes = {normalize_code(r["product_code"]) for r in rows if r.get("product_code")}
        missing = sorted(pdf_codes - extracted_codes)
        extra = sorted(extracted_codes - pdf_codes)

        catalog_checks.append(
            {
                "catalog_file": catalog_file,
                "pdf_codes_detected": len(pdf_codes),
                "extracted_codes": len(extracted_codes),
                "missing_in_extraction": len(missing),
                "extra_not_found_in_pdf": len(extra),
            }
        )

        if missing:
            missing_code_examples[catalog_file] = missing[:15]

    mismatch_rows = []
    for p in products:
        detected = p.get("working_diameter_mm_detected")
        from_code = p.get("working_diameter_mm_from_code")
        if detected is None or from_code is None:
            continue
        if abs(detected - from_code) > 0.051:
            mismatch_rows.append(
                {
                    "catalog_file": p.get("catalog_file"),
                    "product_code": p.get("product_code"),
                    "page": p.get("page"),
                    "detected": detected,
                    "from_code": from_code,
                }
            )

    image_by_file = Counter(p.get("image_file") for p in products if p.get("image_file"))
    heavy_reuse = [{"image_file": k, "uses": v} for k, v in image_by_file.items() if v >= 6]
    heavy_reuse.sort(key=lambda x: x["uses"], reverse=True)

    family_missing_image = []
    fam_groups = defaultdict(list)
    for p in products:
        fam_groups[(p.get("catalog_file"), family_code(p.get("product_code", "")), p.get("page"))].append(p)

    for (catalog, fam, page), rows in fam_groups.items():
        with_img = sum(1 for r in rows if r.get("image_file"))
        without_img = sum(1 for r in rows if not r.get("image_file"))
        if with_img > 0 and without_img > 0:
            family_missing_image.append(
                {
                    "catalog_file": catalog,
                    "family": fam,
                    "page": page,
                    "with_image": with_img,
                    "without_image": without_img,
                }
            )

    family_missing_image.sort(key=lambda x: x["without_image"], reverse=True)

    report = {
        "totals": {
            "products": len(products),
            "catalogs": len(by_catalog),
            "diameter_mismatch_rows": len(mismatch_rows),
            "families_with_partial_image_coverage": len(family_missing_image),
            "heavily_reused_images_6plus": len(heavy_reuse),
        },
        "catalog_code_coverage": catalog_checks,
        "missing_code_examples": missing_code_examples,
        "diameter_mismatch_examples": mismatch_rows[:80],
        "family_partial_image_examples": family_missing_image[:80],
        "heavily_reused_image_examples": heavy_reuse[:80],
    }

    out_json.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    lines = ["# Extraction Audit Report", "", "## Totals", ""]
    for k, v in report["totals"].items():
        lines.append(f"- {k}: {v}")
    lines += ["", "## Catalog Code Coverage", ""]
    for row in catalog_checks:
        lines.append(
            "- {catalog_file}: pdf_codes={pdf_codes_detected}, extracted={extracted_codes}, missing={missing_in_extraction}, extra={extra_not_found_in_pdf}".format(
                **row
            )
        )

    out_md.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote: {out_json}")
    print(f"Wrote: {out_md}")


if __name__ == "__main__":
    main()

