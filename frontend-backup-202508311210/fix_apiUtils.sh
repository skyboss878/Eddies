#!/bin/bash
# fix_apiUtils.sh
# This will replace all apiUtils.formatError usage with handleApiError and fix imports

echo "Starting replacement of apiUtils.formatError with handleApiError..."

# Replace usage in JS/JSX files under src/
grep -rl "apiUtils.formatError" ./src | while read -r file; do
  echo "Updating $file"
  # Replace apiUtils.formatError(...) with handleApiError(...)
  sed -i "s/apiUtils\.formatError/handleApiError/g" "$file"
done

# Fix import statements
grep -rl "import .*apiUtils.* from '../utils/api'" ./src | while read -r file; do
  echo "Fixing import in $file"
  sed -i "s|import \(.*\)apiUtils\(.*\) from '../utils/api'|import \1handleApiError\2 from '../utils/errorUtils'|g" "$file"
done

echo "Replacement complete. Please verify your imports and usage."
