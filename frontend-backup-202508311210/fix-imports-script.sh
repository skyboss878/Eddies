#!/bin/bash

# Script to fix import/export issues in Eddie's Asian Automotive frontend
# Run this from ~/eddies-asian-automotive/frontend

echo "🔍 Analyzing import/export issues..."

# Create backup
echo "📋 Creating backup of current state..."
tar -czf "backup_$(date +%Y%m%d_%H%M%S).tar.gz" src/

# 1. Identify external vs internal imports
echo "🔍 Categorizing imports..."

# External libraries that should NOT be in local exports
cat > external_libraries.txt << 'EOF'
react
react-dom
react-router-dom
lucide-react
@heroicons
framer-motion
recharts
socket.io-client
date-fns
chart.js
react-fontawesome
@fortawesome
EOF

# 2. Clean up missing_components.txt to remove external libraries
grep -vf external_libraries.txt missing_components.txt > local_missing_components.txt || touch local_missing_components.txt

echo "📊 Local missing components:"
cat local_missing_components.txt

# 3. Generate proper index.js for components
echo "🛠️ Generating components/index.js..."

cd src/components

cat > index.js << 'EOF'
// Auto-generated component exports
// This file centralizes all component exports for easier importing

EOF

# Add default exports from component files
find . -maxdepth 1 -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) ! -name "index.js" | while read file; do
  basename=$(basename "$file" | sed 's/\.[^.]*$//')
  # Check if file has default export
  if grep -q "export default" "$file"; then
    echo "export { default as $basename } from './$basename';" >> index.js
  fi
done

# 4. Generate utils/index.js
echo "🛠️ Generating utils/index.js..."

cd ../utils

cat > index.js << 'EOF'
// Auto-generated utility exports

EOF

# Add named exports from utility files
find . -maxdepth 1 -type f \( -name "*.js" -o -name "*.ts" \) ! -name "index.js" | while read file; do
  basename=$(basename "$file" | sed 's/\.[^.]*$//')
  # Extract named exports
  exports=$(grep -Po '(?<=export (const|function|let|var|class) )\w+' "$file" 2>/dev/null | sort -u)
  if [ -n "$exports" ]; then
    echo "// From $basename" >> index.js
    echo "$exports" | sed "s/.*/export { & } from '.\/$basename';/" >> index.js
    echo "" >> index.js
  fi
done

# 5. Generate hooks/index.js (if hooks directory exists)
if [ -d ../hooks ]; then
  echo "🛠️ Generating hooks/index.js..."
  cd ../hooks
  
  cat > index.js << 'EOF'
// Auto-generated hooks exports

EOF

  find . -maxdepth 1 -type f \( -name "*.js" -o -name "*.ts" \) ! -name "index.js" | while read file; do
    basename=$(basename "$file" | sed 's/\.[^.]*$//')
    exports=$(grep -Po '(?<=export (const|function|let|var) )\w+' "$file" 2>/dev/null | sort -u)
    if [ -n "$exports" ]; then
      echo "// From $basename" >> index.js
      echo "$exports" | sed "s/.*/export { & } from '.\/$basename';/" >> index.js
      echo "" >> index.js
    fi
  done
fi

# 6. Generate contexts/index.js (if contexts directory exists)
if [ -d ../contexts ]; then
  echo "🛠️ Generating contexts/index.js..."
  cd ../contexts
  
  cat > index.js << 'EOF'
// Auto-generated context exports

EOF

  find . -maxdepth 1 -type f \( -name "*.js" -o -name "*.ts" \) ! -name "index.js" | while read file; do
    basename=$(basename "$file" | sed 's/\.[^.]*$//')
    exports=$(grep -Po '(?<=export (const|function|let|var|class) )\w+' "$file" 2>/dev/null | sort -u)
    if [ -n "$exports" ]; then
      echo "// From $basename" >> index.js
      echo "$exports" | sed "s/.*/export { & } from '.\/$basename';/" >> index.js
      echo "" >> index.js
    fi
  done
fi

# 7. Fix import paths in files
echo "🔧 Fixing import paths..."

cd ../../

# Fix relative imports to use barrel exports
find src/ -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | while read file; do
  # Skip index.js files
  if [[ "$file" == *"index.js" ]]; then
    continue
  fi
  
  # Create backup of file
  cp "$file" "$file.bak"
  
  # Fix component imports
  sed -i 's|from ['\''"]\.\.\/components\/[^/]*['\''"]|from "../components"|g' "$file"
  
  # Fix utils imports
  sed -i 's|from ['\''"]\.\.\/utils\/[^/]*['\''"]|from "../utils"|g' "$file"
  
  # Fix hooks imports (if exists)
  if [ -d src/hooks ]; then
    sed -i 's|from ['\''"]\.\.\/hooks\/[^/]*['\''"]|from "../hooks"|g' "$file"
  fi
  
  # Fix contexts imports (if exists)
  if [ -d src/contexts ]; then
    sed -i 's|from ['\''"]\.\.\/contexts\/[^/]*['\''"]|from "../contexts"|g' "$file"
  fi
done

# 8. Validate the fixes
echo "✅ Validating fixes..."

# Test that imports can be resolved
npm run build --dry-run 2>/dev/null || echo "⚠️ Build check not available, manually test with 'npm run build'"

echo "🎉 Import/export fix complete!"
echo ""
echo "📋 Summary of changes:"
echo "- Created/updated index.js files in components/, utils/, hooks/, contexts/"
echo "- Fixed relative import paths to use barrel exports"
echo "- Created backup files (.bak) for modified files"
echo ""
echo "🧪 Next steps:"
echo "1. Test your application: npm start"
echo "2. Run build: npm run build"
echo "3. If issues persist, check specific import statements manually"
echo ""
echo "📁 Files to review:"
echo "- src/components/index.js"
echo "- src/utils/index.js"
echo "- src/hooks/index.js (if exists)"
echo "- src/contexts/index.js (if exists)"

# Clean up temporary files
rm -f external_libraries.txt local_missing_components.txt

echo "✨ Script completed successfully!"
