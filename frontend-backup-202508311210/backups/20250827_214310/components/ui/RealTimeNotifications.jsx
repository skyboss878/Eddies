import React, { useEffect, useState } from 'react';
import { socket } from '../../services/socket';
import { toast } from 'react-hot-toast';

toast.configure();

const RealTimeNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on('notification', (data) => {
      setNotifications((prev) => [data, ...prev]);
      toast.info(data.message);
    });
    return () => socket.off('notification');
  }, []);

  return (
    <div className="notifications-list">
      {notifications.map((n, idx) => (
        <div key={idx} className="notification">{n.message}</div>
      ))}
    </div>
  );
};

export default RealTimeNotifications;
