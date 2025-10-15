#!/data/data/com.termux/files/usr/bin/bash
# Billion-Dollar Auto Repair Frontend Starter Script
# Fixes vite.config.js, import aliases, missing service imports, cleans cache, then runs dev

set -e

cd ~/eddies-askan-automotive/frontend

echo "🔧 Fixing vite.config.js..."

# Overwrite vite.config.js with proper ESM
cat > vite.config.js <<'EOF'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
EOF

# Remove Vite timestamp cache
rm -f vite.config.js.timestamp-*.mjs

echo "🛠 Fixing import aliases..."

# Fix common aliases in all src files
find src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) \
  -exec sed -i \
    -e 's|@components/|./components/|g' \
    -e 's|@contexts/|./contexts/|g' \
    -e 's|@pages/|./pages/|g' \
    -e 's|@utils/|./utils/|g' {} +

echo "🛠 Fixing utilityService and employeeService imports..."

# Replace imports from api.js to point to actual service files
sed -i 's|import { utilityService.*} from.*api.js|import utilityService from "./utils/utilityService";|' src/components/TimeClockNavbar.jsx
sed -i 's|import { employeeService.*} from.*api.js|import employeeService from "./utils/employeeService";|' src/contexts/ShopContext.jsx

echo "🚀 Starting frontend dev server..."
npm run dev
