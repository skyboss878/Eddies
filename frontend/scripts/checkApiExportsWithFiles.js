// checkApiExportsWithFiles.js
const fs = require('fs');
const path = require('path');

// Folders to scan
const folders = ['src/utils', 'src/config', 'src/fix_api.sh'];

// Map to track exports and their files
const exportMap = {};

folders.forEach(folder => {
  if (!fs.existsSync(folder)) return;
  const files = fs.readdirSync(folder).filter(f => f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.sh'));
  files.forEach(file => {
    const fullPath = path.join(folder, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const matches = [...content.matchAll(/export\s+(?:const|class|default)\s+([a-zA-Z0-9_]+)/g)];
    matches.forEach(m => {
      const name = m[1];
      if (!exportMap[name]) exportMap[name] = [];
      exportMap[name].push(fullPath);
    });
  });
});

// Separate duplicates from unique exports
const duplicates = Object.entries(exportMap).filter(([name, files]) => files.length > 1);

console.log('=== Duplicate Exports ===');
if (duplicates.length === 0) {
  console.log('✅ No duplicates found');
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
