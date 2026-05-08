const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'data', 'store-products.generated.json');
const imageDir = path.join(__dirname, 'public', 'catalog-images');

const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const files = fs.readdirSync(imageDir);

products.forEach(product => {
  if (product.image.startsWith('/prod/')) {
    // Use the sku to find the best image
    const sku = product.sku;
    const skuParts = sku.split(' ');
    // Try to match with increasing prefix length
    let bestMatch = null;
    for (let i = skuParts.length; i > 0; i--) {
      const prefix = skuParts.slice(0, i).join(' ');
      const matches = files.filter(f => f.startsWith(prefix));
      if (matches.length > 0) {
        bestMatch = matches[0]; // Take the first match
        break;
      }
    }
    if (bestMatch) {
      const newImage = `/catalog-images/${bestMatch}`;
      product.image = newImage;
      console.log(`Updated ${product.id} (${sku}) to ${newImage}`);
    } else {
      console.log(`No match found for ${product.id}: ${sku}`);
    }
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2));
console.log('Updated /prod/ images to /catalog-images/');