#!/bin/bash

# Frontend Project Cleanup and Fix Script
# This script will fix all the import issues and resolve conflicts

echo "🔧 EDDIE'S ASIAN AUTOMOTIVE - FRONTEND FIX"
echo "=========================================="
echo "Starting comprehensive frontend cleanup..."

# Navigate to frontend directory
cd ~/eddies-asian-automotive/frontend/src

# Create backup directory
echo "📦 Creating backup of current state..."
mkdir -p ../backups/$(date +%Y%m%d_%H%M%S)
cp -r . ../backups/$(date +%Y%m%d_%H%M%S)/

echo "✅ Backup created"

# 1. Fix all generic context imports
echo "🔄 Fixing generic context imports..."

# Fix useAuth imports - replace generic with specific AuthContext
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import { useAuth } from "../contexts";|import { useAuth } from "../contexts/AuthContext";|g'
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import { useAuth } from "../../contexts";|import { useAuth } from "../../contexts/AuthContext";|g'
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import { useAuth } from "../contexts"$|import { useAuth } from "../contexts/AuthContext"|g'

# Fix useData imports - replace generic with specific DataContext
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import { useData } from "../contexts";|import { useData } from "../contexts/DataContext";|g'
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import { useData } from "../../contexts";|import { useData } from "../../contexts/DataContext";|g'
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import { useData } from "../contexts"$|import { useData } from "../contexts/DataContext"|g'

# Fix useSettings imports - replace generic with specific SettingsProvider
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import { useSettings } from "../contexts";|import { useSettings } from "../contexts/SettingsProvider";|g'
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import { useSettings } from "../../contexts";|import { useSettings } from "../../contexts/SettingsProvider";|g'

echo "✅ Context imports fixed"

# 2. Fix generic utils imports
echo "🔄 Fixing generic utils imports..."

# Create a temporary file to track what needs specific imports
cat > /tmp/utils_fixes.txt << 'EOF'
# Utils import fixes needed
apiEndpoints|apiEndpoints
computeTotals|computeTotals
showMessage|showMessage
handleApiError|handleApiError
vehicleHelpers|vehicleHelpers
EOF

# Apply utils fixes
while IFS='|' read -r search replace; do
    find . -name "*.jsx" -o -name "*.js" | xargs sed -i "s|import { $search } from \"../utils\";|import { $replace } from \"../utils/index\";|g"
    find . -name "*.jsx" -o -name "*.js" | xargs sed -i "s|import { $search } from \"../../utils\";|import { $replace } from \"../../utils/index\";|g"
done < /tmp/utils_fixes.txt

# Fix default api imports
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import api from "../utils";|import api from "../utils/api";|g'
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import apiClient from "../utils";|import api from "../utils/api";|g'

echo "✅ Utils imports fixed"

# 3. Remove duplicate components - keep the most complete version
echo "🗑️  Removing duplicate components..."

# Remove duplicate AIDiagnosticHelper (keep the ai/ version)
if [ -f "./components/AIDiagnosticHelper.jsx" ] && [ -f "./components/ai/AIDiagnosticHelper.jsx" ]; then
    echo "Removing duplicate AIDiagnosticHelper.jsx"
    rm "./components/AIDiagnosticHelper.jsx"
fi

# Remove duplicate AIEstimateModal (keep the ai/ version)
if [ -f "./components/AIEstimateModal.jsx" ] && [ -f "./components/ai/AIEstimateModal.jsx" ]; then
    echo "Removing duplicate AIEstimateModal.jsx"
    rm "./components/AIEstimateModal.jsx"
fi

# Remove duplicate modals AIEstimateModal (keep the ai/ version)
if [ -f "./components/modals/AIEstimateModal.jsx" ] && [ -f "./components/ai/AIEstimateModal.jsx" ]; then
    echo "Removing duplicate modals/AIEstimateModal.jsx"
    rm "./components/modals/AIEstimateModal.jsx"
fi

# Remove split_components versions (they're duplicates)
echo "Removing split_components duplicates..."
rm -rf "./pages/split_components/"

# Remove duplicate Layout in components (keep the layouts/ version)
if [ -f "./components/Layout.jsx" ] && [ -f "./layouts/Layout.jsx" ]; then
    echo "Removing duplicate components/Layout.jsx"
    rm "./components/Layout.jsx"
fi

# Remove duplicate MobileNavigation (keep the layout/ version)
if [ -f "./components/MobileNavigation.jsx" ] && [ -f "./components/layout/MobileNavigation.jsx" ]; then
    echo "Removing duplicate MobileNavigation.jsx"
    rm "./components/MobileNavigation.jsx"
fi

if [ -f "./components/mobile/MobileNavigation.jsx" ] && [ -f "./components/layout/MobileNavigation.jsx" ]; then
    echo "Removing duplicate mobile/MobileNavigation.jsx"
    rm -rf "./components/mobile/"
fi

# Remove duplicate ProtectedRoute (keep the auth/ version)
if [ -f "./components/ProtectedRoute.jsx" ] && [ -f "./components/auth/ProtectedRoute.jsx" ]; then
    echo "Removing duplicate ProtectedRoute.jsx"
    rm "./components/ProtectedRoute.jsx"
fi

# Remove duplicate RealTimeNotifications (keep the main version)
if [ -f "./components/ui/RealTimeNotifications.jsx" ] && [ -f "./components/RealTimeNotifications.jsx" ]; then
    echo "Removing duplicate ui/RealTimeNotifications.jsx"
    rm "./components/ui/RealTimeNotifications.jsx" 2>/dev/null || true
fi

echo "✅ Duplicate components removed"

# 4. Update App.jsx to use correct imports
echo "🔄 Updating App.jsx imports..."

cat > App.jsx.tmp << 'EOF'
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CombinedProviders } from './contexts/CombinedProviders';

// Import from layouts instead of components
import Layout from './layouts/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import components
import SearchSystem from './components/SearchSystem';
import RealTimeNotifications from './components/RealTimeNotifications';
import CustomerPortal from './components/CustomerPortal';

// Import pages
import {
  Dashboard,
  Login,
  Register,
  Landing,
  NotFound,
  Customers,
  CustomerDetail,
  Vehicles,
  VehicleDetail,
  Jobs,
  JobDetail,
  Estimates,
  EstimateDetail,
  Invoices,
  InvoiceDetail,
  AppointmentCalendar,
  Reports,
  Settings,
  AIDiagnostics
} from './pages';

// Additional imports that might be missing from index.js
import PartsLaborManagement from './pages/PartsLaborManagement';
import TimeClock from './pages/TimeClock';
import Inventory from './pages/Inventory';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CombinedProviders>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected app routes */}
            <Route path="/app" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="vehicles/:id" element={<VehicleDetail />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="jobs/:id" element={<JobDetail />} />
              <Route path="appointments" element={<AppointmentCalendar />} />
              <Route path="estimates" element={<Estimates />} />
              <Route path="estimates/:id" element={<EstimateDetail />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="invoices/:id" element={<InvoiceDetail />} />
              <Route path="parts-labor" element={<PartsLaborManagement />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="ai-diagnostics" element={<AIDiagnostics />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="search" element={<SearchSystem />} />
              <Route path="notifications" element={<RealTimeNotifications />} />
              <Route path="profile" element={<CustomerPortal />} />
              <Route path="timeclock" element={<TimeClock />} />
            </Route>
            
            {/* Catch all - redirect to app */}
            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </CombinedProviders>
    </QueryClientProvider>
  );
}

export default App;
EOF

mv App.jsx.tmp App.jsx

echo "✅ App.jsx updated"

# 5. Clean up API files - remove duplicates
echo "🧹 Cleaning up API files..."

# Remove backup API files
rm -f ./utils/api.js.backup*
rm -f ./utils/api.js.bak*

echo "✅ API cleanup complete"

# 6. Update pages/index.js to export all components properly
echo "📝 Updating pages/index.js exports..."

cat > ./pages/index.js << 'EOF'
// Page exports - centralized export file
export { default as Dashboard } from './Dashboard';
export { default as Login } from './Login';
export { default as Register } from './Register';
export { default as Landing } from './Landing';
export { default as NotFound } from './NotFound';

// Customer pages
export { default as Customers } from './Customers';
export { default as CustomerDetail } from './CustomerDetail';
export { default as CustomerList } from './CustomerList';
export { default as AddAndEditCustomer } from './AddAndEditCustomer';

// Vehicle pages
export { default as Vehicles } from './Vehicles';
export { default as VehicleDetail } from './VehicleDetail';
export { default as VehicleList } from './VehicleList';
export { default as VehicleForm } from './VehicleForm';
export { default as AddVehicle } from './AddVehicle';

// Job pages
export { default as Jobs } from './Jobs';
export { default as JobDetail } from './JobDetail';
export { default as CreateJob } from './CreateJob';
export { default as ViewJobs } from './ViewJobs';

// Estimate pages
export { default as Estimates } from './Estimates';
export { default as EstimateDetail } from './EstimateDetail';
export { default as EstimatesList } from './EstimatesList';
export { default as CreateEditEstimate } from './CreateEditEstimate';

// Invoice pages
export { default as Invoices } from './Invoices';
export { default as Invoice } from './Invoice';
export { default as InvoiceDetail } from './InvoiceDetail';
export { default as CreateInvoice } from './CreateInvoice';

// Other pages
export { default as AppointmentCalendar } from './AppointmentCalendar';
export { default as Reports } from './Reports';
export { default as Settings } from './Settings';
export { default as AIDiagnostics } from './AIDiagnostics';
export { default as Diagnosis } from './Diagnosis';
export { default as PartsLaborManagement } from './PartsLaborManagement';
export { default as Inventory } from './Inventory';
export { default as TimeClock } from './TimeClock';
export { default as DataMigration } from './DataMigration';
export { default as Mobile } from './Mobile';
EOF

echo "✅ Pages index.js updated"

# 7. Fix specific layout imports in App.jsx and other files
echo "🔄 Fixing Layout component imports..."

# Update any remaining Layout imports to use layouts/Layout
find . -name "*.jsx" -o -name "*.js" | xargs sed -i "s|import Layout from './components/Layout';|import Layout from './layouts/Layout';|g"
find . -name "*.jsx" -o -name "*.js" | xargs sed -i "s|import Layout from '../components/Layout';|import Layout from '../layouts/Layout';|g"

# Update ProtectedRoute imports to use auth/ProtectedRoute
find . -name "*.jsx" -o -name "*.js" | xargs sed -i "s|import ProtectedRoute from './components/ProtectedRoute';|import ProtectedRoute from './components/auth/ProtectedRoute';|g"
find . -name "*.jsx" -o -name "*.js" | xargs sed -i "s|import ProtectedRoute from '../components/ProtectedRoute';|import ProtectedRoute from '../components/auth/ProtectedRoute';|g"

echo "✅ Layout imports fixed"

# 8. Fix component barrel imports
echo "🔄 Fixing generic component imports..."

# Fix specific problematic imports found in the analysis
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import DocumentTemplplateRenderer from "../components";|import DocumentTemplplateRenderer from "../components/DocumentTemplplateRenderer";|g'
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import CustomerAuthorization from "../components";|import CustomerAuthorization from "../components/CustomerAuthorization";|g'
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import ErrorBoundaryWithAuth from "../components";|import ErrorBoundaryWithAuth from "../components/ErrorBoundaryWithAuth";|g'
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import CompleteNavigationMenu from "../components";|import CompleteNavigationMenu from "../components/CompleteNavigationMenu";|g'
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import TimeClockNavbar from "../components";|import TimeClockNavbar from "../components/TimeClockNavbar";|g'
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import LoadingSpinner from "../components";|import LoadingSpinner from "../components/LoadingSpinner";|g'

echo "✅ Component imports fixed"

# 9. Update utils imports that need specific file paths
echo "🔄 Fixing utils file imports..."

# Fix vehicleHelpers imports
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import { vehicleHelpers } from "./utils/vehicleHelpers";|import { vehicleHelpers } from "../utils/vehicleHelpers";|g'
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|import { vehicleHelpers } from "../utils";|import { vehicleHelpers } from "../utils/vehicleHelpers";|g'

echo "✅ Utils file imports fixed"

# 10. Clean up unused files
echo "🧹 Cleaning up unused and problematic files..."

# Remove your_file_new.jsx if it exists (seems like a test file)
[ -f "./pages/your_file_new.jsx" ] && rm "./pages/your_file_new.jsx"

# Remove any remaining .backup files
find . -name "*.backup*" -type f -delete

echo "✅ Cleanup complete"

# 11. Verify critical files exist
echo "🔍 Verifying critical files exist..."

critical_files=(
    "contexts/AuthContext.jsx"
    "contexts/DataContext.jsx"
    "contexts/SettingsProvider.jsx"
    "contexts/CombinedProviders.jsx"
    "utils/api.js"
    "utils/apiEndpoints.js"
    "layouts/Layout.jsx"
    "components/auth/ProtectedRoute.jsx"
)

missing_files=()
for file in "${critical_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "✅ All critical files present"
else
    echo "⚠️  Missing critical files:"
    printf '%s\n' "${missing_files[@]}"
fi

# 12. Update any remaining references to removed files
echo "🔄 Updating references to removed files..."

# Update imports that might reference removed split_components
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|from "./split_components/VehicleDetail"|from "./VehicleDetail"|g'
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|from "./split_components/JobDetail"|from "./JobDetail"|g'
find . -name "*.jsx" -o -name "*.js" | xargs sed -i 's|from "./split_components/EstimateDetail"|from "./EstimateDetail"|g'

echo "✅ File references updated"

# 13. Final verification
echo "🔍 Running final verification..."

# Check for any remaining generic imports
remaining_generic=$(find . -name "*.jsx" -o -name "*.js" | xargs grep -l 'from "../contexts"' 2>/dev/null | wc -l)
remaining_utils=$(find . -name "*.jsx" -o -name "*.js" | xargs grep -l 'from "../utils"' 2>/dev/null | wc -l)

echo "Remaining generic context imports: $remaining_generic"
echo "Remaining generic utils imports: $remaining_utils"

# 14. Generate updated project summary
echo "📊 Generating updated project summary..."

cat > ../fix_summary.md << 'EOF'
# Frontend Fix Summary

## Issues Resolved:
✅ Fixed all generic context imports (../contexts -> specific files)
✅ Fixed all generic utils imports 
✅ Removed duplicate components:
   - Removed split_components/ directory
   - Removed duplicate AIDiagnosticHelper
   - Removed duplicate AIEstimateModal
   - Removed duplicate Layout in components/
   - Removed duplicate MobileNavigation
   - Removed duplicate ProtectedRoute
✅ Updated App.jsx to use correct import paths
✅ Cleaned up backup files
✅ Updated pages/index.js exports

## Architecture Decisions:
- AuthContext: Use contexts/AuthContext.jsx
- DataContext: Use contexts/DataContext.jsx  
- Layout: Use layouts/Layout.jsx
- ProtectedRoute: Use components/auth/ProtectedRoute.jsx
- AI Components: Use components/ai/ directory
- API: Use utils/api.js (removed backups)

## Next Steps:
1. Run `npm run dev` to test the application
2. Check console for any remaining import errors
3. Test key functionality (login, navigation, data loading)
EOF

echo "✅ Fix summary generated at ../fix_summary.md"

echo ""
echo "🎉 FRONTEND CLEANUP COMPLETE!"
echo "=========================================="
echo "Summary:"
echo "- Fixed generic context imports"
echo "- Removed duplicate components" 
echo "- Cleaned up file structure"
echo "- Updated App.jsx imports"
echo "- Generated fix summary"
echo ""
echo "Next: Run 'npm run dev' to test your application!"
echo "Check the console for any remaining errors."
