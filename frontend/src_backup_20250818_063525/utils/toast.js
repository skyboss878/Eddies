// src/utils/toast.js - Simple toast notification system
let toastContainer = null;

// Create toast container if it doesn't exist
const createToastContainer = () => {
  if (toastContainer) return toastContainer;
  
  toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
  toastContainer.style.cssText = `
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 9999;
    pointer-events: none;
  `;
  
  document.body.appendChild(toastContainer);
  return toastContainer;
};

// Show toast message
export const showMessage = (message, type = 'info', duration = 5000) => {
  const container = createToastContainer();
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `transform transition-all duration-300 ease-in-out translate-x-full opacity-0 pointer-events-auto`;
  
  // Set styles based on type
  let bgColor, textColor, icon;
  switch (type) {
    case 'success':
      bgColor = 'bg-green-500';
      textColor = 'text-white';
      icon = '✓';
      break;
    case 'error':
      bgColor = 'bg-red-500';
      textColor = 'text-white';
      icon = '✕';
      break;
    case 'warning':
      bgColor = 'bg-yellow-500';
      textColor = 'text-white';
      icon = '⚠';
      break;
    default:
      bgColor = 'bg-blue-500';
      textColor = 'text-white';
      icon = 'ℹ';
  }
  
  toast.innerHTML = `
    <div class="flex items-center px-6 py-4 rounded-lg shadow-lg ${bgColor} ${textColor} min-w-80 max-w-md">
      <span class="text-xl mr-3">${icon}</span>
      <div class="flex-1">
        <p class="text-sm font-medium">${message}</p>
      </div>
      <button class="ml-4 text-white/80 hover:text-white" onclick="this.parentElement.parentElement.remove()">
        <span class="text-lg">×</span>
      </button>
    </div>
  `;
  
  container.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.className = `transform transition-all duration-300 ease-in-out translate-x-0 opacity-100 pointer-events-auto`;
  }, 10);
  
  // Auto remove after duration
  setTimeout(() => {
    toast.className = `transform transition-all duration-300 ease-in-out translate-x-full opacity-0 pointer-events-auto`;
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
  
  return toast;
};

// Convenience methods
export const showSuccess = (message, duration) => showMessage(message, 'success', duration);
export const showError = (message, duration) => showMessage(message, 'error', duration);
export const showWarning = (message, duration) => showMessage(message, 'warning', duration);
export const showInfo = (message, duration) => showMessage(message, 'info', duration);

// Clear all toasts
export const clearAllToasts = () => {
  if (toastContainer) {
    toastContainer.innerHTML = '';
  }
};

export default {
  showMessage,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  clearAllToasts
};
