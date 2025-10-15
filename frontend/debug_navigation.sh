#!/bin/bash

# Navigation & Layout Debugging Script
# Purpose: Diagnose routing conflicts, missing components, and navigation issues

echo "🔍 NAVIGATION & LAYOUT DEBUGGER"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

FRONTEND_DIR="$(pwd)"
SRC_DIR="$FRONTEND_DIR/src"
COMPONENTS_DIR="$SRC_DIR/components"
PAGES_DIR="$SRC_DIR/pages"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this from your frontend directory.${NC}"
    exit 1
fi

echo "📁 Working Directory: $FRONTEND_DIR"
echo ""

# ============================================
# PART 1: ROUTE CONFLICT DETECTION
# ============================================
echo -e "${BLUE}## 🔎 PART 1: Route Conflict Analysis${NC}"
echo "-----------------------------------"

APP_FILE="$SRC_DIR/App.jsx"

if [ ! -f "$APP_FILE" ]; then
    echo -e "${RED}❌ App.jsx not found at: $APP_FILE${NC}"
else
    echo -e "${GREEN}✅ Found App.jsx${NC}"
    echo ""
    
    # Extract all route paths
    echo "📋 Analyzing route conflicts..."
    
    # Find duplicate or conflicting routes
    grep -n "path=" "$APP_FILE" | grep -E "(customers|vehicles|jobs|estimates|invoices)" > /tmp/routes_temp.txt
    
    echo ""
    echo "🚨 POTENTIAL CONFLICTS:"
    echo ""
    
    # Check for base vs list conflicts
    echo "1️⃣  Base Route vs List Route Conflicts:"
    echo "   (When /module and /module/list both exist)"
    echo ""
    
    for module in customers vehicles jobs estimates invoices; do
        base_route=$(grep -c "path=\"/$module\"" "$APP_FILE" 2>/dev/null || echo "0")
        list_route=$(grep -c "path=\"/$module/list\"" "$APP_FILE" 2>/dev/null || echo "0")
        
        if [ "$base_route" -gt 0 ] && [ "$list_route" -gt 0 ]; then
            echo -e "   ${YELLOW}⚠️  /$module${NC} (base) AND ${YELLOW}/$module/list${NC} (list) both exist"
            echo "      → User navigating to /$module might not see the list"
            echo ""
        fi
    done
    
    # Check for duplicate "add/new" routes
    echo "2️⃣  Duplicate 'Add/New' Routes:"
    echo ""
    
    vehicles_new=$(grep -c "path=\"/vehicles/new\"" "$APP_FILE" 2>/dev/null || echo "0")
    vehicles_add=$(grep -c "path=\"/vehicles/add\"" "$APP_FILE" 2>/dev/null || echo "0")
    
    if [ "$vehicles_new" -gt 0 ] && [ "$vehicles_add" -gt 0 ]; then
        echo -e "   ${YELLOW}⚠️  /vehicles/new AND /vehicles/add both exist${NC}"
        echo "      → This creates confusion about which route to use"
        echo ""
    fi
    
    # Check for singular vs plural invoice routes
    echo "3️⃣  Singular vs Plural Route Conflicts:"
    echo ""
    
    invoice_singular=$(grep -c "path=\"/invoice\"" "$APP_FILE" 2>/dev/null || echo "0")
    invoice_plural=$(grep -c "path=\"/invoices\"" "$APP_FILE" 2>/dev/null || echo "0")
    
    if [ "$invoice_singular" -gt 0 ] && [ "$invoice_plural" -gt 0 ]; then
        echo -e "   ${YELLOW}⚠️  /invoice AND /invoices both exist${NC}"
        echo "      → Inconsistent naming convention"
        echo ""
    fi
fi

echo ""

# ============================================
# PART 2: COMPONENT EXISTENCE CHECK
# ============================================
echo -e "${BLUE}## 📦 PART 2: Component File Verification${NC}"
echo "-------------------------------------------"

# Extract component names from routes
echo "Checking if all routed components exist..."
echo ""

declare -A components=(
    ["Login"]="pages/Login.jsx"
    ["Register"]="pages/Register.jsx"
    ["Landing"]="pages/Landing.jsx"
    ["Dashboard"]="pages/Dashboard.jsx"
    ["Customers"]="pages/Customers.jsx"
    ["CustomerList"]="components/CustomerList.jsx"
    ["AddAndEditCustomer"]="components/AddAndEditCustomer.jsx"
    ["CustomerDetail"]="components/CustomerDetail.jsx"
    ["Vehicles"]="pages/Vehicles.jsx"
    ["VehicleList"]="components/VehicleList.jsx"
    ["VehicleForm"]="components/VehicleForm.jsx"
    ["AddVehicle"]="components/AddVehicle.jsx"
    ["VehicleDetail"]="components/VehicleDetail.jsx"
    ["Jobs"]="pages/Jobs.jsx"
    ["ViewJobs"]="components/ViewJobs.jsx"
    ["CreateJob"]="components/CreateJob.jsx"
    ["JobDetail"]="components/JobDetail.jsx"
    ["Estimates"]="pages/Estimates.jsx"
    ["EstimatesList"]="components/EstimatesList.jsx"
    ["CreateEditEstimate"]="components/CreateEditEstimate.jsx"
    ["EstimateAI"]="components/EstimateAI.jsx"
    ["EstimateDetail"]="components/EstimateDetail.jsx"
    ["Invoices"]="pages/Invoices.jsx"
    ["CreateInvoice"]="components/CreateInvoice.jsx"
    ["InvoiceDetail"]="components/InvoiceDetail.jsx"
    ["Invoice"]="components/Invoice.jsx"
    ["NotFound"]="pages/NotFound.jsx"
)

missing_components=()

for component in "${!components[@]}"; do
    file_path="$SRC_DIR/${components[$component]}"
    
    if [ -f "$file_path" ]; then
        echo -e "${GREEN}✅${NC} $component → ${components[$component]}"
    else
        echo -e "${RED}❌${NC} $component → ${components[$component]} ${RED}(MISSING)${NC}"
        missing_components+=("$component")
    fi
done

echo ""

if [ ${#missing_components[@]} -gt 0 ]; then
    echo -e "${RED}🚨 MISSING COMPONENTS DETECTED!${NC}"
    echo "The following components are referenced in routes but don't exist:"
    for comp in "${missing_components[@]}"; do
        echo "   - $comp"
    done
    echo ""
fi

# ============================================
# PART 3: IMPORT VERIFICATION
# ============================================
echo -e "${BLUE}## 📥 PART 3: Import Statement Verification${NC}"
echo "--------------------------------------------"

if [ -f "$APP_FILE" ]; then
    echo "Checking if all components are imported in App.jsx..."
    echo ""
    
    for component in "${!components[@]}"; do
        if grep -q "import.*$component.*from" "$APP_FILE"; then
            echo -e "${GREEN}✅${NC} $component is imported"
        else
            echo -e "${RED}❌${NC} $component is ${RED}NOT imported${NC}"
        fi
    done
fi

echo ""

# ============================================
# PART 4: LAYOUT WRAPPER CHECK
# ============================================
echo -e "${BLUE}## 🎨 PART 4: Layout Wrapper Analysis${NC}"
echo "--------------------------------------"

if [ -f "$APP_FILE" ]; then
    echo "Checking for layout components..."
    echo ""
    
    if grep -q "ProtectedDashboardLayout" "$APP_FILE"; then
        echo -e "${GREEN}✅ Found ProtectedDashboardLayout${NC}"
        
        # Check if the layout file exists
        layout_paths=(
            "$COMPONENTS_DIR/ProtectedDashboardLayout.jsx"
            "$COMPONENTS_DIR/layouts/ProtectedDashboardLayout.jsx"
            "$SRC_DIR/layouts/ProtectedDashboardLayout.jsx"
        )
        
        layout_found=false
        for path in "${layout_paths[@]}"; do
            if [ -f "$path" ]; then
                echo -e "${GREEN}✅ Layout file found at: $path${NC}"
                layout_found=true
                
                # Check for Outlet component
                if grep -q "Outlet" "$path"; then
                    echo -e "${GREEN}✅ Layout contains <Outlet /> for nested routes${NC}"
                else
                    echo -e "${RED}❌ Layout missing <Outlet /> component${NC}"
                    echo "   → Nested routes won't render without <Outlet />"
                fi
                break
            fi
        done
        
        if [ "$layout_found" = false ]; then
            echo -e "${RED}❌ ProtectedDashboardLayout file not found!${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  No ProtectedDashboardLayout found${NC}"
    fi
fi

echo ""

# ============================================
# PART 5: NAVIGATION LINKS CHECK
# ============================================
echo -e "${BLUE}## 🔗 PART 5: Navigation Links Analysis${NC}"
echo "----------------------------------------"

# Find all Link and NavLink components
echo "Searching for navigation links in your codebase..."
echo ""

if [ -d "$COMPONENTS_DIR" ]; then
    # Find Sidebar or Navigation components
    nav_files=$(find "$SRC_DIR" -type f -name "*[Nn]av*.jsx" -o -name "*[Ss]idebar*.jsx" 2>/dev/null)
    
    if [ -n "$nav_files" ]; then
        echo "Found navigation files:"
        echo "$nav_files" | while read -r file; do
            echo -e "${GREEN}✅${NC} $file"
            
            # Check for hardcoded paths
            if grep -q "to=\"/" "$file"; then
                echo "   Navigation links in this file:"
                grep -n "to=\"/" "$file" | head -10
            fi
        done
    else
        echo -e "${YELLOW}⚠️  No navigation component files found${NC}"
    fi
fi

echo ""

# ============================================
# PART 6: RECOMMENDATIONS
# ============================================
echo -e "${BLUE}## 💡 RECOMMENDATIONS${NC}"
echo "--------------------"
echo ""

echo "Based on the analysis, here are suggested fixes:"
echo ""

# Check for base route conflicts
if grep -q "path=\"/customers\"" "$APP_FILE" && grep -q "path=\"/customers/list\"" "$APP_FILE"; then
    echo "1️⃣  ${YELLOW}Customer Routes:${NC}"
    echo "   Problem: Both /customers and /customers/list exist"
    echo "   Fix: Make /customers redirect to /customers/list"
    echo "   Add: <Route path=\"/customers\" element={<Navigate to=\"/customers/list\" replace />} />"
    echo ""
fi

if grep -q "path=\"/vehicles/new\"" "$APP_FILE" && grep -q "path=\"/vehicles/add\"" "$APP_FILE"; then
    echo "2️⃣  ${YELLOW}Vehicle Add Routes:${NC}"
    echo "   Problem: Both /vehicles/new and /vehicles/add exist"
    echo "   Fix: Choose one and remove the other, or redirect one to the other"
    echo ""
fi

if [ ${#missing_components[@]} -gt 0 ]; then
    echo "3️⃣  ${RED}Missing Components:${NC}"
    echo "   Problem: Some components referenced in routes don't exist"
    echo "   Fix: Create the missing component files or remove unused routes"
    echo ""
fi

echo "4️⃣  ${BLUE}Testing Plan:${NC}"
echo "   1. Start dev server: npm run dev"
echo "   2. Test each route manually in browser"
echo "   3. Check browser console for errors"
echo "   4. Verify navigation links work correctly"
echo ""

echo ""
echo "🎉 Debug analysis complete!"
echo ""
echo "💾 To save this output to a file, run:"
echo "   ./debug_navigation.sh > navigation_debug_report.txt"
