const jwt = require('jsonwebtoken');
const User = require('../models/User');

let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  // Socket middleware for JWT verification
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        // Allow unauthenticated connection for public incident map feeds
        socket.user = null;
        return next();
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'safewo_jwt_super_secret_key_2026_change_in_production'
      );

      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        socket.user = user;
      }
      next();
    } catch (err) {
      console.warn('⚠️ [SafeWo Socket] Token verification failed:', err.message);
      // Still allow connection as guest
      socket.user = null;
      next();
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user?._id?.toString();
    const userRole = socket.user?.role;

    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`🔌 [SafeWo Socket] User connected: ${socket.user.name} (${userRole}) [Socket ID: ${socket.id}]`);

      if (userRole === 'ADMIN') {
        socket.join('admin-channel');
        console.log(`🛡️ [SafeWo Socket] Admin joined admin-channel: ${socket.user.name}`);
      }
    } else {
      console.log(`🔌 [SafeWo Socket] Guest client connected [Socket ID: ${socket.id}]`);
    }

    // Client can join a specific alert room to follow live tracking
    socket.on('alert:join', (alertId) => {
      socket.join(`alert:${alertId}`);
      console.log(`📍 [SafeWo Socket] Socket ${socket.id} joined tracking room: alert:${alertId}`);
    });

    socket.on('alert:leave', (alertId) => {
      socket.leave(`alert:${alertId}`);
    });

    // Client streams live location during active SOS
    socket.on('location:send', (data) => {
      // Broadcast to admin channel and alert tracking room
      io.to('admin-channel').emit('location:updated', data);
      if (data.alertId) {
        io.to(`alert:${data.alertId}`).emit('location:updated', data);
      }
    });

    socket.on('disconnect', () => {
      // Disconnected
    });
  });

  return io;
};

// Helper methods to emit from controllers
const emitSOSCreated = (alert, user) => {
  if (!ioInstance) return;
  const payload = { alert, user };
  ioInstance.to('admin-channel').emit('sos:created', payload);
  ioInstance.emit('sos:created:public', {
    _id: alert._id,
    type: alert.type,
    latitude: alert.latitude,
    longitude: alert.longitude,
    createdAt: alert.createdAt,
    status: alert.status,
  });
};

const emitSOSUpdated = (alert) => {
  if (!ioInstance) return;
  ioInstance.to('admin-channel').emit('sos:updated', alert);
  ioInstance.to(`user:${alert.userId}`).emit('sos:updated', alert);
  ioInstance.to(`alert:${alert._id}`).emit('sos:updated', alert);
};

const emitSOSResolved = (alert) => {
  if (!ioInstance) return;
  ioInstance.to('admin-channel').emit('sos:resolved', alert);
  ioInstance.to(`user:${alert.userId}`).emit('sos:resolved', alert);
  ioInstance.to(`alert:${alert._id}`).emit('sos:resolved', alert);
  ioInstance.emit('sos:resolved:public', { _id: alert._id, status: 'RESOLVED' });
};

const emitLocationUpdate = (data) => {
  if (!ioInstance) return;
  ioInstance.to('admin-channel').emit('location:updated', data);
  if (data.alertId) {
    ioInstance.to(`alert:${data.alertId}`).emit('location:updated', data);
  }
};

const emitIncidentCreated = (incident) => {
  if (!ioInstance) return;
  ioInstance.emit('incident:created', incident);
};

const emitIncidentUpdated = (incident) => {
  if (!ioInstance) return;
  ioInstance.emit('incident:updated', incident);
};

const emitNotificationNew = (userId, notification) => {
  if (!ioInstance) return;
  ioInstance.to(`user:${userId}`).emit('notification:new', notification);
};

module.exports = {
  initSocket,
  emitSOSCreated,
  emitSOSUpdated,
  emitSOSResolved,
  emitLocationUpdate,
  emitIncidentCreated,
  emitIncidentUpdated,
  emitNotificationNew,
};
