#!/bin/bash
# Full API verification script for Eddie's Askan Automotive
# Uses token-based auth for all requests

BASE_URL="http://127.0.0.1:5000/new-api-prefix"
TEST_EMAIL="apitest@example.com"
TEST_PASS="123456"

echo "🔐 Registering test user..."
RESP=$(curl -s -X POST "$BASE_URL/auth/register" \
-H "Content-Type: application/json" \
-d "{\"first_name\":\"API\",\"last_name\":\"Tester\",\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASS\"}")

TOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6...UsMHLPG8'

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "⚠️ User exists, trying login..."
  RESP=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASS\"}")
  TOKEN=$(echo $RESP | jq -r '.token')
fi

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Could not obtain token. Aborting."
  exit 1
fi

echo "✅ Token obtained: $TOKEN"
AUTH_HEADER="Authorization: Bearer $TOKEN"

# Generic endpoint tester
test_endpoint() {
  local METHOD=$1
  local URL=$2
  local DATA=$3

  if [ "$METHOD" = "GET" ]; then
    RESP=$(curl -s -X GET "$BASE_URL/$URL" -H "Content-Type: application/json" -H "$AUTH_HEADER")
  else
    RESP=$(curl -s -X $METHOD "$BASE_URL/$URL" -H "Content-Type: application/json" -H "$AUTH_HEADER" -d "$DATA")
  fi

  STATUS=$(echo $RESP | jq -r '.message // .error // empty')

  if [ -n "$STATUS" ]; then
    echo "✅ $METHOD $URL response: $STATUS"
  else
    echo "⚠️ $METHOD $URL response: $RESP"
  fi
}

echo "🚀 Testing Auth Endpoints..."
test_endpoint POST "auth/login" "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASS\"}"
test_endpoint GET "auth/me"
test_endpoint POST "auth/refresh"
test_endpoint POST "auth/logout"

echo "🚀 Testing Customers..."
test_endpoint GET "customers"
test_endpoint POST "customers" "{\"first_name\":\"John\",\"last_name\":\"Doe\",\"email\":\"john.doe@example.com\"}"
test_endpoint GET "customers/1/vehicles"
test_endpoint GET "customers/1/jobs"
test_endpoint GET "customers/1/invoices"
test_endpoint GET "customers/1/estimates"
test_endpoint POST "customers/1/messages" "{\"message\":\"Hello\"}"
test_endpoint GET "customers/1/messages"
test_endpoint GET "customers/1/history"

echo "🚀 Testing Vehicles..."
test_endpoint GET "vehicles"
test_endpoint POST "vehicles" "{\"make\":\"Toyota\",\"model\":\"Camry\",\"year\":2020}"
test_endpoint GET "vehicles/1/history"
test_endpoint GET "vehicles/1/maintenance"
test_endpoint PUT "vehicles/1/maintenance" "{\"last_service\":\"2025-08-19\"}"
test_endpoint GET "vehicles/1/recalls"
test_endpoint POST "vehicles/1/documents" "{\"file\":\"dummy.txt\"}"

echo "🚀 Testing Jobs..."
test_endpoint GET "jobs"
test_endpoint POST "jobs" "{\"customer_id\":1,\"vehicle_id\":1,\"description\":\"Test job\"}"
test_endpoint PATCH "jobs/1/status" "{\"status\":\"in-progress\"}"
test_endpoint POST "jobs/1/timer/start" "{}"
test_endpoint POST "jobs/1/timer/stop" "{}"
test_endpoint GET "jobs/1/times"
test_endpoint POST "jobs/1/parts" "{\"name\":\"Brake pad\",\"quantity\":1}"
test_endpoint POST "jobs/1/labor" "{\"description\":\"Inspection\",\"hours\":1}"
test_endpoint POST "jobs/1/notes" "{\"note\":\"Check engine\"}"
test_endpoint POST "jobs/1/photos" "{\"file\":\"photo.jpg\"}"
test_endpoint GET "jobs/1/photos"
test_endpoint PATCH "jobs/1/assign" "{\"technician_id\":3}"
test_endpoint GET "jobs/templates"

echo "🚀 Testing Estimates..."
test_endpoint GET "estimates"
test_endpoint POST "estimates" "{\"customer_id\":1,\"vehicle_id\":1,\"amount\":100}"
test_endpoint POST "estimates/1/convert-to-job" "{}"
test_endpoint POST "estimates/1/send" "{\"method\":\"email\"}"
test_endpoint GET "estimates/1/pdf"
test_endpoint POST "estimates/1/duplicate" "{}"
test_endpoint GET "estimates/templates"
test_endpoint POST "estimates/preview" "{\"amount\":150}"

echo "🚀 Testing Invoices..."
test_endpoint GET "invoices"
test_endpoint POST "invoices" "{\"customer_id\":1,\"amount\":100}"
test_endpoint POST "invoices/1/mark-paid" "{\"payment_method\":\"cash\"}"
test_endpoint GET "invoices/1/pdf"
test_endpoint POST "invoices/1/send" "{\"method\":\"email\"}"
test_endpoint POST "invoices/1/payments" "{\"amount\":50}"
test_endpoint GET "invoices/1/payments"
test_endpoint POST "invoices/1/void" "{\"reason\":\"Error\"}"
test_endpoint POST "invoices/1/reminder" "{}"

echo "🚀 Testing Reports..."
test_endpoint GET "reports/daily/2025-08-19"
test_endpoint GET "reports/period" "{\"start\":\"2025-08-01\",\"end\":\"2025-08-19\"}"
test_endpoint GET "reports/sales" "{\"start\":\"2025-08-01\",\"end\":\"2025-08-19\"}"
test_endpoint GET "reports/inventory"
test_endpoint GET "reports/customers"
test_endpoint GET "reports/jobs" "{\"status\":\"open\"}"
test_endpoint GET "reports/technician/3"
test_endpoint GET "reports/sales/export?format=pdf&start=2025-08-01&end=2025-08-19"
test_endpoint GET "reports/inventory/export?format=csv"
test_endpoint GET "reports/timesheet/export?format=csv&start=2025-08-01&end=2025-08-19"

echo "🚀 Testing Dashboard..."
test_endpoint GET "dashboard/stats"
test_endpoint GET "dashboard/recent-activity?limit=5"
test_endpoint GET "dashboard/charts?period=30d"
test_endpoint GET "dashboard/alerts"
test_endpoint GET "dashboard/pending-approvals"

echo "🚀 Testing Settings..."
test_endpoint GET "settings"
test_endpoint PUT "settings" "{\"config\":\"value\"}"
test_endpoint GET "settings/shop"
test_endpoint PUT "settings/shop" "{\"name\":\"Test Shop\"}"
test_endpoint GET "settings/labor-rates"
test_endpoint PUT "settings/labor-rates" "{\"rate\":50}"
test_endpoint GET "settings/tax"
test_endpoint PUT "settings/tax" "{\"tax_rate\":7.5}"
test_endpoint GET "settings/notifications"
test_endpoint PUT "settings/notifications" "{\"email_notifications\":true}"
test_endpoint GET "settings/business"
test_endpoint PUT "settings/business" "{\"name\":\"Test Business\"}"

echo "🚀 Testing AI & Diagnostics..."
test_endpoint POST "ai/diagnostics/quick-diagnosis" "{\"issue\":\"engine\"}"
test_endpoint GET "ai/diagnostics/obd/P1234"
test_endpoint POST "ai/diagnostics/symptoms" "{\"symptoms\":[\"noise\",\"vibration\"]}"
test_endpoint POST "ai/generate-estimate" "{\"vehicle_id\":1}"
test_endpoint POST "ai/diagnostics/1/feedback" "{\"feedback\":\"good\"}"
test_endpoint GET "ai/diagnostics/history"

echo "🚀 Testing Time Clock..."
test_endpoint POST "timeclock/clock-in" "{}"
test_endpoint POST "timeclock/clock-out" "{}"
test_endpoint GET "timeclock/status"
test_endpoint GET "timeclock/history?start=2025-08-01&end=2025-08-19"
test_endpoint GET "timeclock/current-shift"
test_endpoint GET "timeclock/timesheet?start=2025-08-01&end=2025-08-19"
test_endpoint GET "timeclock/export?format=csv&start=2025-08-01&end=2025-08-19"

echo "🚀 Testing Inventory..."
test_endpoint GET "inventory"
test_endpoint GET "inventory/low-stock"
test_endpoint GET "inventory/search?q=brake"
test_endpoint POST "inventory/1/adjust" "{\"quantity\":10,\"reason\":\"restock\"}"
test_endpoint POST "inventory/bulk-import" "{\"file\":\"bulk.csv\"}"
test_endpoint GET "inventory/export?format=csv"

echo "🚀 Testing Communication..."
test_endpoint POST "communication/email" "{\"to\":\"user@example.com\",\"subject\":\"Test\",\"body\":\"Hello\"}"
test_endpoint POST "communication/sms" "{\"to\":\"+1234567890\",\"message\":\"Hello\"}"
test_endpoint GET "communication/templates/email"
test_endpoint POST "communication/templates" "{\"name\":\"Template 1\",\"content\":\"Hello\"}"
test_endpoint GET "communication/history/1"

echo "🚀 Testing Data Management..."
test_endpoint GET "data/export/customers?format=csv"
test_endpoint POST "data/import/customers" "{\"file\":\"customers.csv\"}"
test_endpoint GET "data/backup"
test_endpoint POST "data/restore" "{\"file\":\"backup.zip\"}"
test_endpoint POST "data/migrate" "{\"data\":\"test\"}"

echo "🚀 Testing Utilities..."
test_endpoint GET "health"
test_endpoint GET "health/status"

echo "🎉 Full API verification complete!"
