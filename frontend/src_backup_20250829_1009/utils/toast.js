import toast from 'react-hot-toast';

export const showMessage = (message, type = 'info', options = {}) => {
  const defaultOptions = {
    duration: 4000,
    position: 'top-right',
    ...options,
  };

  switch (type) {
    case 'success':
      return toast.success(message, defaultOptions);
    case 'error':
      return toast.error(message, defaultOptions);
    case 'loading':
      return toast.loading(message, defaultOptions);
    case 'info':
    default:
      return toast(message, defaultOptions);
  }
};

export const showSuccess = (message, options = {}) => {
  return showMessage(message, 'success', options);
};

export const showError = (message, options = {}) => {
  return showMessage(message, 'error', options);
};

export const showLoading = (message, options = {}) => {
  return showMessage(message, 'loading', options);
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

export const dismissAllToasts = () => {
  toast.dismiss();
};

export const promiseToast = (promise, messages = {}) => {
  const defaultMessages = {
    loading: 'Loading...',
    success: 'Success!',
    error: 'Something went wrong',
    ...messages,
  };

  return toast.promise(promise, defaultMessages);
};

export default {
  showMessage,
  showSuccess,
  showError,
  showLoading,
  dismissToast,
  dismissAllToasts,
  promiseToast,
};
