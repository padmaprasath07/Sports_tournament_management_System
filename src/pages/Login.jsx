import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Lock, Mail, User, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const { setRole, setCurrentView, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('participant'); // 'participant' | 'admin'
  const [email, setEmail] = useState(activeTab === 'admin' ? 'admin@sportpulse.com' : 'ashwin.player@sportpulse.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setEmail(tab === 'admin' ? 'admin@sportpulse.com' : 'ashwin.player@sportpulse.com');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'admin') {
      setRole('admin');
    } else {
      setRole('participant');
    }
    addToast(`Successfully logged in as ${activeTab === 'admin' ? 'Admin' : 'Participant'}!`, 'success');
  };

  return (
    <div className="max-w-md mx-auto py-12 animate-fade-in">
      <div className="material-card p-8 space-y-6 shadow-xl border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-primary mx-auto flex items-center justify-center text-white shadow-md">
            <Trophy className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-outfit">Welcome Back</h2>
          <p className="text-xs text-slate-500">Select your user role to sign into SportPulse.</p>
        </div>

        {/* Role Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <button 
            type="button"
            onClick={() => handleTabChange('participant')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'participant'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Participant Role
          </button>
          <button 
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Admin Director
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field pl-9 py-2.5"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="flex justify-between items-center">
              <label className="form-label">Password</label>
              <a href="#" className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field pl-9 pr-9 py-2.5"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full btn btn-primary py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
          >
            Sign In as {activeTab === 'admin' ? 'Admin' : 'Participant'} <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Quick Demo Accounts Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center space-y-2">
          <p className="text-[11px] text-slate-400">Testing college project features?</p>
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={() => { setRole('participant'); addToast('Logged in as Demo Participant', 'success'); }}
              className="flex-1 py-1.5 text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg font-semibold hover:bg-emerald-100"
            >
              Demo Participant
            </button>
            <button 
              type="button" 
              onClick={() => { setRole('admin'); addToast('Logged in as Demo Admin', 'success'); }}
              className="flex-1 py-1.5 text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-100"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <button 
            onClick={() => setCurrentView('register')}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Register Now
          </button>
        </div>

      </div>
    </div>
  );
};
