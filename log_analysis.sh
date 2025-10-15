#!/bin/bash

# A script to analyze web server logs using sed.
# Usage: ./log_analysis.sh your_log_file.txt

LOG_FILE=$1

if [ -z "$LOG_FILE" ]; then
  echo "Error: Please provide a log file as an argument."
  echo "Usage: $0 your_log_file.txt"
  exit 1
fi

echo "---"
echo "🔍 Finding the main Python Traceback using sed..."
echo "---"
# Use sed to print the block of text between 'Traceback' and the 'Background on this error' line.
# The -n flag suppresses default output, and '/start/,/end/p' prints only the lines within that range.
sed -n '/Traceback (most recent call last):/,/Background on this error/p' "$LOG_FILE"

echo ""
echo "---"
echo "🔴 Finding all internal server errors (HTTP 500) using sed..."
echo "---"
# This command finds and prints any line containing the string '" 500 -'
sed -n '/" 500 -/p' "$LOG_FILE"

echo ""
echo "---"
echo "📝 Finding all requests to the failing customer creation endpoint..."
echo "---"
# This command finds all POST requests to /api/auth/customers
sed -n '/"POST \/api\/auth\/customers/p' "$LOG_FILE"

echo ""
echo "---"
echo "⚠️ Finding all SQLAlchemy warnings..."
echo "---"
# This command finds and prints any line containing 'SAWarning'
sed -n '/SAWarning/p' "$LOG_FILE"

