import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Navigation,
  Clock,
  Shield,
  ShieldCheck,
  AlertTriangle,
  Battery,
  BatteryCharging,
  Share2,
  CheckCircle,
  Plus,
  Car,
  Footprints,
  Bus,
  Train,
  Check,
  RotateCcw,
  Volume2,
  PhoneCall,
  History,
  Timer,
} from 'lucide-react';
import api from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';
import { fetchContacts } from '../redux/slices/contactSlice';

const TRANSPORT_MODES = [
  { id: 'Walking', label: 'Walking Alone', icon: Footprints },
  { id: 'Cab / Taxi', label: 'Cab / Taxi', icon: Car },
  { id: 'Auto-Rickshaw', label: 'Auto-Rickshaw', icon: Car },
  { id: 'Public Bus', label: 'Public Bus', icon: Bus },
  { id: 'Metro / Train', label: 'Metro / Train', icon: Train },
];

export const SafeJourneyPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { contacts } = useSelector((state) => state.contact);
  const { location: coords } = useGeolocation({ enableWatch: true });

  const [activeJourney, setActiveJourney] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [startLoc, setStartLoc] = useState('Current GPS Location');
  const [destination, setDestination] = useState('');
  const [transportMode, setTransportMode] = useState('Cab / Taxi');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverDetails, setDriverDetails] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(20);
  const [intervalMinutes, setIntervalMinutes] = useState(5);

  // Countdown timer states
  const [secondsUntilCheckIn, setSecondsUntilCheckIn] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(90);
  const [shareCopied, setShareCopied] = useState(false);
  const [escalated, setEscalated] = useState(false);

  const timerRef = useRef(null);

  // Fetch active journey and history on mount
  useEffect(() => {
    dispatch(fetchContacts());
    loadActiveJourney();
    loadHistory();

    // Check battery API
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }
  }, [dispatch]);

  const loadActiveJourney = async () => {
    try {
      setLoading(true);
      const res = await api.get('/journeys/active');
      if (res.data?.data) {
        setActiveJourney(res.data.data);
      } else {
        setActiveJourney(null);
      }
    } catch (err) {
      console.error('Error fetching active journey:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await api.get('/journeys/history');
      if (res.data?.data) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching journey history:', err);
    }
  };

  // Run countdown loop
  useEffect(() => {
    if (activeJourney && activeJourney.status === 'active') {
      const dueTime = new Date(activeJourney.nextCheckInDueAt).getTime();

      const updateCountdown = () => {
        const now = Date.now();
        const diffSecs = Math.max(0, Math.floor((dueTime - now) / 1000));
        setSecondsUntilCheckIn(diffSecs);

        if (diffSecs === 0 && !escalated) {
          handleCheckInOverdue();
        }
      };

      updateCountdown();
      timerRef.current = setInterval(updateCountdown, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [activeJourney, escalated]);

  const handleCheckInOverdue = async () => {
    setEscalated(true);
    try {
      if (activeJourney) {
        await api.put(`/journeys/${activeJourney._id}/missed`);
      }
    } catch (err) {
      console.error('Error escalating missed check-in:', err);
    }
  };

  const handleStartJourney = async (e) => {
    e.preventDefault();
    if (!destination.trim()) return;

    try {
      setSubmitting(true);
      const res = await api.post('/journeys', {
        startLocationName: startLoc,
        destinationName: destination,
        transportMode,
        vehicleNumber,
        driverDetails,
        estimatedMinutes,
        checkInIntervalMinutes: intervalMinutes,
        latitude: coords.latitude,
        longitude: coords.longitude,
        batteryLevel,
      });

      if (res.data?.data) {
        setActiveJourney(res.data.data);
        setEscalated(false);
        loadHistory();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start journey');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckIn = async () => {
    if (!activeJourney) return;
    try {
      const res = await api.put(`/journeys/${activeJourney._id}/check-in`, {
        latitude: coords.latitude,
        longitude: coords.longitude,
        batteryLevel,
        note: 'User confirmed safe check-in',
      });
      if (res.data?.data) {
        setActiveJourney(res.data.data);
        setEscalated(false);
      }
    } catch (err) {
      console.error('Check-in error:', err);
    }
  };

  const handleExtend = async (mins) => {
    if (!activeJourney) return;
    try {
      const res = await api.put(`/journeys/${activeJourney._id}/extend`, {
        additionalMinutes: mins,
      });
      if (res.data?.data) {
        setActiveJourney(res.data.data);
      }
    } catch (err) {
      console.error('Extend error:', err);
    }
  };

  const handleComplete = async () => {
    if (!activeJourney) return;
    try {
      await api.put(`/journeys/${activeJourney._id}/complete`, {
        notes: 'Arrived safely at destination.',
      });
      setActiveJourney(null);
      setEscalated(false);
      loadHistory();
    } catch (err) {
      console.error('Complete error:', err);
    }
  };

  const handleShare = () => {
    if (!activeJourney) return;
    const text = `🛡️ SafeWo Safe Journey Update:\nI am traveling from "${activeJourney.startLocationName}" to "${activeJourney.destinationName}" via ${activeJourney.transportMode}${
      activeJourney.vehicleNumber ? ` (Vehicle: ${activeJourney.vehicleNumber})` : ''
    }.\nSafeWo guardian check-ins are active. Battery: ${batteryLevel}%.\nGPS Coordinates: ${coords.latitude?.toFixed(4)}, ${coords.longitude?.toFixed(4)}`;

    navigator.clipboard.writeText(text);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);

    // Open WhatsApp Web share if user prefers
    if (window.confirm('Copied journey safety text to clipboard! Would you like to share via WhatsApp?')) {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const formatSecs = (secs) => {
    if (secs === null) return '--:--';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-600/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
              <Navigation className="w-3.5 h-3.5" />
              Walk With Me • Guardian Trip Monitor
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Safe Journey</h1>
            <p className="text-rose-100 text-xs sm:text-sm max-w-xl mt-1">
              Never travel alone. Set your destination, choose check-in intervals, and if you don’t check in on time, SafeWo automatically alerts your emergency circle.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs">
            <Battery className="w-4 h-4 text-emerald-300" />
            <span>Battery: <strong>{batteryLevel}%</strong></span>
          </div>
        </div>
      </div>

      {/* OVERDUE CHECK-IN ESCALATION ALERT */}
      {escalated && activeJourney && (
        <div className="p-5 rounded-3xl bg-red-600 text-white border-4 border-red-400 shadow-2xl animate-bounce space-y-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-amber-300 animate-pulse" />
            <div>
              <h3 className="text-lg font-black">Check-in Timer Overdue!</h3>
              <p className="text-xs text-red-100">
                You missed your safety check-in countdown. Confirm your safety right now or SafeWo will escalate to your contacts.
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleCheckIn}
              className="px-6 py-2.5 rounded-2xl bg-white text-red-600 font-black text-sm shadow-lg hover:bg-red-50 active:scale-95 transition-all"
            >
              I Am Safe! Confirm Now
            </button>
            <button
              onClick={() => handleExtend(10)}
              className="px-4 py-2.5 rounded-2xl bg-red-800 text-white font-bold text-xs hover:bg-red-700 transition-colors"
            >
              Stuck in Traffic (+10m)
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE JOURNEY VIEW */}
      {activeJourney ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                Journey In Progress
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                En Route to {activeJourney.destinationName}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                From: {activeJourney.startLocationName} • Mode: <strong>{activeJourney.transportMode}</strong>
                {activeJourney.vehicleNumber && ` • Vehicle: ${activeJourney.vehicleNumber}`}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                {shareCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                {shareCopied ? 'Link Copied!' : 'Share Trip'}
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="px-5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                Arrived Safely
              </button>
            </div>
          </div>

          {/* Radar / Big Check-in Ticker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Ticker Box */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Time Remaining To Next Check-In
              </span>
              <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-rose-600 dark:text-rose-500">
                {formatSecs(secondsUntilCheckIn)}
              </div>
              <p className="text-xs text-slate-500">
                Interval: Every {activeJourney.checkInIntervalMinutes} minutes • Check-ins logged:{' '}
                {activeJourney.checkIns?.length || 1}
              </p>

              {/* Big "I Am Safe" Button */}
              <button
                type="button"
                onClick={handleCheckIn}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base shadow-lg shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" />
                I Am Safe! (Reset Timer)
              </button>

              {/* Extend Trip Buttons */}
              <div className="pt-2 flex items-center justify-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold">Running late?</span>
                <button
                  onClick={() => handleExtend(5)}
                  className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold"
                >
                  +5 Mins
                </button>
                <button
                  onClick={() => handleExtend(10)}
                  className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold"
                >
                  +10 Mins
                </button>
                <button
                  onClick={() => handleExtend(15)}
                  className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold"
                >
                  +15 Mins
                </button>
              </div>
            </div>

            {/* Live Journey Telemetry */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>Current GPS Latitude:</span>
                  <strong className="text-slate-800 dark:text-slate-200">
                    {coords.latitude ? coords.latitude.toFixed(5) : 'Detecting...'}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Current GPS Longitude:</span>
                  <strong className="text-slate-800 dark:text-slate-200">
                    {coords.longitude ? coords.longitude.toFixed(5) : 'Detecting...'}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Phone Battery Level:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{batteryLevel}%</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Emergency Circle Size:</span>
                  <strong className="text-rose-600 font-bold">{contacts.length} Contacts Linked</strong>
                </div>
              </div>

              {/* Check-in breadcrumb timeline */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                  Recent Check-in Breadcrumbs:
                </span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {activeJourney.checkIns?.map((ci, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {ci.note || 'Safety check confirmed'}
                      </span>
                      <span className="font-mono text-slate-400">
                        {new Date(ci.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* START NEW JOURNEY FORM */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-card p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Start a Safe Journey</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Input where you're heading and let SafeWo watch your back throughout your trip.
            </p>
          </div>

          <form onSubmit={handleStartJourney} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Origin */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Starting Point:
                </label>
                <input
                  type="text"
                  value={startLoc}
                  onChange={(e) => setStartLoc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  placeholder="e.g. Current GPS, Office, Metro Station"
                  required
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Destination:
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs focus:ring-2 focus:ring-rose-500 outline-none font-medium"
                  placeholder="e.g. Home, Hostel, City Center Mall"
                  required
                />
              </div>
            </div>

            {/* Transport Mode */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Transport Mode:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {TRANSPORT_MODES.map((mode) => {
                  const isSel = transportMode === mode.id;
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setTransportMode(mode.id)}
                      className={`py-3 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                        isSel
                          ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vehicle Number & Driver details (Especially helpful for cabs/autos) */}
            {(transportMode === 'Cab / Taxi' || transportMode === 'Auto-Rickshaw') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 mb-1">
                    Cab / Auto Plate Number:
                  </label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-rose-500 outline-none uppercase font-mono"
                    placeholder="e.g. DL 01 AB 1234"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 mb-1">
                    Driver Details / App:
                  </label>
                  <input
                    type="text"
                    value={driverDetails}
                    onChange={(e) => setDriverDetails(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                    placeholder="e.g. Uber White Dzire / Driver Ramesh"
                  />
                </div>
              </div>
            )}

            {/* Estimated Duration & Check-in Interval */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Estimated Trip Duration:
                  </span>
                  <span className="text-rose-600">{estimatedMinutes} minutes</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={120}
                  step={5}
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>5 mins</span>
                  <span>30 mins</span>
                  <span>1 hour</span>
                  <span>2 hours</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Safety Check-in Prompt:
                  </span>
                  <span className="text-rose-600">Every {intervalMinutes} minutes</span>
                </div>
                <div className="flex gap-2">
                  {[3, 5, 10, 15].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setIntervalMinutes(mins)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                        intervalMinutes === mins
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-sm shadow-xl shadow-rose-600/25 active:scale-95 transition-all flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                {submitting ? 'Initiating Monitor...' : 'Start Safe Journey'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PAST JOURNEY LOG */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">Recent Safe Journeys</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {history.slice(0, 5).map((j) => (
              <div key={j._id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    To {j.destinationName} ({j.transportMode})
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {new Date(j.startedAt).toLocaleDateString()} at{' '}
                    {new Date(j.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                    {j.estimatedMinutes} mins
                  </p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                    j.status === 'completed'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {j.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
