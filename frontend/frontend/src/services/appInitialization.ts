export const initializeApp = async () => {
  try {
    // Initialize service worker for PWA
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    }

    // Initialize WebSocket connection
    if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
      initializeWebSocket();
    }

    // Initialize notifications
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    console.log('✅ App initialization complete');
  } catch (error) {
    console.error('❌ App initialization failed:', error);
  }
};

const initializeWebSocket = () => {
  // WebSocket connection will be handled by individual components as needed
  console.log('🔌 WebSocket initialization ready');
};
