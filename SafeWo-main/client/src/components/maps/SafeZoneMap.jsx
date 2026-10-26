import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../../utils/constants';

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
};

const safeZoneIcon = L.divIcon({
  className: 'safezone-pin',
  html: `
    <div style="
      background-color: #10b981;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 10px rgba(16,185,129,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const userLocationIcon = L.divIcon({
  className: 'user-pin',
  html: `
    <div style="
      background-color: #3b82f6;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 12px rgba(59,130,246,0.8);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export const SafeZoneMap = ({
  safeZones = [],
  userLocation,
  center,
  zoom = DEFAULT_MAP_ZOOM,
  height = '450px',
}) => {
  const mapCenter = center || (userLocation ? [userLocation.latitude, userLocation.longitude] : DEFAULT_MAP_CENTER);

  return (
    <div style={{ height }} className="w-full rounded-3xl overflow-hidden shadow-card border border-slate-200/80 dark:border-slate-800 relative z-0">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <ChangeView center={mapCenter} zoom={zoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location */}
        {userLocation && userLocation.latitude && userLocation.longitude && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userLocationIcon}
          >
            <Popup>
              <span className="font-bold text-xs text-blue-600">You Are Here</span>
            </Popup>
          </Marker>
        )}

        {/* Safe Zones with Geofenced Radius Circles */}
        {safeZones.map((zone) => {
          if (!zone.latitude || !zone.longitude) return null;

          return (
            <React.Fragment key={zone._id}>
              <Marker position={[zone.latitude, zone.longitude]} icon={safeZoneIcon}>
                <Popup>
                  <div className="p-1 min-w-[160px]">
                    <span className="font-bold text-xs text-slate-900 block">{zone.name}</span>
                    <span className="text-[11px] text-emerald-600 font-semibold block">{zone.type} Safe Zone</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{zone.address}</span>
                    <span className="text-[10px] font-bold text-slate-700 block mt-1">Radius: {zone.radius}m</span>
                  </div>
                </Popup>
              </Marker>

              <Circle
                center={[zone.latitude, zone.longitude]}
                radius={zone.radius || 200}
                pathOptions={{
                  color: '#10b981',
                  fillColor: '#10b981',
                  fillOpacity: 0.2,
                  weight: 2,
                }}
              />
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};
