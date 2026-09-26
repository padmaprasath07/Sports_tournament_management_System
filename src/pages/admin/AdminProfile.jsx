import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Mail, Lock, Server, Save, Activity } from 'lucide-react';

export const AdminProfile = () => {
  const { addToast } = useApp();
  const [adminName, setAdminName] = useState('Admin Director');
  const [email, setEmail] = useState('admin@sportpulse.com');

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Admin system settings saved!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      <h1 className="text-2xl font-bold font-outfit">Admin System Profile & Security</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="material-card p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-indigo-600 text-white text-2xl font-extrabold mx-auto flex items-center justify-center shadow-lg">
            AD
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
