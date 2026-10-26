import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DEFAULT_MAP_CENTER } from '../../utils/constants';

const pickerIcon = L.divIcon({
  className: 'picker-pin',
  html: `
    <div style="
      background-color: #e11d48;
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(225,29,72,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const ChangeCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

export const LocationPickerMap = ({
  latitude,
  longitude,
  onLocationSelect,
  height = '280px',
}) => {
  const position = latitude && longitude ? [latitude, longitude] : DEFAULT_MAP_CENTER;

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative z-0">
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <ChangeCenter center={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        {latitude && longitude && (
          <Marker position={[latitude, longitude]} icon={pickerIcon} />
        )}
      </MapContainer>
      <div className="absolute bottom-2 left-2 right-2 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 font-medium text-center shadow-sm pointer-events-none">
        Click anywhere on the map to set exact pin location
      </div>
    </div>
  );
};
