import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  Shield,
  CheckCircle2,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { updateUserProfile, changePassword, logout } from '../redux/slices/authSlice';

export const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || '',
    emergencyPreferences: {
      autoShareLocation: user?.emergencyPreferences?.autoShareLocation ?? true,
      soundAlarm: user?.emergencyPreferences?.soundAlarm ?? true,
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('pref_')) {
      const prefKey = name.replace('pref_', '');
      setProfileData((prev) => ({
        ...prev,
        emergencyPreferences: {
          ...prev.emergencyPreferences,
          [prefKey]: checked,
        },
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    const result = await dispatch(updateUserProfile(profileData));
    if (updateUserProfile.fulfilled.match(result)) {
      setProfileSuccess('Profile information saved successfully.');
      setTimeout(() => setProfileSuccess(''), 3000);
    } else {
      setProfileError(result.payload || 'Failed to update profile');
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    const result = await dispatch(
      changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
    );

    if (changePassword.fulfilled.match(result)) {
      setPasswordSuccess('Password updated successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } else {
      setPasswordError(result.payload || 'Failed to update password');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          {profileData.profileImage ? (
            <img
              src={profileData.profileImage}
              alt={user?.name}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-rose-100 dark:border-rose-950 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-black text-3xl flex items-center justify-center border-4 border-rose-50 dark:border-rose-900">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          )}
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name}</h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
              {user?.role}
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">{user?.email}</p>

          <button
            type="button"
            onClick={() => dispatch(logout())}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Profile Edit Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Edit Profile Info</h3>

        {profileSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2 rounded-2xl">
            <CheckCircle2 className="w-4 h-4" />
            <span>{profileSuccess}</span>
          </div>
        )}

        {profileError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2 rounded-2xl">
            <AlertCircle className="w-4 h-4" />
            <span>{profileError}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  required
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Profile Photo URL
            </label>
            <input
              type="url"
              name="profileImage"
              placeholder="https://images.unsplash.com/..."
              value={profileData.profileImage}
              onChange={handleProfileChange}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* Emergency Preferences */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Emergency Preferences</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  name="pref_autoShareLocation"
                  checked={profileData.emergencyPreferences.autoShareLocation}
                  onChange={handleProfileChange}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span>Automatically broadcast GPS updates to emergency contacts during SOS</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  name="pref_soundAlarm"
                  checked={profileData.emergencyPreferences.soundAlarm}
                  onChange={handleProfileChange}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span>Enable audio siren button when SOS is active</span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Update Security Password</h3>

        {passwordSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2 rounded-2xl">
            <CheckCircle2 className="w-4 h-4" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2 rounded-2xl">
            <AlertCircle className="w-4 h-4" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleSavePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={passwordData.confirmNewPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-rose-600 dark:hover:bg-rose-700 shadow-md transition-all"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};
