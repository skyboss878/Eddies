#!/bin/bash
# Comprehensive Import Fix for Eddie's Automotive Frontend
# Fixes all import paths consistently across the entire src directory

set -e

cd ~/eddies-askan-automotive/frontend

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 Comprehensive Import Path Fix Starting...${NC}"

# Create timestamped backup
BACKUP_DIR="src_backup_$(date +%Y%m%d_%H%M%S)"
echo -e "${YELLOW}📦 Creating backup: $BACKUP_DIR${NC}"
cp -r src "$BACKUP_DIR"

# Count files to be processed
TOTAL_FILES=$(find src -type f \( -name "*.jsx" -o -name "*.js" \) -not -path "*/node_modules/*" | wc -l)
echo -e "${BLUE}📁 Processing $TOTAL_FILES JavaScript/JSX files...${NC}"

# Initialize counters
AUTH_FIXES=0
API_FIXES=0
CLIENT_FIXES=0
FILES_MODIFIED=0

# Process each file
find src -type f \( -name "*.jsx" -o -name "*.js" \) -not -path "*/node_modules/*" | while read -r file; do
    MODIFIED=false
    
    # Fix AuthContext imports - handle both single and double quotes
    if grep -q "import { useAuth } from ['\"]../../contexts/AuthContext['\"]" "$file"; then
        # Check if it's in auth subfolder (should keep ../../)
        if [[ "$file" == *"/components/auth/"* ]]; then
            echo -e "${YELLOW}⚠️  Keeping ../../ path for auth subfolder: $file${NC}"
        else
            sed -i "s|import { useAuth } from ['\"]../../contexts/AuthContext['\"]|import { useAuth } from '../contexts/AuthContext'|g" "$file"
            echo -e "${GREEN}✅ Fixed AuthContext import: $file${NC}"
            MODIFIED=true
            ((AUTH_FIXES++))
        fi
    fi
    
    # Fix API imports - both api and apiClient patterns
    if grep -q "import api from ['\"]../../api['\"]" "$file"; then
        sed -i "s|import api from ['\"]../../api['\"]|import api from '../utils/api'|g" "$file"
        echo -e "${GREEN}✅ Fixed API import: $file${NC}"
        MODIFIED=true
        ((API_FIXES++))
    fi
    
    # Fix apiClient to api imports
    if grep -q "import apiClient from ['\"]../utils/api['\"]" "$file"; then
        sed -i "s|import apiClient from ['\"]../utils/api['\"]|import api from '../utils/api'|g" "$file"
        echo -e "${GREEN}✅ Fixed apiClient import: $file${NC}"
        MODIFIED=true
        ((CLIENT_FIXES++))
    fi
    
    # Also fix any apiClient usage to api in the file content
    if grep -q "apiClient\." "$file"; then
        sed -i "s|apiClient\.|api.|g" "$file"
        echo -e "${GREEN}✅ Fixed apiClient usage: $file${NC}"
        MODIFIED=true
    fi
    
    $MODIFIED && ((FILES_MODIFIED++))
done

echo -e "\n${GREEN}🎉 Import Fix Complete!${NC}"
echo -e "${BLUE}📊 Summary:${NC}"
echo -e "   AuthContext fixes: $AUTH_FIXES"
echo -e "   API import fixes: $API_FIXES"
echo -e "   ApiClient fixes: $CLIENT_FIXES"
echo -e "   Files modified: $FILES_MODIFIED"
echo -e "   Backup created: $BACKUP_DIR"

echo -e "\n${BLUE}🔍 Checking for remaining issues...${NC}"
REMAINING_ISSUES=$(grep -r "import.*\.\./.*api\|import.*\.\./.*contexts" src/ | grep -v "utils/api\|contexts/AuthContext\|contexts/DataContext\|contexts/SettingsContext" | wc -l)

if [ "$REMAINING_ISSUES" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $REMAINING_ISSUES potential remaining issues:${NC}"
    grep -r "import.*\.\./.*api\|import.*\.\./.*contexts" src/ | grep -v "utils/api\|contexts/AuthContext\|contexts/DataContext\|contexts/SettingsContext" | head -10
else
    echo -e "${GREEN}✅ No remaining import issues detected!${NC}"
fi

echo -e "\n${GREEN}✅ All done! Your frontend should now have consistent imports.${NC}"
echo -e "${BLUE}💡 Refresh your browser at http://localhost:3002 to see the changes.${NC}"
