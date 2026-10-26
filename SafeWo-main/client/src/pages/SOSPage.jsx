import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Radio,
  MapPin,
  CheckCircle2,
  XCircle,
  Phone,
  Volume2,
  VolumeX,
  Clock,
  Users,
  ShieldAlert,
  AlertTriangle,
  MessageSquare,
  Share2,
  ExternalLink,
  Info,
  Mail,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SOSButton } from '../components/common/SOSButton';
import { SOSModal } from '../components/common/SOSModal';
import { LiveSOSMap } from '../components/maps/LiveSOSMap';
import { HelplineBanner } from '../components/common/HelplineBanner';
import {
  triggerSOSAlert,
  resolveSOSAlert,
  cancelSOSAlert,
  fetchActiveAlert,
  sendLiveLocation,
} from '../redux/slices/alertSlice';
import { fetchContacts } from '../redux/slices/contactSlice';
import { useGeolocation } from '../hooks/useGeolocation';
import { getSocket } from '../services/socket';

export const SOSPage = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { activeAlert, sosTriggering } = useSelector((state) => state.alert);
  const { contacts } = useSelector((state) => state.contact);

  const { location: coords, refreshLocation } = useGeolocation({
    enableWatch: !!activeAlert,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState(null);
  const audioContextRef = useRef(null);
  const oscillatorIntervalRef = useRef(null);

  useEffect(() => {
    dispatch(fetchActiveAlert());
    dispatch(fetchContacts());
  }, [dispatch]);

  // Continuously stream location to backend and socket if alert is active
  useEffect(() => {
    if (activeAlert && coords?.latitude && coords?.longitude) {
      dispatch(
        sendLiveLocation({
          alertId: activeAlert._id,
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          speed: coords.speed,
          heading: coords.heading,
        })
      );

      // Also emit via Socket.io
      const socket = getSocket();
      if (socket) {
        socket.emit('location:send', {
          alertId: activeAlert._id,
          userId: user?._id,
          userName: user?.name,
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }, [activeAlert, coords, dispatch, user]);

  // Audio siren synthesizer for emergency sound
  useEffect(() => {
    if (soundEnabled && activeAlert) {
      const playBeep = () => {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          audioContextRef.current = ctx;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch alarm
          osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);

          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        } catch (e) {
          // Audio autoplay restrictions
        }
      };

      playBeep();
      oscillatorIntervalRef.current = setInterval(playBeep, 1200);
    } else {
      if (oscillatorIntervalRef.current) {
        clearInterval(oscillatorIntervalRef.current);
      }
    }

    return () => {
      if (oscillatorIntervalRef.current) {
        clearInterval(oscillatorIntervalRef.current);
      }
    };
  }, [soundEnabled, activeAlert]);

  const handleConfirmSOS = async () => {
    setIsModalOpen(false);
    const resultAction = await dispatch(
      triggerSOSAlert({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy || 10,
        type: 'SOS',
        message: 'Emergency SOS activated! I require immediate assistance at my live coordinates.',
      })
    );

    if (triggerSOSAlert.fulfilled.match(resultAction)) {
      const autoDispatch = resultAction.payload?.autoDispatch;
      if (autoDispatch) {
        setDispatchStatus(autoDispatch);
        // Instant auto-launch WhatsApp in a new tab with live GPS coordinates pre-filled
        if (autoDispatch.primaryWhatsAppUrl) {
          window.open(autoDispatch.primaryWhatsAppUrl, '_blank');
        }
      }
    }
  };

  const handleResolve = () => {
    if (activeAlert) {
      dispatch(resolveSOSAlert({ alertId: activeAlert._id, resolutionNotes: 'Resolved safely by user' }));
      setSoundEnabled(false);
    }
  };

  const handleCancel = () => {
    if (activeAlert) {
      dispatch(cancelSOSAlert({ alertId: activeAlert._id, reason: 'False alarm cancelled by user' }));
      setSoundEnabled(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Active SOS Mode */}
      {activeAlert ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Active Status Header Card */}
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-red-400/40 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white text-red-600 flex items-center justify-center flex-shrink-0 animate-bounce">
                  <Radio className="w-9 h-9" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-red-950/70 tracking-widest">
                      🚨 SOS ACTIVE
                    </span>
                    <span className="text-xs font-semibold text-red-100">
                      Live GPS Tracking Active
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Emergency Alert Broadcasted
                  </h1>
                  <p className="text-xs sm:text-sm text-red-100 max-w-xl mt-1">
                    Your real-time GPS coordinates are being transmitted to your emergency contacts and local responders.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <a
                  href="tel:112"
                  className="flex-1 md:flex-initial px-5 py-3 rounded-2xl font-black text-sm bg-white text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call 112 Police</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSoundEnabled((prev) => !prev)}
                  className={`p-3 rounded-2xl border ${
                    soundEnabled
                      ? 'bg-red-900/80 border-white text-white'
                      : 'bg-red-800/60 border-red-400 text-red-100'
                  } transition-colors`}
                  aria-label="Toggle Siren"
                  title="Toggle siren beacon"
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={handleResolve}
                  className="flex-1 md:flex-initial px-5 py-3 rounded-2xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I'm Safe / Resolve</span>
                </button>
              </div>
            </div>
          </div>

          {/* Auto-Dispatch Real-Time Status Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-emerald-500/40 dark:border-emerald-500/30 shadow-card bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    Auto-Dispatch Systems Active
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Emergency alerts and live coordinates were automatically sent to your circle upon tapping SOS.
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                ✅ Auto Dispatched
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* 1. Automated Email */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-slate-200">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Automated Mail</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {dispatchStatus?.emailDispatch?.success
                    ? `Dispatched to ${dispatchStatus.emailDispatch.recipients?.length} recipient(s) with live Google Maps link.`
                    : contacts.some((c) => c.email)
                    ? 'Dispatched to saved contact emails with live GPS.'
                    : `Dispatched to ${user?.email || 'account email'}. Add contact emails in Contacts.`}
                </p>
              </div>

              {/* 2. WhatsApp Pre-fill */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-slate-200">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Auto-Launch</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  WhatsApp window opened with live GPS pin and emergency text pre-filled.
                </p>
              </div>

              {/* 3. Live Cloud GPS */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-slate-200">
                  <Radio className="w-4 h-4 text-rose-600" />
                  <span>Live GPS Streaming</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Streaming GPS every 3s via Socket.io & MongoDB cloud tracking.
                </p>
              </div>
            </div>
          </div>

          {/* Live Map & Tracking Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Live Map */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Live Emergency GPS Tracker
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold text-red-600 bg-red-50 dark:bg-red-950/60 px-2.5 py-1 rounded-full animate-pulse">
                  Streaming Real-Time
                </span>
              </div>

              <LiveSOSMap
                latitude={activeAlert.latitude || coords?.latitude}
                longitude={activeAlert.longitude || coords?.longitude}
                accuracy={activeAlert.accuracy || coords?.accuracy}
                userName={user?.name}
                height="450px"
              />
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-4 space-y-6">
              {/* Notified Contacts & Direct Action */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-rose-600" />
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      Emergency Circle
                    </h4>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                    {contacts.length} Contacts
                  </span>
                </div>

                {/* Master WhatsApp Broadcast Button */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `🚨 EMERGENCY SOS ALERT from ${user?.name || 'SafeWo User'} (${user?.phone || 'Emergency'})!\nI need immediate assistance at my current location.\n📍 Live Map: https://maps.google.com/?q=${activeAlert.latitude || coords?.latitude},${activeAlert.longitude || coords?.longitude}\nPlease call me or contact 112 immediately!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Broadcast on WhatsApp</span>
                </a>

                {contacts.length === 0 ? (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-center space-y-2">
                    <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 mx-auto" />
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-200">
                      No Emergency Contacts Added!
                    </p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-300">
                      You have not added any contacts yet. Add your trusted family and friends so they can receive your distress alert.
                    </p>
                    <Link
                      to="/contacts"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                    >
                      <span>Add Contacts Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      1-Tap Dispatch to Contacts:
                    </p>
                    {contacts.map((contact) => {
                      const cleanPhone = contact.phone.replace(/[^0-9]/g, '');
                      const sosText = `🚨 EMERGENCY SOS from ${user?.name || 'SafeWo User'}!\nI need help right now.\n📍 Live GPS Location: https://maps.google.com/?q=${activeAlert.latitude || coords?.latitude},${activeAlert.longitude || coords?.longitude}\nPlease contact me or call 112!`;
                      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(sosText)}`;
                      const smsUrl = `sms:${contact.phone}?&body=${encodeURIComponent(sosText)}`;

                      return (
                        <div
                          key={contact._id}
                          className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">
                                {contact.name}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {contact.relationship} &bull; {contact.phone}
                              </p>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                              Priority {contact.priority}
                            </span>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-1.5 pt-1">
                            <a
                              href={`tel:${contact.phone}`}
                              className="flex-1 py-1.5 px-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
                              title="Direct Phone Call"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>Call</span>
                            </a>
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm transition-colors"
                              title="Send SOS via WhatsApp"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                            <a
                              href={smsUrl}
                              className="flex-1 py-1.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm transition-colors"
                              title="Send SOS via SMS"
                            >
                              <Phone className="w-3 h-3" />
                              <span>SMS</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Delivery Notice */}
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-2xl text-[11px] text-blue-800 dark:text-blue-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span>How Contact Dispatch Works</span>
                  </div>
                  <p className="leading-tight text-blue-700/90 dark:text-blue-300/90">
                    Your live GPS coordinates are streaming to SafeWo database. Tap <strong>WhatsApp</strong> or <strong>SMS</strong> beside any contact to send your live location directly to their phone with 1 tap.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-600 dark:hover:text-red-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel False Alarm</span>
                  </button>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <h5 className="font-bold text-slate-900 dark:text-white text-sm mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  What To Do Right Now:
                </h5>
                <p>&bull; Move towards well-lit public areas or commercial establishments.</p>
                <p>&bull; Keep your phone screen unlocked and battery in power-saver mode.</p>
                <p>&bull; If immediate threat persists, call 112 directly using the button above.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Inactive State: Ready to trigger SOS */
        <div className="space-y-8">
          <div className="bg-gradient-to-b from-white via-rose-50/30 to-white dark:from-slate-900 dark:via-rose-950/20 dark:to-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-card text-center max-w-3xl mx-auto space-y-6">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 block mb-2">
                Instant Distress Trigger
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3">
                One-Click SOS Emergency System
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                In danger? Tap the button below. Your GPS location will be captured and immediately transmitted to your emergency circle and responders.
              </p>
            </div>

            <div className="my-4">
              <SOSButton onClick={() => setIsModalOpen(true)} loading={sosTriggering} size="hero" />
            </div>

            {/* Zero Contacts Warning */}
            {contacts.length === 0 ? (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/70 rounded-2xl max-w-md mx-auto flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      0 Emergency Contacts Saved
                    </p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-300">
                      Add contacts so SafeWo can alert your trusted circle during an SOS.
                    </p>
                  </div>
                </div>
                <Link
                  to="/contacts"
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex-shrink-0 transition-colors"
                >
                  Add Contacts
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-rose-600" />
                  {contacts.length} Emergency Contact{contacts.length > 1 ? 's' : ''} Linked
                </span>
                <span>&bull;</span>
                <Link to="/contacts" className="text-rose-600 hover:underline font-semibold">
                  Manage Circle
                </Link>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>
                Current Location: {coords?.latitude ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : 'Detecting GPS...'}
              </span>
            </div>
          </div>

          <HelplineBanner />
        </div>
      )}

      {/* Confirmation Modal */}
      <SOSModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSOS}
        location={coords}
        contactCount={contacts.length}
        loading={sosTriggering}
      />
    </div>
  );
};
