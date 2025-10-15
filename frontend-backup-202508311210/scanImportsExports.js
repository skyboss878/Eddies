// scripts/scanImportsExports.js
import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('./src'); // change if needed
const TARGET_FOLDERS = ['hooks', 'pages', 'contexts', 'components'];

function scanFolder(folderPath) {
  const results = {};

  const items = fs.readdirSync(folderPath, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(folderPath, item.name);

    if (item.isDirectory() && TARGET_FOLDERS.includes(item.name)) {
      results[item.name] = scanFolder(fullPath); // recursive
    } else if (item.isFile() && fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const imports = [...content.matchAll(/import\s+.*?from\s+['"](.*?)['"]/g)].map(m => m[0]);
      const exports = [...content.matchAll(/export\s+(default|const|function|class)\s+(\w*)?/g)].map(m => m[0]);
      results[item.name] = { imports, exports };
    }
  }

  return results;
}

const data = scanFolder(SRC_DIR);

fs.writeFileSync('imports-exports.json', JSON.stringify(data, null, 2));
console.log('✅ Scanned all imports/exports and saved to imports-exports.json');
