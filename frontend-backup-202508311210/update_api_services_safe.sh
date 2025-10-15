#!/bin/bash

API_FILE="src/utils/api.js"

# Backup first
cp "$API_FILE" "${API_FILE}.bak_$(date +%Y%m%d_%H%M%S)"
echo "Backup created: ${API_FILE}.bak_$(date +%Y%m%d_%H%M%S)"

# Helper function to insert a line if it doesn't exist
insert_if_missing() {
  local service_name="$1"
  local line_to_insert="$2"
  grep -qF "$line_to_insert" "$API_FILE" || sed -i "/const $service_name = {/,/};/ {
    /};/i $line_to_insert
  }" "$API_FILE"
}

# ---------------- Reports Service ----------------
grep -q "const reportService" "$API_FILE"
if [ $? -eq 0 ]; then
  echo "Updating reportService..."
  insert_if_missing "reportService" "  getDailySummary: (date) => axios.get(\`\${API_URL}/reports/daily-summary/\${date}\`),"
  insert_if_missing "reportService" "  getPeriodSummary: (data) => axios.post(\`\${API_URL}/reports/period-summary\`, data),"
  insert_if_missing "reportService" "  getDetailedTransactions: (data) => axios.post(\`\${API_URL}/reports/detailed-transactions\`, data),"
  insert_if_missing "reportService" "  getTaxSummary: (data) => axios.post(\`\${API_URL}/reports/tax-summary\`, data),"
  insert_if_missing "reportService" "  exportQuickBooks: (data) => axios.post(\`\${API_URL}/reports/export/quickbooks\`, data),"
  insert_if_missing "reportService" "  exportExcel: (data) => axios.post(\`\${API_URL}/reports/export/excel\`, data),"
  insert_if_missing "reportService" "  getCustomerSummary: (customerId) => axios.get(\`\${API_URL}/reports/customer-summary/\${customerId}\`)"
else
  echo "reportService not found, please create it manually."
fi

# ---------------- Settings Service ----------------
grep -q "const settingsService" "$API_FILE"
if [ $? -eq 0 ]; then
  echo "Updating settingsService..."
  insert_if_missing "settingsService" "  getAccountingSettings: () => axios.get(\`\${API_URL}/settings/accounting\`),"
  insert_if_missing "settingsService" "  updateAccountingSettings: (data) => axios.post(\`\${API_URL}/settings/accounting\`, data)"
else
  echo "settingsService not found, please create it manually."
fi

# ---------------- Migration Service ----------------
grep -q "const migrationService" "$API_FILE"
if [ $? -ne 0 ]; then
  echo "Adding migrationService..."
  echo -e "\nconst migrationService = {\n  analyzeMigrationFile: (formData) => axios.post(\`\${API_URL}/migration/analyze\`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),\n  importMigrationData: (data) => axios.post(\`\${API_URL}/migration/import\`, data)\n};" >> "$API_FILE"
  # Add to exports at the end
  sed -i "\$i \ \ migrationService," "$API_FILE"
else
  echo "migrationService already exists."
fi

echo "API services updated safely. No duplicates were added."
