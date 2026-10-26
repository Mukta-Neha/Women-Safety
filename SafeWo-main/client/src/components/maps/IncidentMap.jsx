import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { SeverityBadge, CategoryBadge } from '../common/Badge';
import { formatRelativeTime } from '../../utils/formatters';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../../utils/constants';

// Helper component to center map on coordinates
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
};

// Create custom colored DivIcon for Leaflet markers
const createIncidentIcon = (severity) => {
  const colors = {
    CRITICAL: '#ef4444',
    HIGH: '#f97316',
    MEDIUM: '#f59e0b',
    LOW: '#10b981',
  };
  const color = colors[severity?.toUpperCase()] || '#e11d48';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
        font-weight: bold;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      background-color: #2563eb;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 15px rgba(37,99,235,0.6);
    "></div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export const IncidentMap = ({
  incidents = [],
  userLocation,
  center,
  zoom = DEFAULT_MAP_ZOOM,
  height = '500px',
  onMarkerClick,
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

        {/* User Current Location Marker */}
        {userLocation && userLocation.latitude && userLocation.longitude && (
          <>
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={userLocationIcon}
            >
              <Popup>
                <div className="text-center p-1">
                  <span className="font-bold text-xs text-blue-600">Your Current Location</span>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              radius={userLocation.accuracy || 40}
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.15,
                weight: 1,
              }}
            />
          </>
        )}

        {/* Incident Markers */}
        {incidents.map((incident) => {
          if (!incident.latitude || !incident.longitude) return null;

          return (
            <Marker
              key={incident._id}
              position={[incident.latitude, incident.longitude]}
              icon={createIncidentIcon(incident.severity)}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(incident),
              }}
            >
              <Popup className="custom-incident-popup">
                <div className="p-1 min-w-[200px] max-w-[260px]">
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <CategoryBadge category={incident.category} />
                    <SeverityBadge severity={incident.severity} />
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 mb-1 leading-snug">
                    {incident.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 mb-2 truncate">
                    {incident.address}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-t pt-1.5">
                    <span>{formatRelativeTime(incident.createdAt)}</span>
                    <Link
                      to={`/incidents/${incident._id}`}
                      className="font-bold text-rose-600 hover:underline"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
