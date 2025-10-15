#!/bin/bash

echo "🔍 Diagnosing unterminated string literals..."

# Check the exact content around the problematic lines
echo "=== Login.jsx around line 196 ==="
sed -n '190,200p' src/pages/Login.jsx | cat -n

echo -e "\n=== Register.jsx around line 317 ==="
sed -n '310,320p' src/pages/Register.jsx | cat -n

# Look for unmatched quotes in these areas
echo -e "\n🔍 Looking for quote issues..."

# Check for unmatched quotes in Login.jsx around line 196
echo "Login.jsx lines 190-200 with visible characters:"
sed -n '190,200p' src/pages/Login.jsx | cat -A

echo -e "\nRegister.jsx lines 310-320 with visible characters:"
sed -n '310,320p' src/pages/Register.jsx | cat -A

# Let's also check the line count to see if the files are complete
echo -e "\n📊 File info:"
echo "Login.jsx total lines: $(wc -l < src/pages/Login.jsx)"
echo "Register.jsx total lines: $(wc -l < src/pages/Register.jsx)"

# Check for any unmatched quotes or brackets in the entire files
echo -e "\n🔍 Checking for syntax issues..."

# Count quotes to see if they're balanced
echo "Login.jsx quote count:"
echo "Single quotes: $(grep -o "'" src/pages/Login.jsx | wc -l)"
echo "Double quotes: $(grep -o '"' src/pages/Login.jsx | wc -l)"
echo "Backticks: $(grep -o '`' src/pages/Login.jsx | wc -l)"

echo -e "\nRegister.jsx quote count:"
echo "Single quotes: $(grep -o "'" src/pages/Register.jsx | wc -l)"
echo "Double quotes: $(grep -o '"' src/pages/Register.jsx | wc -l)"
echo "Backticks: $(grep -o '`' src/pages/Register.jsx | wc -l)"
