#!/bin/bash

echo "🔧 Fixing loading state in DataContext..."

# Backup the file
cp src/contexts/DataContext.jsx src/contexts/DataContext.jsx.backup

# Check if the fetchData function exists and add setLoading(false) if missing
if grep -q "setLoading('initialData', false)" src/contexts/DataContext.jsx; then
    echo "✅ Loading state already properly managed"
else
    echo "🛠️ Adding missing setLoading('initialData', false)"
    
    # Find the fetchData function and add the missing setLoading call
    sed -i '/console\.log.*Data fetched successfully/a\      setLoading('\''initialData'\'', false);' src/contexts/DataContext.jsx
    
    echo "✅ Fix applied!"
fi

echo "🏁 Restarting dev server should fix the loading issue"
