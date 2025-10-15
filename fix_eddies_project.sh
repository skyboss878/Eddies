#!/bin/bash
# fix_eddies_project.sh
# Safe recovery and cleanup for Eddie's Automotive Termux setup

echo "🚨 Stopping backend and frontend processes..."
pkill -f "python.*app.py"
pkill -f "vite"

echo "📁 Navigating to backend directory..."
cd ~/eddies-asian-automotive/backend || { echo "Backend folder not found"; exit 1; }

# Step 1: Fix database name
DB_CORRECT="eddies_automotive.db"
DB_WRONG="eddie_automotive.db"
if [ -f "$DB_WRONG" ]; then
    echo "🔹 Renaming $DB_WRONG -> $DB_CORRECT"
    mv "$DB_WRONG" "$DB_CORRECT"
else
    echo "✅ $DB_WRONG not found, skipping rename."
fi

# Step 2: Remove empty or duplicate DB files
for file in automotive.db dev.db your_database_name.db; do
    if [ -f "$file" ]; then
        echo "🗑 Removing old/duplicate DB: $file"
        rm "$file"
    fi
done

# Step 3: Add missing column if not exists
COLUMN_CHECK=$(sqlite3 "$DB_CORRECT" "PRAGMA table_info(time_entries);" | grep break_duration || true)
if [ -z "$COLUMN_CHECK" ]; then
    echo "➕ Adding missing column 'break_duration' to time_entries table"
    sqlite3 "$DB_CORRECT" "ALTER TABLE time_entries ADD COLUMN break_duration INTEGER DEFAULT 0;"
else
    echo "✅ Column 'break_duration' already exists"
fi

# Step 4: Remove conflicting API file
API_CONFLICT="../frontend/src/utils/apiEndpoints.js"
if [ -f "$API_CONFLICT" ]; then
    echo "🗑 Removing conflicting API file: apiEndpoints.js"
    rm "$API_CONFLICT"
else
    echo "✅ No conflicting API file found"
fi

# Step 5: Start backend
echo "🚀 Starting Flask backend..."
python app.py &

# Step 6: Start frontend
echo "🚀 Starting Vite frontend..."
cd ../frontend || { echo "Frontend folder not found"; exit 1; }
npm run dev &

echo "💡 DONE! Please clear your browser cache manually:"
echo "localStorage.clear(); sessionStorage.clear(); location.reload();"
echo "✅ Backend and frontend should now be running."
