import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ApiErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('API Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
              <h1 className="text-lg font-semibold text-gray-900">
                Connection Error
              </h1>
            </div>
            <p className="text-gray-600 mb-4">
              Unable to connect to the backend server. Please check:
            </p>
            <ul className="text-sm text-gray-500 mb-6 space-y-1">
              <li>• Backend server is running</li>
              <li>• API URL is correct in .env</li>
              <li>• Network connection is stable</li>
            </ul>
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4">
                <summary className="text-sm text-gray-500 cursor-pointer">
                  Technical Details
                </summary>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ApiErrorBoundary;
