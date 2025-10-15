#!/bin/bash

# =============================================================================
# Eddie's Askan Automotive - Safe System Analysis Script (NO FIXES)
# =============================================================================
# This script only analyzes your full-stack automotive shop management system.
# It does not create, modify, or delete files.
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_ROOT=$(pwd)
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend"
ANALYSIS_DIR="$PROJECT_ROOT/system_analysis"

mkdir -p "$ANALYSIS_DIR"

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${PURPLE}ℹ️  $1${NC}"; }

# -----------------------------------------------------------------------------
# Frontend analysis
# -----------------------------------------------------------------------------
analyze_frontend_structure() {
    print_header "Analyzing Frontend Structure"
    if [ ! -d "$FRONTEND_DIR" ]; then
        print_error "Frontend directory not found"
        return
    fi
    cd "$FRONTEND_DIR"
    local required_dirs=("src" "src/components" "src/pages" "src/contexts" "src/hooks" "src/utils" "src/layouts" "src/services" "src/assets" "public")
    for dir in "${required_dirs[@]}"; do
        [ -d "$dir" ] && print_success "$dir exists" || print_warning "$dir missing"
    done
    cd "$PROJECT_ROOT"
}

analyze_frontend_files() {
    print_header "Analyzing Frontend Files"
    cd "$FRONTEND_DIR"
    local essential_files=("package.json" "vite.config.js" "src/main.jsx" "src/App.jsx" "src/index.css")
    for file in "${essential_files[@]}"; do
        [ -f "$file" ] && print_success "$file exists" || print_error "$file missing"
    done
    cd "$PROJECT_ROOT"
}

analyze_react_components() {
    print_header "Analyzing React Components"
    cd "$FRONTEND_DIR/src" 2>/dev/null || return
    find . -type f \( -name "*.jsx" -o -name "*.js" \) -not -path "./node_modules/*" > "$ANALYSIS_DIR/frontend_components.txt"
    echo "🔍 Found $(wc -l < "$ANALYSIS_DIR/frontend_components.txt") React files"
    head -n 10 "$ANALYSIS_DIR/frontend_components.txt"
    cd "$PROJECT_ROOT"
}

# -----------------------------------------------------------------------------
# Backend analysis
# -----------------------------------------------------------------------------
analyze_backend_structure() {
    print_header "Analyzing Backend Structure"
    if [ ! -d "$BACKEND_DIR" ]; then
        print_error "Backend directory not found"
        return
    fi
    cd "$BACKEND_DIR"
    local backend_files=("app.py" "requirements.txt" "models.py" "database.py")
    for file in "${backend_files[@]}"; do
        [ -f "$file" ] && print_success "$file exists" || print_warning "$file missing"
    done
    cd "$PROJECT_ROOT"
}

analyze_flask_routes() {
    print_header "Analyzing Flask Routes"
    if [ -f "$BACKEND_DIR/app.py" ]; then
        python3 - <<'EOF'
import re
try:
    with open("backend/app.py") as f:
        content = f.read()
    routes = re.findall(r'@app\.route\([\"\'](.*?)[\"\']', content)
    print(f"Found {len(routes)} routes:")
    for r in routes: print(" -", r)
except Exception as e:
    print("Error:", e)
EOF
    else
        print_error "app.py not found"
    fi
}

# -----------------------------------------------------------------------------
# Cross-system analysis
# -----------------------------------------------------------------------------
analyze_route_matching() {
    print_header "Analyzing Route Matching"
    local frontend_routes="$ANALYSIS_DIR/frontend_routes.txt"
    local backend_routes="$ANALYSIS_DIR/backend_routes.txt"
    > "$frontend_routes"
    > "$backend_routes"

    [ -f "$FRONTEND_DIR/src/App.jsx" ] && \
        grep -o 'path="[^"]*"' "$FRONTEND_DIR/src/App.jsx" | sed 's/path="//;s/"//' > "$frontend_routes"

    [ -f "$BACKEND_DIR/app.py" ] && \
        python3 - <<EOF > "$backend_routes"
import re
with open("$BACKEND_DIR/app.py") as f:
    content = f.read()
routes = re.findall(r'@app\.route\([\"\'](.*?)[\"\']', content)
print("\n".join(routes))
EOF

    echo "Frontend Routes: $(wc -l < "$frontend_routes")"
    echo "Backend Routes: $(wc -l < "$backend_routes")"
}

# -----------------------------------------------------------------------------
# Generate report
# -----------------------------------------------------------------------------
generate_report() {
    print_header "Generating Report"
    local report="$ANALYSIS_DIR/analysis_report.md"
    cat > "$report" <<EOF
# Eddie's Askan Automotive - Analysis Report
Generated on: $(date)

Frontend: $([ -d "$FRONTEND_DIR" ] && echo "✅ Present" || echo "❌ Missing")
Backend:  $([ -d "$BACKEND_DIR" ] && echo "✅ Present" || echo "❌ Missing")

See:
- $ANALYSIS_DIR/frontend_components.txt
- $ANALYSIS_DIR/frontend_routes.txt
- $ANALYSIS_DIR/backend_routes.txt
EOF
    print_success "Report generated at $report"
}

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
main() {
    print_header "🚗 Eddie's Askan Automotive - ANALYSIS ONLY"
    analyze_frontend_structure
    analyze_frontend_files
    analyze_react_components
    analyze_backend_structure
    analyze_flask_routes
    analyze_route_matching
    generate_report
    print_info "No files were created or modified. Safe to run anytime."
}

main "$@"
