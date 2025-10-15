#!/bin/bash

# Complete Frontend Analyzer for Eddie's Asian Automotive
# This script performs comprehensive analysis of the React frontend application

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
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
ANALYSIS_DIR="analysis_${TIMESTAMP}"
REPORT_FILE="${ANALYSIS_DIR}/complete_analysis_report.md"

# Create analysis directory
mkdir -p "$ANALYSIS_DIR"/{logs,reports,fixes}

echo -e "${CYAN}🔍 Eddie's Asian Automotive - Complete Frontend Analysis${NC}"
echo -e "${CYAN}================================================================${NC}"
echo "Analysis started at: $(date)"
echo "Analysis directory: $ANALYSIS_DIR"
echo ""

# Initialize report
cat > "$REPORT_FILE" << EOF
# Complete Frontend Analysis Report
**Generated:** $(date)
**Project:** Eddie's Asian Automotive Frontend
**Analysis ID:** ${TIMESTAMP}

## Executive Summary
This report provides a comprehensive analysis of the frontend application structure, dependencies, code quality, and potential issues.

---

EOF

# Function to log and display
log_section() {
    local title="$1"
    echo -e "\n${BLUE}📋 $title${NC}"
    echo "## $title" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
}

log_result() {
    local level="$1"
    local message="$2"
    case $level in
        "SUCCESS") echo -e "${GREEN}✅ $message${NC}" ;;
        "WARNING") echo -e "${YELLOW}⚠️  $message${NC}" ;;
        "ERROR") echo -e "${RED}❌ $message${NC}" ;;
        "INFO") echo -e "${CYAN}ℹ️  $message${NC}" ;;
    esac
    echo "- $message" >> "$REPORT_FILE"
}

# Function to analyze file structure
analyze_structure() {
    log_section "Project Structure Analysis"
    
    # Count files by type
    local js_files=$(find src -name "*.js" -o -name "*.jsx" | wc -l)
    local css_files=$(find src -name "*.css" | wc -l)
    local json_files=$(find . -name "*.json" | wc -l)
    local config_files=$(find . -name "*.config.*" | wc -l)
    
    log_result "INFO" "JavaScript/JSX files: $js_files"
    log_result "INFO" "CSS files: $css_files"
    log_result "INFO" "JSON files: $json_files"
    log_result "INFO" "Config files: $config_files"
    
    # Check for required files
    local required_files=("package.json" "vite.config.js" "src/App.jsx" "src/main.jsx" "index.html")
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            log_result "SUCCESS" "Required file exists: $file"
        else
            log_result "ERROR" "Missing required file: $file"
        fi
    done
    
    # Analyze directory structure
    echo -e "\n### Directory Structure" >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
    tree src -I node_modules 2>/dev/null || find src -type d | sed 's|[^/]*/|  |g' >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
}

# Function to analyze dependencies
analyze_dependencies() {
    log_section "Dependencies Analysis"
    
    if [ -f "package.json" ]; then
        # Check for package.json issues
        if ! node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" 2>/dev/null; then
            log_result "ERROR" "Invalid package.json format"
        else
            log_result "SUCCESS" "Valid package.json format"
        fi
        
        # Count dependencies
        local deps=$(node -pe "Object.keys(JSON.parse(require('fs').readFileSync('package.json', 'utf8')).dependencies || {}).length" 2>/dev/null || echo "0")
        local devDeps=$(node -pe "Object.keys(JSON.parse(require('fs').readFileSync('package.json', 'utf8')).devDependencies || {}).length" 2>/dev/null || echo "0")
        
        log_result "INFO" "Production dependencies: $deps"
        log_result "INFO" "Development dependencies: $devDeps"
        
        # Check for security vulnerabilities
        if command -v npm &> /dev/null; then
            log_result "INFO" "Running npm audit..."
            npm audit --json > "${ANALYSIS_DIR}/logs/npm_audit.json" 2>/dev/null || true
            if [ -f "${ANALYSIS_DIR}/logs/npm_audit.json" ]; then
                local vulnerabilities=$(node -pe "JSON.parse(require('fs').readFileSync('${ANALYSIS_DIR}/logs/npm_audit.json', 'utf8')).metadata?.vulnerabilities?.total || 0" 2>/dev/null || echo "0")
                if [ "$vulnerabilities" -gt 0 ]; then
                    log_result "WARNING" "Found $vulnerabilities security vulnerabilities"
                else
                    log_result "SUCCESS" "No security vulnerabilities found"
                fi
            fi
        fi
        
        # Check for outdated packages
        if command -v npm &> /dev/null; then
            npm outdated --json > "${ANALYSIS_DIR}/logs/outdated_packages.json" 2>/dev/null || true
            if [ -f "${ANALYSIS_DIR}/logs/outdated_packages.json" ] && [ -s "${ANALYSIS_DIR}/logs/outdated_packages.json" ]; then
                log_result "WARNING" "Some packages are outdated (check logs/outdated_packages.json)"
            else
                log_result "SUCCESS" "All packages are up to date"
            fi
        fi
        
        # List key dependencies
        echo -e "\n### Key Dependencies" >> "$REPORT_FILE"
        echo '```json' >> "$REPORT_FILE"
        node -pe "JSON.stringify(JSON.parse(require('fs').readFileSync('package.json', 'utf8')).dependencies, null, 2)" 2>/dev/null >> "$REPORT_FILE" || echo "Error reading dependencies" >> "$REPORT_FILE"
        echo '```' >> "$REPORT_FILE"
    else
        log_result "ERROR" "package.json not found"
    fi
}

# Function to analyze imports and exports
analyze_imports_exports() {
    log_section "Import/Export Analysis"
    
    # Find unused imports (basic check)
    echo "Analyzing imports and exports..." > "${ANALYSIS_DIR}/logs/import_export_analysis.log"
    
    # Check for circular dependencies
    find src -name "*.js" -o -name "*.jsx" | xargs grep -l "import.*from.*\.\/" > "${ANALYSIS_DIR}/logs/relative_imports.txt" 2>/dev/null || true
    local relative_imports=$(wc -l < "${ANALYSIS_DIR}/logs/relative_imports.txt" 2>/dev/null || echo "0")
    log_result "INFO" "Files with relative imports: $relative_imports"
    
    # Check for missing exports in index.js
    if [ -f "src/index.js" ]; then
        local exports_count=$(grep -c "export" src/index.js 2>/dev/null || echo "0")
        log_result "INFO" "Exports in src/index.js: $exports_count"
    fi
    
    # Find potentially unused components
    find src/components -name "*.jsx" | while read component; do
        local basename=$(basename "$component" .jsx)
        if ! grep -r "import.*$basename" src --exclude="$component" >/dev/null 2>&1; then
            echo "Potentially unused component: $basename" >> "${ANALYSIS_DIR}/logs/unused_components.txt"
        fi
    done
    
    if [ -f "${ANALYSIS_DIR}/logs/unused_components.txt" ]; then
        local unused_count=$(wc -l < "${ANALYSIS_DIR}/logs/unused_components.txt")
        log_result "WARNING" "Potentially unused components: $unused_count (check logs/unused_components.txt)"
    else
        log_result "SUCCESS" "All components appear to be used"
    fi
}

# Function to analyze code quality
analyze_code_quality() {
    log_section "Code Quality Analysis"
    
    # Check for console.log statements
    local console_logs=$(find src -name "*.js" -o -name "*.jsx" | xargs grep -n "console\." 2>/dev/null | wc -l)
    if [ "$console_logs" -gt 0 ]; then
        log_result "WARNING" "Found $console_logs console statements (should be removed for production)"
        find src -name "*.js" -o -name "*.jsx" | xargs grep -n "console\." > "${ANALYSIS_DIR}/logs/console_statements.txt" 2>/dev/null
    else
        log_result "SUCCESS" "No console statements found"
    fi
    
    # Check for TODO/FIXME comments
    local todos=$(find src -name "*.js" -o -name "*.jsx" | xargs grep -ni "todo\|fixme" 2>/dev/null | wc -l)
    if [ "$todos" -gt 0 ]; then
        log_result "INFO" "Found $todos TODO/FIXME comments"
        find src -name "*.js" -o -name "*.jsx" | xargs grep -ni "todo\|fixme" > "${ANALYSIS_DIR}/logs/todos.txt" 2>/dev/null
    fi
    
    # Check for hardcoded URLs/credentials
    local hardcoded=$(find src -name "*.js" -o -name "*.jsx" | xargs grep -n "http://\|https://\|password.*=" 2>/dev/null | wc -l)
    if [ "$hardcoded" -gt 0 ]; then
        log_result "WARNING" "Found $hardcoded potentially hardcoded URLs/values"
        find src -name "*.js" -o -name "*.jsx" | xargs grep -n "http://\|https://" > "${ANALYSIS_DIR}/logs/hardcoded_urls.txt" 2>/dev/null
    fi
    
    # Check for proper error handling
    local try_catch_count=$(find src -name "*.js" -o -name "*.jsx" | xargs grep -c "try\s*{" 2>/dev/null | awk -F: '{sum += $2} END {print sum+0}')
    local api_calls=$(find src -name "*.js" -o -name "*.jsx" | xargs grep -c "api\.\|axios\.\|fetch(" 2>/dev/null | awk -F: '{sum += $2} END {print sum+0}')
    
    log_result "INFO" "Try-catch blocks: $try_catch_count"
    log_result "INFO" "API calls: $api_calls"
    
    if [ "$api_calls" -gt 0 ] && [ "$try_catch_count" -lt $(($api_calls / 2)) ]; then
        log_result "WARNING" "Low error handling coverage for API calls"
    fi
}

# Function to analyze React-specific issues
analyze_react() {
    log_section "React Analysis"
    
    # Check for proper React imports
    local react_imports=$(find src -name "*.jsx" | xargs grep -c "import React" 2>/dev/null | awk -F: '{sum += $2} END {print sum+0}')
    local jsx_files=$(find src -name "*.jsx" | wc -l)
    
    log_result "INFO" "JSX files: $jsx_files"
    log_result "INFO" "Files with React imports: $react_imports"
    
    # Check for hooks usage
    local hook_usage=$(find src -name "*.js" -o -name "*.jsx" | xargs grep -c "useState\|useEffect\|useContext" 2>/dev/null | awk -F: '{sum += $2} END {print sum+0}')
    log_result "INFO" "Hook usages: $hook_usage"
    
    # Check for key props in lists
    local map_without_key=$(find src -name "*.js" -o -name "*.jsx" | xargs grep -n "\.map(" 2>/dev/null | grep -v "key=" | wc -l)
    if [ "$map_without_key" -gt 0 ]; then
        log_result "WARNING" "Found $map_without_key .map() calls potentially missing key props"
    fi
    
    # Check for inline styles
    local inline_styles=$(find src -name "*.js" -o -name "*.jsx" | xargs grep -n 'style={{' 2>/dev/null | wc -l)
    if [ "$inline_styles" -gt 10 ]; then
        log_result "WARNING" "High usage of inline styles ($inline_styles) - consider CSS classes"
    fi
    
    # Check for proper component structure
    find src -name "*.jsx" | while read file; do
        if ! grep -q "export default\|export const\|export function" "$file"; then
            echo "No default export: $file" >> "${ANALYSIS_DIR}/logs/no_exports.txt"
        fi
    done
    
    if [ -f "${ANALYSIS_DIR}/logs/no_exports.txt" ]; then
        local no_exports=$(wc -l < "${ANALYSIS_DIR}/logs/no_exports.txt")
        log_result "ERROR" "Components without exports: $no_exports"
    fi
}

# Function to analyze routing
analyze_routing() {
    log_section "Routing Analysis"
    
    # Check for React Router usage
    if grep -r "react-router" package.json >/dev/null 2>&1; then
        log_result "SUCCESS" "React Router is configured"
        
        # Check for route definitions
        local routes=$(grep -r "Route path" src 2>/dev/null | wc -l)
        log_result "INFO" "Route definitions found: $routes"
        
        # Check for protected routes
        if grep -r "ProtectedRoute" src >/dev/null 2>&1; then
            log_result "SUCCESS" "Protected routes implemented"
        else
            log_result "WARNING" "No protected routes found"
        fi
        
        # Extract all routes
        grep -r "Route path" src 2>/dev/null | sed 's/.*path="//g' | sed 's/".*//g' > "${ANALYSIS_DIR}/logs/routes.txt"
        
    else
        log_result "WARNING" "React Router not configured"
    fi
}

# Function to analyze API integration
analyze_api() {
    log_section "API Integration Analysis"
    
    # Check for API configuration
    if [ -f "src/utils/api.js" ]; then
        log_result "SUCCESS" "API utility file exists"
        
        # Check for base URL configuration
        if grep -q "baseURL\|API_BASE_URL" src/utils/api.js; then
            log_result "SUCCESS" "API base URL configured"
        else
            log_result "WARNING" "API base URL not configured"
        fi
        
        # Check for authentication headers
        if grep -q "Authorization\|Bearer" src/utils/api.js; then
            log_result "SUCCESS" "Authentication headers configured"
        else
            log_result "WARNING" "No authentication headers found"
        fi
        
        # Count API endpoints
        local endpoints=$(grep -c "export const.*=" src/utils/api.js 2>/dev/null || echo "0")
        log_result "INFO" "API endpoints defined: $endpoints"
        
    else
        log_result "ERROR" "API utility file not found"
    fi
    
    # Check for error handling
    if find src -name "*.js" -o -name "*.jsx" | xargs grep -q "catch\|\.then.*error"; then
        log_result "SUCCESS" "API error handling present"
    else
        log_result "WARNING" "Limited API error handling"
    fi
}

# Function to analyze build configuration
analyze_build() {
    log_section "Build Configuration Analysis"
    
    # Check Vite config
    if [ -f "vite.config.js" ]; then
        log_result "SUCCESS" "Vite configuration exists"
        
        # Check for proxy configuration
        if grep -q "proxy" vite.config.js; then
            log_result "SUCCESS" "Proxy configuration found"
        else
            log_result "WARNING" "No proxy configuration"
        fi
        
        # Check for build settings
        if grep -q "build:" vite.config.js; then
            log_result "SUCCESS" "Build configuration present"
        fi
        
    else
        log_result "ERROR" "Vite configuration missing"
    fi
    
    # Check for environment variables
    if [ -f ".env" ] || [ -f ".env.local" ] || [ -f ".env.production" ]; then
        log_result "SUCCESS" "Environment files present"
    else
        log_result "WARNING" "No environment files found"
    fi
    
    # Check for build scripts
    if grep -q '"build"' package.json; then
        log_result "SUCCESS" "Build script configured"
    else
        log_result "ERROR" "Build script missing"
    fi
}

# Function to analyze performance
analyze_performance() {
    log_section "Performance Analysis"
    
    # Check for code splitting
    if find src -name "*.js" -o -name "*.jsx" | xargs grep -q "lazy\|Suspense"; then
        log_result "SUCCESS" "Code splitting implemented"
    else
        log_result "WARNING" "No code splitting found"
    fi
    
    # Check for image optimization
    local images=$(find src -name "*.jpg" -o -name "*.png" -o -name "*.gif" | wc -l)
    log_result "INFO" "Image files: $images"
    
    # Check for unused CSS
    if [ -f "src/index.css" ] && [ -f "src/App.css" ]; then
        log_result "SUCCESS" "CSS files present"
        
        # Basic CSS analysis
        local css_rules=$(grep -c "{" src/*.css 2>/dev/null | awk -F: '{sum += $2} END {print sum+0}')
        log_result "INFO" "CSS rules: $css_rules"
    fi
    
    # Check bundle size (if dist exists)
    if [ -d "dist" ]; then
        local bundle_size=$(du -sh dist 2>/dev/null | cut -f1)
        log_result "INFO" "Current bundle size: $bundle_size"
    fi
}

# Function to analyze testing
analyze_testing() {
    log_section "Testing Analysis"
    
    # Check for test files
    local test_files=$(find . -name "*.test.js" -o -name "*.test.jsx" -o -name "*.spec.js" -o -name "*.spec.jsx" | wc -l)
    log_result "INFO" "Test files: $test_files"
    
    # Check for testing frameworks
    if grep -q "jest\|vitest\|@testing-library" package.json; then
        log_result "SUCCESS" "Testing framework configured"
    else
        log_result "WARNING" "No testing framework found"
    fi
    
    # Check for test scripts
    if grep -q '"test"' package.json; then
        log_result "SUCCESS" "Test script configured"
    else
        log_result "WARNING" "Test script missing"
    fi
}

# Function to generate fix recommendations
generate_fixes() {
    log_section "Fix Recommendations"
    
    cat >> "$REPORT_FILE" << EOF

### High Priority Fixes
EOF
    
    # Check for critical issues and generate fixes
    if [ -f "${ANALYSIS_DIR}/logs/npm_audit.json" ]; then
        local critical=$(node -pe "JSON.parse(require('fs').readFileSync('${ANALYSIS_DIR}/logs/npm_audit.json', 'utf8')).metadata?.vulnerabilities?.critical || 0" 2>/dev/null || echo "0")
        if [ "$critical" -gt 0 ]; then
            echo "1. **Security Vulnerabilities**: Run \`npm audit fix\` to address $critical critical vulnerabilities" >> "$REPORT_FILE"
            echo "npm audit fix --force" > "${ANALYSIS_DIR}/fixes/security_fix.sh"
            chmod +x "${ANALYSIS_DIR}/fixes/security_fix.sh"
        fi
    fi
    
    # Generate component cleanup script
    if [ -f "${ANALYSIS_DIR}/logs/unused_components.txt" ]; then
        cat >> "${ANALYSIS_DIR}/fixes/cleanup_components.sh" << EOF
#!/bin/bash
# Remove unused components (review before running)
echo "Unused components found:"
cat ${ANALYSIS_DIR}/logs/unused_components.txt
echo "Review the above list and manually remove unused components"
EOF
        chmod +x "${ANALYSIS_DIR}/fixes/cleanup_components.sh"
        echo "2. **Unused Components**: Review and remove unused components using \`${ANALYSIS_DIR}/fixes/cleanup_components.sh\`" >> "$REPORT_FILE"
    fi
    
    # Generate console cleanup script
    if [ -f "${ANALYSIS_DIR}/logs/console_statements.txt" ]; then
        cat >> "${ANALYSIS_DIR}/fixes/remove_console.sh" << EOF
#!/bin/bash
# Remove console statements for production
find src -name "*.js" -o -name "*.jsx" | xargs sed -i '/console\./d'
echo "Console statements removed"
EOF
        chmod +x "${ANALYSIS_DIR}/fixes/remove_console.sh"
        echo "3. **Console Statements**: Remove console.log statements for production using \`${ANALYSIS_DIR}/fixes/remove_console.sh\`" >> "$REPORT_FILE"
    fi
    
    cat >> "$REPORT_FILE" << EOF

### Medium Priority Improvements
4. **Add Error Boundaries**: Implement React error boundaries for better error handling
5. **Optimize Images**: Compress and optimize image assets
6. **Add Tests**: Implement unit and integration tests
7. **Code Splitting**: Implement lazy loading for large components

### Low Priority Enhancements
8. **TypeScript Migration**: Consider migrating to TypeScript for better type safety
9. **Performance Monitoring**: Add performance monitoring tools
10. **Documentation**: Add comprehensive component documentation
EOF
}

# Function to create summary dashboard
create_dashboard() {
    cat > "${ANALYSIS_DIR}/dashboard.html" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Frontend Analysis Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; margin-bottom: 20px; }
        .metric { display: inline-block; margin: 10px 20px; padding: 15px; background: #ecf0f1; border-radius: 5px; min-width: 120px; text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; color: #2980b9; }
        .metric-label { font-size: 12px; color: #7f8c8d; }
        .section { margin: 20px 0; padding: 15px; border-left: 4px solid #3498db; background: #f8f9fa; }
        .success { color: #27ae60; }
        .warning { color: #f39c12; }
        .error { color: #e74c3c; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="header">Eddie's Asian Automotive - Frontend Analysis Dashboard</h1>
        
        <div class="metrics">
            <div class="metric">
                <div class="metric-value">$(find src -name "*.jsx" | wc -l)</div>
                <div class="metric-label">Components</div>
            </div>
            <div class="metric">
                <div class="metric-value">$(find src -name "*.js" -o -name "*.jsx" | wc -l)</div>
                <div class="metric-label">JS/JSX Files</div>
            </div>
            <div class="metric">
                <div class="metric-value">$(wc -l < src/index.js 2>/dev/null || echo "0")</div>
                <div class="metric-label">Exports</div>
            </div>
        </div>
        
        <div class="section">
            <h3>Quick Summary</h3>
            <p>Analysis completed at $(date)</p>
            <p>Full report available in: <code>$REPORT_FILE</code></p>
            <p>Log files available in: <code>${ANALYSIS_DIR}/logs/</code></p>
            <p>Fix scripts available in: <code>${ANALYSIS_DIR}/fixes/</code></p>
        </div>
    </div>
</body>
</html>
EOF
    
    log_result "SUCCESS" "Dashboard created: ${ANALYSIS_DIR}/dashboard.html"
}

# Run all analyses
main() {
    analyze_structure
    analyze_dependencies
    analyze_imports_exports
    analyze_code_quality
    analyze_react
    analyze_routing
    analyze_api
    analyze_build
    analyze_performance
    analyze_testing
    generate_fixes
    create_dashboard
    
    # Final summary
    echo -e "\n${PURPLE}📊 Analysis Complete${NC}"
    echo -e "${CYAN}================================================================${NC}"
    echo -e "📁 Analysis files saved to: ${YELLOW}$ANALYSIS_DIR${NC}"
    echo -e "📋 Main report: ${YELLOW}$REPORT_FILE${NC}"
    echo -e "🌐 Dashboard: ${YELLOW}${ANALYSIS_DIR}/dashboard.html${NC}"
    echo -e "🔧 Fix scripts: ${YELLOW}${ANALYSIS_DIR}/fixes/${NC}"
    echo -e "📜 Logs: ${YELLOW}${ANALYSIS_DIR}/logs/${NC}"
    
    echo -e "\n${GREEN}Next Steps:${NC}"
    echo "1. Review the main report: $REPORT_FILE"
    echo "2. Open dashboard in browser: ${ANALYSIS_DIR}/dashboard.html"
    echo "3. Check fix scripts in: ${ANALYSIS_DIR}/fixes/"
    echo "4. Address high-priority issues first"
    
    # Add to report
    cat >> "$REPORT_FILE" << EOF

---

## Analysis Completion
- **Total Execution Time**: $(date)
- **Files Analyzed**: $(find src -name "*.js" -o -name "*.jsx" | wc -l) JavaScript/JSX files
- **Analysis Directory**: $ANALYSIS_DIR
- **Dashboard**: ${ANALYSIS_DIR}/dashboard.html

## Next Steps
1. Review high-priority fixes first
2. Run security audit fixes if needed
3. Clean up unused components and console statements
4. Implement missing error boundaries
5. Add comprehensive testing
6. Consider performance optimizations

---
*Generated by Eddie's Asian Automotive Frontend Analyzer*
EOF
}

# Execute main function
main

exit 0
