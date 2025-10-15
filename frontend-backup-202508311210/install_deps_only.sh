#!/bin/bash
# Check route mappings and fix any mismatches

cd ~/eddies-askan-automotive/frontend

echo "🔍 Checking Route Mappings..."
echo "=================================="

echo "📄 Current App.jsx route definitions:"
grep -n "import.*from.*pages" src/App.jsx | head -10

echo ""
echo "📁 Available page files:"
ls src/pages/*.jsx | grep -E "(Customer|Vehicle|Job|Estimate|Invoice)" | head -10

echo ""
echo "🔍 Checking for route/file mismatches..."

# Check if App.jsx imports match actual files
echo ""
echo "Import/File Matching Analysis:"
echo "==============================="

# Extract imports from App.jsx
IMPORTS=$(grep "import.*from.*\./pages" src/App.jsx | sed -n "s/.*import.*from.*'\([^']*\)'.*/\1/p")

for import_path in $IMPORTS; do
    # Convert relative path to actual file
    full_path="src/${import_path#./}.jsx"
    
    if [ -f "$full_path" ]; then
        echo "✅ $import_path → $full_path (exists)"
    else
        echo "❌ $import_path → $full_path (MISSING)"
        
        # Suggest alternatives
        basename=$(basename "$import_path")
        echo "   🔍 Looking for alternatives..."
        find src/pages -name "*${basename}*" -o -name "*$(echo $basename | sed 's/s$//')List*" | head -3 | while read alt; do
            echo "   💡 Found: $alt"
        done
    fi
done

echo ""
echo "🚀 Quick Fix Options:"
echo "====================="

echo "Option 1: Create symbolic links (recommended)"
echo "Option 2: Update App.jsx imports to match existing files"
echo "Option 3: Rename existing files to match App.jsx imports"

echo ""
echo "Which option would you prefer?"
echo "1) Create symlinks for missing standard names"
echo "2) Show current App.jsx imports that need fixing"
echo "3) Show existing files that could be renamed"

read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🔗 Creating symbolic links..."
        
        # Create symlinks for common naming patterns
        [ ! -f "src/pages/Customers.jsx" ] && [ -f "src/pages/CustomerList.jsx" ] && {
            ln -sf CustomerList.jsx src/pages/Customers.jsx
            echo "✅ Created Customers.jsx → CustomerList.jsx"
        }
        
        [ ! -f "src/pages/Vehicles.jsx" ] && [ -f "src/pages/VehicleList.jsx" ] && {
            ln -sf VehicleList.jsx src/pages/Vehicles.jsx
            echo "✅ Created Vehicles.jsx → VehicleList.jsx"
        }
        
        [ ! -f "src/pages/Jobs.jsx" ] && [ -f "src/pages/ViewJobs.jsx" ] && {
            ln -sf ViewJobs.jsx src/pages/Jobs.jsx
            echo "✅ Created Jobs.jsx → ViewJobs.jsx"
        }
        
        [ ! -f "src/pages/Estimates.jsx" ] && [ -f "src/pages/EstimatesList.jsx" ] && {
            ln -sf EstimatesList.jsx src/pages/Estimates.jsx
            echo "✅ Created Estimates.jsx → EstimatesList.jsx"
        }
        
        [ ! -f "src/pages/Invoices.jsx" ] && [ -f "src/pages/Invoice.jsx" ] && {
            ln -sf Invoice.jsx src/pages/Invoices.jsx
            echo "✅ Created Invoices.jsx → Invoice.jsx"
        }
        
        echo "🎉 Symbolic links created! Your routes should now work."
        ;;
        
    2)
        echo ""
        echo "📝 App.jsx imports that may need updating:"
        grep -n "const.*lazy.*import.*pages" src/App.jsx
        ;;
        
    3)
        echo ""
        echo "📁 Existing page files:"
        ls -la src/pages/ | grep -E "\.(jsx|js)$" | head -15
        ;;
        
    *)
        echo "Invalid choice. Run the script again."
        ;;
esac
