// Error handling utilities

export const handleApiError = (error, context = '') => {
  
  let errorMessage = 'An unexpected error occurred';
  let errorCode = 'UNKNOWN_ERROR';
  let statusCode = 500;
  
  if (error.response) {
    // Server responded with error status
    statusCode = error.response.status;
    errorMessage = error.response.data?.message || error.response.statusText || errorMessage;
    errorCode = error.response.data?.code || `HTTP_${statusCode}`;
  } else if (error.request) {
    // Network error
    errorMessage = 'Unable to connect to server. Please check your connection.';
    errorCode = 'NETWORK_ERROR';
    statusCode = 0;
  } else {
    // Something else went wrong
    errorMessage = error.message || errorMessage;
    errorCode = 'CLIENT_ERROR';
  }
  
  const errorInfo = {
    message: errorMessage,
    code: errorCode,
    statusCode,
    context,
    timestamp: new Date().toISOString(),
    originalError: error
  };
  
  // Log to external service if configured
  if (import.meta.env.VITE_ERROR_LOGGING_ENABLED === 'true') {
    // Add your error logging service here
  }
  
  return errorInfo;
};

export const createErrorBoundary = (fallbackComponent) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
    
    componentDidCatch(error, errorInfo) {
      handleApiError(error, 'Error Boundary');
    }
    
    render() {
      if (this.state.hasError) {
        return fallbackComponent || <div>Something went wrong.</div>;
      }
      
      return this.props.children;
    }
  };
};

export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

export const validateRequiredFields = (data, requiredFields) => {
  const errors = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || data[field] === '') {
      errors.push(`${field} is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
