import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ThumbsUp, Clock, Eye, AlertTriangle } from 'lucide-react';
import { SeverityBadge, CategoryBadge } from '../common/Badge';
import { formatRelativeTime } from '../../utils/formatters';

export const IncidentCard = ({ incident, onToggleHelpful, currentUserId }) => {
  const isHelpful =
    currentUserId && incident.helpfulUsers
      ? incident.helpfulUsers.some((u) => (typeof u === 'string' ? u === currentUserId : u?._id === currentUserId))
      : false;

  const helpfulCount = incident.helpfulUsers ? incident.helpfulUsers.length : 0;

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card hover:border-rose-300/80 dark:hover:border-rose-900/60 transition-all flex flex-col justify-between">
      <div>
        {/* Badges Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <CategoryBadge category={incident.category} />
            <SeverityBadge severity={incident.severity} />
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatRelativeTime(incident.createdAt)}</span>
          </div>
        </div>

        {/* Title */}
        <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2 leading-snug hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
          <Link to={`/incidents/${incident._id}`}>{incident.title}</Link>
        </h4>

        {/* Location / Address */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
          <span className="truncate">{incident.address}</span>
          {incident.distanceKm !== undefined && (
            <span className="text-rose-600 dark:text-rose-400 font-semibold flex-shrink-0">
              &bull; {incident.distanceKm} km away
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {incident.description}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => onToggleHelpful && onToggleHelpful(incident._id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors ${
            isHelpful
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          aria-label="Mark incident as helpful"
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${isHelpful ? 'fill-rose-600' : ''}`} />
          <span>Helpful ({helpfulCount})</span>
        </button>

        <Link
          to={`/incidents/${incident._id}`}
          className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 hover:underline"
        >
          <span>Details</span>
          <Eye className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
