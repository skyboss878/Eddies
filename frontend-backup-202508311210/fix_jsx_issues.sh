#!/bin/bash

echo "🔧 Comprehensive JSX syntax fix..."

# Step 1: Check the problematic areas
echo "=== Checking Login.jsx around line 196 ==="
sed -n '190,200p' src/pages/Login.jsx

echo -e "\n=== Checking Register.jsx line 180 ==="
sed -n '175,185p' src/pages/Register.jsx

# Step 2: Create backups
echo -e "\n📁 Creating backups..."
cp src/pages/Login.jsx src/pages/Login.jsx.backup
cp src/pages/Register.jsx src/pages/Register.jsx.backup

# Step 3: Fix Register.jsx line 180 specifically
echo -e "\n🔧 Fixing Register.jsx line 180..."
sed -i '180s/.*/                  className="w-full px-4 py-3 bg-white\/20 border border-white\/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"/' src/pages/Register.jsx

# Step 4: Replace ALL template literals with simple strings
echo -e "\n🔧 Replacing all template literals..."

# Fix Login.jsx - replace all template literals
sed -i 's/className={`[^`]*`}/className="w-full px-4 py-3 rounded-lg bg-white\/20 border border-white\/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"/g' src/pages/Login.jsx

# Fix Register.jsx - replace all template literals  
sed -i 's/className={`[^`]*`}/className="w-full px-4 py-3 rounded-lg bg-white\/20 border border-white\/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"/g' src/pages/Register.jsx

# Step 5: Check for any remaining backticks that might cause issues
echo -e "\n🔍 Checking for remaining template literals..."
echo "Login.jsx backticks:"
grep -n '`' src/pages/Login.jsx | head -5

echo "Register.jsx backticks:"
grep -n '`' src/pages/Register.jsx | head -5

# Step 6: Verify the fixes
echo -e "\n✅ Verification:"
echo "Fixed Register.jsx line 180:"
sed -n '180p' src/pages/Register.jsx

echo "Login.jsx line 196 area:"
sed -n '194,198p' src/pages/Login.jsx

echo -e "\n✅ All fixes applied! You can now try: npm run dev"
