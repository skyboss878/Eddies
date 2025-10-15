#!/bin/bash
echo "🔍 Scanning for truly unused .jsx files in src/ ..."

# Step 1: define folders to scan
folders=(src/components src/pages src/hooks src/contexts src/utils)

# Step 2: find all .jsx files except index.jsx
all_files=()
for folder in "${folders[@]}"; do
    files_in_folder=$(find "$folder" -type f -name "*.jsx" ! -name "index.jsx")
    all_files+=($files_in_folder)
done

all_files_sorted=($(printf "%s\n" "${all_files[@]}" | sort))

echo ""
echo "📄 All .jsx files found:"
printf "%s\n" "${all_files_sorted[@]}"

echo ""
echo "🔎 Checking which files are imported somewhere ..."

unused_files=()

for file in "${all_files_sorted[@]}"; do
    # Get path relative to src/
    rel_path=${file#src/}

    # Remove .jsx extension for comparison (matches lazy import)
    rel_path_no_ext=${rel_path%.jsx}

    # Search for this file in all JS/TS/JSX/TSX files
    if ! grep -rE "import .*['\"]\.?\/${rel_path_no_ext}['\"]|lazy\(\(\)\s*=>\s*import\(['\"]\.?\/${rel_path_no_ext}['\"]\)" src/ > /dev/null; then
        unused_files+=("$file")
    fi
done

echo ""
echo "❌ Truly unused .jsx files (safe to archive or remove):"
for uf in "${unused_files[@]}"; do
    echo "$uf"
done

echo ""
echo "✅ Scan complete."
