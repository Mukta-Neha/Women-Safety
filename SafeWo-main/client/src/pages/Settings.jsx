import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Sun,
  Moon,
  MapPin,
  Bell,
  Lock,
  ShieldCheck,
  Smartphone,
  Info,
} from 'lucide-react';
import { toggleTheme, setTheme } from '../redux/slices/themeSlice';
import { useGeolocation } from '../hooks/useGeolocation';

export const Settings = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const { permissionStatus, refreshLocation, location } = useGeolocation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Application Settings & Privacy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your experience, display modes, and privacy configurations.
        </p>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          {mode === 'dark' ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
          Display & Appearance
        </h3>

        <div className="grid grid-cols-2 gap-4 max-w-sm">
          <button
            type="button"
            onClick={() => dispatch(setTheme('light'))}
            className={`p-4 rounded-2xl border text-center transition-all ${
              mode === 'light'
                ? 'border-rose-600 bg-rose-50/50 dark:bg-rose-950/20 font-bold text-rose-600 ring-2 ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Sun className="w-6 h-6 mx-auto mb-2 text-amber-500" />
            <span className="text-xs">Light Mode</span>
          </button>

          <button
            type="button"
            onClick={() => dispatch(setTheme('dark'))}
            className={`p-4 rounded-2xl border text-center transition-all ${
              mode === 'dark'
                ? 'border-rose-600 bg-rose-50/50 dark:bg-rose-950/20 font-bold text-rose-600 ring-2 ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Moon className="w-6 h-6 mx-auto mb-2 text-indigo-400" />
            <span className="text-xs">Dark Mode</span>
          </button>
        </div>
      </div>

      {/* Geolocation Permissions Diagnostic */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-rose-600" />
          Location Access & GPS Permissions
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
          High-accuracy GPS access is required for real-time SOS broadcasting and safe zone detection.
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Permission Status:</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  permissionStatus === 'granted'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : permissionStatus === 'denied'
                    ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
              >
                {permissionStatus}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Active Coordinates: {location?.latitude?.toFixed(4)}, {location?.longitude?.toFixed(4)}
            </p>
          </div>

          <button
            type="button"
            onClick={refreshLocation}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Re-query Location
          </button>
        </div>
      </div>

      {/* Privacy Policy Principles */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          SafeWo Privacy Commitments
        </h3>

        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
            <strong className="text-slate-900 dark:text-white block mb-0.5">
              1. Never Expose Private Home Locations
            </strong>
            Your exact home, college, or hostel coordinates are never visible publicly on any public feeds.
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
            <strong className="text-slate-900 dark:text-white block mb-0.5">
              2. On-Demand Emergency Sharing Only
            </strong>
            Live GPS tracking is ONLY transmitted when you explicitly click "SEND SOS" and stays active only until you resolve the alert.
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
            <strong className="text-slate-900 dark:text-white block mb-0.5">
              3. Anonymous Reporting Protection
            </strong>
            When reporting safety incidents, toggling "Report Anonymously" permanently shields your identity from community members.
          </div>
        </div>
      </div>
    </div>
  );
};
