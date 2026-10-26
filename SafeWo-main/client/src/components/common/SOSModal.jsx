import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { AlertOctagon, MapPin, ShieldAlert, PhoneCall } from 'lucide-react';

export const SOSModal = ({
  isOpen,
  onClose,
  onConfirm,
  location,
  loading = false,
  contactCount = 0,
}) => {
  const [countdown, setCountdown] = useState(3);
  const [autoSendEnabled, setAutoSendEnabled] = useState(true);

  useEffect(() => {
    let timer;
    if (isOpen && autoSendEnabled && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isOpen && autoSendEnabled && countdown === 0) {
      onConfirm();
    }
    return () => clearTimeout(timer);
  }, [isOpen, autoSendEnabled, countdown, onConfirm]);

  useEffect(() => {
    if (isOpen) {
      setCountdown(3);
      setAutoSendEnabled(true);
    }
  }, [isOpen]);

  const handleCancelCountdown = () => {
    setAutoSendEnabled(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Emergency SOS Confirmation" maxWidth="max-w-md">
      <div className="text-center py-2">
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center animate-pulse">
          <AlertOctagon className="w-10 h-10" />
        </div>

        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Send Emergency SOS?
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          This will immediately broadcast your distress signal, send automated emergency emails with live Google Maps links, and launch WhatsApp to your contacts.
        </p>

        {/* Location & Contact Status */}
        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3.5 mb-5 text-left border border-slate-200/80 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>
              GPS: {location?.latitude?.toFixed(4)}, {location?.longitude?.toFixed(4)}
              {location?.accuracy && ` (±${Math.round(location.accuracy)}m)`}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            <PhoneCall className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Emergency Circle: {contactCount > 0 ? `${contactCount} contact(s) linked` : '0 saved contacts'}</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
            ⚡ Auto-dispatches Email & opens WhatsApp immediately upon confirm
          </div>
        </div>

        {/* Countdown notice if auto-send is running */}
        {autoSendEnabled && (
          <div className="mb-6 p-2 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/60 text-xs font-semibold text-red-700 dark:text-red-300 flex items-center justify-between px-4">
            <span>Auto-dispatching in {countdown}s...</span>
            <button
              type="button"
              onClick={handleCancelCountdown}
              className="underline hover:text-red-900 dark:hover:text-red-100"
            >
              Pause timer
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-1/2 py-3 px-4 rounded-xl font-semibold text-sm border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-1/2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            {loading ? 'Dispatching...' : 'Send SOS Now'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
