// validatePages.js
const fs = require("fs");
const path = require("path");

const pagesDir = path.join(__dirname, "src", "pages");
const jsxFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith(".jsx"));

jsxFiles.forEach(filename => {
  const fullPath = path.join(pagesDir, filename);
  const content = fs.readFileSync(fullPath, "utf-8");

  const hasImport = /import\s.+\sfrom\s['"].+['"]/.test(content);
  const hasExport = /export\s(default\s)?function|export\sdefault\s\w+/.test(content);

  console.log(`🔍 Checking ${filename}`);
  if (!hasImport) console.warn(`  ⚠️  Missing imports`);
  if (!hasExport) console.warn(`  ❌ Missing export`);
  if (hasImport && hasExport) console.log(`  ✅ Good\n`);
});
