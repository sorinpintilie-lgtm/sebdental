import csv
import json
import re
from collections import defaultdict
from pathlib import Path


ALPHA_CODE_RE = re.compile(r"^[A-Z]\d\s\dR\d\sU\d{2}$", re.IGNORECASE)
NUMERIC_5_RE = re.compile(r"^(\d{3}\s\d{3}\s[0-9A-Z]{3,5}\s[0-9A-Z]{3}\s[0-9A-Z]{3})")
NUMERIC_4_RE = re.compile(r"^(\d{3}\s\d{3}\s[0-9A-Z]{3,5}\s[0-9A-Z]{3})")
THREE_DIGIT_RE = re.compile(r"^\d{3}$")
TOKEN_WITH_AG_RE = re.compile(r"^[0-9A-Z]+AG$", re.IGNORECASE)


def normalize_spaces(value: str) -> str:
    return " ".join(value.strip().upper().split())


def numeric_normalized_5(code: str):
    parts = normalize_spaces(code).split()
    if len(parts) < 5:
        return None

    out = []
    for token in parts[:5]:
        digits = "".join(ch for ch in token if ch.isdigit())
        if not digits:
            return None
        out.append(digits.zfill(3)[-3:])
    return " ".join(out)


def family_code(code: str):
    code = normalize_spaces(code)
    if ALPHA_CODE_RE.match(code):
        return " ".join(code.split()[:2])
    parts = code.split()
    if len(parts) >= 3:
        return " ".join(parts[:3])
    return code


def normalize_family_token(token: str) -> str:
    token = normalize_spaces(token)
    if TOKEN_WITH_AG_RE.match(token):
        # Some image names use tokens like 201AG, while products use 201A.
        return token[:-1]
    return token


def parse_diameter_from_token(token: str):
    digits = "".join(ch for ch in token if ch.isdigit())
    if not digits:
        return None
    return digits.zfill(3)[-3:]


def diameter_token(code: str):
    code = normalize_spaces(code)
    if ALPHA_CODE_RE.match(code):
        parts = code.split()
        if len(parts) == 3 and len(parts[2]) >= 2:
            return "".join(ch for ch in parts[2][1:] if ch.isdigit()).zfill(3)[-3:]
        return None

    parts = code.split()
    if len(parts) >= 5:
        digits = "".join(ch for ch in parts[4] if ch.isdigit())
        if digits:
            return digits.zfill(3)[-3:]
    return None


def parse_image_code_from_filename(file_name: str):
    stem = Path(file_name).stem
    base = stem.split(" (")[0].strip()
    base = normalize_spaces(base)

    if ALPHA_CODE_RE.match(base):
        return base, family_code(base), diameter_token(base)

    m5 = NUMERIC_5_RE.match(base)
    if m5:
        code = normalize_spaces(m5.group(1))
        parts = code.split()
        if len(parts) >= 3:
            parts[2] = normalize_family_token(parts[2])
            code = " ".join(parts)
        return code, family_code(code), diameter_token(code)

    m4 = NUMERIC_4_RE.match(base)
    if m4:
        code4 = normalize_spaces(m4.group(1))
        parts = code4.split()
        if len(parts) >= 3:
            parts[2] = normalize_family_token(parts[2])
            code4 = " ".join(parts)
        diam = parse_diameter_from_token(parts[3]) if len(parts) >= 4 else None
        return None, family_code(code4), diam

    # Flexible fallback for filename styles like:
    # - 500 204 001 SQ 018
    # - 500 314 140 MK 014
    # - 330 000 300 023
    # - 500 347 201AG 170 010
    # - 635 900 LS1 140
    tokens = base.split()
    if len(tokens) >= 4 and THREE_DIGIT_RE.match(tokens[0]) and THREE_DIGIT_RE.match(tokens[1]):
        t3 = normalize_family_token(tokens[2])
        fam = f"{tokens[0]} {tokens[1]} {t3}"
        diam = parse_diameter_from_token(tokens[-1])

        # Build a strict code only for clearly numeric 5-token forms.
        code = None
        if (
            len(tokens) == 5
            and THREE_DIGIT_RE.match(tokens[3])
            and parse_diameter_from_token(tokens[4]) is not None
        ):
            code = f"{tokens[0]} {tokens[1]} {t3} {tokens[3]} {parse_diameter_from_token(tokens[4])}"

        return code, fam, diam

    return None, None, None


def write_csv(rows, path: Path):
    if not rows:
        return
    headers = sorted({k for row in rows for k in row.keys()})
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)


def main():
    root = Path(".")
    images_dir = root / "IMAGESS"
    products_path = root / "all_catalogs_products" / "all_products.json"

    out_json = root / "all_catalogs_products" / "all_products_with_external_images.json"
    out_csv = root / "all_catalogs_products" / "all_products_with_external_images.csv"
    out_report = root / "all_catalogs_products" / "external_image_match_report.json"

    if not images_dir.exists():
        raise SystemExit(f"Image directory not found: {images_dir}")
    if not products_path.exists():
        raise SystemExit(f"Products file not found: {products_path}")

    products = json.loads(products_path.read_text(encoding="utf-8"))
    image_files = sorted([p for p in images_dir.rglob("*") if p.is_file()])

    exact_map = defaultdict(list)
    norm_map = defaultdict(list)
    family_map = defaultdict(list)
    family_diam_map = defaultdict(list)
    unknown_images = []

    for img in image_files:
        parsed_code, parsed_family, parsed_diam = parse_image_code_from_filename(img.name)
        rel = str(img.as_posix())

        if parsed_family:
            family_map[parsed_family].append(rel)

        if parsed_code:
            exact_map[parsed_code].append(rel)
            diam = diameter_token(parsed_code)
            if diam:
                family_diam_map[(parsed_family, diam)].append(rel)
            norm_code = numeric_normalized_5(parsed_code)
            if norm_code:
                norm_map[norm_code].append(rel)
        elif parsed_family and parsed_diam:
            # Allow family+diameter matching for filenames that include extra qualifiers
            # (e.g. SQ/RR/FQ/MK/II/LS1) but not a strict full code.
            family_diam_map[(parsed_family, parsed_diam)].append(rel)
        else:
            unknown_images.append(rel)

    matched = 0
    unmatched = 0
    match_type_counts = defaultdict(int)
    unresolved = []

    for row in products:
        code = normalize_spaces(row.get("product_code", ""))
        fam = family_code(code)
        norm_code = numeric_normalized_5(code)

        matched_file = None
        match_type = "none"

        exact_candidates = exact_map.get(code, [])
        if exact_candidates:
            matched_file = exact_candidates[0]
            match_type = "exact"
        elif norm_code and norm_map.get(norm_code):
            matched_file = norm_map[norm_code][0]
            match_type = "normalized"
        else:
            diam = diameter_token(code)
            if diam:
                fd_candidates = sorted(set(family_diam_map.get((fam, diam), [])))
                if len(fd_candidates) == 1:
                    matched_file = fd_candidates[0]
                    match_type = "family_diameter_unique"

            if not matched_file:
                fam_candidates = sorted(set(family_map.get(fam, [])))
                if len(fam_candidates) == 1:
                    matched_file = fam_candidates[0]
                    match_type = "family_unique"

        row["external_image_file"] = matched_file
        row["external_image_match_type"] = match_type

        if matched_file:
            matched += 1
        else:
            unmatched += 1
            unresolved.append(
                {
                    "catalog_file": row.get("catalog_file"),
                    "product_code": row.get("product_code"),
                    "family": fam,
                }
            )

        match_type_counts[match_type] += 1

    out_json.write_text(json.dumps(products, indent=2, ensure_ascii=False), encoding="utf-8")
    write_csv(products, out_csv)

    report = {
        "products_total": len(products),
        "images_total": len(image_files),
        "matched_products": matched,
        "unmatched_products": unmatched,
        "match_type_counts": dict(sorted(match_type_counts.items())),
        "unparsed_image_files": len(unknown_images),
        "unparsed_image_examples": unknown_images[:100],
        "unmatched_product_examples": unresolved[:200],
    }
    out_report.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Wrote: {out_json}")
    print(f"Wrote: {out_csv}")
    print(f"Wrote: {out_report}")
    print(f"Matched: {matched}/{len(products)}")


if __name__ == "__main__":
    main()

