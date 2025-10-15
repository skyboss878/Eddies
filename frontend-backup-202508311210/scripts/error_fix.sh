#!/bin/bash

echo "🔧 Eddie's Automotive - Error Diagnostic & Auto-Fix Script"
echo "=========================================================="

cd ~/eddies-askan-automotive/frontend

echo "🔍 ERROR 1: Checking DataContext export issues..."

# Check if useData hook is exported
if grep -q "export.*useData" src/contexts/DataContext.jsx; then
    echo "✅ useData hook export found"
else
    echo "❌ useData hook export MISSING - THIS CAUSES utils.isLoading error!"
    echo "🔧 Adding missing useData hook export..."
    
    cat >> src/contexts/DataContext.jsx << 'DATAEOF'

// Hook to use the context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;
DATAEOF
    
    echo "✅ useData hook added!"
fi

echo ""
echo "🔧 Fix 2: Creating a robust ErrorBoundary..."

cat > src/components/ErrorBoundary.jsx << 'ERROREOF'
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-800 flex items-center justify-center">
          <div className="text-center text-white p-8 bg-red-900/50 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4">⚠️ Something went wrong</h2>
            <p className="mb-4">The application encountered an error.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
ERROREOF

echo "✅ ErrorBoundary recreated!"

echo ""
echo "🏁 FIXES APPLIED!"
echo "================"
echo ""
echo "🚀 Now restart your dev server:"
echo "   npm run dev"

