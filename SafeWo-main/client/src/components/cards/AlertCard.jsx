import React from 'react';
import { ShieldAlert, MapPin, Clock, Users, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../common/Badge';
import { formatDate, formatRelativeTime } from '../../utils/formatters';

export const AlertCard = ({ alert, onResolve, onView }) => {
  const isResolved = alert.status === 'RESOLVED';
  const isActive = alert.status === 'ACTIVE' || alert.status === 'ACKNOWLEDGED';

  return (
    <div
      className={`p-5 rounded-3xl border transition-all ${
        isActive
          ? 'bg-red-50/50 dark:bg-red-950/20 border-red-300 dark:border-red-800 shadow-md ring-2 ring-red-500/20'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-card'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              isActive
                ? 'bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-300 animate-pulse'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                {alert.type || 'SOS'} Emergency Alert
              </h4>
              <StatusBadge status={alert.status} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatDate(alert.createdAt)} ({formatRelativeTime(alert.createdAt)})
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 mb-3 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 font-medium">
        "{alert.message}"
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
          <span>
            {alert.latitude?.toFixed(4)}, {alert.longitude?.toFixed(4)} (±{Math.round(alert.accuracy || 10)}m)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
          <span>
            {alert.emergencyContactsNotified?.length || 0} Contacts Notified
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        {alert.resolvedAt && (
          <span className="text-slate-400 text-[11px]">
            Resolved at {formatDate(alert.resolvedAt)}
          </span>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {isActive && onResolve && (
            <button
              type="button"
              onClick={() => onResolve(alert)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Resolved</span>
            </button>
          )}

          {onView && (
            <button
              type="button"
              onClick={() => onView(alert)}
              className="px-3 py-1.5 rounded-xl font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              View on Map
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
