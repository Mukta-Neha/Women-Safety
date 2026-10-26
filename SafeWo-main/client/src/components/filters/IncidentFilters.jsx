import React from 'react';
import { Search, Filter, RotateCcw, SlidersHorizontal, MapPin } from 'lucide-react';
import { INCIDENT_CATEGORIES } from '../../utils/constants';

export const IncidentFilters = ({
  filters,
  onFilterChange,
  onReset,
  hasLocation = false,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-card mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-rose-600" />
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Filter & Search Incidents</h4>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Keyword */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search keywords, street..."
            value={filters.keyword || ''}
            onChange={(e) => onFilterChange({ keyword: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <select
            value={filters.category || 'ALL'}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          >
            <option value="ALL">All Categories</option>
            {INCIDENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Severity Dropdown */}
        <div>
          <select
            value={filters.severity || 'ALL'}
            onChange={(e) => onFilterChange({ severity: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          >
            <option value="ALL">All Severities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          >
            <option value="newest">Sort: Most Recent</option>
            {hasLocation && <option value="distance">Sort: Nearest Distance</option>}
          </select>
        </div>
      </div>
    </div>
  );
};
