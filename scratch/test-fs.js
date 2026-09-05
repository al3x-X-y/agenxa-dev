const fs = require('fs');
const path = require('path');

try {
  const p = path.resolve('src', 'app', '(main)', 'agency');
  console.log('Absolute path:', p);
  const files = fs.readdirSync(p);
  console.log('Files:', files);
} catch (e) {
  console.error('Error:', e);
}
