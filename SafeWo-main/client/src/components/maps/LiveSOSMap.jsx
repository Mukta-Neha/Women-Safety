import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DEFAULT_MAP_CENTER } from '../../utils/constants';

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 16);
    }
  }, [center, zoom, map]);
  return null;
};

const sosLiveIcon = L.divIcon({
  className: 'sos-live-marker',
  html: `
    <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(239,68,68,0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="
        position: relative;
        background-color: #dc2626;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 20px rgba(220,38,38,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      ">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="2"/>
          <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

export const LiveSOSMap = ({
  latitude,
  longitude,
  accuracy = 10,
  trail = [],
  height = '480px',
  userName = 'Emergency Contact',
}) => {
  const center = latitude && longitude ? [latitude, longitude] : DEFAULT_MAP_CENTER;

  // Format trail points
  const polylinePositions = trail.length > 0
    ? trail.map((t) => [t.latitude, t.longitude])
    : (latitude && longitude ? [[latitude, longitude]] : []);

  return (
    <div style={{ height }} className="w-full rounded-3xl overflow-hidden shadow-card border-2 border-red-500/40 relative z-0">
      <MapContainer
        center={center}
        zoom={16}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <ChangeView center={center} zoom={16} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Trail Path */}
        {polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{
              color: '#ef4444',
              weight: 4,
              dashArray: '8, 8',
              opacity: 0.7,
            }}
          />
        )}

        {/* Live SOS Marker */}
        {latitude && longitude && (
          <>
            <Marker position={[latitude, longitude]} icon={sosLiveIcon}>
              <Popup>
                <div className="p-1 text-center">
                  <span className="font-black text-xs text-red-600 block">🚨 LIVE EMERGENCY LOCATION</span>
                  <span className="text-xs font-semibold text-slate-800 block">{userName}</span>
                  <span className="text-[10px] text-slate-500 block">
                    {latitude.toFixed(5)}, {longitude.toFixed(5)}
                  </span>
                </div>
              </Popup>
            </Marker>

            <Circle
              center={[latitude, longitude]}
              radius={accuracy || 15}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.2,
                weight: 1.5,
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};
