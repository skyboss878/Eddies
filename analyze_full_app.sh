#!/bin/bash
# File: analyze_full_app.sh
# Usage: ./analyze_full_app.sh
# Comprehensive analysis of backend routes and frontend component usage

BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"
OUTPUT_FILE="full_app_analysis_report.txt"

SECTIONS=("dashboard" "settings" "invoices" "estimates" "customers" "vehicles" "jobs" "appointments" "ai")

echo "===== FULL APP ANALYSIS REPORT =====" > $OUTPUT_FILE
echo "Generated on: $(date)" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo "== Backend Routes ==" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

for section in "${SECTIONS[@]}"; do
    echo "---- $section ----" >> $OUTPUT_FILE
    # Extract routes from list_routes.py filtered by section
    python3 "$BACKEND_DIR/list_routes.py" 2>/dev/null | grep -i "$section" >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
done
echo "" >> $OUTPUT_FILE
echo "== Frontend Component Usage ==" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

for section in "${SECTIONS[@]}"; do
    echo "---- $section ----" >> $OUTPUT_FILE
    # Recursive grep for imports, usage, or routes
    grep -Ri --exclude-dir=node_modules --exclude=*.log "$section" "$FRONTEND_DIR/src/" >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
done
echo "" >> $OUTPUT_FILE
echo "== Coverage Summary ==" >> $OUTPUT_FILE
for section in "${SECTIONS[@]}"; do
    BACKEND_COUNT=$(python3 "$BACKEND_DIR/list_routes.py" 2>/dev/null | grep -ic "$section")
    FRONTEND_COUNT=$(grep -Ri --exclude-dir=node_modules --exclude=*.log "$section" "$FRONTEND_DIR/src/" | wc -l)
    echo "$section -> Backend routes: $BACKEND_COUNT, Frontend mentions: $FRONTEND_COUNT" >> $OUTPUT_FILE
done
echo "" >> $OUTPUT_FILE
echo "===== End of Report =====" >> $OUTPUT_FILE
echo "Report generated at: $OUTPUT_FILE"
