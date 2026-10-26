import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (token) => {
  if (socket && socket.connected) {
    return socket;
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;

  socket = io(socketUrl, {
    auth: {
      token: token || localStorage.getItem('safewo_token'),
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('⚡ [SafeWo Socket] Connected with ID:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 [SafeWo Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('⚠️ [SafeWo Socket] Connection error:', err.message);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
