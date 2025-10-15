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
