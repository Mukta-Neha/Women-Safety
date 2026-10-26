import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Radio,
  MapPin,
  Users,
  ShieldCheck,
  PhoneCall,
  Bell,
  ArrowRight,
  AlertTriangle,
  Lock,
  Compass,
  Sparkles,
  Navigation,
  Calculator,
  Scale,
} from 'lucide-react';
import { HelplineBanner } from '../components/common/HelplineBanner';

export const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 dark:border-slate-800">
        {/* Ambient Glows */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs font-bold mb-6 tracking-wide uppercase shadow-sm">
              <Shield className="w-3.5 h-3.5 fill-rose-600" />
              <span>Next-Gen Women Safety & Emergency Response</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
              Your Safety. <br />
              <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                One Click Away.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-normal max-w-2xl mx-auto">
              SafeWo helps you respond faster, share your real-time GPS location, report unsafe incidents, and stay securely connected with trusted contacts and emergency responders.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Link
                to="/register"
                className="px-8 py-4 rounded-2xl font-bold text-base bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25 flex items-center gap-2 transform active:scale-95 transition-all"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/incidents"
                className="px-8 py-4 rounded-2xl font-bold text-base bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-card flex items-center gap-2 transition-all"
              >
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Explore Safety Incidents</span>
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left pt-6 border-t border-slate-200/80 dark:border-slate-800/80 max-w-4xl mx-auto">
              <div className="p-3">
                <span className="block text-2xl font-black text-slate-900 dark:text-white">100%</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Free & Accessible</span>
              </div>
              <div className="p-3">
                <span className="block text-2xl font-black text-rose-600 dark:text-rose-400">&lt; 3 Sec</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Instant SOS Broadcast</span>
              </div>
              <div className="p-3">
                <span className="block text-2xl font-black text-slate-900 dark:text-white">Real-Time</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Live GPS Geolocation</span>
              </div>
              <div className="p-3">
                <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">Zero-Leak</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Private Geofencing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Helplines Highlight */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HelplineBanner />
      </section>

      {/* Core Features Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-2">Designed For Protection</h2>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Comprehensive Safety Features Built for Peace of Mind
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: One-Click SOS */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center mb-6">
                <Radio className="w-7 h-7 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">One-Click SOS Alert</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Activate an emergency alert in seconds. Instantly notifies designated emergency contacts and broadcasts real-time GPS coordinates via WebSockets.
              </p>
            </div>
            <Link to="/sos" className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 mt-6 hover:underline">
              <span>Try SOS System</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Incident Map & Explorer */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-6">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Interactive Incident Explorer</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Explore crowdsourced safety reports on an interactive Leaflet map. Filter by severity, distance, and categories such as Harassment, Stalking, or Unsafe Areas.
              </p>
            </div>
            <Link to="/incidents" className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 mt-6 hover:underline">
              <span>View Incident Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Safe Zones & Geofencing */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Smart Safe Zones</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Designate trusted locations (Home, College, Office, Hostel) with customizable radius. Receive automated reassurance when you are securely within your safe perimeter.
              </p>
            </div>
            <Link to="/safe-zones" className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 mt-6 hover:underline">
              <span>Configure Safe Zones</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Next-Gen Safety Power Pack Showcase */}
      <section className="py-16 bg-gradient-to-b from-rose-50/50 via-white to-slate-50 dark:from-rose-950/20 dark:via-slate-950 dark:to-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Unique Non-Emergency Tools
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Next-Gen Safety Power Pack
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Safety isn’t only about emergency sirens. SafeWo equips you with proactive tools to discreetly escape uncomfortable situations, track journeys with guardian check-ins, disguise screens, and master your legal rights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Fake Call */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-4">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Discreet Fake Call</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Authentic incoming phone call with real Web Audio ringtone cadence, customizable caller avatars (Mom, Dad, Cab, Boss), and voice dialogue player to excuse yourself safely.
                </p>
              </div>
              <Link
                to="/toolkit"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
              >
                <span>Try Fake Call</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 2. Safe Journey */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-4">
                  <Navigation className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Safe Journey (Walk With Me)</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Timed trip guardian monitor with periodic "I Am Safe" prompts, vehicle plate logger for cabs/autos, live battery tracking, and automated missed check-in alerts.
                </p>
              </div>
              <Link
                to="/safe-journey"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
              >
                <span>Start Safe Journey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3. Stealth Cloak */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Stealth Camouflage</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Single hotkey (Esc / Alt+S) or button cloaks the web app into a working scientific Calculator or Notes Pad. Enter secret PIN (1234=) to unmask instantly.
                </p>
              </div>
              <Link
                to="/toolkit"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>Learn About Stealth</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4. Safe Havens & Legal Rights */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-4">
                  <Scale className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Safe Havens & Legal Rights</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  24/7 verified police desks, emergency pharmacies & shelters with route score analysis, alongside our comprehensive Zero FIR, POSH act, and cyber safety handbook.
                </p>
              </div>
              <Link
                to="/legal-rights"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>View Legal Handbook</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-2">Simple & Intuitive</h2>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              How SafeWo Works In An Emergency
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative">
              <span className="w-10 h-10 rounded-2xl bg-rose-600 text-white font-black text-base flex items-center justify-center mb-4">
                1
              </span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">Click SOS Button</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Single tap with short confirmation triggers your emergency protocol from any device.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative">
              <span className="w-10 h-10 rounded-2xl bg-rose-600 text-white font-black text-base flex items-center justify-center mb-4">
                2
              </span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">GPS Acquired</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Browser Geolocation captures high-accuracy coordinates and continuous location breadcrumbs.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative">
              <span className="w-10 h-10 rounded-2xl bg-rose-600 text-white font-black text-base flex items-center justify-center mb-4">
                3
              </span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">Live Broadcast</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Emergency contacts and admin dispatchers receive real-time Socket.io alerts with your live map trail.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative">
              <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center mb-4">
                4
              </span>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">Assistance & Resolve</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Direct calling to 112 or your primary contact. Mark resolved when you are safely out of danger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black">
              <Shield className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">SafeWo</span>
              <span className="block text-[11px] text-slate-400">Your Safety. One Click Away.</span>
            </div>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link to="/incidents" className="hover:text-rose-600">Safety Incidents</Link>
            <Link to="/sos" className="hover:text-rose-600">SOS System</Link>
            <Link to="/settings" className="hover:text-rose-600">Privacy Policy</Link>
            <Link to="/login" className="hover:text-rose-600">Sign In</Link>
          </div>

          <p className="text-center md:text-right text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} SafeWo Women Safety Platform. Built with security and privacy by design.
          </p>
        </div>
      </footer>
    </div>
  );
};
