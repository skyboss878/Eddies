#!/bin/bash
set -e

FILE="src/utils/api.js"

# 1. Remove stray commas after );
sed -i 's/);,/) ;/' "$FILE"

# 2. Add missing comma after settingsService update() block
sed -i '/return apiClient.put('"'"'\/api\/settings'"'"', { \[key\]: value });}/s/});}/});},/' "$FILE"

echo "✅ Fixed stray commas and settingsService block in $FILE"
