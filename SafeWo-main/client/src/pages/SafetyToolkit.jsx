import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PhoneCall,
  Navigation,
  Calculator,
  Shield,
  Scale,
  Sparkles,
  ArrowRight,
  Lock,
  EyeOff,
  Compass,
  FileCheck,
  CheckCircle,
  Clock,
  Mic,
  MicOff,
} from 'lucide-react';

export const SafetyToolkit = ({ onOpenFakeCall, onActivateCloak }) => {
  // Quick Audio Memo Recorder State (Bonus emergency evidence recorder)
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudios, setRecordedAudios] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        setRecordedAudios((prev) => [
          {
            id: Date.now(),
            url: audioUrl,
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString(),
          },
          ...prev,
        ]);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingSeconds(0);

      const interval = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);

      recorder.onstop_cleanup = () => clearInterval(interval);
    } catch (err) {
      alert('Microphone permission required for audio evidence memo.');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const tools = [
    {
      title: 'Discreet Fake Call',
      badge: 'Immediate Escape',
      desc: 'Simulate an authentic incoming call with realistic ringtones, caller avatars (Mom, Dad, Cab), and voice dialogues to excuse yourself safely.',
      icon: PhoneCall,
      color: 'rose',
      actionText: 'Configure & Launch Call',
      onClick: onOpenFakeCall,
    },
    {
      title: 'Safe Journey (Walk With Me)',
      badge: 'Guardian Monitor',
      desc: 'Set your destination and trip duration. SafeWo prompts periodic safety check-ins and alerts your emergency contacts if you fail to respond.',
      icon: Navigation,
      color: 'purple',
      link: '/safe-journey',
      actionText: 'Start Safe Journey',
    },
    {
      title: 'Stealth Camouflage Cloak',
      badge: 'Anti-Prying Shield',
      desc: 'Instantly masks the entire application as a working Calculator or Notepad. Type secret PIN (1234=) or press Esc to return.',
      icon: Calculator,
      color: 'indigo',
      actionText: 'Activate Disguise Cloak',
      onClick: onActivateCloak,
    },
    {
      title: 'Safe Haven & Route Safety',
      badge: '24/7 Verified Spots',
      desc: 'Discover nearby 24/7 police kiosks, well-lit pharmacies, and trauma hospitals. Calculate real-time Route Safety Index scores before walking.',
      icon: Shield,
      color: 'blue',
      link: '/safe-havens',
      actionText: 'Explore Safe Havens',
    },
    {
      title: 'Women’s Rights & Cyber Kit',
      badge: 'Knowledge Is Armor',
      desc: 'Interactive guides on Zero FIR, arrest rules, POSH act laws, digital evidence preservation checklist, and personal safety self-audit quiz.',
      icon: Scale,
      color: 'emerald',
      link: '/legal-rights',
      actionText: 'Read Legal Rights',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-600/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Complete Safety Power Pack
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Safety Toolkit & Guardian Hub</h1>
          <p className="text-rose-100 text-xs sm:text-sm max-w-2xl mt-1">
            Empower yourself with unique proactive safety utilities designed for everyday commute, uncomfortable social encounters, discreet camouflage, and legal rights.
          </p>
        </div>
      </div>

      {/* TOOLS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-purple-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {tool.badge}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white">{tool.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                {tool.link ? (
                  <Link
                    to={tool.link}
                    className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    {tool.actionText}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={tool.onClick}
                    className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    {tool.actionText}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* 6TH TOOL: DISCREET AUDIO EVIDENCE VAULT */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                <Mic className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                Evidence Locker
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">Audio Evidence Recorder</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Discreet 1-tap voice and ambient audio recorder. Stored safely in your private browser memory for legal verification.
            </p>

            {isRecording && (
              <div className="mt-3 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold text-red-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  Recording Audio ({recordingSeconds}s)...
                </span>
                <button
                  onClick={stopAudioRecording}
                  className="px-3 py-1 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700"
                >
                  Stop & Save
                </button>
              </div>
            )}

            {recordedAudios.length > 0 && (
              <div className="mt-3 space-y-1.5 max-h-24 overflow-y-auto">
                {recordedAudios.slice(0, 2).map((a) => (
                  <div key={a.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-[11px]">
                    <span>Recorded at {a.time}</span>
                    <audio src={a.url} controls className="h-6 w-32" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {!isRecording ? (
              <button
                type="button"
                onClick={startAudioRecording}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
              >
                <Mic className="w-4 h-4 text-rose-500" />
                Record Ambient Memo
              </button>
            ) : (
              <button
                type="button"
                onClick={stopAudioRecording}
                className="w-full py-2.5 px-4 rounded-2xl bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-700 active:scale-95 transition-all"
              >
                <MicOff className="w-4 h-4" />
                Stop Recording
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
