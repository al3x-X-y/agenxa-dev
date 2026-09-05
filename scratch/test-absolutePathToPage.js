const path = require('path');
const { absolutePathToPage } = require(path.resolve(__dirname, '../node_modules/next/dist/shared/lib/page-path/absolute-path-to-page.js'));

const appDir = path.resolve('src/app');
const fileName = path.resolve('src/app/(main)/agency/[agencyID]/page.tsx');

const pageName = absolutePathToPage(fileName, {
  dir: appDir,
  extensions: ['tsx', 'ts', 'jsx', 'js'],
  keepIndex: true,
  pagesType: 'app'
});

console.log('pageName for [agencyID]:', pageName);
