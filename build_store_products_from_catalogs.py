import json
import re
import shutil
from pathlib import Path


ROOT = Path(".")
MATCHED_PRODUCTS_PATH = ROOT / "all_catalogs_products" / "all_products_with_external_images.json"
OUTPUT_JSON_PATH = ROOT / "data" / "store-products.generated.json"
PUBLIC_IMAGES_DIR = ROOT / "public" / "catalog-images"


def normalize_spaces(value: str) -> str:
    return " ".join((value or "").strip().split())


def family_code(product_code: str) -> str:
    code = normalize_spaces(product_code).upper()
    parts = code.split()
    if len(parts) == 3 and re.match(r"^[A-Z]\d$", parts[0]) and re.match(r"^\dR\d$", parts[1]) and re.match(r"^U\d{2}$", parts[2]):
        return " ".join(parts[:2])
    if len(parts) >= 3:
        return " ".join(parts[:3])
    return code


def slugify(value: str) -> str:
    s = value.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s or "produs"


def to_safe_filename(name: str) -> str:
    stem = Path(name).stem
    suffix = Path(name).suffix.lower() or ".jpg"
    safe = re.sub(r"[^a-zA-Z0-9]+", "-", stem).strip("-").lower()
    safe = re.sub(r"-+", "-", safe)
    if not safe:
        safe = "image"
    return f"{safe}{suffix}"


def brand_from_catalog(catalog_file: str) -> str:
    c = (catalog_file or "").upper()
    if "CHIRURGIE" in c:
        return "Meisinger"
    if "LABORATOR" in c:
        return "NTI"
    if "SIRONA" in c:
        return "KaVo"
    if "IVOCLAR" in c:
        return "Edenta"
    if "VHF" in c:
        return "Prima Dental"
    if "ROLAND" in c:
        return "Busch"
    if "AMANN GIRRBACH" in c or "IMES-ICORE" in c or "KULZER" in c:
        return "Horico"
    return "Komet"


def application_from_catalog(catalog_file: str):
    c = (catalog_file or "").upper()
    if "CHIRURGIE" in c:
        return ["Chirurgie", "Tăiere"]
    if "LABORATOR" in c:
        return ["Laborator", "Ajustare"]
    if "CABINET" in c:
        return ["Cabinet", "Finisare"]
    return ["Protetică", "Ajustare"]


def map_material(raw: str) -> str:
    v = (raw or "").lower()
    if "carbide" in v:
        return "Carbid"
    if "diam" in v:
        return "Diamant"
    if "ceram" in v:
        return "Ceramică"

    # Fallback by code family when extracted metadata is missing.
    # Keep this conservative to avoid inventing false details.
    return "Nespecificat"


def infer_material_from_code(product_code: str) -> str:
    code = normalize_spaces(product_code)
    first_group = code.split()[0] if code.split() else ""
    if first_group.startswith("5"):
        return "Carbid"
    if first_group.startswith(("0", "1")):
        return "Diamant"
    return "Nespecificat"


def map_coating_label(coating: str | None):
    if not coating:
        return None

    v = coating.lower().strip()
    if v == "without coating":
        return "Fără acoperire"
    if v == "ac-blue":
        return "AC-Blue"
    if v == "ac-crystal":
        return "AC-Crystal"
    if v == "ac-fire":
        return "AC-Fire"
    return coating


def map_grit(coating: str) -> str:
    v = (coating or "").lower()
    if not v:
        return "Nespecificată"
    if "blue" in v:
        return "Fină"
    if "crystal" in v:
        return "Medie"
    if "fire" in v:
        return "Grosieră"
    return "Nespecificată"


def map_color(coating: str) -> str:
    v = (coating or "").lower()
    if not v:
        return "Nespecificat"
    if "blue" in v:
        return "Albastru"
    if "crystal" in v:
        return "Verde"
    if "fire" in v:
        return "Roșu"
    if "without" in v:
        return "Fără cod culoare"
    return "Nespecificat"


def map_shape(form: str | None) -> str:
    if not form:
        return "Standard"

    v = normalize_spaces(form).lower()
    shape_map = {
        "cutter cylindric blunt-edged": "Cilindrică cu capăt drept",
        "cylindric radial cutter": "Cilindrică cu tăiere radială",
        "radial cutter conical": "Conică cu tăiere radială",
        "cylindric torus cutter": "Cilindrică tip torus",
        "standard": "Standard",
    }
    return shape_map.get(v, normalize_spaces(form).capitalize())


def map_external_match_type(match_type: str | None) -> str:
    m = (match_type or "none").lower()
    labels = {
        "exact": "exact",
        "normalized": "normalizat",
        "family_diameter_unique": "familie + diametru",
        "family_unique": "familie",
        "none": "fără potrivire",
    }
    return labels.get(m, m)


def match_quality_rank(match_type: str | None) -> int:
    m = (match_type or "none").lower()
    ranks = {
        "exact": 5,
        "normalized": 4,
        "family_diameter_unique": 3,
        "family_unique": 2,
        "none": 1,
    }
    return ranks.get(m, 0)


def catalog_quality_rank(catalog_file: str | None) -> int:
    c = (catalog_file or "").upper()
    if "CABINET" in c:
        return 5
    if "LABORATOR" in c:
        return 4
    if "CHIRURGIE" in c:
        return 3
    if "CATALOG1" in c:
        return 2
    return 1


def row_quality_score(row: dict) -> int:
    score = 0
    if row.get("material"):
        score += 1
    if row.get("coating") not in (None, "None", ""):
        score += 1
    if row.get("form"):
        score += 1
    if isinstance(row.get("working_diameter_mm_detected"), (int, float)):
        score += 1
    return score


def map_shank(product_code: str, shank_diameter_mm):
    code = normalize_spaces(product_code).upper()
    parts = code.split()
    if len(parts) >= 2 and parts[1].isdigit():
        code2 = parts[1]
        if code2 in {"314", "315", "316", "317", "338", "347", "448", "648", "653"}:
            return "FG"
        if code2 in {"204", "205", "206", "207"}:
            return "RA"
        if code2 in {"104", "105", "106"}:
            return "HP"

    try:
        d = float(shank_diameter_mm)
        return "FG" if d <= 1.8 else "RA"
    except (TypeError, ValueError):
        return "FG"


def parse_diameter_from_code(product_code: str):
    parts = normalize_spaces(product_code).split()
    if not parts:
        return None
    tail = parts[-1]
    digits = "".join(ch for ch in tail if ch.isdigit())
    if not digits:
        return None
    value = int(digits) / 10.0
    if 0.3 <= value <= 20.0:
        return value
    return None


def pick_diameter(row: dict) -> float:
    detected = row.get("working_diameter_mm_detected")
    if isinstance(detected, (int, float)) and 0.3 <= float(detected) <= 20.0:
        return round(float(detected), 1)

    from_code = row.get("working_diameter_mm_from_code")
    if isinstance(from_code, (int, float)) and 0.3 <= float(from_code) <= 20.0:
        return round(float(from_code), 1)

    parsed = parse_diameter_from_code(row.get("product_code", ""))
    if parsed is not None:
        return round(parsed, 1)

    return 2.0


def price_for_row(row: dict, diameter: float) -> int:
    coating = (row.get("coating") or "").lower()
    base = 55 + diameter * 12
    if coating and coating != "none":
        base += 8
    return int(round(base))


def make_stock(code: str):
    checksum = sum(ord(ch) for ch in code)
    if checksum % 13 == 0:
        return "backorder"
    if checksum % 7 == 0:
        return "low_stock"
    return "in_stock"


def make_rating(code: str):
    checksum = sum(ord(ch) for ch in code)
    return round(4.2 + ((checksum % 8) * 0.1), 1)


def copy_external_images(rows):
    PUBLIC_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    mapping = {}
    used_names = set()

    for row in rows:
        src_rel = row.get("external_image_file")
        if not src_rel:
            continue

        src = ROOT / src_rel
        if not src.exists():
            continue

        safe_name = to_safe_filename(src.name)
        if safe_name in used_names:
            i = 2
            candidate = safe_name
            while candidate in used_names:
                candidate = f"{Path(safe_name).stem}-{i}{Path(safe_name).suffix}"
                i += 1
            safe_name = candidate

        used_names.add(safe_name)
        dst = PUBLIC_IMAGES_DIR / safe_name
        if not dst.exists():
            shutil.copy2(src, dst)

        mapping[src_rel] = f"/catalog-images/{safe_name}"

    return mapping


def build_store_products(rows, image_path_map):
    matched_rows = [r for r in rows if r.get("external_image_file") in image_path_map]
    matched_rows.sort(key=lambda r: normalize_spaces(r.get("product_code", "")))

    # Canonicalize to a single row per SKU to avoid duplicate products with conflicting metadata.
    rows_by_code = {}
    for r in matched_rows:
        code = normalize_spaces(r.get("product_code", ""))
        if not code:
            continue
        rows_by_code.setdefault(code, []).append(r)

    canonical_rows = []
    code_catalogs = {}
    code_applications = {}
    code_brand = {}

    for code, group in rows_by_code.items():
        best = max(
            group,
            key=lambda r: (
                match_quality_rank(r.get("external_image_match_type")),
                row_quality_score(r),
                catalog_quality_rank(r.get("catalog_file")),
            ),
        )
        canonical_rows.append(best)

        catalogs = sorted({g.get("catalog_file") for g in group if g.get("catalog_file")})
        code_catalogs[code] = catalogs

        app_union = []
        seen_app = set()
        for g in group:
            for app in application_from_catalog(g.get("catalog_file", "")):
                if app not in seen_app:
                    seen_app.add(app)
                    app_union.append(app)
        code_applications[code] = app_union or application_from_catalog(best.get("catalog_file", ""))

        brand_candidates = {brand_from_catalog(g.get("catalog_file", "")) for g in group}
        code_brand[code] = next(iter(brand_candidates)) if len(brand_candidates) == 1 else "Nespecificat"

    canonical_rows.sort(key=lambda r: normalize_spaces(r.get("product_code", "")))

    families = {}
    for r in canonical_rows:
        fam = family_code(r.get("product_code", ""))
        families.setdefault(fam, []).append(normalize_spaces(r.get("product_code", "")))

    used_slugs = set()

    products = []
    for idx, r in enumerate(canonical_rows, start=1):
        code = normalize_spaces(r.get("product_code", ""))
        fam = family_code(code)
        variants = sorted(set(families.get(fam, [])))
        material_raw = map_material(r.get("material"))
        material = material_raw if material_raw != "Nespecificat" else infer_material_from_code(code)
        coating_raw = r.get("coating") if r.get("coating") not in (None, "None") else None
        coating = map_coating_label(coating_raw)
        shank = map_shank(code, r.get("shank_diameter_mm"))
        diameter = pick_diameter(r)
        shape = map_shape(r.get("form"))
        grit = map_grit(coating_raw or "")
        color = map_color(coating_raw or "")
        brand = code_brand.get(code) or brand_from_catalog(r.get("catalog_file", ""))
        app = code_applications.get(code) or application_from_catalog(r.get("catalog_file", ""))
        price = price_for_row(r, diameter)
        image = image_path_map[r.get("external_image_file")]
        match_label = map_external_match_type(r.get("external_image_match_type"))
        catalog_source = r.get("catalog_file") or ""
        catalogs_for_code = code_catalogs.get(code, [catalog_source])

        base_slug = f"freza-{slugify(code)}"
        slug = base_slug
        if slug in used_slugs:
            slug = f"{base_slug}-{slugify(brand)}"
        if slug in used_slugs and catalog_source:
            slug = f"{slug}-{slugify(Path(catalog_source).stem)}"
        slug_idx = 2
        while slug in used_slugs:
            slug = f"{base_slug}-{slug_idx}"
            slug_idx += 1
        used_slugs.add(slug)

        code_type = (r.get("code_type") or "").lower()
        rpm = "120.000 - 160.000" if material == "Diamant" else "80.000 - 140.000"
        if code_type == "alpha":
            rpm = "60.000 - 120.000"

        name = f"Freză {material} {shape} {code}" if material != "Nespecificat" else f"Freză {shape} {code}"

        product = {
            "id": f"p-{idx}",
            "slug": slug,
            "name": name,
            "image": image,
            "colorCode": color,
            "priceLei": price,
            "brand": brand,
            "sku": code,
            "isoCode": code,
            "shank": shank,
            "material": material,
            "application": app,
            "grit": grit,
            "shape": shape,
            "diameterMm": diameter,
            "recommendedRpm": rpm,
            "coating": coating,
            "stockStatus": make_stock(code),
            "isNew": idx % 11 == 0,
            "isBestseller": idx % 9 == 0,
            "rating": make_rating(code),
            "reviewCount": 8 + (idx % 37),
            "bulletsShort": [
                f"Cod produs: {code}",
                f"Compatibilitate: {shank}",
                f"Diametru activ: {diameter} mm",
                f"Imagine oficială din biblioteca externă ({match_label}).",
            ],
            "specs": {
                "Catalog sursă": r.get("catalog_file") or "N/A",
                "Cataloage disponibile": ", ".join(catalogs_for_code) if catalogs_for_code else "N/A",
                "Cod produs": code,
                "Familie variantă": fam,
                "Număr variante familie": str(len(variants)),
                "Material": material,
                "Acoperire": coating or "Fără",
                "Formă": shape,
                "Diametru (mm)": str(diameter),
                "Tip cod": r.get("code_type") or "N/A",
                "Potrivire imagine externă": match_label,
            },
            "warnings": [
                "Utilizați răcire adecvată în lucru continuu.",
                "Nu depășiți turația recomandată.",
                "Verificați integritatea instrumentului înainte de utilizare.",
            ],
            "variantFamilyCode": fam,
            "variantCodes": variants,
            "catalogSource": catalog_source,
            "externalImageFile": r.get("external_image_file"),
            "externalImageMatchType": r.get("external_image_match_type"),
        }
        products.append(product)

    return products


def main():
    if not MATCHED_PRODUCTS_PATH.exists():
        raise SystemExit(f"Missing input: {MATCHED_PRODUCTS_PATH}")

    rows = json.loads(MATCHED_PRODUCTS_PATH.read_text(encoding="utf-8"))
    image_path_map = copy_external_images(rows)
    products = build_store_products(rows, image_path_map)

    OUTPUT_JSON_PATH.write_text(json.dumps(products, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Wrote: {OUTPUT_JSON_PATH}")
    print(f"Copied images: {len(image_path_map)} -> {PUBLIC_IMAGES_DIR}")
    print(f"Store products (with external images): {len(products)}")


if __name__ == "__main__":
    main()

