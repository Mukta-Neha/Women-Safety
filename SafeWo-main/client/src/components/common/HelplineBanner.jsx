import React from 'react';
import { Phone, AlertTriangle, ShieldCheck } from 'lucide-react';
import { HELPLINES } from '../../utils/constants';

export const HelplineBanner = ({ compact = false }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Emergency Helplines</h3>
        </div>
        <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full">
          24/7 Toll-Free
        </span>
      </div>

      {/* Helplines Grid */}
      <div className={`grid ${compact ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'} gap-3 mb-3`}>
        {HELPLINES.slice(0, compact ? 3 : 4).map((line) => (
          <a
            key={line.number}
            href={line.tel}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-all duration-150 group"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white tracking-wide">
                  {line.number}
                </span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {line.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                {line.tag}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-600 group-hover:bg-rose-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm transition-colors">
              <Phone className="w-4 h-4" />
            </div>
          </a>
        ))}
      </div>

      {/* Mandatory safety warning */}
      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs italic">
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-500" />
        <span>Emergency numbers may vary by location. Verify local emergency services.</span>
      </div>
    </div>
  );
};
