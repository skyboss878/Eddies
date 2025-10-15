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
