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
