import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, User, ShieldCheck, Mail, Lock, Phone, MapPin, ArrowRight } from 'lucide-react';

export const Register = () => {
  const { setRole, setCurrentView, addToast } = useApp();
  const [roleSelection, setRoleSelection] = useState('participant');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setRole(roleSelection);
    addToast(`Account created! Logged in as ${roleSelection === 'admin' ? 'Admin' : 'Participant'}.`, 'success');
  };

  return (
    <div className="max-w-lg mx-auto py-10 animate-fade-in">
      <div className="material-card p-8 space-y-6 shadow-xl border border-slate-200 dark:border-slate-800">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-primary mx-auto flex items-center justify-center text-white shadow-md">
            <Trophy className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-outfit">Create SportPulse Account</h2>
          <p className="text-xs text-slate-500">Join the premier sports tournament network.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="form-group">
            <label className="form-label">I want to register as:</label>
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => setRoleSelection('participant')}
                className={`p-3 rounded-xl border cursor-pointer text-center space-y-1 transition-all ${
                  roleSelection === 'participant'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 font-bold text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                <User className="w-5 h-5 mx-auto" />
                <span>Athlete / Participant</span>
              </div>
              <div 
                onClick={() => setRoleSelection('admin')}
                className={`p-3 rounded-xl border cursor-pointer text-center space-y-1 transition-all ${
                  roleSelection === 'admin'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 font-bold text-blue-700 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500'
                }`}
              >
                <ShieldCheck className="w-5 h-5 mx-auto" />
                <span>Tournament Admin</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-field py-2.5"
              placeholder="e.g. Ashwin Kumar"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field py-2.5"
              placeholder="name@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Create Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field py-2.5"
            />
          </div>

          <button 
            type="submit"
            className="w-full btn btn-primary py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
          >
            Create Account & Continue <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <div className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <button 
            onClick={() => setCurrentView('login')}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign In Here
          </button>
        </div>

      </div>
    </div>
  );
};
