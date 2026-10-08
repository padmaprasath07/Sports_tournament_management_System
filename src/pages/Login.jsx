import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { SportPulseLogo } from '../components/SportPulseLogo';
import { 
  Trophy, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Compass, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Activity,
  Calendar,
  Award
} from 'lucide-react';

export const Login = () => {
  const { setRole, loginUserAccount, continueAsGuest, setCurrentView, addToast } = useApp();
  
  // Tabs: 'participant' | 'admin' | 'guest'
  const [activeTab, setActiveTab] = useState('participant');
  const [email, setEmail] = useState('ashwin.player@sportpulse.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setLoginError('');
    if (tab === 'participant') {
      setEmail('ashwin.player@sportpulse.com');
      setPassword('password123');
    } else if (tab === 'admin') {
      setEmail('admin@sportpulse.com');
      setPassword('password123');
    }
  };

  const handleAutofill = (roleType) => {
    if (roleType === 'participant') {
      setEmail('ashwin.player@sportpulse.com');
      setPassword('password123');
      addToast('Athlete credentials filled.', 'info');
    } else if (roleType === 'admin') {
      setEmail('admin@sportpulse.com');
      setPassword('password123');
      addToast('Admin credentials filled.', 'info');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (activeTab === 'guest') {
      handleContinueAsGuest();
      return;
    }

    if (!email.trim() || !password) {
      setLoginError('Please provide both your email address and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (loginUserAccount) {
        const res = await loginUserAccount({ 
          email: email.trim(), 
          password, 
          role: activeTab 
        });

        if (res.success) {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
          addToast(`🎉 Welcome back, ${res.data?.name || 'Athlete'}!`, 'success');
        }
      } else {
        setRole(activeTab);
        setCurrentView(activeTab === 'admin' ? 'admin-dashboard' : 'participant-dashboard');
        addToast(`Logged in as ${activeTab === 'admin' ? 'Admin' : 'Participant'}!`, 'success');
      }
    } catch (err) {
      console.warn('[Login Error]', err);
      let errMsg = err.message || 'Authentication failed. Please verify your email and password.';
      if (errMsg.toLowerCase().includes('failed to fetch') || errMsg.toLowerCase().includes('network') || errMsg.toLowerCase().includes('cloudbackend')) {
        errMsg = 'Unable to reach authentication server. If using demo credentials, click "Fill Demo" and sign in.';
      }
      setLoginError(errMsg);
      addToast(errMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueAsGuest = () => {
    if (continueAsGuest) {
      continueAsGuest();
    } else {
      setRole('guest');
      setCurrentView('browse-tournaments');
      addToast('Exploring SportPulse as a Guest', 'info');
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto py-8 sm:py-12 px-4 animate-fade-in">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-600/15 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="material-card p-6 sm:p-10 space-y-7 shadow-2xl border border-slate-200/90 dark:border-slate-800/90 rounded-3xl bg-white/95 dark:bg-[#10172a]/95 backdrop-blur-2xl">
        
        {/* Header with SportPulse Brand Emblem */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <SportPulseLogo size="lg" showText={false} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-urbanist text-slate-900 dark:text-white tracking-tight">
              Sport<span className="text-blue-600 dark:text-blue-400">Pulse</span> Access Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
              Choose your role to sign into championships, digital passes, and live scorekeeping console.
            </p>
          </div>
        </div>

        {/* 3-Role Options Tab Bar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70">
          
          {/* Participant Tab */}
          <button 
            type="button"
            onClick={() => handleTabChange('participant')}
            className={`p-2.5 sm:p-3 rounded-xl text-left transition-all relative flex flex-col items-center sm:items-start gap-1 cursor-pointer ${
              activeTab === 'participant'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md shadow-emerald-500/10 font-bold border border-emerald-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/40'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span className="text-xs font-outfit font-bold">Athlete</span>
            </div>
            <span className="text-[10px] hidden sm:block opacity-75 font-normal">Participant Login</span>
          </button>

          {/* Admin Tab */}
          <button 
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`p-2.5 sm:p-3 rounded-xl text-left transition-all relative flex flex-col items-center sm:items-start gap-1 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/10 font-bold border border-indigo-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/40'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-outfit font-bold">Admin</span>
            </div>
            <span className="text-[10px] hidden sm:block opacity-75 font-normal">Director Portal</span>
          </button>

          {/* Guest Tab */}
          <button 
            type="button"
            onClick={() => handleTabChange('guest')}
            className={`p-2.5 sm:p-3 rounded-xl text-left transition-all relative flex flex-col items-center sm:items-start gap-1 cursor-pointer ${
              activeTab === 'guest'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md shadow-blue-500/10 font-bold border border-blue-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/40'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span className="text-xs font-outfit font-bold">Guest</span>
            </div>
            <span className="text-[10px] hidden sm:block opacity-75 font-normal">Explore Publicly</span>
          </button>

        </div>

        {/* Error Alert */}
        {loginError && (
          <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400 animate-shake">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1 font-medium">{loginError}</div>
          </div>
        )}

        {/* TAB 1 & 2: Participant & Admin Login Forms */}
        {activeTab !== 'guest' ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Context Badge for current role */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
              activeTab === 'admin' 
                ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200/80 dark:border-indigo-800/80 text-indigo-900 dark:text-indigo-200' 
                : 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
            }`}>
              <div className="flex items-center gap-2">
                {activeTab === 'admin' ? (
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                )}
                <div>
                  <p className="font-bold text-xs">
                    {activeTab === 'admin' ? 'Tournament Administrator Clearance' : 'Athlete & Competitor Account'}
                  </p>
                  <p className="text-[11px] opacity-80">
                    {activeTab === 'admin' 
                      ? 'Access to tournament creator, bracket seeding, referee scorekeeper & participant fee logs'
                      : 'Enroll in championships, download entry passes & track personal match records'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleAutofill(activeTab)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-700'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-700'
                }`}
                title="Auto-fill credentials"
              >
                <Zap className="w-3 h-3" />
                <span>Quick Fill</span>
              </button>
            </div>

            {/* Email Address */}
            <div className="form-group space-y-1">
              <label className="form-label font-semibold text-slate-700 dark:text-slate-300">
                {activeTab === 'admin' ? 'Administrator Email *' : 'Athlete Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field pl-11 pr-3 py-2.5 rounded-xl w-full text-xs"
                  placeholder={activeTab === 'admin' ? 'admin@sportpulse.com' : 'athlete@campus.edu'}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group space-y-1">
              <div className="flex items-center justify-between">
                <label className="form-label font-semibold text-slate-700 dark:text-slate-300">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => addToast('Default password is: password123', 'info')}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pl-11 pr-11 py-2.5 rounded-xl w-full text-xs"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-400">Keep me signed in on this device</span>
              </label>

              <span className="text-[11px] text-slate-400 font-mono">MongoDB ODM Active</span>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-indigo-500/25'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/25'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Credentials with MongoDB...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {activeTab === 'admin' ? 'Sign In to Admin Console' : 'Sign In as Athlete'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        ) : (
          /* TAB 3: Guest Explorer View */
          <div className="space-y-5 animate-fade-in text-xs">
            
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 text-blue-900 dark:text-blue-100 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-blue-700 dark:text-blue-300">
                <Compass className="w-5 h-5" />
                <span>Explore SportPulse Publicly</span>
              </div>
              <p className="text-xs text-blue-800/90 dark:text-blue-300/90 leading-relaxed">
                As a guest, you can freely browse campus tournaments, inspect interactive knockout brackets, track real-time match clocks, and explore the global leaderboard.
              </p>
            </div>

            {/* Guest Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2.5">
                <Trophy className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Active Tournaments</h4>
                  <p className="text-[11px] text-slate-500">Football, Cricket, Basketball & Badminton leagues</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2.5">
                <Activity className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Live Fixtures</h4>
                  <p className="text-[11px] text-slate-500">Quarterfinals, Semifinals & Championship trees</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2.5">
                <Award className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Athletic Leaderboard</h4>
                  <p className="text-[11px] text-slate-500">Player form, win rates, points tables & trophies</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Match Schedules</h4>
                  <p className="text-[11px] text-slate-500">Campus venue timings, team rosters & dates</p>
                </div>
              </div>
            </div>

            {/* Guest Action Button */}
            <button 
              type="button"
              onClick={handleContinueAsGuest}
              className="w-full btn btn-primary py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Continue as Guest & Browse Tournaments</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

        {/* Footer: Register Callout */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Don't have a SportPulse account?{' '}
            <button 
              type="button"
              onClick={() => setCurrentView('register')}
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Register Athlete Account &rarr;
            </button>
          </div>
          
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>MongoDB Connected</span>
          </div>
        </div>

      </div>
    </div>
  );
};
