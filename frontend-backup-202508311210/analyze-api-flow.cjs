const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve(__dirname, 'src/pages');

function getAllJsxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsxFiles(filepath));
    } else if (file.endsWith('.jsx') || file.endsWith('.tsx')) {
      results.push(filepath);
    }
  });
  return results;
}

const componentRegex = /export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*\{([\s\S]*?)^\}/gm;
const apiCallRegex = /(fetch|axios\.(get|post|put|delete|patch))\s*\(\s*([`'"])(\/api\/[^\s'"`)]*)\3/gi;

const files = getAllJsxFiles(pagesDir);

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  let matches;
  const components = [];

  while ((matches = componentRegex.exec(content)) !== null) {
    const compName = matches[1];
    const compBody = matches[2];

    const apis = [];
    let apiMatch;
    while ((apiMatch = apiCallRegex.exec(compBody)) !== null) {
      apis.push(apiMatch[4]);
    }

    const uniqueApis = [...new Set(apis)];

    components.push({ name: compName, apis: uniqueApis });
  }

  if (components.length) {
    console.log(`\nFile: ${path.relative(process.cwd(), file)}\n`);
    components.forEach(({ name, apis }) => {
      console.log(`Component: ${name}`);
      if (apis.length === 0) {
        console.log('  - No API calls found');
      } else {
        console.log('  - Calls API endpoints:');
        apis.forEach(api => console.log(`    - ${api}`));
      }
      console.log('');
    });
  }
});
