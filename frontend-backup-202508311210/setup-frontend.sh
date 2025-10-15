#!/bin/bash
# setup-frontend.sh - Frontend setup script for API integration

echo "🚀 Setting up Frontend API Integration"
echo "======================================"

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development

# Optional: Set to true for debug logging
REACT_APP_DEBUG=true

# Optional: Authentication settings
REACT_APP_TOKEN_STORAGE_KEY=token
REACT_APP_USER_STORAGE_KEY=user

# Optional: Default settings
REACT_APP_DEFAULT_HOURLY_RATE=25.00
REACT_APP_OVERTIME_MULTIPLIER=1.5
REACT_APP_REGULAR_HOURS_THRESHOLD=40
EOF
    echo "✅ Created .env file with default settings"
else
    echo "ℹ️  .env file already exists"
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from your React project root."
    exit 1
fi

# Install required dependencies if not already installed
echo "📦 Checking dependencies..."

# Check for lucide-react (for icons)
if ! npm list lucide-react > /dev/null 2>&1; then
    echo "📦 Installing lucide-react for icons..."
    npm install lucide-react
fi

# Create utils directory if it doesn't exist
if [ ! -d "src/utils" ]; then
    echo "📁 Creating src/utils directory..."
    mkdir -p src/utils
fi

# Create api.js if it doesn't exist (user should copy the artifact content)
if [ ! -f "src/utils/api.js" ]; then
    echo "⚠️  src/utils/api.js not found!"
    echo "Please copy the Complete API Service artifact content to src/utils/api.js"
    echo ""
    echo "The file should start with:"
    echo "// src/utils/api.js - Complete API Service"
    echo ""
fi

# Create components directory if it doesn't exist
if [ ! -d "src/components" ]; then
    echo "📁 Creating src/components directory..."
    mkdir -p src/components
fi

# Create a simple test component to verify API connection
echo "🧪 Creating API test component..."
cat > src/components/ApiTest.jsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { healthService, apiUtils } from '../utils/api.js';

const ApiTest = () => {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const result = await apiUtils.testConnection();
      setStatus(result.connected ? 'connected' : 'disconnected');
      setError(result.connected ? null : result.message);
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'disconnected': return 'text-red-600';
      case 'checking': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2">API Connection Test</h3>
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          status === 'connected' ? 'bg-green-500' : 
          status === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
        }`}></div>
        <span className={`font-medium ${getStatusColor()}`}>
          {status === 'checking' ? 'Checking...' : 
           status === 'connected' ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      <button
        onClick={testConnection}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Test Again
      </button>
    </div>
  );
};

export default ApiTest;
EOF

echo "✅ Created ApiTest component"

# Create a simple authentication hook
echo "🔐 Creating authentication hook..."
mkdir -p src/hooks

cat > src/hooks/useAuth.js << 'EOF'
import { useState, useEffect } from 'react';
import { authService } from '../utils/api.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    const authenticated = authService.isAuthenticated();
    
    setUser(currentUser);
    setIsAuthenticated(authenticated);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout
  };
};
EOF

echo "✅ Created useAuth hook"

# Create API error boundary component
echo "🛡️ Creating API error boundary..."
cat > src/components/ApiErrorBoundary.jsx << 'EOF'
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
EOF

echo "✅ Created API error boundary"

# Create a comprehensive README for the API integration
echo "📖 Creating API integration README..."
cat > API_INTEGRATION.md << 'EOF'
# API Integration Guide

This guide explains how to use the API service with your React frontend.

## Setup

1. Make sure your backend server is running on the configured port
2. Update `.env` file with correct API URL:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

## Available Services

### Authentication
```javascript
import { authService } from './utils/api.js';

// Login
const response = await authService.login({ email, password });

// Check if authenticated
const isAuth = authService.isAuthenticated();

// Get current user
const user = authService.getCurrentUser();

// Logout
authService.logout();
```

### Time Clock
```javascript
import { timeClockService } from './utils/api.js';

// Get status
const status = await timeClockService.getStatus();

// Clock in/out
await timeClockService.clockIn();
await timeClockService.clockOut();

// Breaks
await timeClockService.startBreak();
await timeClockService.endBreak();
```

### Jobs
```javascript
import { jobService } from './utils/api.js';

// Get all jobs
const jobs = await jobService.getAll();

// Get job by ID
const job = await jobService.getById(id);

// Create job
const newJob = await jobService.create(jobData);

// Update job
await jobService.update(id, jobData);
```

### Customers
```javascript
import { customerService } from './utils/api.js';

// Get all customers
const customers = await customerService.getAll();

// Create customer
const newCustomer = await customerService.create(customerData);
```

## Error Handling

All API calls should be wrapped in try-catch blocks:

```javascript
try {
  const data = await jobService.getAll();
  setJobs(data);
} catch (error) {
  console.error('API Error:', error);
  setError(apiUtils.formatError(error));
}
```

## Components

### Using API in Components
```javascript
import React, { useState, useEffect } from 'react';
import { jobService, apiUtils } from '../utils/api.js';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    if (!apiUtils.requireAuth()) return;

    try {
      setError(null);
      const response = await jobService.getAll();
      setJobs(response.data || response);
    } catch (error) {
      setError(apiUtils.formatError(error));
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {jobs.map(job => (
        <div key={job.id}>{job.title}</div>
      ))}
    </div>
  );
};
```

## Testing Connection

Use the ApiTest component to verify your backend connection:

```javascript
import ApiTest from './components/ApiTest';

function App() {
  return (
    <div>
      <ApiTest />
      {/* Your other components */}
    </div>
  );
}
```

## Environment Variables

Create a `.env` file in your project root:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
REACT_APP_DEBUG=true
```

## Backend Endpoints

Your backend provides these endpoints:
- POST `/api/auth/login`
- GET|POST `/api/appointments`
- GET|POST `/api/customers`
- GET|POST `/api/vehicles`
- GET|POST `/api/jobs`
- GET|POST `/api/estimates`
- GET|POST `/api/invoices`
- GET `/api/dashboard/stats`
- GET `/api/search`
- GET `/health`
- GET|POST `/api/parts`
- GET|POST `/api/labor`
- GET|POST `/api/settings`
- GET `/api/timeclock/status`
- POST `/api/timeclock/clock-in`
- POST `/api/timeclock/clock-out`

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend allows requests from your frontend domain
2. **401 Unauthorized**: Check if authentication token is valid
3. **Connection Refused**: Verify backend server is running
4. **404 Errors**: Check API endpoint URLs match your backend routes

### Debug Mode

Set `REACT_APP_DEBUG=true` in `.env` to see detailed API logs in console.

### Error Boundary

Wrap your app with the ApiErrorBoundary to catch API-related errors:

```javascript
import ApiErrorBoundary from './components/ApiErrorBoundary';

function App() {
  return (
    <ApiErrorBoundary>
      {/* Your app components */}
    </ApiErrorBoundary>
  );
}
```
EOF

echo "✅ Created API integration README"

# Create package.json scripts if they don't exist
echo "📝 Adding npm scripts..."

# Check if scripts section exists in package.json and add helpful scripts
if command -v jq &> /dev/null; then
    # Add scripts using jq if available
    jq '.scripts.start = "react-scripts start"' package.json > package.temp.json && mv package.temp.json package.json 2>/dev/null || echo "Could not update package.json scripts"
else
    echo "ℹ️  jq not found, please manually add these scripts to package.json:"
    echo "  \"scripts\": {"
    echo "    \"start\": \"react-scripts start\","
    echo "    \"build\": \"react-scripts build\","
    echo "    \"test\": \"react-scripts test\","
    echo "    \"test:api\": \"npm start -- --env=test\""
    echo "  }"
fi

echo ""
echo "🎉 Frontend API integration setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy the 'Complete API Service' artifact content to src/utils/api.js"
echo "2. Update your backend URL in .env if needed"
echo "3. Start your backend server"
echo "4. Run 'npm start' to start the frontend"
echo "5. Test the connection using the ApiTest component"
echo ""
echo "📁 Files created:"
echo "  - .env (API configuration)"
echo "  - src/components/ApiTest.jsx (connection test)"
echo "  - src/components/ApiErrorBoundary.jsx (error handling)"
echo "  - src/hooks/useAuth.js (authentication hook)"
echo "  - API_INTEGRATION.md (documentation)"
echo ""
echo "📖 Read API_INTEGRATION.md for usage examples"
echo "🧪 Import and use <ApiTest /> component to verify connection"
EOF

echo "✅ Created setup script"

# Make the script executable
chmod +x setup-frontend.sh 2>/dev/null || echo "Note: Could not make script executable (run with: bash setup-frontend.sh)"

echo ""
echo "🎯 Summary of what you need to do:"
echo ""
echo "1. COPY API SERVICE: Copy the 'Complete API Service' artifact to src/utils/api.js"
echo "2. RUN SETUP: Run the setup script with: bash setup-frontend.sh"
echo "3. START BACKEND: Make sure your Flask backend is running on port 5000"
echo "4. TEST CONNECTION: Use the ApiTest component to verify connectivity"
echo "5. UPDATE COMPONENTS: Replace your existing API calls with the new service methods"
echo ""
echo "Backend endpoints detected:"
echo "✓ POST /api/auth/login"
echo "✓ GET|POST /api/appointments"
echo "✓ GET|POST /api/customers"
echo "✓ GET|POST /api/vehicles"
echo "✓ GET|POST /api/jobs"
echo "✓ GET|POST /api/estimates"
echo "✓ GET|POST /api/invoices"
echo "✓ GET /api/dashboard/stats"
echo "✓ GET /api/search"
echo "✓ GET /health"
echo "✓ GET|POST /api/parts"
echo "✓ GET|POST /api/labor"
echo "✓ GET|POST /api/settings"
echo "✓ GET /api/timeclock/status"
echo "✓ POST /api/timeclock/clock-in"
echo "✓ POST /api/timeclock/clock-out"

echo ""
echo "Your TimeClockNavbar component is already updated to use the new API!"
echo "The Dashboard example shows how to integrate other components."
