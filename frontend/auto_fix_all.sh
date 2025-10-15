#!/bin/bash

# AUTOMATIC NAVIGATION FIX - APPLIES ALL CHANGES
# This script will fix all routing issues automatically

echo "🚀 AUTOMATIC NAVIGATION FIX"
echo "============================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

FRONTEND_DIR="$(pwd)"
SRC_DIR="$FRONTEND_DIR/src"
APP_FILE="$SRC_DIR/App.jsx"
NAVBAR_FILE="$SRC_DIR/components/Navbar.jsx"
BACKUP_DIR="$FRONTEND_DIR/backups/$(date +%Y%m%d_%H%M%S)"

# Safety check
if [ ! -f "$APP_FILE" ]; then
    echo -e "${RED}❌ Error: App.jsx not found${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  WARNING: This will modify your files!${NC}"
echo ""
echo "This script will:"
echo "  1. Create backups in: $BACKUP_DIR"
echo "  2. Remove 5 duplicate files from src/ root"
echo "  3. Fix App.jsx routes (add redirects, remove conflicts)"
echo "  4. Update Navbar.jsx links to point to /list routes"
echo ""
read -p "Type 'YES' to continue: " confirm

if [ "$confirm" != "YES" ]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo -e "${BLUE}Starting automatic fix...${NC}"
echo ""

# ============================================
# STEP 1: CREATE BACKUPS
# ============================================
echo -e "${BLUE}[1/4] Creating backups...${NC}"

mkdir -p "$BACKUP_DIR"
mkdir -p "$BACKUP_DIR/src"
mkdir -p "$BACKUP_DIR/src/components"

cp "$APP_FILE" "$BACKUP_DIR/src/"
[ -f "$NAVBAR_FILE" ] && cp "$NAVBAR_FILE" "$BACKUP_DIR/src/components/"

# Backup duplicate files before deletion
for file in VehicleList CustomerList ViewJobs EstimatesList Invoice; do
    [ -f "$SRC_DIR/${file}.jsx" ] && cp "$SRC_DIR/${file}.jsx" "$BACKUP_DIR/src/"
done

echo -e "${GREEN}✅ Backups created in: $BACKUP_DIR${NC}"
echo ""

# ============================================
# STEP 2: REMOVE DUPLICATE FILES
# ============================================
echo -e "${BLUE}[2/4] Removing duplicate files...${NC}"

duplicate_count=0

for file in VehicleList CustomerList ViewJobs EstimatesList Invoice; do
    if [ -f "$SRC_DIR/${file}.jsx" ]; then
        # Check if it's empty (0 bytes)
        size=$(wc -c < "$SRC_DIR/${file}.jsx")
        if [ "$size" -eq 0 ]; then
            rm "$SRC_DIR/${file}.jsx"
            echo -e "${GREEN}✅ Removed empty: src/${file}.jsx${NC}"
            ((duplicate_count++))
        else
            echo -e "${YELLOW}⚠️  Skipped (not empty): src/${file}.jsx${NC}"
        fi
    fi
done

echo -e "${GREEN}✅ Removed $duplicate_count duplicate files${NC}"
echo ""

# ============================================
# STEP 3: FIX APP.JSX ROUTES
# ============================================
echo -e "${BLUE}[3/4] Fixing App.jsx routes...${NC}"

# Create a temporary file for the new App.jsx
TMP_APP="$SRC_DIR/App.jsx.tmp"

# Read App.jsx and make replacements
sed -e 's|<Route path="/customers" element={<Customers />} />|<Route path="/customers" element={<Navigate to="/customers/list" replace />} />|g' \
    -e 's|<Route path="/vehicles" element={<Vehicles />} />|<Route path="/vehicles" element={<Navigate to="/vehicles/list" replace />} />|g' \
    -e 's|<Route path="/jobs" element={<Jobs />} />|<Route path="/jobs" element={<Navigate to="/jobs/list" replace />} />|g' \
    -e 's|<Route path="/estimates" element={<Estimates />} />|<Route path="/estimates" element={<Navigate to="/estimates/list" replace />} />|g' \
    -e 's|<Route path="/invoices" element={<Invoices />} />|<Route path="/invoices" element={<Navigate to="/invoices/list" replace />} />|g' \
    "$APP_FILE" > "$TMP_APP"

# Check if Navigate is imported
if ! grep -q "Navigate" "$TMP_APP"; then
    # Add Navigate to the react-router-dom import
    sed -i 's/from "react-router-dom"/from "react-router-dom"/' "$TMP_APP"
    sed -i 's/import { Router, Routes, Route/import { Router, Routes, Route, Navigate/' "$TMP_APP"
    sed -i 's/import { BrowserRouter as Router, Routes, Route/import { BrowserRouter as Router, Routes, Route, Navigate/' "$TMP_APP"
fi

# Move temp file to original
mv "$TMP_APP" "$APP_FILE"

echo -e "${GREEN}✅ Fixed route redirects in App.jsx${NC}"
echo "   - /customers → redirects to /customers/list"
echo "   - /vehicles → redirects to /vehicles/list"
echo "   - /jobs → redirects to /jobs/list"
echo "   - /estimates → redirects to /estimates/list"
echo "   - /invoices → redirects to /invoices/list"
echo ""

# ============================================
# STEP 4: FIX NAVBAR LINKS
# ============================================
echo -e "${BLUE}[4/4] Fixing Navbar.jsx links...${NC}"

if [ -f "$NAVBAR_FILE" ]; then
    TMP_NAVBAR="$NAVBAR_FILE.tmp"
    
    # Update navbar links to point to /list routes
    sed -e 's|to="/customers"|to="/customers/list"|g' \
        -e 's|to="/vehicles"|to="/vehicles/list"|g' \
        -e 's|to="/jobs"|to="/jobs/list"|g' \
        -e 's|to="/estimates"|to="/estimates/list"|g' \
        -e 's|to="/invoices"|to="/invoices/list"|g' \
        "$NAVBAR_FILE" > "$TMP_NAVBAR"
    
    mv "$TMP_NAVBAR" "$NAVBAR_FILE"
    
    echo -e "${GREEN}✅ Updated Navbar links${NC}"
    echo "   - Customers → /customers/list"
    echo "   - Vehicles → /vehicles/list"
    echo "   - Jobs → /jobs/list"
    echo "   - Estimates → /estimates/list"
    echo "   - Invoices → /invoices/list"
else
    echo -e "${YELLOW}⚠️  Navbar.jsx not found, skipping${NC}"
fi

echo ""

# ============================================
# SUMMARY
# ============================================
echo -e "${GREEN}🎉 ALL FIXES APPLIED SUCCESSFULLY!${NC}"
echo ""
echo "═══════════════════════════════════════════"
echo "📋 SUMMARY OF CHANGES"
echo "═══════════════════════════════════════════"
echo ""
echo "✅ Created backups in: $BACKUP_DIR"
echo "✅ Removed $duplicate_count empty duplicate files"
echo "✅ Fixed 5 route conflicts in App.jsx"
echo "✅ Updated Navbar links to use /list routes"
echo ""
echo "═══════════════════════════════════════════"
echo "🚦 REMAINING ISSUES TO HANDLE MANUALLY"
echo "═══════════════════════════════════════════"
echo ""
echo "1️⃣  Vehicle Add Routes Conflict:"
echo "   ⚠️  Both /vehicles/new and /vehicles/add exist"
echo "   📝 TODO: Choose one or redirect one to the other"
echo "   "
echo "   Option A - Remove /vehicles/add route:"
echo "   Delete this line from App.jsx:"
echo "   <Route path=\"/vehicles/add\" element={<AddVehicle />} />"
echo ""
echo "   Option B - Redirect /vehicles/add to /vehicles/new:"
echo "   Replace with:"
echo "   <Route path=\"/vehicles/add\" element={<Navigate to=\"/vehicles/new\" replace />} />"
echo ""
echo "2️⃣  Invoice vs Invoices:"
echo "   ⚠️  /invoice (singular) still exists"
echo "   📝 TODO: Decide what /invoice should do"
echo "   "
echo "   If /invoice is not needed, delete this line:"
echo "   <Route path=\"/invoice\" element={<Invoice />} />"
echo ""
echo "═══════════════════════════════════════════"
echo "🧪 TESTING CHECKLIST"
echo "═══════════════════════════════════════════"
echo ""
echo "Run: npm run dev"
echo ""
echo "Test these URLs:"
echo "  ✓ http://localhost:5173/customers (should redirect to /customers/list)"
echo "  ✓ http://localhost:5173/customers/list (should show customer list)"
echo "  ✓ http://localhost:5173/vehicles (should redirect to /vehicles/list)"
echo "  ✓ http://localhost:5173/vehicles/list (should show vehicle list)"
echo "  ✓ http://localhost:5173/jobs (should redirect to /jobs/list)"
echo "  ✓ http://localhost:5173/estimates (should redirect to /estimates/list)"
echo "  ✓ http://localhost:5173/invoices (should redirect to /invoices/list)"
echo ""
echo "Test navbar clicks work correctly"
echo ""
echo "═══════════════════════════════════════════"
echo "🔄 TO ROLLBACK CHANGES"
echo "═══════════════════════════════════════════"
echo ""
echo "If something went wrong:"
echo "  cp $BACKUP_DIR/src/App.jsx $SRC_DIR/"
echo "  cp $BACKUP_DIR/src/components/Navbar.jsx $SRC_DIR/components/"
echo ""
echo "═══════════════════════════════════════════"
echo ""
echo -e "${GREEN}✨ Done! Start your dev server and test.${NC}"
echo ""
