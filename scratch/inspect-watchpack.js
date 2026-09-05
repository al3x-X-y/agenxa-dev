const path = require('path');
const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const appDir = path.resolve('src/app');
const files = walk(appDir);
console.log('Found', files.length, 'files in src/app:');
files.forEach(f => {
  if (f.includes('agency')) {
    console.log(' -', f);
  }
});
