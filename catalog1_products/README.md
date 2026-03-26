# Catalog 1 product extraction

Generated from `catalog1.pdf` using `extract_products_from_pdf.py`.

## Output files

- `products.json` – structured product records
- `products.csv` – tabular export for Excel/import
- `images/` – extracted product images from the PDF

## Notes

- Detected products: **9**
- Extracted images: **8**
- One code (`530 648 204A 120 020`) appears to be a stop/spacer ring accessory entry and does not have a dedicated product image in the PDF page layout.

## Re-run extraction

```bash
python extract_products_from_pdf.py
```
