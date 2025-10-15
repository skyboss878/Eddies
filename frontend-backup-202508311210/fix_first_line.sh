#!/bin/bash

echo "🔧 Fixing the first line issue..."

# Check what the first line looks like now
echo "Current first line of Login.jsx:"
head -1 src/pages/Login.jsx

echo "Current first line of Register.jsx:"
head -1 src/pages/Register.jsx

# Remove the problematic first line from both files
echo -e "\n🔧 Removing the invalid first line..."

# Remove first line from Login.jsx
sed -i '1d' src/pages/Login.jsx

# Remove first line from Register.jsx
sed -i '1d' src/pages/Register.jsx

echo "✅ Removed invalid first lines"

# Verify the new first lines
echo -e "\n✅ New first lines:"
echo "Login.jsx first line:"
head -1 src/pages/Login.jsx

echo "Register.jsx first line:"
head -1 src/pages/Register.jsx

echo -e "\n✅ Files should now be valid! Try npm run dev"
