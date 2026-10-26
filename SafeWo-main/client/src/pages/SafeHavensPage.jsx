import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Shield,
  MapPin,
  Building2,
  Phone,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
  Plus,
  Navigation,
  Compass,
  CheckCircle2,
  HeartHandshake,
  AlertTriangle,
  Lightbulb,
  X,
} from 'lucide-react';
import api from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const ChangeMapView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);
  return null;
};

// Custom Marker Icons for Haven Types
const createHavenIcon = (category) => {
  const colors = {
    Police: '#2563eb', // Blue
    Hospital: '#ef4444', // Red
    Pharmacy: '#10b981', // Green
    Transit: '#8b5cf6', // Purple
    Shelter: '#e11d48', // Rose
    Store: '#f59e0b', // Amber
  };
  const color = colors[category] || '#2563eb';

  return L.divIcon({
    className: 'custom-haven-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20],
  });
};

const userGpsIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `
    <div style="
      background-color: #e11d48;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 0 6px rgba(225, 29, 72, 0.35);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export const SafeHavensPage = () => {
  const { location: coords } = useGeolocation();

  const [havens, setHavens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHaven, setSelectedHaven] = useState(null);

  // Route Safety Evaluator states
  const [originText, setOriginText] = useState('Current GPS Location');
  const [destText, setDestText] = useState('');
  const [evaluatingRoute, setEvaluatingRoute] = useState(false);
  const [routeScoreData, setRouteScoreData] = useState(null);

  // Suggest Haven Modal
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [newHavenName, setNewHavenName] = useState('');
  const [newHavenCat, setNewHavenCat] = useState('Police');
  const [newHavenAddress, setNewHavenAddress] = useState('');
  const [newHavenPhone, setNewHavenPhone] = useState('');
  const [submittingHaven, setSubmittingHaven] = useState(false);

  useEffect(() => {
    loadHavens();
  }, [selectedCategory, coords.latitude, coords.longitude]);

  const loadHavens = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (coords.latitude && coords.longitude) {
        params.userLat = coords.latitude;
        params.userLon = coords.longitude;
      }

      const res = await api.get('/safe-havens', { params });
      if (res.data?.data) {
        setHavens(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching safe havens:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateRoute = async (e) => {
    e.preventDefault();
    if (!destText.trim()) return;

    try {
      setEvaluatingRoute(true);
      const res = await api.post('/safe-havens/route-score', {
        originLat: coords.latitude || 28.6139,
        originLon: coords.longitude || 77.209,
        destLat: (coords.latitude || 28.6139) + 0.025,
        destLon: (coords.longitude || 77.209) + 0.02,
      });

      if (res.data?.data) {
        setRouteScoreData(res.data.data);
      }
    } catch (err) {
      console.error('Route evaluation error:', err);
    } finally {
      setEvaluatingRoute(false);
    }
  };

  const handleSuggestHaven = async (e) => {
    e.preventDefault();
    if (!newHavenName.trim() || !newHavenAddress.trim()) return;

    try {
      setSubmittingHaven(true);
      await api.post('/safe-havens', {
        name: newHavenName,
        category: newHavenCat,
        address: newHavenAddress,
        contactPhone: newHavenPhone || '112',
        latitude: coords.latitude || 28.6139,
        longitude: coords.longitude || 77.209,
      });

      alert('Safe Haven submitted successfully! Thank you for protecting the community.');
      setIsSuggestModalOpen(false);
      setNewHavenName('');
      setNewHavenAddress('');
      setNewHavenPhone('');
      loadHavens();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit haven');
    } finally {
      setSubmittingHaven(false);
    }
  };

  const defaultCenter = [
    coords.latitude || (havens[0]?.latitude ? havens[0].latitude : 28.6139),
    coords.longitude || (havens[0]?.longitude ? havens[0].longitude : 77.209),
  ];

  const categories = ['All', 'Police', 'Hospital', 'Pharmacy', 'Transit', 'Shelter'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-700/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" />
              Verified 24/7 Safe Points & Route Heatmap
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Safe Haven & Route Finder</h1>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl mt-1">
              Locate nearby 24/7 staffed, well-lit safe havens (Police Kiosks, 24/7 Pharmacies, Hospitals, CISF Metro Posts, and Women Crisis Shelters).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsSuggestModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-white text-blue-900 font-bold text-xs shadow-lg hover:bg-blue-50 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-blue-700" />
            Suggest Safe Spot
          </button>
        </div>
      </div>

      {/* ROUTE SAFETY EVALUATOR SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-rose-600" />
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Route Safety Score Evaluator</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Analyze safety factors, street lighting, safe haven coverage, and past incidents along any corridor.
        </p>

        <form onSubmit={handleEvaluateRoute} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={originText}
            onChange={(e) => setOriginText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Starting Point (e.g. My Current GPS)"
            required
          />
          <input
            type="text"
            value={destText}
            onChange={(e) => setDestText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            placeholder="Destination (e.g. Connaught Place, Ranchi Station)"
            required
          />
          <button
            type="submit"
            disabled={evaluatingRoute}
            className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 active:scale-95 transition-all"
          >
            {evaluatingRoute ? 'Evaluating...' : 'Score Route'}
          </button>
        </form>

        {/* Evaluation Result Card */}
        {routeScoreData && (
          <div className="mt-4 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl text-white font-black text-xl flex items-center justify-center shadow-lg ${
                    routeScoreData.safetyScore >= 75
                      ? 'bg-emerald-600 shadow-emerald-600/30'
                      : routeScoreData.safetyScore >= 50
                      ? 'bg-amber-500 shadow-amber-500/30'
                      : 'bg-rose-600 shadow-rose-600/30'
                  }`}
                >
                  {routeScoreData.safetyScore}%
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">Safety Index:</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-black ${
                        routeScoreData.riskLevel === 'SAFE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : routeScoreData.riskLevel === 'MODERATE'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {routeScoreData.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{routeScoreData.summary}</p>
                </div>
              </div>

              <div className="flex gap-4 text-xs text-slate-500">
                <div>
                  <span>Distance:</span>{' '}
                  <strong className="text-slate-800 dark:text-slate-200">{routeScoreData.totalDistanceKm} km</strong>
                </div>
                <div>
                  <span>Walk ETA:</span>{' '}
                  <strong className="text-slate-800 dark:text-slate-200">{routeScoreData.estimatedMinutesWalk}m</strong>
                </div>
                <div>
                  <span>Drive ETA:</span>{' '}
                  <strong className="text-slate-800 dark:text-slate-200">{routeScoreData.estimatedMinutesDrive}m</strong>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Route Safety Advisory:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                {routeScoreData.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* FILTER PILLS & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Proximity / Count Info */}
        <span className="text-xs text-slate-500 self-end sm:self-center font-medium">
          Showing <strong>{havens.length}</strong> verified safe havens
        </span>
      </div>

      {/* MAP & CARDS SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Leaflet Map (7 cols) */}
        <div className="lg:col-span-7 h-[500px] bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-card relative">
          <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={true} className="w-full h-full">
            <ChangeMapView center={defaultCenter} zoom={13} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User GPS Pin */}
            {coords.latitude && coords.longitude && (
              <Marker position={[coords.latitude, coords.longitude]} icon={userGpsIcon}>
                <Popup>
                  <strong className="text-xs">Your Current Location</strong>
                </Popup>
              </Marker>
            )}

            {/* Haven Markers */}
            {havens.map((h) => (
              <Marker
                key={h._id}
                position={[h.latitude, h.longitude]}
                icon={createHavenIcon(h.category)}
                eventHandlers={{
                  click: () => setSelectedHaven(h),
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1 text-xs">
                    <strong className="text-sm font-bold block">{h.name}</strong>
                    <span className="text-[10px] font-semibold uppercase text-blue-600 dark:text-blue-400">
                      {h.category} • 24/7 Verified Safe Spot
                    </span>
                    <p className="text-slate-600">{h.address}</p>
                    <div className="pt-1 flex gap-2">
                      <a
                        href={`tel:${h.contactPhone}`}
                        className="px-2 py-1 rounded bg-blue-600 text-white font-bold text-[11px]"
                      >
                        Call {h.contactPhone}
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Haven Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {loading ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : havens.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No safe havens found for this category.</p>
            </div>
          ) : (
            havens.map((h) => {
              const isSel = selectedHaven?._id === h._id;
              return (
                <div
                  key={h._id}
                  onClick={() => setSelectedHaven(h)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                    isSel
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {h.category}
                        </span>
                        {h.is24x7 && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 24/7 Open
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">{h.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{h.address}</p>
                    </div>

                    {h.distanceKm !== undefined && (
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-black text-blue-600">{h.distanceKm} km</span>
                        <span className="block text-[10px] text-slate-400">
                          ~{Math.round(h.distanceKm * 12)}m walk
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Feature badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                    {h.features?.slice(0, 3).map((feat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 mt-3 pt-2">
                    <a
                      href={`tel:${h.contactPhone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call {h.contactPhone}
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-500" />
                      Directions
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SUGGEST SAFE SPOT MODAL */}
      {isSuggestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Suggest a Safe Haven Spot
              </h3>
              <button
                onClick={() => setIsSuggestModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSuggestHaven} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Place Name</label>
                <input
                  type="text"
                  placeholder="e.g. 24/7 MedPlus Pharmacy, Pink Booth"
                  value={newHavenName}
                  onChange={(e) => setNewHavenName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={newHavenCat}
                  onChange={(e) => setNewHavenCat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                >
                  <option value="Police">Police Post / Booth</option>
                  <option value="Pharmacy">24/7 Pharmacy</option>
                  <option value="Hospital">Hospital / Clinic</option>
                  <option value="Transit">Transit / Metro Helpdesk</option>
                  <option value="Shelter">Women's Crisis Shelter</option>
                  <option value="Store">24/7 Staffed Store</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Full Address</label>
                <input
                  type="text"
                  placeholder="e.g. Circular Road, Lalpur, Ranchi"
                  value={newHavenAddress}
                  onChange={(e) => setNewHavenAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. 112 or local desk number"
                  value={newHavenPhone}
                  onChange={(e) => setNewHavenPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSuggestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingHaven}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/30"
                >
                  {submittingHaven ? 'Submitting...' : 'Submit Haven'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
