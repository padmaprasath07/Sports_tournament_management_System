import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { SportPulseLogo } from '../components/SportPulseLogo';
import { 
  Trophy, 
  User, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Activity
} from 'lucide-react';

export const Register = () => {
  const { registerUserAccount, setCurrentView, addToast, dbStatus } = useApp();
  
  const [roleSelection, setRoleSelection] = useState('participant');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredSport, setPreferredSport] = useState('Football');
  const [location, setLocation] = useState('Campus Main Arena');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const sportsList = ['Football', 'Cricket', 'Basketball', 'Badminton', 'Tennis', 'Chess', 'Athletics'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (password.length < 4) {
      setFormError('Password must be at least 4 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!agreeTerms) {
      setFormError('Please accept the Fair Play & Sportsmanship guidelines.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: roleSelection,
        phone: phone.trim(),
        preferredSports: [preferredSport],
        location: location.trim(),
        bio: roleSelection === 'admin' 
          ? 'Campus Athletic Coordinator & Tournament Admin.' 
          : `Active competitor in collegiate ${preferredSport} leagues.`
      };

      const result = await registerUserAccount(payload);

      if (result.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });

        addToast(
          `🎉 Welcome to SportPulse, ${result.data?.name || name}! Account created and saved to MongoDB.`, 
          'success'
        );
      }
    } catch (err) {
      console.error('[Registration Error]', err);
      const errMsg = err.message || 'Failed to create account. Please try again.';
      setFormError(errMsg);
      addToast(errMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6 sm:py-10 px-4 animate-fade-in">
      <div className="material-card p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#11192e]/95 backdrop-blur-xl rounded-3xl">
        
        {/* Header with Live DB Connectivity Badge */}
        <div className="text-center space-y-2.5">
          <div className="flex justify-center">
            <SportPulseLogo size="lg" showText={false} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-urbanist text-slate-900 dark:text-white tracking-tight">
            Create Sport<span className="text-blue-600 dark:text-blue-400">Pulse</span> Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Join the collegiate sports tournament network. Enroll in premier championships, track live brackets, and compete for honors.
          </p>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Database className="w-3 h-3" />
            <span>Direct MongoDB Cloud & Local Database Sync</span>
          </div>
        </div>

        {/* Error Alert if any */}
        {formError && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400 animate-shake">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Role Selection Toggle */}
          <div className="form-group space-y-1.5">
            <label className="form-label font-bold text-slate-700 dark:text-slate-200">
              I want to register as:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => setRoleSelection('participant')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer text-center space-y-1.5 transition-all ${
                  roleSelection === 'participant'
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 font-bold text-emerald-700 dark:text-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center ${
                  roleSelection === 'participant' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  <User className="w-4 h-4" />
                </div>
                <div className="font-outfit font-bold text-sm">Athlete / Participant</div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                  Register for cups, track player statistics & fixtures
                </p>
              </div>

              <div 
                onClick={() => setRoleSelection('admin')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer text-center space-y-1.5 transition-all ${
                  roleSelection === 'admin'
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 font-bold text-blue-700 dark:text-blue-300 shadow-md shadow-blue-500/10'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center ${
                  roleSelection === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="font-outfit font-bold text-sm">Tournament Admin</div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                  Create championships, update live scores & manage fees
                </p>
              </div>
            </div>
          </div>

          {/* Name & Email Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-group space-y-1">
              <label className="form-label font-semibold">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="input-field pl-11 py-2.5 rounded-xl w-full"
                  placeholder="e.g. Vikramaditya Singh"
                />
              </div>
            </div>

            <div className="form-group space-y-1">
              <label className="form-label font-semibold">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field pl-11 py-2.5 rounded-xl w-full"
                  placeholder="athlete@campus.edu"
                />
              </div>
            </div>
          </div>

          {/* Phone & Sport Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-group space-y-1">
              <label className="form-label font-semibold">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="input-field pl-11 py-2.5 rounded-xl w-full"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="form-group space-y-1">
              <label className="form-label font-semibold">Primary Sport</label>
              <div className="relative">
                <Activity className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select 
                  value={preferredSport}
                  onChange={e => setPreferredSport(e.target.value)}
                  className="input-field pl-11 py-2.5 rounded-xl w-full cursor-pointer bg-white dark:bg-slate-900"
                >
                  {sportsList.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Campus Location */}
          <div className="form-group space-y-1">
            <label className="form-label font-semibold">Campus / Athletic Facility</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input 
                type="text" 
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="input-field pl-11 py-2.5 rounded-xl w-full"
                placeholder="Central Sports Arena / Campus Field"
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-group space-y-1">
              <label className="form-label font-semibold">Create Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pl-11 pr-11 py-2.5 rounded-xl w-full"
                  placeholder="Min 4 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="form-group space-y-1">
              <label className="form-label font-semibold">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="input-field pl-11 py-2.5 rounded-xl w-full"
                  placeholder="Re-enter password"
                />
              </div>
            </div>
          </div>

          {/* Guidelines / Terms Checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input 
              type="checkbox" 
              id="terms"
              checked={agreeTerms}
              onChange={e => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="terms" className="text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              I agree to the <span className="font-semibold text-slate-800 dark:text-slate-200">SportPulse Fair Play & Athlete Code of Conduct</span>. All tournament registrations will be recorded under this account.
            </label>
          </div>

          {/* Submit Registration Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full btn btn-primary py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding to MongoDB Database...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Register Account & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Footer Link to Sign In */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
          Already registered on SportPulse?{' '}
          <button 
            onClick={() => setCurrentView('login')}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Sign In Here &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};
