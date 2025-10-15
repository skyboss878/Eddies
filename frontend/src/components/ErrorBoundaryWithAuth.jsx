import React from 'react';

class ErrorBoundaryWithAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // SAFE error handling - check for null/undefined before accessing properties
    console.error('ErrorBoundary caught an error:', error);
    
    // Safe property access with optional chaining and nullish coalescing
    const safeErrorInfo = {
      componentStack: errorInfo?.componentStack || 'No component stack available',
      errorBoundary: errorInfo?.errorBoundary || null,
      errorBoundaryStack: errorInfo?.errorBoundaryStack || 'No error boundary stack available'
    };
    
    console.error('Error info:', safeErrorInfo);
    
    this.setState({
      error: error || new Error('Unknown error occurred'),
      errorInfo: safeErrorInfo
    });
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '1px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#ffe0e0'
        }}>
          <h2 style={{ color: '#d63384' }}>Something went wrong</h2>
          <details style={{ marginTop: '10px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Click to see error details
            </summary>
            <div style={{ 
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '12px',
              whiteSpace: 'pre-wrap'
            }}>
              <strong>Error:</strong> {this.state.error?.message || this.state.error?.toString() || 'Unknown error'}
              
              {this.state.errorInfo?.componentStack && (
                <>
                  <br /><br />
                  <strong>Component Stack:</strong>
                  {this.state.errorInfo.componentStack}
                </>
              )}
            </div>
          </details>
          <button 
            onClick={this.handleReset}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWithAuth;
