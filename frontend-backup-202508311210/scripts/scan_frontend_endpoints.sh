#!/bin/bash

echo "🔍 Scanning frontend for API endpoint usage..."
echo

# Set the directory to scan
SRC_DIR="./src"

# Search all files for fetch/axios/apiFetch and extract the endpoint
grep -rohE "(fetch|axios|apiFetch)\(['\"]\/[a-zA-Z0-9\/\-\_\?\=]*" $SRC_DIR \
  | sed -E "s/(fetch|axios|apiFetch)\(['\"]//" \
  | sort | uniq \
  | tee frontend_endpoints.txt

echo
echo "✅ Found $(wc -l < frontend_endpoints.txt) unique endpoint(s). Saved to frontend_endpoints.txt"
echo

echo "📄 Sample output:"
cat frontend_endpoints.txt
