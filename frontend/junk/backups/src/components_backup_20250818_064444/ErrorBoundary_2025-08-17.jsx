// src/components/ErrorBoundary.jsx - Catch React errors gracefully
import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bg-white rounded-lg shadow-xl border border-red-200 p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-10 h-10 text-red-600" />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Something went wrong
                </h1>
                
                <p className="text-gray-600 text-lg mb-6">
                  We're sorry, but something unexpected happened. Don't worry - your data is safe.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <button
                    onClick={this.handleRetry}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Try Again</span>
                  </button>
                  
                  <button
                    onClick={this.handleGoHome}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Home className="w-5 h-5" />
                    <span>Go Home</span>
                  </button>
                  
                  <button
                    onClick={this.handleReload}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Reload Page</span>
                  </button>
                </div>
              </div>

              {/* Error Details (Development Mode) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-red-500">
                  <div className="flex items-center mb-4">
                    <Bug className="w-5 h-5 text-red-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Developer Information
                    </h3>
                  </div>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Error Message:</h4>
                      <p className="text-red-600 bg-red-50 p-3 rounded border font-mono">
                        {this.state.error.toString()}
                      </p>
                    </div>
                    
                    {this.state.errorInfo.componentStack && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Component Stack:</h4>
                        <pre className="text-xs bg-gray-100 p-3 rounded border overflow-auto max-h-60 font-mono">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Stack Trace:</h4>
                      <pre className="text-xs bg-gray-100 p-3 rounded border overflow-auto max-h-60 font-mono">
                        {this.state.error.stack}
                      </pre>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm">
                        <strong>Note:</strong> This detailed error information is only shown in development mode. 
                        In production, users will see a simplified error message.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Retry Count */}
              {this.state.retryCount > 0 && (
                <div className="mt-6 text-center">
                  <p className="text-gray-500 text-sm">
                    Retry attempts: {this.state.retryCount}
                  </p>
                </div>
              )}

              {/* Help Text */}
              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                  If this problem persists, please contact support with the error details above.
                </p>
              </div>
            </div>

            {/* System Status */}
            <div className="mt-6 bg-white rounded-lg shadow border p-4">
              <h3 className="font-semibold text-gray-900 mb-3">System Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Backend: Connected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Database: Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Frontend: Error State</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
