const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const catalogDir = path.join(publicDir, 'catalog-images');

// Get all files in public/
const files = fs.readdirSync(publicDir).filter(f => {
  const stat = fs.statSync(path.join(publicDir, f));
  return stat.isFile();
});

files.forEach(file => {
  if (file.includes(' ')) {
    const newName = file.replace(/ /g, '-');
    const oldPath = path.join(publicDir, file);
    const newPath = path.join(catalogDir, newName);
    fs.renameSync(oldPath, newPath);
    console.log(`Moved and renamed ${file} to catalog-images/${newName}`);
  }
});

console.log('Renamed and moved files with spaces.');