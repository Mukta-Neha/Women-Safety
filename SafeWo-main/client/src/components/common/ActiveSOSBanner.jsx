import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Phone, CheckCircle2, ChevronRight } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

export const ActiveSOSBanner = ({ alert, onResolve }) => {
  if (!alert) return null;

  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-lg border-b border-red-500/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Status Indicator */}
        <div className="flex items-center gap-3">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-wide uppercase">
                🚨 SOS ACTIVE
              </span>
              <span className="text-xs bg-red-900/60 px-2 py-0.5 rounded-full font-medium hidden sm:inline-block">
                Tracking live since {formatRelativeTime(alert.createdAt)}
              </span>
            </div>
            <p className="text-xs text-red-100 hidden md:block">
              Your real-time GPS location is being broadcast to emergency contacts and responders.
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-red-700 font-bold text-xs hover:bg-red-50 transition-colors shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 112</span>
          </a>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `🚨 EMERGENCY SOS ALERT!\nI need immediate assistance at my current location:\n📍 Live Map: https://maps.google.com/?q=${alert.latitude},${alert.longitude}\nPlease contact me or call 112 immediately!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-sm"
            title="Share SOS details to WhatsApp"
          >
            <span>WhatsApp SOS</span>
          </a>

          <Link
            to="/sos"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-800/80 hover:bg-red-900 text-white font-semibold text-xs transition-colors"
          >
            <span>Live Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          {onResolve && (
            <button
              onClick={onResolve}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resolve SOS</span>
              <span className="sm:hidden">Resolve</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
