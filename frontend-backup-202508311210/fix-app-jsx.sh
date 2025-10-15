#!/bin/bash

cd ~/eddies-asian-automotive/frontend

# Restore from backup
cp src/App.jsx.backup src/App.jsx

# Add IntegrationTest import properly (only once)
# Find the line with React imports and add after it
if ! grep -q "IntegrationTest" src/App.jsx; then
    # Add import after React imports
    sed -i "/import React/a import { IntegrationTest } from './components';" src/App.jsx
    echo "✅ Added IntegrationTest import"
fi

# Add route before the closing </Routes> tag
if ! grep -q "/integration-test" src/App.jsx; then
    # Find the last Route and add the integration test route after it
    sed -i "/<\/Routes>/i \          <Route path=\"/integration-test\" element={<IntegrationTest />} />" src/App.jsx
    echo "✅ Added integration test route"
fi

echo "🔧 App.jsx fixed successfully"
echo ""
echo "📋 Check the file to ensure it looks correct:"
head -15 src/App.jsx
