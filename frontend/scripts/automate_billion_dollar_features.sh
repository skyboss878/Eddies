#!/bin/bash
# automate_billion_dollar_features.sh
# This script wires MobileNavigation, RealTimeNotifications, and WebSocket updates

echo "🚀 Starting billion-dollar frontend wiring..."

# 1️⃣ Ensure required dependencies are installed
echo "📦 Installing frontend dependencies..."
npm install socket.io-client react-icons react-toastify

# 2️⃣ Create MobileNavigation component
echo "📱 Creating MobileNavigation component..."
mkdir -p src/components/layout
cat > src/components/layout/MobileNavigation.jsx <<EOL
import React from 'react';
import { FaHome, FaCar, FaBell } from 'react-icons/fa';
import './MobileNavigation.css';

const MobileNavigation = ({ active, setActive }) => {
  return (
    <nav className="mobile-nav">
      <button onClick={() => setActive('dashboard')} className={active==='dashboard'?'active':''}><FaHome /></button>
      <button onClick={() => setActive('jobs')} className={active==='jobs'?'active':''}><FaCar /></button>
      <button onClick={() => setActive('notifications')} className={active==='notifications'?'active':''}><FaBell /></button>
    </nav>
  );
};

export default MobileNavigation;
EOL

# 3️⃣ Create WebSocket service
echo "🌐 Creating WebSocket service..."
mkdir -p src/services
cat > src/services/socket.js <<EOL
import { io } from 'socket.io-client';
const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
export const socket = io(SOCKET_URL, { transports: ['websocket'] });
EOL

# 4️⃣ Create RealTimeNotifications component
echo "🔔 Creating RealTimeNotifications component..."
mkdir -p src/components/ui
cat > src/components/ui/RealTimeNotifications.jsx <<EOL
import React, { useEffect, useState } from 'react';
import { socket } from '../../services/socket';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
EOL

# 5️⃣ Inject MobileNavigation and RealTimeNotifications into main App.jsx
echo "🧩 Wiring components into App.jsx..."
APP_FILE="src/App.jsx"
if [ -f "$APP_FILE" ]; then
  sed -i "/import React from 'react';/a import MobileNavigation from './components/layout/MobileNavigation';\nimport RealTimeNotifications from './components/ui/RealTimeNotifications';" $APP_FILE

  sed -i "/return (</a \    <MobileNavigation active={activeTab} setActive={setActiveTab} />\n    <RealTimeNotifications />" $APP_FILE
else
  echo "⚠️ App.jsx not found! Please integrate MobileNavigation and RealTimeNotifications manually."
fi

echo "✅ Billion-dollar frontend wiring complete!"
echo "📱 MobileNavigation, RealTimeNotifications, and WebSocket are ready."
echo "🚀 You can now run: npm run dev"
