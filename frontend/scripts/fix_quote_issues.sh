#!/bin/bash

echo "🔧 Finding and fixing unmatched quotes..."

# The files have unmatched backticks (3 each), let's find them
echo "🔍 Finding backticks in Login.jsx:"
grep -n '`' src/pages/Login.jsx

echo -e "\n🔍 Finding backticks in Register.jsx:"
grep -n '`' src/pages/Register.jsx

# Since we need an even number of backticks, let's replace any remaining template literals
echo -e "\n🔧 Fixing remaining template literals..."

# Create safer backups
cp src/pages/Login.jsx src/pages/Login.jsx.safe
cp src/pages/Register.jsx src/pages/Register.jsx.safe

# Remove all backticks and replace with regular quotes
sed -i 's/`/"/g' src/pages/Login.jsx
sed -i 's/`/"/g' src/pages/Register.jsx

echo "✅ Replaced all backticks with double quotes"

# Check quote balance now
echo -e "\n📊 New quote counts:"
echo "Login.jsx double quotes: $(grep -o '"' src/pages/Login.jsx | wc -l)"
echo "Register.jsx double quotes: $(grep -o '"' src/pages/Register.jsx | wc -l)"

# Verify no backticks remain
echo -e "\n🔍 Verifying no backticks remain:"
echo "Login.jsx backticks: $(grep -o '`' src/pages/Login.jsx | wc -l)"
echo "Register.jsx backticks: $(grep -o '`' src/pages/Register.jsx | wc -l)"

echo -e "\n✅ All backticks removed! Try npm run dev now."
