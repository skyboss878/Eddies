#!/bin/bash
# scan_components.sh - Find all .tsx and .jsx files and suggest imports

BASE_DIR="./src/components"

echo "🔍 Scanning $BASE_DIR for .tsx and .jsx files..."
echo

find "$BASE_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) | while read -r FILE; do
    # Get relative path from src/components
    REL_PATH="${FILE#$BASE_DIR/}"
    
    # Get alias-friendly import path (replace / with .)
    IMPORT_PATH="@components/${REL_PATH%.*}"
    
    # Get component name
    COMPONENT_NAME=$(basename "$FILE" | cut -d. -f1)
    
    echo "File: $FILE"
    echo "Suggested import: import $COMPONENT_NAME from '$IMPORT_PATH';"
    echo
done
