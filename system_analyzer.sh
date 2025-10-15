#!/bin/bash
# system_analyzer.sh - Eddie's Automotive Full System Analysis

LOGFILE="$HOME/eddies-asian-automotive/system_analysis_$(date +%Y%m%d_%H%M%S).log"
FIXSCRIPT="$HOME/eddies-asian-automotive/fix_script_$(date +%Y%m%d_%H%M%S).sh"

echo "🔍 Eddie's Automotive Full System Analysis - $(date)" | tee -a $LOGFILE
echo "📝 Logging to: $LOGFILE" | tee -a $LOGFILE
echo "===================================" | tee -a $LOGFILE

# 1. System Environment Check
echo "[INFO] 1. System Environment Check" | tee -a $LOGFILE
echo "Python Version: $(python3 --version)" | tee -a $LOGFILE
echo "Node Version: $(node --version)" | tee -a $LOGFILE
echo "NPM Version: $(npm --version)" | tee -a $LOGFILE
echo "Current Directory: $(pwd)" | tee -a $LOGFILE
echo "User: $(whoami)" | tee -a $LOGFILE
echo "OS: $(uname -a)" | tee -a $LOGFILE

# 2. Backend / Database Analysis
echo "[INFO] 2. Backend / Database Analysis" | tee -a $LOGFILE
DB_DIR="$HOME/eddies-asian-automotive/backend"
cd $DB_DIR || exit 1

# Read DATABASE from .env
DB_FILE_RAW=$(grep -E "^DATABASE=" .env | cut -d '=' -f2)
DB_FILE=${DB_FILE_RAW/sqlite:\/\//} # remove sqlite:///
echo "[INFO] Database file detected: $DB_FILE" | tee -a $LOGFILE

if [ ! -f "$DB_FILE" ]; then
  echo "[ERROR] Database file $DB_FILE not found!" | tee -a $LOGFILE
else
  echo "[SUCCESS] Database file exists: $DB_FILE" | tee -a $LOGFILE

  TABLES=("settings" "customers" "vehicles" "jobs" "estimates" "invoices" "appointments" "time_entries")
  declare -A REQUIRED_COLUMNS
  REQUIRED_COLUMNS[settings]="id shop_name address phone email"
  REQUIRED_COLUMNS[customers]="id name email phone"
  REQUIRED_COLUMNS[vehicles]="id customer_id make model year color"
  REQUIRED_COLUMNS[jobs]="id vehicle_id customer_id symptoms status"
  REQUIRED_COLUMNS[estimates]="id customer_id job_id total_amount status"
  REQUIRED_COLUMNS[invoices]="id customer_id estimate_id total_amount paid"
  REQUIRED_COLUMNS[appointments]="id customer_id vehicle_id service_date is_active"
  REQUIRED_COLUMNS[time_entries]="id employee_id start_time end_time break_duration"

  echo "[INFO] Checking database schema..." | tee -a $LOGFILE
  > "$FIXSCRIPT"  # start empty fix script
  echo "#!/bin/bash" >> "$FIXSCRIPT"
  echo "# Fix script for missing database columns" >> "$FIXSCRIPT"

  for table in "${TABLES[@]}"; do
    echo "[INFO] Table: $table" | tee -a $LOGFILE
    for col in ${REQUIRED_COLUMNS[$table]}; do
      RESULT=$(sqlite3 "$DB_FILE" "PRAGMA table_info($table);" 2>/dev/null | awk -F'|' '{print $2}' | grep -w "$col")
      if [ -z "$RESULT" ]; then
        echo "[ERROR] Missing column: $table.$col" | tee -a $LOGFILE
        echo "sqlite3 $DB_FILE \"ALTER TABLE $table ADD COLUMN $col TEXT;\"" >> "$FIXSCRIPT"
      fi
    done
  done
fi

# 3. Backend API Route Check (quick check using list_routes.py)
echo "[INFO] 3. Backend API Route Check" | tee -a $LOGFILE
if [ -f "./list_routes.py" ]; then
  ROUTES=$(python3 list_routes.py)
  for r in settings invoices estimates customers vehicles jobs appointments timeclock dashboard; do
    echo "$ROUTES" | grep -q "$r" && echo "[SUCCESS] Route exists: $r" | tee -a $LOGFILE || echo "[WARN] Route missing: $r" | tee -a $LOGFILE
  done
fi

# 4. Frontend Analysis
echo "[INFO] 4. Frontend Analysis" | tee -a $LOGFILE
FRONTEND_DIR="$HOME/eddies-asian-automotive/frontend/src/pages"
PAGES=("Customers.jsx" "Dashboard.jsx" "Estimates.jsx" "Invoices.jsx")
for page in "${PAGES[@]}"; do
  if [ -f "$FRONTEND_DIR/$page" ]; then
    echo "[SUCCESS] Found frontend file: $page" | tee -a $LOGFILE
  else
    echo "[WARN] Frontend file missing: $page" | tee -a $LOGFILE
  fi
done

chmod +x "$FIXSCRIPT"
echo "✅ Full system analysis complete!"
echo "Run '$FIXSCRIPT' to apply database fixes automatically." | tee -a $LOGFILE
