import React from 'react';

export const StatsCard = ({ title, value, subtitle, icon: Icon, color = 'rose', trend }) => {
  const colorMap = {
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-900/40',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-950/40',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-100 dark:border-red-900/40',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/40',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-100 dark:border-purple-900/40',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-900/40',
    },
  };

  const scheme = colorMap[color] || colorMap.rose;

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{subtitle}</p>
        )}
      </div>

      <div className={`p-3.5 rounded-2xl ${scheme.bg} ${scheme.text} flex-shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
