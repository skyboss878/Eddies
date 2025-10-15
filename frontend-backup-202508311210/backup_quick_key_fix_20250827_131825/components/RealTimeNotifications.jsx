import React, { useState, useEffect } from 'react';

const RealTimeNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const notification = {
          id: Date.now(),
          message: 'New job update available',
          type: 'info',
          time: new Date()
        };
        
        setNotifications(prev => [notification, ...prev.slice(0, 4)]);
        
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-blue-500 text-white p-4 rounded-lg shadow-lg max-w-sm animate-slide-in-right"
        >
          <p className="font-medium text-sm">{notification.message}</p>
          <p className="text-xs opacity-75 mt-1">
            {notification.time.toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RealTimeNotifications;
