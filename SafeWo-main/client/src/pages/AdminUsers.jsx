import React, { useState, useEffect } from 'react';
import { Users, Trash2, Shield, Mail, Phone, Calendar } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import api from '../services/api';
import { formatDate } from '../utils/formatters';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Permanently remove user "${name}" from the database?`)) {
      try {
        await api.delete(`/users/${id}`);
        setUsers((prev) => prev.filter((u) => u._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            User Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Registered accounts on the SafeWo network.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-full">
          {users.length} Registered
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Fetching users..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {u.profileImage ? (
                          <img
                            src={u.profileImage}
                            alt={u.name}
                            className="w-8 h-8 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 font-bold flex items-center justify-center">
                            {u.name[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {u.name}
                          </span>
                          <span className="text-slate-400 text-[11px]">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">
                      {u.phone}
                    </td>
                    <td className="p-4 text-slate-400">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
