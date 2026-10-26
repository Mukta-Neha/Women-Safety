import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initSocket, disconnectSocket } from '../services/socket';
import { setActiveAlert, updateActiveAlertLocation, clearActiveAlert } from '../redux/slices/alertSlice';
import { addLiveIncident, updateLiveIncident } from '../redux/slices/incidentSlice';
import { addLiveNotification } from '../redux/slices/notificationSlice';

export const useSocketEvents = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) return;

    const socket = initSocket(token);

    // SOS Created (for admin monitoring or contacts)
    socket.on('sos:created', (data) => {
      console.log('🚨 [Socket Event] SOS Created:', data);
      if (user?.role === 'ADMIN') {
        dispatch(
          addLiveNotification({
            _id: Date.now().toString(),
            type: 'SOS',
            title: '🚨 Emergency SOS Triggered',
            message: `${data.user?.name || 'A user'} triggered an emergency alert!`,
            read: false,
            createdAt: new Date().toISOString(),
          })
        );
      }
    });

    // SOS Updated
    socket.on('sos:updated', (data) => {
      if (data.status === 'RESOLVED' || data.status === 'CANCELLED') {
        dispatch(clearActiveAlert());
      } else {
        dispatch(setActiveAlert(data));
      }
    });

    // SOS Resolved
    socket.on('sos:resolved', (data) => {
      console.log('✅ [Socket Event] SOS Resolved:', data);
      dispatch(clearActiveAlert());
    });

    // Live Location streaming
    socket.on('location:updated', (data) => {
      dispatch(updateActiveAlertLocation(data));
    });

    // Incident Created
    socket.on('incident:created', (incident) => {
      console.log('📍 [Socket Event] Incident Created:', incident);
      dispatch(addLiveIncident(incident));
    });

    // Incident Updated
    socket.on('incident:updated', (incident) => {
      dispatch(updateLiveIncident(incident));
    });

    // New In-App Notification
    socket.on('notification:new', (notif) => {
      console.log('🔔 [Socket Event] New Notification:', notif);
      dispatch(addLiveNotification(notif));
    });

    return () => {
      socket.off('sos:created');
      socket.off('sos:updated');
      socket.off('sos:resolved');
      socket.off('location:updated');
      socket.off('incident:created');
      socket.off('incident:updated');
      socket.off('notification:new');
    };
  }, [token, user, dispatch]);
};
