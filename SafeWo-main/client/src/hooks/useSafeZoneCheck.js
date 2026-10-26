import { useMemo } from 'react';

const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const useSafeZoneCheck = (userCoords, safeZones = []) => {
  return useMemo(() => {
    if (!userCoords || !userCoords.latitude || !userCoords.longitude || !safeZones.length) {
      return { isInside: false, activeZone: null, distance: null };
    }

    const { latitude: uLat, longitude: uLon } = userCoords;

    for (const zone of safeZones) {
      const dist = calculateDistanceMeters(uLat, uLon, zone.latitude, zone.longitude);
      if (dist <= zone.radius) {
        return {
          isInside: true,
          activeZone: zone,
          distance: Math.round(dist),
        };
      }
    }

    return { isInside: false, activeZone: null, distance: null };
  }, [userCoords, safeZones]);
};
