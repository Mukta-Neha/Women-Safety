import React from 'react';
import { AlertCircle, Radio } from 'lucide-react';

export const SOSButton = ({
  onClick,
  size = 'hero',
  disabled = false,
  className = '',
  loading = false,
}) => {
  const sizeStyles = {
    sm: 'w-24 h-24 text-sm',
    md: 'w-36 h-36 text-base',
    lg: 'w-48 h-48 text-lg',
    hero: 'w-56 h-56 sm:w-64 sm:h-64 text-xl',
  };

  return (
    <div className="relative flex items-center justify-center p-4">
      {/* Outer Radar Pulse Rings */}
      <div className="absolute w-full h-full rounded-full bg-red-500/20 dark:bg-red-600/30 animate-radar" />
      <div className="absolute w-4/5 h-4/5 rounded-full bg-rose-500/25 dark:bg-rose-600/35 animate-ping-slow" />

      {/* Main SOS Trigger Button */}
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        aria-label="Send Emergency SOS Alert"
        className={`relative ${sizeStyles[size]} rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 text-white font-extrabold shadow-sos hover:shadow-sos-hover active:scale-95 transition-all duration-300 flex flex-col items-center justify-center border-4 sm:border-8 border-white dark:border-slate-900 z-10 focus:outline-none focus:ring-8 focus:ring-red-400/40 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <div className="flex items-center gap-1.5 mb-1 text-red-100">
          <Radio className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
        </div>
        <span className="tracking-wider text-2xl sm:text-3xl font-black drop-shadow-md">
          {loading ? 'SENDING...' : 'SEND SOS'}
        </span>
        <span className="text-[11px] sm:text-xs font-semibold text-rose-100 uppercase tracking-widest mt-1">
          One-Click Alert
        </span>
      </button>
    </div>
  );
};
