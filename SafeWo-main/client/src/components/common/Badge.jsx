import React from 'react';
import { getSeverityColor, getStatusBadge } from '../../utils/formatters';

export const SeverityBadge = ({ severity, className = '' }) => {
  const config = getSeverityColor(severity);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {severity}
    </span>
  );
};

export const StatusBadge = ({ status, className = '' }) => {
  const config = getStatusBadge(status);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {config.label}
    </span>
  );
};

export const CategoryBadge = ({ category, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 ${className}`}
    >
      {category}
    </span>
  );
};
