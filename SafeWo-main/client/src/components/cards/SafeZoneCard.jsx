import React from 'react';
import { ShieldCheck, MapPin, Edit3, Trash2, Home, GraduationCap, Briefcase, Building, Heart } from 'lucide-react';

export const SafeZoneCard = ({ zone, onEdit, onDelete, isUserInside }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Home':
        return <Home className="w-5 h-5" />;
      case 'College':
        return <GraduationCap className="w-5 h-5" />;
      case 'Office':
        return <Briefcase className="w-5 h-5" />;
      case 'Hostel':
        return <Building className="w-5 h-5" />;
      case 'Family House':
        return <Heart className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const inside = isUserInside || zone.isUserInside;

  return (
    <div
      className={`p-5 rounded-3xl border transition-all duration-200 ${
        inside
          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400 dark:border-emerald-800 shadow-md ring-2 ring-emerald-500/20'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-card'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              inside
                ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
            }`}
          >
            {getTypeIcon(zone.type)}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">{zone.name}</h4>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {zone.type}
            </span>
          </div>
        </div>

        {/* Inside Zone Indicator */}
        {inside && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-sm animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5" />
            Inside Safe Zone
          </span>
        )}
      </div>

      <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 mb-4">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
          <span className="truncate">{zone.address}</span>
        </div>
        <div className="font-semibold text-slate-700 dark:text-slate-300">
          Radius: <span className="font-bold text-rose-600 dark:text-rose-400">{zone.radius} meters</span>
          {zone.distanceMeters !== undefined && (
            <span className="text-slate-400 font-normal"> &bull; ~{zone.distanceMeters}m from you</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-1 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => onEdit(zone)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Edit Safe Zone"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(zone)}
          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          aria-label="Delete Safe Zone"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
