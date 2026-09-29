import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SportPulseLogo } from './SportPulseLogo';
import { DbStatusBadge } from './DbStatusBadge';
import { 
  Trophy, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  User, 
  ShieldCheck, 
  Menu, 
  X,
  ChevronDown,
  CheckCircle,
  LogOut,
  Sparkles,
  UserPlus
} from 'lucide-react';

export const Navbar = () => {
  const { 
    role, 
    setRole, 
    theme, 
    toggleTheme, 
    currentView, 
    setCurrentView,
    notifications,
    searchQuery,
    setSearchQuery,
    addToast,
    logout,
    userProfile
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const getUserInitials = (name, currentRole) => {
    if (!name) return currentRole === 'admin' ? 'AD' : 'AT';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleNavClick = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView(role === 'admin' ? 'manage-tournaments' : 'browse-tournaments');
    }
  };

  return (
    <header className="sticky top-2 z-40 w-full px-3 sm:px-6 lg:px-8 transition-colors duration-300 pointer-events-none">
      <div className="max-w-7xl mx-auto rounded-full bg-white/95 dark:bg-[#11192e]/95 shadow-xl shadow-slate-200/40 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 pointer-events-auto">
          
          {/* Brand Logo with Custom SportPulse Crest */}
          <div className="cursor-pointer flex-shrink-0" onClick={() => handleNavClick('home')}>
            <SportPulseLogo size="md" />
          </div>

          {/* Main Navigation Links as Floating Tactile Pills */}
          <nav className="hidden lg:flex items-center bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-full border border-slate-200/60 dark:border-slate-700/60 shadow-inner gap-1 flex-shrink-0">
            <button 
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${currentView === 'home' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('browse-tournaments')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${currentView === 'browse-tournaments' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Tournaments
            </button>
            <button 
              onClick={() => handleNavClick('match-schedule')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${currentView === 'match-schedule' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Fixtures
            </button>
            <button 
              onClick={() => handleNavClick('leaderboard')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${currentView === 'leaderboard' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Leaderboard
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${currentView === 'about' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
            >
              About
            </button>
          </nav>

          {/* Actions & Profile Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            
            {/* Search Pill (visible on xl screens to maintain clean spacing) */}
            <form onSubmit={handleSearchSubmit} className="hidden xl:flex relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 outline-none w-24 focus:w-36 transition-all"
              />
            </form>

            {/* Active Role Indicator Badge (when logged in as Participant or Admin) */}
            {role !== 'guest' && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold border border-slate-200/60 dark:border-slate-700/60">
                <span className={`w-2 h-2 rounded-full ${role === 'admin' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
                <span className={role === 'admin' ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'}>
                  {role === 'admin' ? 'Admin Portal' : 'Athlete Portal'}
                </span>
              </div>
            )}

            {/* Database Live Connectivity Indicator */}
            <DbStatusBadge />

            {/* Dark/Light Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="font-semibold text-sm font-outfit">Notifications</h4>
                    <span className="text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium px-2 py-0.5 rounded-full">
                      {unreadCount} unread
                    </span>
                  </div>
                  <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-xs">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</div>
                        <div className="text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => { setCurrentView('notifications'); setNotificationsOpen(false); }}
                    className="w-full mt-3 py-1.5 text-xs text-center font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </div>

            {/* Profile Menu / Auth CTAs */}
            {role === 'guest' ? (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <button 
                  onClick={() => handleNavClick('login')}
                  className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-full transition-all text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                    currentView === 'login' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold' : ''
                  }`}
                >
                  Log In
                </button>
                <button 
                  onClick={() => handleNavClick('register')}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-500/25 transition-all flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap cursor-pointer ${
                    currentView === 'register' ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' : ''
                  }`}
                  title="Create SportPulse Athlete or Admin Account"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full gradient-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {getUserInitials(userProfile?.name, role)}
                  </div>
                  <span className="hidden sm:block text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[130px]" title={userProfile?.name}>
                    {userProfile?.name || (role === 'admin' ? 'Admin Director' : 'Athlete Portal')}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate" title={userProfile?.name}>
                        {userProfile?.name || (role === 'admin' ? 'Admin Director' : 'Athlete')}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate" title={userProfile?.email}>
                        {userProfile?.email || `${role} Account`}
                      </p>
                    </div>

                    <div className="py-1">
                      {role === 'participant' ? (
                        <>
                          <button 
                            onClick={() => { handleNavClick('participant-dashboard'); setProfileDropdownOpen(false); }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                          >
                            <User className="w-3.5 h-3.5" /> Dashboard
                          </button>
                          <button 
                            onClick={() => { handleNavClick('my-registrations'); setProfileDropdownOpen(false); }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                          >
                            <Trophy className="w-3.5 h-3.5" /> My Registrations
                          </button>
                          <button 
                            onClick={() => { handleNavClick('participant-profile'); setProfileDropdownOpen(false); }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Profile Settings
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => { handleNavClick('admin-dashboard'); setProfileDropdownOpen(false); }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> Admin Dashboard
                          </button>
                          <button 
                            onClick={() => { handleNavClick('create-tournament'); setProfileDropdownOpen(false); }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                          >
                            <Trophy className="w-3.5 h-3.5" /> Create Tournament
                          </button>
                          <button 
                            onClick={() => { handleNavClick('admin-profile'); setProfileDropdownOpen(false); }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                          >
                            <User className="w-3.5 h-3.5" /> System Settings
                          </button>
                        </>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button 
                        onClick={() => { if (logout) logout(); else setRole('guest'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Drawer Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3 animate-fade-in">
          {role !== 'guest' && userProfile?.name && (
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-9 h-9 rounded-full gradient-primary text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                {getUserInitials(userProfile?.name, role)}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{userProfile.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{userProfile.email || `${role} Account`}</p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500">Switch Role:</span>
            <div className="flex gap-1">
              <button onClick={() => setRole('guest')} className={`px-2 py-1 text-xs rounded ${role === 'guest' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>Guest</button>
              <button onClick={() => setRole('participant')} className={`px-2 py-1 text-xs rounded ${role === 'participant' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>Participant</button>
              <button onClick={() => setRole('admin')} className={`px-2 py-1 text-xs rounded ${role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>Admin</button>
            </div>
          </div>

          <div className="space-y-1">
            <button onClick={() => handleNavClick('home')} className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Home</button>
            <button onClick={() => handleNavClick('browse-tournaments')} className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Browse Tournaments</button>
            <button onClick={() => handleNavClick('match-schedule')} className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Match Fixtures</button>
            <button onClick={() => handleNavClick('leaderboard')} className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Leaderboard</button>
            <button onClick={() => handleNavClick('about')} className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">About Us</button>
            <button onClick={() => handleNavClick('contact')} className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Contact</button>
          </div>
        </div>
      )}
    </header>
  );
};
