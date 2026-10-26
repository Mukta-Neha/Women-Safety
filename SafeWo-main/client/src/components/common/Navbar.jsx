import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Shield,
  Radio,
  Sun,
  Moon,
  Bell,
  User,
  LogOut,
  Settings,
  ShieldCheck,
  Menu,
  X,
  MapPin,
  ChevronDown,
  PhoneCall,
  EyeOff,
  Calculator,
  Navigation,
  Scale,
  Sparkles,
} from 'lucide-react';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { logout } from '../../redux/slices/authSlice';
import { NotificationDropdown } from './NotificationDropdown';

export const Navbar = ({ onOpenFakeCall, onToggleCloak }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const { unreadCount } = useSelector((state) => state.notification);
  const { activeAlert } = useSelector((state) => state.alert);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', authRequired: true },
    { label: 'SOS Alert', path: '/sos', authRequired: true, highlight: true },
    { label: 'Toolkit', path: '/toolkit', badge: 'New' },
    { label: 'Safe Journey', path: '/safe-journey', authRequired: true },
    { label: 'Safe Havens', path: '/safe-havens' },
    { label: 'Legal Rights', path: '/legal-rights' },
    { label: 'Incidents', path: '/incidents' },
    { label: 'Contacts', path: '/contacts', authRequired: true },
    { label: 'Safe Zones', path: '/safe-zones', authRequired: true },
    { label: 'Alert History', path: '/alerts', authRequired: true },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Safe<span className="text-rose-600">Wo</span>
                </span>
                {activeAlert && (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                )}
              </div>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 hidden sm:block tracking-wider uppercase">
                Your Safety. One Click Away.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.authRequired && !isAuthenticated) return null;
              const isActive = location.pathname === link.path;

              if (link.highlight) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                        : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                    }`}
                  >
                    <Radio className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Admin Link */}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Quick Escape Fake Call Simulator Button */}
            <button
              type="button"
              onClick={onOpenFakeCall}
              title="Discreet Fake Call (Escape Tool)"
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 hover:border-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Fake Call</span>
            </button>

            {/* Quick Stealth Disguise Cloak Button */}
            <button
              type="button"
              onClick={onToggleCloak}
              title="Stealth Camouflage Cloak (Press Esc or Alt+S)"
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
            >
              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Stealth (Esc)</span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              className="p-2 sm:p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme mode"
            >
              {mode === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications Dropdown */}
            {isAuthenticated && (
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setIsNotifOpen((prev) => !prev)}
                  className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
              </div>
            )}

            {/* User Profile / Auth Action */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-8 h-8 rounded-xl object-cover border border-rose-300 dark:border-rose-900"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-bold text-xs flex items-center justify-center">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[100px]">
                      {user?.name}
                    </span>
                    <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 block uppercase">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {/* User Popover Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Settings & Privacy</span>
                    </Link>

                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors border-t border-slate-100 dark:border-slate-800"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
            {navLinks.map((link) => {
              if (link.authRequired && !isAuthenticated) return null;
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40"
              >
                Admin Console
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
