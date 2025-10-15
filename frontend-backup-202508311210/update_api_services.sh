#!/bin/bash

API_FILE="src/utils/api.js"

# Backup first
cp "$API_FILE" "${API_FILE}.bak_$(date +%Y%m%d_%H%M%S)"
echo "Backup created: ${API_FILE}.bak_$(date +%Y%m%d_%H%M%S)"

# Add missing report endpoints
grep -q "const reportService" "$API_FILE"
if [ $? -eq 0 ]; then
  echo "Adding missing report endpoints..."
  sed -i "/const reportService = {/,/};/ {
    /};/i \
  getDailySummary: (date) => axios.get(\`\${API_URL}/reports/daily-summary/\${date}\`),\
  getPeriodSummary: (data) => axios.post(\`\${API_URL}/reports/period-summary\`, data),\
  getDetailedTransactions: (data) => axios.post(\`\${API_URL}/reports/detailed-transactions\`, data),\
  getTaxSummary: (data) => axios.post(\`\${API_URL}/reports/tax-summary\`, data),\
  exportQuickBooks: (data) => axios.post(\`\${API_URL}/reports/export/quickbooks\`, data),\
  exportExcel: (data) => axios.post(\`\${API_URL}/reports/export/excel\`, data),\
  getCustomerSummary: (customerId) => axios.get(\`\${API_URL}/reports/customer-summary/\${customerId}\`)\
  }" "$API_FILE"
else
  echo "reportService not found, please create it manually."
fi

# Add missing settings endpoints
grep -q "const settingsService" "$API_FILE"
if [ $? -eq 0 ]; then
  echo "Adding missing settings endpoints..."
  sed -i "/const settingsService = {/,/};/ {
    /};/i \
  getAccountingSettings: () => axios.get(\`\${API_URL}/settings/accounting\`),\
  updateAccountingSettings: (data) => axios.post(\`\${API_URL}/settings/accounting\`, data)\
  }" "$API_FILE"
else
  echo "settingsService not found, please create it manually."
fi

# Add migrationService if missing
grep -q "const migrationService" "$API_FILE"
if [ $? -ne 0 ]; then
  echo "Adding migrationService..."
  echo -e "\nconst migrationService = {\n  analyzeMigrationFile: (formData) => axios.post(\`\${API_URL}/migration/analyze\`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),\n  importMigrationData: (data) => axios.post(\`\${API_URL}/migration/import\`, data)\n};" >> "$API_FILE"
  # Add to exports (last 20 lines)
  sed -i "\$i \ \ migrationService," "$API_FILE"
else
  echo "migrationService already exists."
fi

echo "API services updated successfully."
