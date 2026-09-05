const path = require('path');
const { getSortedRoutes } = require(path.resolve(__dirname, '../node_modules/next/dist/shared/lib/router/utils/sorted-routes.js'));

console.log('Testing sorted routes:');
try {
  const routes = [
    '/agency/[agencyID]',
    '/agency/[agencyId]'
  ];
  console.log(getSortedRoutes(routes));
} catch (e) {
  console.log('Caught expected error with both:', e.message);
}

try {
  const routes = [
    '/agency/[agencyID]',
    '/[domain]',
    '/[domain]/[path]',
    '/agency',
    '/agency/unauthorized',
    '/site'
  ];
  console.log('Sorted routes single:', getSortedRoutes(routes));
} catch (e) {
  console.log('Error single:', e.message);
}
