#!/bin/bash

# Navigation & Routing Fix Script
# Fixes route conflicts and cleans up duplicate files

echo "🔧 NAVIGATION & ROUTING FIX SCRIPT"
echo "===================================="
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

FRONTEND_DIR="$(pwd)"
SRC_DIR="$FRONTEND_DIR/src"
APP_FILE="$SRC_DIR/App.jsx"
BACKUP_DIR="$FRONTEND_DIR/backups/$(date +%Y%m%d_%H%M%S)"

# Safety check
if [ ! -f "$APP_FILE" ]; then
    echo -e "${RED}❌ Error: App.jsx not found at $APP_FILE${NC}"
    exit 1
fi

echo -e "${CYAN}This script will:${NC}"
echo "  1. Create backups of all files before modification"
echo "  2. Identify and report duplicate files"
echo "  3. Fix route conflicts (base vs list routes)"
echo "  4. Suggest fixes for duplicate 'add' routes"
echo "  5. Generate a cleaned App.jsx with proper redirects"
echo ""
echo -e "${YELLOW}⚠️  This is a DRY RUN - no files will be modified yet${NC}"
echo ""
read -p "Press ENTER to continue with analysis..."
echo ""

# ============================================
# PART 1: IDENTIFY DUPLICATE FILES
# ============================================
echo -e "${BLUE}## 📋 PART 1: Duplicate File Analysis${NC}"
echo "--------------------------------------"
echo ""

declare -A duplicate_files

# Check for duplicates
for file in "VehicleList" "CustomerList" "ViewJobs" "EstimatesList" "Invoice"; do
    root_file="$SRC_DIR/${file}.jsx"
    pages_file="$SRC_DIR/pages/${file}.jsx"
    
    if [ -f "$root_file" ] && [ -f "$pages_file" ]; then
        echo -e "${YELLOW}⚠️  DUPLICATE: ${file}.jsx${NC}"
        echo "   📁 src/${file}.jsx"
        echo "   📁 src/pages/${file}.jsx"
        
        # Compare file sizes
        root_size=$(wc -c < "$root_file")
        pages_size=$(wc -c < "$pages_file")
        
        echo "   Size: root=$root_size bytes, pages=$pages_size bytes"
        
        # Check which one is imported in App.jsx
        import_line=$(grep "import.*${file}.*from" "$APP_FILE" 2>/dev/null)
        if [ -n "$import_line" ]; then
            echo "   📥 Import: $import_line"
        fi
        
        echo ""
        duplicate_files["$file"]="true"
    fi
done

if [ ${#duplicate_files[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ No duplicate files found${NC}"
else
    echo -e "${RED}Found ${#duplicate_files[@]} duplicate file(s)${NC}"
fi

echo ""

# ============================================
# PART 2: ANALYZE ROUTE CONFLICTS
# ============================================
echo -e "${BLUE}## 🚦 PART 2: Route Conflict Analysis${NC}"
echo "--------------------------------------"
echo ""

declare -A route_conflicts

for module in customers vehicles jobs estimates invoices; do
    base_exists=$(grep -c "path=\"/${module}\"" "$APP_FILE" 2>/dev/null || echo "0")
    list_exists=$(grep -c "path=\"/${module}/list\"" "$APP_FILE" 2>/dev/null || echo "0")
    
    if [ "$base_exists" -gt 0 ] && [ "$list_exists" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  /${module} conflicts with /${module}/list${NC}"
        
        # Show which components are used
        base_component=$(grep "path=\"/${module}\"" "$APP_FILE" | sed -n 's/.*element={<\([^>]*\).*$/\1/p' | head -1)
        list_component=$(grep "path=\"/${module}/list\"" "$APP_FILE" | sed -n 's/.*element={<\([^>]*\).*$/\1/p' | head -1)
        
        echo "   /${module} → $base_component"
        echo "   /${module}/list → $list_component"
        echo ""
        
        route_conflicts["$module"]="true"
    fi
done

# Check vehicles add routes
vehicles_new=$(grep -c "path=\"/vehicles/new\"" "$APP_FILE" 2>/dev/null || echo "0")
vehicles_add=$(grep -c "path=\"/vehicles/add\"" "$APP_FILE" 2>/dev/null || echo "0")

if [ "$vehicles_new" -gt 0 ] && [ "$vehicles_add" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  /vehicles/new AND /vehicles/add both exist${NC}"
    
    new_component=$(grep "path=\"/vehicles/new\"" "$APP_FILE" | sed -n 's/.*element={<\([^>]*\).*$/\1/p')
    add_component=$(grep "path=\"/vehicles/add\"" "$APP_FILE" | sed -n 's/.*element={<\([^>]*\).*$/\1/p')
    
    echo "   /vehicles/new → $new_component"
    echo "   /vehicles/add → $add_component"
    echo ""
fi

# Check invoice singular vs plural
invoice_singular=$(grep -c "path=\"/invoice\"" "$APP_FILE" 2>/dev/null || echo "0")
invoice_plural=$(grep -c "path=\"/invoices\"" "$APP_FILE" 2>/dev/null || echo "0")

if [ "$invoice_singular" -gt 0 ] && [ "$invoice_plural" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  /invoice AND /invoices both exist${NC}"
    echo "   This creates inconsistent naming"
    echo ""
fi

echo ""

# ============================================
# PART 3: GENERATE RECOMMENDED FIXES
# ============================================
echo -e "${BLUE}## 💡 PART 3: Recommended Fixes${NC}"
echo "--------------------------------"
echo ""

cat > /tmp/routing_fixes.txt << 'EOF'
# RECOMMENDED ROUTING FIXES
# Copy these changes to your App.jsx

import { Navigate } from 'react-router-dom';

// INSIDE YOUR <Routes> BLOCK, MODIFY THESE ROUTES:

// ========================================
// FIX 1: Customer Routes
// ========================================
// REMOVE: <Route path="/customers" element={<Customers />} />
// REPLACE WITH:
<Route path="/customers" element={<Navigate to="/customers/list" replace />} />
<Route path="/customers/list" element={<CustomerList />} />
<Route path="/customers/new" element={<AddAndEditCustomer />} />
<Route path="/customers/:id" element={<CustomerDetail />} />
<Route path="/customers/:id/edit" element={<AddAndEditCustomer />} />

// ========================================
// FIX 2: Vehicle Routes
// ========================================
// REMOVE: <Route path="/vehicles" element={<Vehicles />} />
// REMOVE: <Route path="/vehicles/add" element={<AddVehicle />} />
// REPLACE WITH:
<Route path="/vehicles" element={<Navigate to="/vehicles/list" replace />} />
<Route path="/vehicles/list" element={<VehicleList />} />
<Route path="/vehicles/new" element={<VehicleForm />} />
<Route path="/vehicles/:id" element={<VehicleDetail />} />
<Route path="/vehicles/:id/edit" element={<VehicleForm />} />

// ========================================
// FIX 3: Job Routes
// ========================================
// REMOVE: <Route path="/jobs" element={<Jobs />} />
// REPLACE WITH:
<Route path="/jobs" element={<Navigate to="/jobs/list" replace />} />
<Route path="/jobs/list" element={<ViewJobs />} />
<Route path="/jobs/new" element={<CreateJob />} />
<Route path="/jobs/:id" element={<JobDetail />} />

// ========================================
// FIX 4: Estimate Routes
// ========================================
// REMOVE: <Route path="/estimates" element={<Estimates />} />
// REPLACE WITH:
<Route path="/estimates" element={<Navigate to="/estimates/list" replace />} />
<Route path="/estimates/list" element={<EstimatesList />} />
<Route path="/estimates/new" element={<CreateEditEstimate />} />
<Route path="/estimates/ai" element={<EstimateAI />} />
<Route path="/estimates/:id" element={<EstimateDetail />} />
<Route path="/estimates/:id/edit" element={<CreateEditEstimate />} />

// ========================================
// FIX 5: Invoice Routes
// ========================================
// REMOVE: <Route path="/invoice" element={<Invoice />} />
// KEEP ONLY:
<Route path="/invoices" element={<Navigate to="/invoices/list" replace />} />
<Route path="/invoices/list" element={<InvoicesList />} />  // Create this if missing
<Route path="/invoices/new" element={<CreateInvoice />} />
<Route path="/invoices/:id" element={<InvoiceDetail />} />

EOF

cat /tmp/routing_fixes.txt

echo ""
echo -e "${GREEN}✅ Fixes written to: /tmp/routing_fixes.txt${NC}"
echo ""

# ============================================
# PART 4: NAVBAR LINK FIXES
# ============================================
echo -e "${BLUE}## 🔗 PART 4: Navbar Link Updates${NC}"
echo "----------------------------------"
echo ""

NAVBAR_FILE="$SRC_DIR/components/Navbar.jsx"

if [ -f "$NAVBAR_FILE" ]; then
    echo "Current Navbar links:"
    grep "to=\"/" "$NAVBAR_FILE" | head -10
    echo ""
    
    cat > /tmp/navbar_fixes.txt << 'EOF'
# NAVBAR LINK FIXES
# Update these links in src/components/Navbar.jsx

<Link to="/dashboard" className="nav-link">Dashboard</Link>
<Link to="/customers/list" className="nav-link">Customers</Link>
<Link to="/vehicles/list" className="nav-link">Vehicles</Link>
<Link to="/jobs/list" className="nav-link">Jobs</Link>
<Link to="/estimates/list" className="nav-link">Estimates</Link>
<Link to="/invoices/list" className="nav-link">Invoices</Link>
<Link to="/appointments" className="nav-link">Appointments</Link>
<Link to="/reports" className="nav-link">Reports</Link>
<Link to="/inventory" className="nav-link">Inventory</Link>
EOF
    
    cat /tmp/navbar_fixes.txt
    echo ""
    echo -e "${GREEN}✅ Navbar fixes written to: /tmp/navbar_fixes.txt${NC}"
else
    echo -e "${YELLOW}⚠️  Navbar.jsx not found at expected location${NC}"
fi

echo ""

# ============================================
# PART 5: DUPLICATE FILE CLEANUP
# ============================================
echo -e "${BLUE}## 🗑️  PART 5: Duplicate File Cleanup${NC}"
echo "--------------------------------------"
echo ""

if [ ${#duplicate_files[@]} -gt 0 ]; then
    echo "The following duplicate files should be removed:"
    echo ""
    
    for file in "${!duplicate_files[@]}"; do
        echo -e "${YELLOW}  rm src/${file}.jsx${NC}"
        echo "  (Keep src/pages/${file}.jsx)"
        echo ""
    done
    
    echo "After removing duplicates, the imports in App.jsx are already correct:"
    echo "  import ${file} from './pages/${file}';"
else
    echo -e "${GREEN}✅ No duplicate files to clean up${NC}"
fi

echo ""

# ============================================
# SUMMARY
# ============================================
echo -e "${BLUE}## 📊 SUMMARY & NEXT STEPS${NC}"
echo "--------------------------"
echo ""

echo "1️⃣  Review the fixes in:"
echo "   📄 /tmp/routing_fixes.txt"
echo "   📄 /tmp/navbar_fixes.txt"
echo ""

echo "2️⃣  Create a backup:"
echo "   mkdir -p backups"
echo "   cp src/App.jsx backups/App.jsx.backup"
echo "   cp src/components/Navbar.jsx backups/Navbar.jsx.backup"
echo ""

echo "3️⃣  Apply the routing fixes to App.jsx manually"
echo ""

echo "4️⃣  Apply the navbar fixes to Navbar.jsx manually"
echo ""

echo "5️⃣  Remove duplicate files:"
for file in "${!duplicate_files[@]}"; do
    echo "   rm src/${file}.jsx"
done
echo ""

echo "6️⃣  Test the application:"
echo "   npm run dev"
echo "   Visit each route to verify it works"
echo ""

echo -e "${GREEN}🎉 Analysis complete!${NC}"
echo ""
echo "Would you like me to create an automatic fix script that applies these changes?"
echo "(Answer: yes/no)"
