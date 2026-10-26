import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { LocationPickerMap } from '../maps/LocationPickerMap';
import { SAFE_ZONE_TYPES } from '../../utils/constants';
import { MapPin, Navigation, ShieldCheck } from 'lucide-react';

export const SafeZoneModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  currentLocation,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Home',
    address: '',
    latitude: currentLocation?.latitude || 23.3441,
    longitude: currentLocation?.longitude || 85.3096,
    radius: 300,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'Home',
        address: initialData.address || '',
        latitude: initialData.latitude || 23.3441,
        longitude: initialData.longitude || 85.3096,
        radius: initialData.radius || 300,
      });
    } else if (currentLocation?.latitude && currentLocation?.longitude) {
      setFormData((prev) => ({
        ...prev,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      }));
    }
  }, [initialData, currentLocation, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'radius' ? parseInt(value, 10) : value,
    }));
  };

  const handleLocationSelect = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleUseCurrentGPS = () => {
    if (currentLocation?.latitude && currentLocation?.longitude) {
      setFormData((prev) => ({
        ...prev,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Safe Zone' : 'Create New Safe Zone'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Safe Zone Name *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. My Home, University Campus"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Type of Place *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            >
              {SAFE_ZONE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Street Address / Landmarks *
          </label>
          <input
            type="text"
            name="address"
            required
            placeholder="e.g. Morabadi Stadium Road, Ranchi, Jharkhand"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        {/* Radius Slider */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Safe Zone Radius: <span className="text-rose-600 dark:text-rose-400 font-extrabold">{formData.radius} meters</span>
            </span>
            <span className="text-[11px] text-slate-400">50m to 2000m</span>
          </div>
          <input
            type="range"
            name="radius"
            min="50"
            max="2000"
            step="25"
            value={formData.radius}
            onChange={handleChange}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
          />
        </div>

        {/* Interactive Map */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              Pin Center Location
            </span>
            <button
              type="button"
              onClick={handleUseCurrentGPS}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <Navigation className="w-3 h-3" />
              Use Current GPS
            </button>
          </div>
          <LocationPickerMap
            latitude={formData.latitude}
            longitude={formData.longitude}
            onLocationSelect={handleLocationSelect}
            height="200px"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 disabled:opacity-50"
          >
            {loading ? 'Saving...' : initialData ? 'Update Safe Zone' : 'Create Safe Zone'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
