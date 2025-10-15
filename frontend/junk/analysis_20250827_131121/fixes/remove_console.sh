#!/bin/bash
# Remove console statements for production
find src -name "*.js" -o -name "*.jsx" | xargs sed -i '/console\./d'
echo "Console statements removed"
