const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'data', 'store-products.generated.json');
const imageDir = path.join(__dirname, 'public', 'catalog-images');

const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

products.forEach(product => {
  const imagePath = product.image.replace('/catalog-images/', '');
  const fullImagePath = path.join(imageDir, imagePath);
  
  // If the current image exists, keep it
  if (fs.existsSync(fullImagePath)) return;
  
  // If not, try to find the base image without -number
  const match = imagePath.match(/^(.+)-web1500(-\d+)?\.jpg$/);
  if (match) {
    const base = match[1] + '-web1500.jpg';
    const basePath = path.join(imageDir, base);
    if (fs.existsSync(basePath)) {
      product.image = '/catalog-images/' + base;
      console.log(`Updated ${product.id} from ${imagePath} to ${base}`);
    }
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2));
console.log('Updated images to use base versions where possible.');