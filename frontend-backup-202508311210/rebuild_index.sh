#!/bin/bash
# rebuild_index.sh
# Auto-generate src/utils/index.js with all named exports

UTILS_DIR="./src/utils"
INDEX_FILE="$UTILS_DIR/index.js"

echo "Rebuilding $INDEX_FILE..."

if [ ! -d "$UTILS_DIR" ]; then
  echo "Error: $UTILS_DIR does not exist!"
  exit 1
fi

# Start fresh index.js
cat << 'EOF' > "$INDEX_FILE"
// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
// All exports from src/utils modules
EOF

# Loop through all JS/JSX files in utils
for file in "$UTILS_DIR"/*.{js,jsx}; do
  [ -e "$file" ] || continue
  base=$(basename "$file")
  if [ "$base" != "index.js" ]; then
    # Extract all named exports
    exports=$(grep -Eo "export (const|let|var|function|class|default) [a-zA-Z0-9_]+" "$file" | sed -E 's/export (const|let|var|function|class|default) //')
    default_export=$(grep -Eo "export default [a-zA-Z0-9_]+" "$file" | sed -E 's/export default //')
    
    # Add default export if exists
    if [ ! -z "$default_export" ]; then
      echo "export { default as ${default_export} } from './${base%.*}';" >> "$INDEX_FILE"
    fi

    # Add named exports
    if [ ! -z "$exports" ]; then
      echo "export { $exports } from './${base%.*}';" >> "$INDEX_FILE"
    fi
  fi
done

echo "✔ $INDEX_FILE rebuilt successfully."
