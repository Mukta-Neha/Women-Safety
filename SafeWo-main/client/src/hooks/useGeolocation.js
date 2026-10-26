import { useState, useEffect, useCallback } from 'react';

// Default fallback coordinate (Ranchi city center)
const DEFAULT_FALLBACK = {
  latitude: 23.3441,
  longitude: 85.3096,
  accuracy: 15,
};

export const useGeolocation = (options = {}) => {
  const { enableWatch = false } = options;

  const [location, setLocation] = useState(() => {
    // Try restoring saved location if available
    const saved = sessionStorage.getItem('safewo_last_location');
    return saved ? JSON.parse(saved) : DEFAULT_FALLBACK;
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'prompt', 'granted', 'denied'

  // Query permission status if browser supports it
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          setPermissionStatus(result.state);
          result.onchange = () => {
            setPermissionStatus(result.state);
          };
        })
        .catch(() => {
          // Permissions API query not supported for geolocation
        });
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Using simulated location.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed,
          heading: position.coords.heading,
          timestamp: position.timestamp,
        };
        setLocation(newLocation);
        sessionStorage.setItem('safewo_last_location', JSON.stringify(newLocation));
        setPermissionStatus('granted');
        setLoading(false);
      },
      (err) => {
        let msg = 'Unable to retrieve your location.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission is required for live emergency tracking. Showing default demo coordinates.';
          setPermissionStatus('denied');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'The request to get user location timed out.';
        }
        setError(msg);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // Watch position if enableWatch is true
  useEffect(() => {
    if (!enableWatch || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed,
          heading: position.coords.heading,
          timestamp: position.timestamp,
        };
        setLocation(newLocation);
        sessionStorage.setItem('safewo_last_location', JSON.stringify(newLocation));
        setLoading(false);
      },
      (err) => {
        console.warn('Geolocation watch error:', err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enableWatch]);

  return {
    location,
    error,
    loading,
    permissionStatus,
    refreshLocation: getCurrentLocation,
    setManualLocation: (lat, lon) => {
      const manual = { latitude: lat, longitude: lon, accuracy: 10, timestamp: Date.now() };
      setLocation(manual);
      sessionStorage.setItem('safewo_last_location', JSON.stringify(manual));
    }
  };
};
