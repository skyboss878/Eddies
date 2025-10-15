#!/bin/bash

# User Flow and API Analyzer Script
# Analyzes React app routing, components, and API calls without making changes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="${1:-./src}"
OUTPUT_DIR="flow-analysis-$(date +%Y%m%d_%H%M%S)"
LOG_FILE="$OUTPUT_DIR/analysis.log"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo -e "${GREEN}🚀 Starting User Flow & API Analysis${NC}"
echo -e "${BLUE}📁 Analyzing directory: $APP_DIR${NC}"
echo -e "${BLUE}📋 Output directory: $OUTPUT_DIR${NC}"

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to extract routes from App.jsx
extract_routes() {
    echo -e "\n${YELLOW}🔍 Extracting Routes...${NC}"
    log "Starting route extraction"
    
    if [[ -f "$APP_DIR/App.jsx" || -f "$APP_DIR/App.js" ]]; then
        APP_FILE=$(find "$APP_DIR" -name "App.jsx" -o -name "App.js" | head -1)
        
        echo "# Route Analysis" > "$OUTPUT_DIR/routes.md"
        echo "Generated on: $(date)" >> "$OUTPUT_DIR/routes.md"
        echo "" >> "$OUTPUT_DIR/routes.md"
        
        echo "## Public Routes" >> "$OUTPUT_DIR/routes.md"
        grep -n "path=" "$APP_FILE" | grep -v "ProtectedRoute" | while read -r line; do
            echo "- $line" >> "$OUTPUT_DIR/routes.md"
        done
        
        echo "" >> "$OUTPUT_DIR/routes.md"
        echo "## Protected Routes" >> "$OUTPUT_DIR/routes.md"
        grep -A 5 -B 5 "ProtectedRoute" "$APP_FILE" | grep "path=" | while read -r line; do
            echo "- $line" >> "$OUTPUT_DIR/routes.md"
        done
        
        # Extract lazy-loaded components
        echo "" >> "$OUTPUT_DIR/routes.md"
        echo "## Lazy Loaded Components" >> "$OUTPUT_DIR/routes.md"
        grep -n "lazy(" "$APP_FILE" | while read -r line; do
            echo "- $line" >> "$OUTPUT_DIR/routes.md"
        done
        
        echo -e "${GREEN}✅ Routes extracted to $OUTPUT_DIR/routes.md${NC}"
        log "Routes extracted successfully"
    else
        echo -e "${RED}❌ App.jsx/App.js not found${NC}"
        log "ERROR: App.jsx/App.js not found"
    fi
}

# Function to analyze API calls
analyze_api_calls() {
    echo -e "\n${YELLOW}🌐 Analyzing API Calls...${NC}"
    log "Starting API call analysis"
    
    echo "# API Analysis" > "$OUTPUT_DIR/api-calls.md"
    echo "Generated on: $(date)" >> "$OUTPUT_DIR/api-calls.md"
    echo "" >> "$OUTPUT_DIR/api-calls.md"
    
    # Find fetch calls
    echo "## Fetch API Calls" >> "$OUTPUT_DIR/api-calls.md"
    find "$APP_DIR" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | \
    xargs grep -n "fetch(" | \
    sed 's/^/- /' >> "$OUTPUT_DIR/api-calls.md"
    
    # Find axios calls
    echo "" >> "$OUTPUT_DIR/api-calls.md"
    echo "## Axios API Calls" >> "$OUTPUT_DIR/api-calls.md"
    find "$APP_DIR" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | \
    xargs grep -n "axios\." | \
    sed 's/^/- /' >> "$OUTPUT_DIR/api-calls.md"
    
    # Find API endpoints
    echo "" >> "$OUTPUT_DIR/api-calls.md"
    echo "## API Endpoints" >> "$OUTPUT_DIR/api-calls.md"
    find "$APP_DIR" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | \
    xargs grep -n "'/api/" | \
    sed 's/^/- /' >> "$OUTPUT_DIR/api-calls.md"
    
    echo -e "${GREEN}✅ API calls analyzed and saved to $OUTPUT_DIR/api-calls.md${NC}"
    log "API call analysis completed"
}

# Function to analyze components and their relationships
analyze_components() {
    echo -e "\n${YELLOW}🧩 Analyzing Components...${NC}"
    log "Starting component analysis"
    
    echo "# Component Analysis" > "$OUTPUT_DIR/components.md"
    echo "Generated on: $(date)" >> "$OUTPUT_DIR/components.md"
    echo "" >> "$OUTPUT_DIR/components.md"
    
    # Find all components
    echo "## All Components" >> "$OUTPUT_DIR/components.md"
    find "$APP_DIR" -name "*.jsx" -o -name "*.js" | while read -r file; do
        component_name=$(basename "$file" .jsx)
        component_name=$(basename "$component_name" .js)
        echo "- $component_name ($file)" >> "$OUTPUT_DIR/components.md"
    done
    
    # Find imports between components
    echo "" >> "$OUTPUT_DIR/components.md"
    echo "## Component Dependencies" >> "$OUTPUT_DIR/components.md"
    find "$APP_DIR" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | \
    xargs grep -n "import.*from.*\'\.\/" | \
    sed 's/^/- /' >> "$OUTPUT_DIR/components.md"
    
    echo -e "${GREEN}✅ Components analyzed and saved to $OUTPUT_DIR/components.md${NC}"
    log "Component analysis completed"
}

# Function to create flow map
create_flow_map() {
    echo -e "\n${YELLOW}🗺️  Creating Flow Map...${NC}"
    log "Creating flow map"
    
    cat > "$OUTPUT_DIR/flow-map.md" << 'EOF'
# User Flow Map

## Authentication Flow
1. Landing Page (/) → Login/Register
2. Login (/login) → Dashboard (/dashboard)
3. Register (/register) → Dashboard (/dashboard)

## Main Application Flow
Dashboard (/app/dashboard) serves as the central hub with navigation to:

### Vehicle Management Flow
- Vehicle List (/app/vehicles)
  - Add Vehicle (/app/vehicles/add)
  - Vehicle Detail (/app/vehicles/:id)
  - Edit Vehicle (/app/vehicles/:id/edit)

### Job Management Flow
- Jobs List (/app/jobs)
  - Create Job (/app/jobs/create)
  - Job Detail (/app/jobs/:id)
  - Edit Job (/app/jobs/:id/edit)

### Customer Management Flow
- Customer List (/app/customers)
  - Add Customer (/app/customers/add)
  - Customer Detail (/app/customers/:id)
  - Edit Customer (/app/customers/:id/edit)

### Estimate Management Flow
- AI Estimates (/app/estimates)
  - Create Estimate (/app/estimates/create)
  - Estimate Detail (/app/estimates/:id)
  - Edit Estimate (/app/estimates/:id/edit)

### Additional Modules
- Invoice Management (/app/invoices)
- Appointment Calendar (/app/appointments)
- Parts & Labor Management (/app/parts-labor)
- Reports & Analytics (/app/reports)
- Settings (/app/settings)

## Protected Route Structure
All /app/* routes require authentication and use the Layout component.
EOF

    echo -e "${GREEN}✅ Flow map created at $OUTPUT_DIR/flow-map.md${NC}"
    log "Flow map created successfully"
}

# Function to analyze state management
analyze_state_management() {
    echo -e "\n${YELLOW}📊 Analyzing State Management...${NC}"
    log "Starting state management analysis"
    
    echo "# State Management Analysis" > "$OUTPUT_DIR/state-management.md"
    echo "Generated on: $(date)" >> "$OUTPUT_DIR/state-management.md"
    echo "" >> "$OUTPUT_DIR/state-management.md"
    
    # Find useState hooks
    echo "## useState Hooks" >> "$OUTPUT_DIR/state-management.md"
    find "$APP_DIR" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | \
    xargs grep -n "useState" | \
    sed 's/^/- /' >> "$OUTPUT_DIR/state-management.md"
    
    # Find useEffect hooks
    echo "" >> "$OUTPUT_DIR/state-management.md"
    echo "## useEffect Hooks" >> "$OUTPUT_DIR/state-management.md"
    find "$APP_DIR" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | \
    xargs grep -n "useEffect" | \
    sed 's/^/- /' >> "$OUTPUT_DIR/state-management.md"
    
    # Find context usage
    echo "" >> "$OUTPUT_DIR/state-management.md"
    echo "## Context Usage" >> "$OUTPUT_DIR/state-management.md"
    find "$APP_DIR" -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | \
    xargs grep -n "useContext\|createContext" | \
    sed 's/^/- /' >> "$OUTPUT_DIR/state-management.md"
    
    echo -e "${GREEN}✅ State management analyzed and saved to $OUTPUT_DIR/state-management.md${NC}"
    log "State management analysis completed"
}

# Function to generate test scripts
generate_test_scripts() {
    echo -e "\n${YELLOW}🧪 Generating Test Scripts...${NC}"
    log "Generating test scripts"
    
    # Generate curl test script for API endpoints
    cat > "$OUTPUT_DIR/api-test.sh" << 'EOF'
#!/bin/bash

# API Test Script
# Run this to test your API endpoints

BASE_URL="${API_BASE_URL:-http://localhost:3001}"
TOKEN=""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test authentication
echo -e "${YELLOW}Testing Authentication...${NC}"
curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  | jq '.'

# Test protected endpoints (add your actual endpoints here)
echo -e "${YELLOW}Testing Protected Endpoints...${NC}"

# Example tests - modify based on your actual API
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/vehicles" | jq '.'
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/customers" | jq '.'
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/jobs" | jq '.'

echo -e "${GREEN}API tests completed${NC}"
EOF

    # Generate Cypress test template
    mkdir -p "$OUTPUT_DIR/cypress-tests"
    cat > "$OUTPUT_DIR/cypress-tests/user-flow.cy.js" << 'EOF'
// Cypress User Flow Tests
// Place this in cypress/e2e/ directory

describe('Automotive App User Flow', () => {
  beforeEach(() => {
    // Visit the app
    cy.visit('/')
  })

  it('should navigate through authentication flow', () => {
    // Test landing page to login
    cy.contains('Login').click()
    cy.url().should('include', '/login')
    
    // Test login form (modify with actual selectors)
    cy.get('[data-cy=email]').type('test@example.com')
    cy.get('[data-cy=password]').type('password')
    cy.get('[data-cy=login-submit]').click()
    
    // Should redirect to dashboard
    cy.url().should('include', '/dashboard')
  })

  it('should navigate vehicle management flow', () => {
    // Login first
    cy.login('test@example.com', 'password')
    
    // Navigate to vehicles
    cy.visit('/app/vehicles')
    cy.url().should('include', '/app/vehicles')
    
    // Test add vehicle flow
    cy.get('[data-cy=add-vehicle]').click()
    cy.url().should('include', '/app/vehicles/add')
  })

  it('should navigate job management flow', () => {
    cy.login('test@example.com', 'password')
    
    cy.visit('/app/jobs')
    cy.url().should('include', '/app/jobs')
    
    cy.get('[data-cy=create-job]').click()
    cy.url().should('include', '/app/jobs/create')
  })

  it('should navigate customer management flow', () => {
    cy.login('test@example.com', 'password')
    
    cy.visit('/app/customers')
    cy.url().should('include', '/app/customers')
    
    cy.get('[data-cy=add-customer]').click()
    cy.url().should('include', '/app/customers/add')
  })
})

// Custom command for login
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('[data-cy=email]').type(email)
    cy.get('[data-cy=password]').type(password)
    cy.get('[data-cy=login-submit]').click()
    cy.url().should('include', '/dashboard')
  })
})
EOF

    chmod +x "$OUTPUT_DIR/api-test.sh"
    
    echo -e "${GREEN}✅ Test scripts generated:${NC}"
    echo -e "  - API tests: $OUTPUT_DIR/api-test.sh"
    echo -e "  - Cypress tests: $OUTPUT_DIR/cypress-tests/"
    log "Test scripts generated successfully"
}

# Function to create monitoring script
create_monitoring_script() {
    echo -e "\n${YELLOW}📊 Creating Monitoring Script...${NC}"
    log "Creating monitoring script"
    
    cat > "$OUTPUT_DIR/monitor-app.sh" << 'EOF'
#!/bin/bash

# App Monitoring Script
# Monitors your app's health and performance

BASE_URL="${APP_URL:-http://localhost:3000}"
API_URL="${API_URL:-http://localhost:3001}"

echo "🔍 Monitoring App Health..."

# Check if app is running
echo "Checking app availability..."
if curl -s "$BASE_URL" > /dev/null; then
    echo "✅ App is running at $BASE_URL"
else
    echo "❌ App is not accessible at $BASE_URL"
fi

# Check API health
echo "Checking API availability..."
if curl -s "$API_URL/health" > /dev/null 2>&1; then
    echo "✅ API is running at $API_URL"
else
    echo "❌ API is not accessible at $API_URL"
fi

# Monitor network requests (requires browser dev tools or network monitoring)
echo "📊 To monitor real-time API calls:"
echo "1. Open browser dev tools (F12)"
echo "2. Go to Network tab"
echo "3. Navigate through your app"
echo "4. Filter by XHR/Fetch to see API calls"

# Performance monitoring suggestions
echo "🚀 Performance monitoring suggestions:"
echo "1. Use Lighthouse: lighthouse $BASE_URL --output html --output-path ./lighthouse-report.html"
echo "2. Use browser dev tools Performance tab"
echo "3. Monitor bundle size with webpack-bundle-analyzer"
EOF

    chmod +x "$OUTPUT_DIR/monitor-app.sh"
    
    echo -e "${GREEN}✅ Monitoring script created: $OUTPUT_DIR/monitor-app.sh${NC}"
    log "Monitoring script created successfully"
}

# Function to generate summary report
generate_summary() {
    echo -e "\n${YELLOW}📋 Generating Summary Report...${NC}"
    log "Generating summary report"
    
    cat > "$OUTPUT_DIR/README.md" << EOF
# User Flow & API Analysis Report

Generated on: $(date)
Analyzed directory: $APP_DIR

## 📁 Files Generated

1. **routes.md** - Complete route analysis from your App.jsx
2. **api-calls.md** - All API calls found in your codebase
3. **components.md** - Component structure and dependencies
4. **flow-map.md** - Visual user flow map
5. **state-management.md** - State management patterns used
6. **api-test.sh** - Shell script to test your API endpoints
7. **cypress-tests/** - Cypress test templates for user flows
8. **monitor-app.sh** - Monitoring script for app health
9. **analysis.log** - Detailed log of the analysis process

## 🚀 Quick Start

### Test API Endpoints
\`\`\`bash
chmod +x api-test.sh
./api-test.sh
\`\`\`

### Monitor App Health
\`\`\`bash
chmod +x monitor-app.sh
./monitor-app.sh
\`\`\`

### Set up Cypress Testing
\`\`\`bash
npm install --save-dev cypress
cp cypress-tests/* cypress/e2e/
npx cypress open
\`\`\`

## 📊 Analysis Summary

- **Routes analyzed**: $(grep -c "path=" "$APP_DIR/App.jsx" 2>/dev/null || echo "N/A")
- **Components found**: $(find "$APP_DIR" -name "*.jsx" -o -name "*.js" | wc -l)
- **API calls detected**: $(find "$APP_DIR" -name "*.js" -o -name "*.jsx" | xargs grep -c "fetch(\|axios\." 2>/dev/null | awk '{sum += \$1} END {print sum}' || echo "0")

## 🔧 Next Steps

1. Review the flow-map.md to understand your app structure
2. Test critical user flows with the generated Cypress tests
3. Use api-test.sh to verify your API endpoints
4. Monitor app performance with monitor-app.sh
5. Check routes.md for any routing issues

## 📝 Notes

- All analysis is read-only - no changes were made to your codebase
- Test scripts may need customization based on your specific API structure
- Consider adding data-cy attributes to your components for better testing
EOF

    echo -e "${GREEN}✅ Summary report generated: $OUTPUT_DIR/README.md${NC}"
    log "Summary report generated successfully"
}

# Main execution
main() {
    log "Starting user flow and API analysis"
    
    extract_routes
    analyze_api_calls
    analyze_components
    create_flow_map
    analyze_state_management
    generate_test_scripts
    create_monitoring_script
    generate_summary
    
    echo -e "\n${GREEN}🎉 Analysis Complete!${NC}"
    echo -e "${CYAN}📂 All results saved in: $OUTPUT_DIR${NC}"
    echo -e "${CYAN}📖 Start with: cat $OUTPUT_DIR/README.md${NC}"
    
    log "Analysis completed successfully"
}

# Check if src directory exists
if [[ ! -d "$APP_DIR" ]]; then
    echo -e "${RED}❌ Directory $APP_DIR not found${NC}"
    echo -e "${YELLOW}Usage: $0 [src-directory]${NC}"
    echo -e "${YELLOW}Example: $0 ./src${NC}"
    exit 1
fi

# Run main function
main "$@"
