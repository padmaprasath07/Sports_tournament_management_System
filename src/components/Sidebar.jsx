import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Trophy, 
  Calendar, 
  Award, 
  Bell, 
  User, 
  PlusCircle, 
  FileText, 
  Users, 
  GitBranch, 
  Zap, 
  BarChart3, 
  Settings,
  Ticket
} from 'lucide-react';

export const Sidebar = () => {
  const { role, currentView, setCurrentView } = useApp();

  if (role === 'guest') return null;

  const participantLinks = [
    { view: 'participant-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { view: 'browse-tournaments', label: 'Browse Tournaments', icon: Trophy },
    { view: 'my-registrations', label: 'My Registrations', icon: Ticket },
    { view: 'match-schedule', label: 'Match Schedule', icon: Calendar },
    { view: 'leaderboard', label: 'Leaderboard', icon: Award },
    { view: 'notifications', label: 'Notifications', icon: Bell },
    { view: 'participant-profile', label: 'My Profile', icon: User }
  ];

  const adminLinks = [
    { view: 'admin-dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { view: 'create-tournament', label: 'Create Tournament', icon: PlusCircle },
    { view: 'manage-tournaments', label: 'Manage Tournaments', icon: FileText },
    { view: 'registered-participants', label: 'Participants & Fees', icon: Users },
    { view: 'fixture-management', label: 'Fixture & Brackets', icon: GitBranch },
    { view: 'live-score', label: 'Live Score Console', icon: Zap },
    { view: 'reports-analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { view: 'admin-profile', label: 'Admin Profile & Logs', icon: Settings }
  ];

  const activeLinks = role === 'admin' ? adminLinks : participantLinks;

  return (
    <aside className="w-72 lg:w-80 xl:w-84 flex-shrink-0 hidden md:block">
      <div className="sticky top-20 w-full bg-card border border-border rounded-2xl p-4 shadow-sm space-y-6 min-h-[calc(100vh-6rem)]">
        
        {/* Sidebar Header */}
        <div className="px-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {role === 'admin' ? 'ADMIN NAVIGATION' : 'PARTICIPANT MENU'}
          </span>
        </div>

        {/* Links List */}
        <nav className="space-y-1.5">
          {activeLinks.map(link => {
            const Icon = link.icon;
            const isActive = currentView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => setCurrentView(link.view)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200/50 dark:border-blue-800/50'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Help Card */}
        <div className="p-3.5 rounded-xl gradient-card border border-blue-100 dark:border-slate-800 text-xs space-y-2">
          <p className="font-semibold text-slate-900 dark:text-slate-100">Need Assistance?</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Contact the sports coordinator or visit the help desk.</p>
          <button 
            onClick={() => setCurrentView('contact')}
            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Contact Support &rarr;
          </button>
        </div>

      </div>
    </aside>
  );
};
