#!/bin/bash

# Fix CustomerList infinite loop

echo "🔧 FIXING CUSTOMERLIST INFINITE LOOP"
echo "====================================="
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

FRONTEND_DIR="$(pwd)"
CUSTOMER_LIST="$FRONTEND_DIR/src/pages/CustomerList.jsx"
BACKUP_FILE="$CUSTOMER_LIST.backup.$(date +%Y%m%d_%H%M%S)"

if [ ! -f "$CUSTOMER_LIST" ]; then
    echo -e "${RED}❌ CustomerList.jsx not found${NC}"
    exit 1
fi

echo -e "${YELLOW}Creating backup...${NC}"
cp "$CUSTOMER_LIST" "$BACKUP_FILE"
echo -e "${GREEN}✅ Backup: $BACKUP_FILE${NC}"
echo ""

echo -e "${BLUE}Applying fix...${NC}"
echo ""

# The fix: Change the useEffect to not depend on saveCurrentState
# Instead, depend on the actual values and call savePageState directly

cat > /tmp/customerlist_fix.tmp << 'EOF'
  // FIXED: Debounced state saving without saveCurrentState dependency
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (savePageState && currentPath) {
        savePageState(currentPath, {
          searchTerm,
          selectedCustomers,
          sortBy,
          sortOrder,
          filterStatus,
          viewMode
        });
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCustomers, sortBy, sortOrder, filterStatus, viewMode, savePageState, currentPath]);
EOF

# Find and replace the problematic useEffect
awk '
/\/\/ FIXED: Debounced state saving/ {
    in_block = 1
    # Print the new version
    while ((getline line < "/tmp/customerlist_fix.tmp") > 0) {
        print line
    }
    close("/tmp/customerlist_fix.tmp")
    # Skip the old block
    next
}
in_block && /^  \}, \[saveCurrentState\]\);/ {
    in_block = 0
    next
}
in_block {
    next
}
{ print }
' "$CUSTOMER_LIST" > "$CUSTOMER_LIST.tmp"

mv "$CUSTOMER_LIST.tmp" "$CUSTOMER_LIST"

echo -e "${GREEN}✅ Fixed the infinite loop!${NC}"
echo ""
echo "The problem was:"
echo "  - useEffect depended on [saveCurrentState]"
echo "  - saveCurrentState had dependencies that changed every render"
echo "  - This created an infinite loop"
echo ""
echo "The solution:"
echo "  - Remove saveCurrentState from dependencies"
echo "  - Call savePageState directly inside the useEffect"
echo "  - Depend only on the actual state values"
echo ""
echo -e "${GREEN}Now you can safely apply navigation fixes!${NC}"
echo ""
echo "To rollback:"
echo "  cp $BACKUP_FILE $CUSTOMER_LIST"
echo ""
