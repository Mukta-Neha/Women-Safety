import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { LocationPickerMap } from '../maps/LocationPickerMap';
import { INCIDENT_CATEGORIES } from '../../utils/constants';
import { MapPin, Navigation, EyeOff, AlertTriangle } from 'lucide-react';

export const ReportIncidentModal = ({
  isOpen,
  onClose,
  onSubmit,
  currentLocation,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Harassment',
    severity: 'MEDIUM',
    address: '',
    latitude: currentLocation?.latitude || 23.3441,
    longitude: currentLocation?.longitude || 85.3096,
    anonymous: false,
  });

  useEffect(() => {
    if (currentLocation?.latitude && currentLocation?.longitude) {
      setFormData((prev) => ({
        ...prev,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      }));
    }
  }, [currentLocation]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
    <Modal isOpen={isOpen} onClose={onClose} title="Report a Safety Incident" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Incident Title *
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g. Broken streetlights and catcalling near bus stand"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        {/* Category & Severity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            >
              {INCIDENT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Severity Level *
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            >
              <option value="LOW">Low (Awareness only)</option>
              <option value="MEDIUM">Medium (Caution advised)</option>
              <option value="HIGH">High (Active danger / harassment)</option>
              <option value="CRITICAL">Critical (Immediate physical threat)</option>
            </select>
          </div>
        </div>

        {/* Location Address */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Street / Area Address *
          </label>
          <input
            type="text"
            name="address"
            required
            placeholder="e.g. Main Road near GEL Church Complex, Ranchi"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        {/* Interactive Map Picker */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              Pin Exact Incident Location
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

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Detailed Description *
          </label>
          <textarea
            name="description"
            rows="3"
            required
            placeholder="Describe what occurred, time of occurrence, visual details of any individuals or vehicles involved..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        {/* Anonymous Option */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          <input
            type="checkbox"
            id="anonymous"
            name="anonymous"
            checked={formData.anonymous}
            onChange={handleChange}
            className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 border-slate-300"
          />
          <label htmlFor="anonymous" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer flex-1">
            <span className="font-bold block flex items-center gap-1">
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
              Report Anonymously
            </span>
            <span className="text-slate-500 text-[11px]">
              Your name and profile will be completely hidden from public incident viewers.
            </span>
          </label>
        </div>

        {/* Actions */}
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
            {loading ? 'Submitting...' : 'Submit Incident Report'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
