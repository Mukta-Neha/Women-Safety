import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sparkles, AlertTriangle, Users, User, Radio } from 'lucide-react';

export const MobileNav = ({ onSOSTrigger }) => {
  const location = useLocation();

  const items = [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Toolkit', path: '/toolkit', icon: Sparkles },
    { label: 'SOS', isSOS: true },
    { label: 'Incidents', path: '/incidents', icon: AlertTriangle },
    { label: 'Contacts', path: '/contacts', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item, idx) => {
          if (item.isSOS) {
            return (
              <div key="sos-mobile" className="relative -top-5 flex flex-col items-center">
                <button
                  type="button"
                  onClick={onSOSTrigger}
                  aria-label="Send Emergency SOS"
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-red-500/40 border-4 border-white dark:border-slate-900 active:scale-95 transition-transform"
                >
                  <Radio className="w-6 h-6 animate-pulse" />
                </button>
                <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 mt-1 uppercase tracking-wider">
                  SOS
                </span>
              </div>
            );
          }

          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-1 text-center transition-colors ${
                isActive
                  ? 'text-rose-600 dark:text-rose-400 font-bold'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[11px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
