// checkFrontendExports.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Folders to scan
const folders = [
  'src/utils',
  'src/utils/services',
  'src/config',
  'src/layouts',
  'src/contexts',
  'src/hooks',
  'src/components',
  'src/pages'
].map(f => path.join(__dirname, f));

// Map to track exports
const exportMap = {};

// Recursive scan function
function scanFolder(folder) {
  if (!fs.existsSync(folder)) return;
  const files = fs.readdirSync(folder);
  for (const file of files) {
    const fullPath = path.join(folder, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      scanFolder(fullPath);
    } else if (stats.isFile() && (file.endsWith('.js') || file.endsWith('.jsx'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      // Match export const/class/default/function
      const matches = [...content.matchAll(/export\s+(?:const|class|default|function)\s+([a-zA-Z0-9_]+)/g)];
      matches.forEach(m => {
        const name = m[1];
        if (!exportMap[name]) exportMap[name] = [];
        exportMap[name].push(fullPath);
      });
    }
  }
}

// Scan all folders
folders.forEach(f => scanFolder(f));

// Find duplicates
const duplicates = Object.entries(exportMap).filter(([name, files]) => files.length > 1);

console.log('=== Duplicate Exports ===');
if (duplicates.length === 0) {
  console.log('✅ No duplicate exports found');
} else {
  duplicates.forEach(([name, files]) => {
    console.log(`\n${name} exported in:`);
    files.forEach(f => console.log(`  - ${f}`));
  });
}

console.log('\n=== All Exports ===');
Object.entries(exportMap).forEach(([name, files]) => {
  console.log(`${name}: ${files.join(', ')}`);
});
