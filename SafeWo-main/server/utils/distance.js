/**
 * Haversine formula to calculate the distance between two coordinates in kilometers or meters
 */
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  return calculateDistanceKm(lat1, lon1, lat2, lon2) * 1000;
};

/**
 * Checks if a point (lat, lon) is within the safe zone radius (in meters)
 */
const isPointInsideSafeZone = (userLat, userLon, zoneLat, zoneLon, radiusMeters) => {
  const distance = calculateDistanceMeters(userLat, userLon, zoneLat, zoneLon);
  return distance <= radiusMeters;
};

module.exports = {
  calculateDistanceKm,
  calculateDistanceMeters,
  isPointInsideSafeZone,
};
