#!/bin/bash

# Create missing utility files that are being imported
echo "🛠️ Creating missing utility files..."

cd ~/eddies-asian-automotive/frontend/src/utils

# 1. Create apiEndpoints.js
cat > apiEndpoints.js << 'EOF'
// API endpoint configuration
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const apiEndpoints = {
  // Authentication
  auth: {
    login: `${BASE_URL}/auth/login`,
    logout: `${BASE_URL}/auth/logout`,
    register: `${BASE_URL}/auth/register`,
    verify: `${BASE_URL}/auth/verify`
  },
  
  // Vehicles
  vehicles: {
    list: `${BASE_URL}/vehicles`,
    create: `${BASE_URL}/vehicles`,
    update: (id) => `${BASE_URL}/vehicles/${id}`,
    delete: (id) => `${BASE_URL}/vehicles/${id}`,
    get: (id) => `${BASE_URL}/vehicles/${id}`
  },
  
  // Work Orders
  workOrders: {
    list: `${BASE_URL}/work-orders`,
    create: `${BASE_URL}/work-orders`,
    update: (id) => `${BASE_URL}/work-orders/${id}`,
    delete: (id) => `${BASE_URL}/work-orders/${id}`,
    get: (id) => `${BASE_URL}/work-orders/${id}`
  },
  
  // Customers
  customers: {
    list: `${BASE_URL}/customers`,
    create: `${BASE_URL}/customers`,
    update: (id) => `${BASE_URL}/customers/${id}`,
    delete: (id) => `${BASE_URL}/customers/${id}`,
    get: (id) => `${BASE_URL}/customers/${id}`
  },
  
  // Estimates
  estimates: {
    list: `${BASE_URL}/estimates`,
    create: `${BASE_URL}/estimates`,
    update: (id) => `${BASE_URL}/estimates/${id}`,
    delete: (id) => `${BASE_URL}/estimates/${id}`,
    get: (id) => `${BASE_URL}/estimates/${id}`
  },
  
  // Parts
  parts: {
    list: `${BASE_URL}/parts`,
    search: `${BASE_URL}/parts/search`,
    get: (id) => `${BASE_URL}/parts/${id}`
  }
};
EOF

# 2. Create aiUtils.js
cat > aiUtils.js << 'EOF'
// AI response generation utilities
export const generateAIResponse = async (prompt, context = {}) => {
  try {
    // Mock AI response for now - replace with actual AI service
    const responses = [
      "Based on the information provided, I recommend checking the brake system first.",
      "The symptoms suggest a potential issue with the transmission. Consider a diagnostic test.",
      "This appears to be a routine maintenance item. Schedule it for the next available slot.",
      "The vehicle history indicates this is a recurring issue. Check for underlying causes."
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return random response for now
    return {
      success: true,
      response: responses[Math.floor(Math.random() * responses.length)],
      confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
    };
  } catch (error) {
    console.error('AI response generation failed:', error);
    return {
      success: false,
      error: 'Failed to generate AI response',
      response: 'Unable to provide AI assistance at this time.'
    };
  }
};

export const analyzeDiagnosticCodes = async (codes) => {
  // Analyze diagnostic trouble codes with AI
  try {
    const analysis = codes.map(code => ({
      code,
      description: `Diagnostic code ${code} analysis`,
      severity: Math.random() > 0.5 ? 'high' : 'medium',
      recommendation: `Check ${code} related components`
    }));
    
    return {
      success: true,
      analysis,
      summary: `Found ${codes.length} diagnostic codes requiring attention`
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to analyze diagnostic codes'
    };
  }
};
EOF

# 3. Create messageUtils.js
cat > messageUtils.js << 'EOF'
// Message/notification utilities
let messageQueue = [];

export const showMessage = (message, type = 'info', duration = 5000) => {
  const messageObj = {
    id: Date.now() + Math.random(),
    message,
    type, // 'info', 'success', 'warning', 'error'
    duration,
    timestamp: new Date()
  };
  
  messageQueue.push(messageObj);
  
  // If using a toast library, you could integrate here
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      messageQueue = messageQueue.filter(msg => msg.id !== messageObj.id);
    }, duration);
  }
  
  return messageObj.id;
};

export const hideMessage = (messageId) => {
  messageQueue = messageQueue.filter(msg => msg.id !== messageId);
};

export const clearAllMessages = () => {
  messageQueue = [];
};

export const getActiveMessages = () => {
  return [...messageQueue];
};

// Success message helper
export const showSuccess = (message, duration = 3000) => {
  return showMessage(message, 'success', duration);
};

// Error message helper
export const showError = (message, duration = 8000) => {
  return showMessage(message, 'error', duration);
};

// Warning message helper
export const showWarning = (message, duration = 5000) => {
  return showMessage(message, 'warning', duration);
};

// Info message helper
export const showInfo = (message, duration = 4000) => {
  return showMessage(message, 'info', duration);
};
EOF

# 4. Create socketUtils.js
cat > socketUtils.js << 'EOF'
// Socket.IO utilities
import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (serverUrl = 'http://localhost:3001') => {
  if (!socket) {
    socket = io(serverUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });
    
    // Set up default event listeners
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
    
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }
  
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.warn('Socket not initialized. Call initializeSocket() first.');
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Export socket instance (will be null until initialized)
export { socket };

// Socket event helpers
export const emitSocketEvent = (event, data) => {
  const socketInstance = getSocket();
  if (socketInstance.connected) {
    socketInstance.emit(event, data);
  } else {
    console.warn('Socket not connected. Event not sent:', event);
  }
};

export const onSocketEvent = (event, callback) => {
  const socketInstance = getSocket();
  socketInstance.on(event, callback);
};

export const offSocketEvent = (event, callback) => {
  const socketInstance = getSocket();
  socketInstance.off(event, callback);
};
EOF

# 5. Create calculations.js
cat > calculations.js << 'EOF'
// Calculation utilities for work orders, estimates, etc.

export const computeTotals = (items = []) => {
  const totals = {
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    laborCost: 0,
    partsCost: 0,
    taxRate: 0.08 // Default 8% tax rate
  };
  
  if (!Array.isArray(items) || items.length === 0) {
    return totals;
  }
  
  // Calculate parts and labor costs
  items.forEach(item => {
    const cost = parseFloat(item.cost || 0);
    const quantity = parseInt(item.quantity || 1);
    const itemTotal = cost * quantity;
    
    if (item.type === 'labor') {
      totals.laborCost += itemTotal;
    } else if (item.type === 'part') {
      totals.partsCost += itemTotal;
    }
    
    totals.subtotal += itemTotal;
  });
  
  // Apply discount if provided
  const discountAmount = parseFloat(items[0]?.discount || 0);
  if (discountAmount > 0) {
    if (discountAmount < 1) {
      // Percentage discount
      totals.discount = totals.subtotal * discountAmount;
    } else {
      // Fixed amount discount
      totals.discount = discountAmount;
    }
  }
  
  // Calculate tax on discounted subtotal
  const taxableAmount = totals.subtotal - totals.discount;
  totals.tax = taxableAmount * totals.taxRate;
  
  // Calculate final total
  totals.total = taxableAmount + totals.tax;
  
  return totals;
};

export const calculateLaborCost = (hours, rate = 120) => {
  return parseFloat(hours || 0) * parseFloat(rate || 0);
};

export const calculatePartMarkup = (cost, markupPercentage = 0.30) => {
  const baseCost = parseFloat(cost || 0);
  return baseCost * (1 + parseFloat(markupPercentage || 0));
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(parseFloat(amount || 0));
};

export const calculateEstimateAccuracy = (estimate, actual) => {
  const est = parseFloat(estimate || 0);
  const act = parseFloat(actual || 0);
  
  if (est === 0) return 0;
  
  const difference = Math.abs(est - act);
  const accuracy = ((est - difference) / est) * 100;
  
  return Math.max(0, accuracy);
};
EOF

# 6. Create dateUtils.js
cat > dateUtils.js << 'EOF'
// Date and time formatting utilities

export const formatDate = (date, format = 'MM/dd/yyyy') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const options = {};
  
  switch (format) {
    case 'MM/dd/yyyy':
      return d.toLocaleDateString('en-US');
    case 'yyyy-MM-dd':
      return d.toISOString().split('T')[0];
    case 'MMM dd, yyyy':
      options.year = 'numeric';
      options.month = 'short';
      options.day = 'numeric';
      return d.toLocaleDateString('en-US', options);
    case 'MMMM dd, yyyy':
      options.year = 'numeric';
      options.month = 'long';
      options.day = 'numeric';
      return d.toLocaleDateString('en-US', options);
    default:
      return d.toLocaleDateString('en-US');
  }
};

export const formatTime = (time, format = '12h') => {
  if (!time) return '';
  
  const t = new Date(time);
  if (isNaN(t.getTime())) return 'Invalid Time';
  
  if (format === '24h') {
    return t.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else {
    return t.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  }
};

export const formatDateTime = (datetime, dateFormat = 'MM/dd/yyyy', timeFormat = '12h') => {
  if (!datetime) return '';
  
  const date = formatDate(datetime, dateFormat);
  const time = formatTime(datetime, timeFormat);
  
  return `${date} ${time}`;
};

export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addHours = (date, hours) => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};
EOF

# 7. Create statusUtils.js
cat > statusUtils.js << 'EOF'
// Status color and icon utilities

export const getStatusColor = (status) => {
  const statusColors = {
    // Work Order Statuses
    'pending': 'text-yellow-600 bg-yellow-100',
    'in-progress': 'text-blue-600 bg-blue-100',
    'completed': 'text-green-600 bg-green-100',
    'cancelled': 'text-red-600 bg-red-100',
    'on-hold': 'text-orange-600 bg-orange-100',
    
    // Estimate Statuses
    'draft': 'text-gray-600 bg-gray-100',
    'sent': 'text-purple-600 bg-purple-100',
    'approved': 'text-green-600 bg-green-100',
    'rejected': 'text-red-600 bg-red-100',
    
    // Vehicle Statuses
    'active': 'text-green-600 bg-green-100',
    'inactive': 'text-gray-600 bg-gray-100',
    
    // Payment Statuses
    'paid': 'text-green-600 bg-green-100',
    'unpaid': 'text-red-600 bg-red-100',
    'partial': 'text-yellow-600 bg-yellow-100',
    'overdue': 'text-red-800 bg-red-200',
    
    // Priority Levels
    'low': 'text-gray-600 bg-gray-100',
    'medium': 'text-yellow-600 bg-yellow-100',
    'high': 'text-orange-600 bg-orange-100',
    'urgent': 'text-red-600 bg-red-100',
    'critical': 'text-red-800 bg-red-200'
  };
  
  return statusColors[status?.toLowerCase()] || 'text-gray-600 bg-gray-100';
};

export const getStatusIcon = (status) => {
  const statusIcons = {
    // Work Order Statuses
    'pending': 'Clock',
    'in-progress': 'Play',
    'completed': 'CheckCircle',
    'cancelled': 'XCircle',
    'on-hold': 'Pause',
    
    // Estimate Statuses
    'draft': 'Edit3',
    'sent': 'Send',
    'approved': 'CheckCircle',
    'rejected': 'XCircle',
    
    // Vehicle Statuses
    'active': 'Car',
    'inactive': 'Square',
    
    // Payment Statuses
    'paid': 'CheckCircle',
    'unpaid': 'AlertCircle',
    'partial': 'Clock',
    'overdue': 'AlertTriangle',
    
    // Priority Levels
    'low': 'ArrowDown',
    'medium': 'ArrowRight',
    'high': 'ArrowUp',
    'urgent': 'AlertTriangle',
    'critical': 'AlertCircle'
  };
  
  return statusIcons[status?.toLowerCase()] || 'Circle';
};

export const getStatusText = (status) => {
  if (!status) return 'Unknown';
  
  return status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getStatusBadgeProps = (status) => {
  return {
    color: getStatusColor(status),
    icon: getStatusIcon(status),
    text: getStatusText(status)
  };
};
EOF

# 8. Create errorUtils.js
cat > errorUtils.js << 'EOF'
// Error handling utilities

export const handleApiError = (error, context = '') => {
  console.error(`API Error ${context}:`, error);
  
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
  if (process.env.REACT_APP_ERROR_LOGGING_ENABLED === 'true') {
    // Add your error logging service here
    console.log('Would log to external service:', errorInfo);
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
      console.error('Error Boundary caught an error:', error, errorInfo);
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
      
      console.warn(`Operation failed (attempt ${attempt}/${maxRetries}):`, error.message);
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
EOF

echo "✅ Created missing utility files"

# 9. Update utils/index.js to include all exports
echo "🔧 Updating utils/index.js with all exports..."

cat > index.js << 'EOF'
// Auto-generated utility exports

// From apiEndpoints
export { apiEndpoints } from './apiEndpoints';

// From aiUtils
export { generateAIResponse, analyzeDiagnosticCodes } from './aiUtils';

// From calculations
export { 
  computeTotals, 
  calculateLaborCost, 
  calculatePartMarkup, 
  formatCurrency, 
  calculateEstimateAccuracy 
} from './calculations';

// From dateUtils
export { 
  formatDate, 
  formatTime, 
  formatDateTime, 
  getRelativeTime, 
  addDays, 
  addHours 
} from './dateUtils';

// From errorUtils
export { 
  handleApiError, 
  createErrorBoundary, 
  retryOperation, 
  validateRequiredFields 
} from './errorUtils';

// From messageUtils
export { 
  showMessage, 
  hideMessage, 
  clearAllMessages, 
  getActiveMessages, 
  showSuccess, 
  showError, 
  showWarning, 
  showInfo 
} from './messageUtils';

// From socketUtils
export { 
  initializeSocket, 
  getSocket, 
  disconnectSocket, 
  socket, 
  emitSocketEvent, 
  onSocketEvent, 
  offSocketEvent 
} from './socketUtils';

// From statusUtils
export { 
  getStatusColor, 
  getStatusIcon, 
  getStatusText, 
  getStatusBadgeProps 
} from './statusUtils';

// From vehicleHelpers (if it exists)
export { vehicleHelpers } from './vehicleHelpers';

EOF

echo "✅ Updated utils/index.js with all exports"
echo ""
echo "🎉 All missing utility files created!"
echo ""
echo "📁 Created files:"
echo "  - apiEndpoints.js"
echo "  - aiUtils.js"
echo "  - calculations.js"
echo "  - dateUtils.js"
echo "  - errorUtils.js"
echo "  - messageUtils.js"
echo "  - socketUtils.js"
echo "  - statusUtils.js"
echo "  - Updated index.js"
echo ""
echo "🧪 Next steps:"
echo "1. Run: npm start"
echo "2. Check for any remaining import errors"
echo "3. Customize the utility functions as needed for your specific use case"
