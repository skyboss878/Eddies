#!/bin/bash
echo "🔍 Checking lazy-loaded pages..."

# Step 1: list all page files
all_pages=$(find src/pages -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) | sort)

# Step 2: extract all lazy imports from App.jsx
lazy_pages=$(grep -oE "lazy\(\s*\(\s*\)\s*=>\s*import\(['\"][^'\"]+['\"]\)" src/App.jsx \
    | sed -E "s/lazy\(\s*\(\s*\)\s*=>\s*import\(['\"](.*)['\"]\)/\1/" \
    | sort)

# Step 3: normalize paths to full paths
lazy_pages_full=()
for lp in $lazy_pages; do
    # resolve relative to src/
    lazy_pages_full+=("src/${lp#./}")
done

# Step 4: compare all pages vs lazy pages
echo ""
echo "🗂️ All pages in src/pages/:"
echo "$all_pages"
echo ""
echo "⚡ Lazy-loaded pages in App.jsx:"
printf "%s\n" "${lazy_pages_full[@]}"
echo ""
echo "❌ Pages NOT referenced (potentially unused):"
for page in $all_pages; do
    if [[ ! " ${lazy_pages_full[@]} " =~ " ${page} " ]]; then
        echo "$page"
    fi
done
