// Socket.IO utilities
import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (serverUrl = 'http://192.168.1.26:5000') => {
  if (!socket) {
    socket = io(serverUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });
    
    // Set up default event listeners
    socket.on('connect', () => {
    });
    
    socket.on('disconnect', (reason) => {
    });
    
    socket.on('error', (error) => {
    });
  }
  
  return socket;
};

export const getSocket = () => {
  if (!socket) {
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
