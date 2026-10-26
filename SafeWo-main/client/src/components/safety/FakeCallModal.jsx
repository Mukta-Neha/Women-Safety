import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Clock,
  User,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Grid,
  X,
  Copy,
  Check,
  Sparkles,
  ShieldAlert,
  Play,
  RotateCcw,
} from 'lucide-react';
import { startRingtone, stopRingtone, speakCallerDialogue, stopCallerDialogue } from '../../utils/fakeCallAudio';

const CALLER_PRESETS = [
  {
    id: 'mom',
    name: 'Mom (Home)',
    phone: '+91 98201 54321',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    dialogue:
      'Hey sweetie, where are you right now? Dad is waiting downstairs in the car right outside with hazard lights on. Come out quickly, we are waiting for you!',
  },
  {
    id: 'dad',
    name: 'Papa',
    phone: '+91 94311 00998',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    dialogue:
      'Beta, are you coming out? I just reached near the entrance. I can see the building from here. Don’t stop anywhere, just walk straight over to the car now.',
  },
  {
    id: 'cab',
    name: 'Uber Driver (Ramesh Kumar)',
    phone: '+91 98112 34567',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    dialogue:
      'Hello ma’am, I am your cab driver. I have arrived at your pickup spot in the white Dzire. Please come out now, parking is not allowed here.',
  },
  {
    id: 'boss',
    name: 'Manager Anjali (Office)',
    phone: '+91 99001 22334',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    dialogue:
      'Hi, apologies for the late call, but our production server has a critical client alert and we need your sign-off right away. Please log into your workstation immediately.',
  },
  {
    id: 'police',
    name: 'Inspector Sharma (Control Room)',
    phone: '112 / 1091',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    dialogue:
      'Good evening. This is the area women safety patrol desk. We are conducting standard safety checks along this corridor. Confirm your location and if you require a patrol escort.',
  },
];

const EXCUSE_SNIPPETS = [
  '“My family is parked right outside waiting with the engine running, I have to step out immediately.”',
  '“My office manager just called with a critical server emergency, I need to log in right away.”',
  '“My roommate locked herself out and I have the only spare key, heading home right now.”',
  '“My doctor’s clinic is calling for my scheduled medical callback, I need to take this in private.”',
];

export const FakeCallModal = ({ isOpen, onClose }) => {
  const [stage, setStage] = useState('config'); // 'config' | 'countdown' | 'incoming' | 'active'
  const [selectedPreset, setSelectedPreset] = useState(CALLER_PRESETS[0]);
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customDialogue, setCustomDialogue] = useState('');
  const [delaySeconds, setDelaySeconds] = useState(5);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  // Active call states
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [copiedExcuseIndex, setCopiedExcuseIndex] = useState(null);

  const countdownTimerRef = useRef(null);
  const callDurationTimerRef = useRef(null);

  // Reset when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      handleEndCall();
      setStage('config');
    }
  }, [isOpen]);

  // Clean up audio & timers on unmount
  useEffect(() => {
    return () => {
      stopRingtone();
      stopCallerDialogue();
      clearInterval(countdownTimerRef.current);
      clearInterval(callDurationTimerRef.current);
    };
  }, []);

  // Handle countdown
  useEffect(() => {
    if (stage === 'countdown' && secondsRemaining > 0) {
      countdownTimerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current);
            triggerIncomingCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownTimerRef.current);
    }
  }, [stage, secondsRemaining]);

  // Handle call duration counter
  useEffect(() => {
    if (stage === 'active') {
      callDurationTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(callDurationTimerRef.current);
    }
  }, [stage]);

  const activeCaller = {
    name: customName.trim() || selectedPreset.name,
    phone: customPhone.trim() || selectedPreset.phone,
    avatar: selectedPreset.avatar,
    dialogue: customDialogue.trim() || selectedPreset.dialogue,
  };

  const handleStartCountdown = (secs) => {
    setDelaySeconds(secs);
    if (secs === 0) {
      triggerIncomingCall();
    } else {
      setSecondsRemaining(secs);
      setStage('countdown');
    }
  };

  const triggerIncomingCall = () => {
    setStage('incoming');
    startRingtone();
  };

  const handleAcceptCall = () => {
    stopRingtone();
    setStage('active');
    setCallDuration(0);
    playDialogue();
  };

  const playDialogue = () => {
    setIsVoiceSpeaking(true);
    speakCallerDialogue(activeCaller.dialogue, () => {
      setIsVoiceSpeaking(false);
    });
  };

  const handleEndCall = () => {
    stopRingtone();
    stopCallerDialogue();
    clearInterval(countdownTimerRef.current);
    clearInterval(callDurationTimerRef.current);
    setStage('config');
    setCallDuration(0);
    setIsVoiceSpeaking(false);
  };

  const formatCallTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleCopyExcuse = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedExcuseIndex(idx);
    setTimeout(() => setCopiedExcuseIndex(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* 1. CONFIGURATION VIEW */}
      {stage === 'config' && (
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-rose-500/10 via-pink-500/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
                <PhoneCall className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  Fake Call Simulator
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold uppercase tracking-wider">
                    Discreet Escape
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Simulate an authentic incoming phone call with realistic voice audio to excuse yourself from uncomfortable situations.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm">
            {/* Quick Trigger Buttons */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                1. Trigger Incoming Call In:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { label: 'Now (3s)', secs: 3 },
                  { label: '10s', secs: 10 },
                  { label: '30s', secs: 30 },
                  { label: '1 min', secs: 60 },
                  { label: '3 mins', secs: 180 },
                ].map((item) => (
                  <button
                    key={item.secs}
                    type="button"
                    onClick={() => handleStartCountdown(item.secs)}
                    className="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl border-2 border-rose-200 dark:border-rose-900/50 hover:border-rose-500 dark:hover:border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 hover:scale-105 active:scale-95 font-bold transition-all"
                  >
                    <Clock className="w-4 h-4 mb-1 text-rose-600" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                2. Select Caller Profile:
              </label>
              <div className="space-y-2">
                {CALLER_PRESETS.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id && !customName;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(preset);
                        setCustomName('');
                        setCustomPhone('');
                        setCustomDialogue('');
                      }}
                      className={`w-full text-left p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                      }`}
                    >
                      <img
                        src={preset.avatar}
                        alt={preset.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/30"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{preset.name}</p>
                          <span className="text-xs text-slate-400 dark:text-slate-500">{preset.phone}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate italic mt-0.5">
                          "{preset.dialogue}"
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Caller Toggle Accordion */}
            <details className="group border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/30">
              <summary className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 cursor-pointer list-none flex items-center justify-between">
                <span>Or Customize Caller Details</span>
                <span className="text-xs text-rose-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Caller Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Papa, Officer, Dr. Neha"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98123 45678"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Voice Speech Script</label>
                  <textarea
                    rows={2}
                    placeholder="What the caller should say aloud when answered..."
                    value={customDialogue}
                    onChange={(e) => setCustomDialogue(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-rose-500 outline-none resize-none"
                  />
                </div>
              </div>
            </details>

            {/* Quick Excuse Generator */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Discreet Verbal Excuse Bank:
                </label>
              </div>
              <div className="space-y-1.5">
                {EXCUSE_SNIPPETS.map((excuse, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 group"
                  >
                    <p className="flex-1 pr-2">{excuse}</p>
                    <button
                      type="button"
                      onClick={() => handleCopyExcuse(excuse, idx)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-rose-600 transition-colors"
                      title="Copy excuse to clipboard"
                    >
                      {copiedExcuseIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Trigger */}
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Selected: <strong className="text-slate-800 dark:text-white">{activeCaller.name}</strong>
            </span>
            <button
              type="button"
              onClick={() => handleStartCountdown(3)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs shadow-lg shadow-rose-500/25 hover:from-rose-500 hover:to-pink-500 active:scale-95 transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              Launch Call Now
            </button>
          </div>
        </div>
      )}

      {/* 2. COUNTDOWN VIEW (TICKER) */}
      {stage === 'countdown' && (
        <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 text-center border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-scaleUp">
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center relative">
            <span className="absolute inset-0 rounded-full border-4 border-rose-500/30 animate-ping" />
            <span className="text-3xl font-black">{secondsRemaining}</span>
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Call Armed & Scheduled</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Incoming call from <strong>{activeCaller.name}</strong> in {secondsRemaining} seconds...
            </p>
          </div>
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={triggerIncomingCall}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors"
            >
              Trigger Instantly
            </button>
            <button
              type="button"
              onClick={handleEndCall}
              className="py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 3. INCOMING CALL SCREEN (HYPER-REALISTIC PHONE UI) */}
      {stage === 'incoming' && (
        <div className="w-full max-w-sm h-[640px] bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white rounded-[40px] border-4 border-slate-800 shadow-2xl p-6 flex flex-col justify-between relative overflow-hidden animate-slideUp">
          {/* Top Notch / Status bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 px-2">
            <span>SafeWo Secure</span>
            <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
            <span>5G • 98%</span>
          </div>

          {/* Caller Profile */}
          <div className="text-center space-y-3 mt-4">
            <div className="relative inline-block">
              <img
                src={activeCaller.avatar}
                alt={activeCaller.name}
                className="w-28 h-28 mx-auto rounded-full object-cover ring-4 ring-rose-500/50 shadow-2xl animate-pulse"
              />
              <span className="absolute -bottom-1 right-2 w-7 h-7 rounded-full bg-rose-600 border-2 border-slate-950 flex items-center justify-center">
                <Phone className="w-3.5 h-3.5 text-white" />
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">{activeCaller.name}</h2>
              <p className="text-sm text-slate-400 font-medium">{activeCaller.phone}</p>
              <p className="text-xs text-rose-400 font-semibold uppercase tracking-widest mt-2 animate-bounce">
                Incoming Phone Call...
              </p>
            </div>
          </div>

          {/* Accept / Decline Action Controls */}
          <div className="space-y-6 pb-6">
            <div className="flex items-center justify-around px-4">
              {/* Decline (Red) */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={handleEndCall}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/50 active:scale-95 transition-all"
                  aria-label="Decline Call"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
                <span className="text-xs font-semibold text-slate-300">Decline</span>
              </div>

              {/* Accept (Green) */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={handleAcceptCall}
                  className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/60 active:scale-95 transition-all animate-pulse"
                  aria-label="Accept Call"
                >
                  <Phone className="w-7 h-7" />
                </button>
                <span className="text-xs font-semibold text-emerald-400">Accept</span>
              </div>
            </div>

            <p className="text-[11px] text-center text-slate-500">
              Audio ringtone is playing. Tap Accept to listen to voice.
            </p>
          </div>
        </div>
      )}

      {/* 4. ACTIVE IN-CALL SCREEN */}
      {stage === 'active' && (
        <div className="w-full max-w-sm h-[640px] bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white rounded-[40px] border-4 border-slate-800 shadow-2xl p-6 flex flex-col justify-between relative overflow-hidden animate-fadeIn">
          {/* Top Info */}
          <div className="text-center space-y-2 pt-6">
            <h2 className="text-2xl font-black">{activeCaller.name}</h2>
            <p className="text-xs text-emerald-400 font-mono tracking-widest text-sm">
              {formatCallTime(callDuration)}
            </p>
            <p className="text-[11px] text-slate-400">{activeCaller.phone}</p>
          </div>

          {/* Voice Speaking Animation & Dialogue Subtitles */}
          <div className="space-y-4 px-2">
            <div className="relative p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  Live Voice Dialogue:
                </span>
                {isVoiceSpeaking && (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-3 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "{activeCaller.dialogue}"
              </p>
            </div>

            {/* Replay voice button */}
            <button
              type="button"
              onClick={playDialogue}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              Repeat Caller Speech
            </button>
          </div>

          {/* In-Call Controls Matrix */}
          <div className="space-y-6 pb-4">
            <div className="grid grid-cols-3 gap-4 px-4 text-center">
              {/* Mute */}
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-white text-black' : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              {/* Keypad */}
              <button
                type="button"
                className="w-14 h-14 mx-auto rounded-full bg-slate-800 text-white hover:bg-slate-700 flex items-center justify-center"
              >
                <Grid className="w-6 h-6" />
              </button>

              {/* Speaker */}
              <button
                type="button"
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center transition-colors ${
                  isSpeaker ? 'bg-white text-black' : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                {isSpeaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </button>
            </div>

            {/* Red End Call Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleEndCall}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xl shadow-red-600/50 active:scale-95 transition-all"
                aria-label="End Call"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
