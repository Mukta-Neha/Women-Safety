import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Shield,
  Radio,
  MapPin,
  AlertTriangle,
  Users,
  ShieldCheck,
  Plus,
  ArrowRight,
  Phone,
  Clock,
  Compass,
  PhoneCall,
  Navigation,
  Calculator,
  Scale,
  Sparkles,
} from 'lucide-react';
import { SOSButton } from '../components/common/SOSButton';
import { SOSModal } from '../components/common/SOSModal';
import { HelplineBanner } from '../components/common/HelplineBanner';
import { EmergencyContactCard } from '../components/cards/EmergencyContactCard';
import { IncidentCard } from '../components/cards/IncidentCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { triggerSOSAlert, resolveSOSAlert, fetchActiveAlert } from '../redux/slices/alertSlice';
import { fetchContacts } from '../redux/slices/contactSlice';
import { fetchIncidents, toggleIncidentHelpful } from '../redux/slices/incidentSlice';
import { fetchSafeZones } from '../redux/slices/safeZoneSlice';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSafeZoneCheck } from '../hooks/useSafeZoneCheck';

export const Dashboard = ({ onOpenFakeCall, onActivateCloak }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { activeAlert, sosTriggering } = useSelector((state) => state.alert);
  const { contacts } = useSelector((state) => state.contact);
  const { incidents } = useSelector((state) => state.incident);
  const { safeZones } = useSelector((state) => state.safeZone);

  const { location: coords, permissionStatus, refreshLocation } = useGeolocation({
    enableWatch: !!activeAlert,
  });

  const { isInside, activeZone } = useSafeZoneCheck(coords, safeZones);

  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchActiveAlert());
    dispatch(fetchContacts());
    dispatch(fetchSafeZones(coords));
    dispatch(fetchIncidents({ limit: 4 }));
  }, [dispatch]);

  const handleOpenSOS = () => {
    setIsSOSModalOpen(true);
  };

  const handleConfirmSOS = async () => {
    setIsSOSModalOpen(false);
    const resultAction = await dispatch(
      triggerSOSAlert({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy || 10,
        type: 'SOS',
        message: 'Emergency SOS activated! I require immediate assistance.',
      })
    );
    if (triggerSOSAlert.fulfilled.match(resultAction)) {
      navigate('/sos');
    }
  };

  const handleResolveAlert = (alert) => {
    dispatch(resolveSOSAlert({ alertId: alert._id, resolutionNotes: 'Resolved from Dashboard' }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Welcome & Safety Status Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Hello, {user?.name || 'Friend'}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
              SafeWo Protected
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              GPS: {coords?.latitude ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : 'Locating...'}
            </span>
            {permissionStatus === 'denied' && (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                (Location access restricted)
              </span>
            )}
          </div>
        </div>

        {/* Safe Zone Reassurance Indicator */}
        {isInside && activeZone ? (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 animate-pulse">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold">You're inside your safe zone</p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                {activeZone.name} ({activeZone.type})
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-2xl">
            <Compass className="w-4 h-4 text-slate-400" />
            <span>Outside designated safe zones</span>
          </div>
        )}
      </div>

      {/* Main Action Hub: Big SOS Button & Helplines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left/Center: Signature SOS Trigger Card */}
        <div className="lg:col-span-7 bg-gradient-to-b from-white to-rose-50/40 dark:from-slate-900 dark:to-rose-950/20 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="max-w-md mx-auto mb-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 block mb-1">
              Immediate Emergency Response
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Emergency SOS Activation
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Press the button below to instantly alert contacts with your live location.
            </p>
          </div>

          <SOSButton onClick={handleOpenSOS} loading={sosTriggering} size="hero" />

          {activeAlert && (
            <div className="mt-4 flex items-center gap-3">
              <Link
                to="/sos"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm flex items-center gap-1.5 animate-pulse"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Track Active Alert</span>
              </Link>
              <button
                onClick={() => handleResolveAlert(activeAlert)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                Resolve SOS
              </button>
            </div>
          )}
        </div>

        {/* Right: Quick Emergency Contacts Dial Card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Emergency Contacts
                </h3>
              </div>
              <Link
                to="/contacts"
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {contacts.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-400 mb-3">No emergency contacts added yet</p>
                <Link
                  to="/contacts"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Contact</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.slice(0, 3).map((contact) => (
                  <div
                    key={contact._id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                          {contact.name}
                        </h5>
                        {contact.isPrimary && (
                          <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{contact.relationship} &bull; {contact.phone}</p>
                    </div>
                    <a
                      href={`tel:${contact.phone}`}
                      className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center justify-center transition-colors"
                      aria-label={`Call ${contact.name}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <Link
              to="/contacts"
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Emergency Contact</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Emergency Helplines Section */}
      <HelplineBanner compact />

      {/* Next-Gen Safety Power Pack Hub */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-600" />
              <h3 className="font-black text-slate-900 dark:text-white text-xl">
                Next-Gen Safety Power Pack
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm">
                Unique Features
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Proactive personal protection tools for discreet escape, timed journey check-ins, screen disguise, and legal guidance.
            </p>
          </div>
          <Link
            to="/toolkit"
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 self-start sm:self-center"
          >
            <span>Open Safety Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Fake Call Simulator */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Discreet Fake Call</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Escape awkward or unsafe encounters with an authentic incoming phone call and voice speech.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onOpenFakeCall}
                className="w-full py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Launch Fake Call
              </button>
            </div>
          </div>

          {/* Card 2: Safe Journey / Walk With Me */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Navigation className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Safe Journey Monitor</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Guardian timer for cab/night walks with scheduled check-in prompts and automated contact escalation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/safe-journey"
                className="w-full py-2 px-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 hover:bg-purple-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                Start Safe Journey
              </Link>
            </div>
          </div>

          {/* Card 3: Stealth Camouflage Cloak */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Stealth Camouflage</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Disguise this entire screen instantly as a functional Calculator. Unlock with secret PIN 1234=.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onActivateCloak}
                className="w-full py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Calculator className="w-3.5 h-3.5" />
                Activate Cloak (Esc)
              </button>
            </div>
          </div>

          {/* Card 4: Safe Havens & Route Finder */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Safe Havens & Routes</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Interactive map of 24/7 verified police, pharmacy, and shelter spots with corridor safety scoring.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/safe-havens"
                className="w-full py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                Explore Safe Havens
              </Link>
            </div>
          </div>
        </div>

        {/* Legal Rights Banner Quick Access */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-purple-800/50 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-600/50 border border-purple-400/40 flex items-center justify-center flex-shrink-0">
              <Scale className="w-6 h-6 text-purple-200" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Women’s Legal Rights & Cyber Safety Handbook</h4>
              <p className="text-xs text-purple-200">
                Learn your statutory rights: Zero FIR filing at any station, sunset arrest safeguards, POSH act laws & digital evidence checklist.
              </p>
            </div>
          </div>
          <Link
            to="/legal-rights"
            className="px-4 py-2 rounded-xl bg-white text-purple-950 hover:bg-purple-50 font-bold text-xs shadow-sm flex-shrink-0 flex items-center gap-1.5"
          >
            <span>Read Legal Rights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Nearby Incidents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Recent Safety Reports Nearby
            </h3>
          </div>
          <Link
            to="/incidents"
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            <span>Explore All on Map</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {incidents.slice(0, 4).map((incident) => (
            <IncidentCard
              key={incident._id}
              incident={incident}
              onToggleHelpful={(id) => dispatch(toggleIncidentHelpful(id))}
              currentUserId={user?._id}
            />
          ))}
        </div>
      </div>

      {/* SOS Confirmation Modal */}
      <SOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        onConfirm={handleConfirmSOS}
        location={coords}
        contactCount={contacts.length}
        loading={sosTriggering}
      />
    </div>
  );
};
