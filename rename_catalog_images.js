const fs = require('fs');
const path = require('path');

const catalogDir = path.join(__dirname, 'public', 'catalog-images');

// Get all files in catalog-images/
const files = fs.readdirSync(catalogDir).filter(f => {
  const stat = fs.statSync(path.join(catalogDir, f));
  return stat.isFile();
});

files.forEach(file => {
  if (file.includes(' ')) {
    const newName = file.replace(/ /g, '-');
    const oldPath = path.join(catalogDir, file);
    const newPath = path.join(catalogDir, newName);
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed ${file} to ${newName}`);
  }
});

console.log('Renamed files with spaces in catalog-images/.');