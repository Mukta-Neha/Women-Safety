import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Common Components
import { Navbar } from './components/common/Navbar';
import { MobileNav } from './components/common/MobileNav';
import { ActiveSOSBanner } from './components/common/ActiveSOSBanner';
import { SOSModal } from './components/common/SOSModal';

// Route Guards
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { AdminRoute } from './components/routes/AdminRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { NotFound } from './pages/NotFound';

import { Dashboard } from './pages/Dashboard';
import { SOSPage } from './pages/SOSPage';
import { Incidents } from './pages/Incidents';
import { IncidentDetails } from './pages/IncidentDetails';
import { EmergencyContacts } from './pages/EmergencyContacts';
import { SafeZones } from './pages/SafeZones';
import { AlertHistory } from './pages/AlertHistory';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

// Unique Next-Gen Safety Pages & Modals
import { SafetyToolkit } from './pages/SafetyToolkit';
import { SafeJourneyPage } from './pages/SafeJourneyPage';
import { SafeHavensPage } from './pages/SafeHavensPage';
import { LegalRightsPage } from './pages/LegalRightsPage';
import { FakeCallModal } from './components/safety/FakeCallModal';
import { StealthCloak } from './components/safety/StealthCloak';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminAlerts } from './pages/AdminAlerts';
import { AdminIncidents } from './pages/AdminIncidents';
import { AdminUsers } from './pages/AdminUsers';

// Hooks & Slices
import { useSocketEvents } from './hooks/useSocketEvents';
import { useGeolocation } from './hooks/useGeolocation';
import { fetchActiveAlert, resolveSOSAlert, triggerSOSAlert } from './redux/slices/alertSlice';
import { fetchNotifications } from './redux/slices/notificationSlice';

export function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { activeAlert, sosTriggering } = useSelector((state) => state.alert);
  const { contacts } = useSelector((state) => state.contact);

  const { location: coords } = useGeolocation({ enableWatch: !!activeAlert });

  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [isFakeCallOpen, setIsFakeCallOpen] = useState(false);
  const [isCloakActive, setIsCloakActive] = useState(false);

  // Global shortcut (Alt+S) to toggle stealth camouflage cloak
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === 's') {
        setIsCloakActive((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Initialize socket listener
  useSocketEvents();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchActiveAlert());
      dispatch(fetchNotifications());
    }
  }, [isAuthenticated, dispatch]);

  const handleOpenSOS = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsSOSModalOpen(true);
  };

  const handleConfirmSOS = async () => {
    setIsSOSModalOpen(false);
    const result = await dispatch(
      triggerSOSAlert({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy || 10,
        type: 'SOS',
        message: 'Emergency SOS activated! I require immediate assistance.',
      })
    );
    if (triggerSOSAlert.fulfilled.match(result)) {
      navigate('/sos');
    }
  };

  const handleResolveSOS = (alert) => {
    dispatch(resolveSOSAlert({ alertId: alert._id, resolutionNotes: 'Resolved from persistent banner' }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-16 lg:pb-0">
      {/* Top Navbar */}
      <Navbar
        onOpenFakeCall={() => setIsFakeCallOpen(true)}
        onToggleCloak={() => setIsCloakActive((prev) => !prev)}
      />

      {/* Persistent Emergency SOS Active Banner */}
      {activeAlert && (
        <ActiveSOSBanner alert={activeAlert} onResolve={() => handleResolveSOS(activeAlert)} />
      )}

      {/* Main Routed Content */}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Incidents (Public Explorer) */}
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/incidents/:id" element={<IncidentDetails />} />

          {/* Next-Gen Safety Power Pack Routes */}
          <Route
            path="/toolkit"
            element={
              <SafetyToolkit
                onOpenFakeCall={() => setIsFakeCallOpen(true)}
                onActivateCloak={() => setIsCloakActive(true)}
              />
            }
          />
          <Route
            path="/safe-journey"
            element={
              <ProtectedRoute>
                <SafeJourneyPage />
              </ProtectedRoute>
            }
          />
          <Route path="/safe-havens" element={<SafeHavensPage />} />
          <Route path="/legal-rights" element={<LegalRightsPage />} />

          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard
                  onOpenFakeCall={() => setIsFakeCallOpen(true)}
                  onActivateCloak={() => setIsCloakActive(true)}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sos"
            element={
              <ProtectedRoute>
                <SOSPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <EmergencyContacts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/safe-zones"
            element={
              <ProtectedRoute>
                <SafeZones />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <AlertHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={<Settings />}
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/alerts"
            element={
              <AdminRoute>
                <AdminAlerts />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/incidents"
            element={
              <AdminRoute>
                <AdminIncidents />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Bottom Mobile Navigation */}
      <MobileNav onSOSTrigger={handleOpenSOS} />

      {/* Global SOS Modal */}
      <SOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        onConfirm={handleConfirmSOS}
        location={coords}
        contactCount={contacts.length}
        loading={sosTriggering}
      />

      {/* Discreet Fake Call Simulator Modal */}
      <FakeCallModal isOpen={isFakeCallOpen} onClose={() => setIsFakeCallOpen(false)} />

      {/* Stealth Camouflage Cloak Fullscreen Disguise */}
      <StealthCloak isActive={isCloakActive} onClose={() => setIsCloakActive(false)} />
    </div>
  );
}

export default App;
