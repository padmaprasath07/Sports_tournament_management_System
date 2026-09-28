import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Mail, Lock, Server, Save, Activity } from 'lucide-react';

export const AdminProfile = () => {
  const { userProfile, updateUserProfile, addToast } = useApp();
  const [adminName, setAdminName] = useState(userProfile?.name || 'Tournament Director');
  const [email, setEmail] = useState(userProfile?.email || 'admin@sportpulse.com');

  useEffect(() => {
    if (userProfile?.name) setAdminName(userProfile.name);
    if (userProfile?.email) setEmail(userProfile.email);
  }, [userProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (updateUserProfile) {
      await updateUserProfile({ name: adminName, email });
    } else {
      addToast('Admin system settings saved!', 'success');
    }
  };

  const initials = adminName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      <h1 className="text-2xl font-black font-urbanist tracking-tight">Admin System Profile & Security</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="material-card p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 text-white text-2xl font-black font-urbanist mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/20">
            {initials || 'AD'}
          </div>
          <div>
            <h2 className="font-bold text-lg font-outfit">{adminName}</h2>
            <p className="text-xs text-slate-500">Super Administrator • Access Level 5</p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2 text-left text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-blue-500" /> {email}</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Two-Factor Authentication: Enabled</div>
          </div>
        </div>

        <div className="md:col-span-2 material-card p-6 space-y-4">
          <h3 className="font-bold text-base font-outfit">Security & Preferences</h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="form-group">
              <label className="form-label">Administrator Display Name</label>
              <input 
                type="text" 
                value={adminName}
                onChange={e => setAdminName(e.target.value)}
                className="input-field py-2"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Admin Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field py-2"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button type="submit" className="btn btn-primary py-2 px-4 text-xs font-semibold">
                <Save className="w-4 h-4" /> Save System Settings
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};
