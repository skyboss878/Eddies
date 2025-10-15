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
