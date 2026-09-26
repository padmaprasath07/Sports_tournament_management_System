import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { TournamentCard } from '../../components/TournamentCard';
import { 
  Trophy, 
  Calendar, 
  Award, 
  Ticket, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Flame 
} from 'lucide-react';

export const ParticipantDashboard = () => {
  const { userProfile, tournaments, setCurrentView, setSelectedTournamentId } = useApp();

  const recommendedTournaments = tournaments.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 material-card bg-gradient-to-r from-blue-900 to-indigo-900 text-white border-none rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Active Athlete
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white">
            Welcome back, {userProfile.name}! 👋
          </h1>
          <p className="text-xs text-slate-300">
            You have 2 upcoming matches scheduled for this week. Keep up the high performance!
          </p>
        </div>

        <button 
          onClick={() => setCurrentView('browse-tournaments')}
          className="btn btn-accent btn-md rounded-2xl flex-shrink-0"
        >
          <Trophy className="w-4 h-4" /> Explore Events
        </button>
      </div>

      {/* KPI Statistics Cards Grid */}
      <div className="grid-stats">
        <StatCard 
          title="Registered Events" 
          value={userProfile.stats.registeredTournaments} 
          icon={Ticket} 
          color="blue"
          trend="up"
          trendValue="2"
        />
        <StatCard 
          title="Upcoming Matches" 
          value={userProfile.stats.upcomingMatches} 
          icon={Calendar} 
          color="emerald"
        />
        <StatCard 
          title="Total Victories" 
          value={userProfile.stats.wins} 
          icon={Trophy} 
          color="amber"
          trend="up"
          trendValue="15%"
        />
        <StatCard 
          title="Certificates" 
          value={userProfile.stats.certificates} 
          icon={Award} 
          color="purple"
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Upcoming Matches & Registered Events */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Upcoming Fixture Widget */}
          <div className="material-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base font-outfit flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" /> My Next Fixture
              </h3>
              <button 
                onClick={() => setCurrentView('match-schedule')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Full Schedule &rarr;
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="badge badge-danger flex items-center gap-1">
                  <span className="live-indicator"></span> Tomorrow • 4:00 PM
                </span>
                <span className="font-semibold text-slate-500">Green Valley Arena • Field 2</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="text-center space-y-1 w-1/3">
                  <div className="w-10 h-10 mx-auto rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    TF
                  </div>
                  <span className="font-bold text-xs block truncate">Thunder FC</span>
                </div>

                <div className="text-center font-extrabold text-lg text-slate-400 font-outfit">
                  VS
                </div>

                <div className="text-center space-y-1 w-1/3">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    BP
                  </div>
                  <span className="font-bold text-xs block truncate">Blue Panthers</span>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 font-medium">Tournament: Champions Football Cup 2026 (Semi-Final)</span>
              </div>
            </div>
          </div>

          {/* Active Registrations Preview */}
          <div className="material-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base font-outfit flex items-center gap-2">
                <Ticket className="w-4 h-4 text-emerald-500" /> Active Tournament Passes
              </h3>
              <button 
                onClick={() => setCurrentView('my-registrations')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All ({userProfile.registrations.length}) &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {userProfile.registrations.map(reg => (
                <div key={reg.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs hover:border-blue-400 transition-colors">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{reg.tournamentName}</p>
                    <p className="text-[11px] text-slate-500">{reg.sport} • Ticket: <span className="font-mono text-blue-600 font-bold">{reg.ticketCode}</span></p>
                  </div>
                  <span className="badge badge-success">{reg.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Recommended & Activity Timeline */}
        <div className="space-y-6">
          
          {/* Recent Activity Timeline */}
          <div className="material-card p-6 space-y-4">
            <h3 className="font-bold text-base font-outfit flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" /> Activity Timeline
            </h3>

            <div className="space-y-4 text-xs relative pl-4 border-l-2 border-slate-200 dark:border-slate-800">
              <div className="relative space-y-0.5">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-900"></div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Registered for T20 League</p>
                <p className="text-[10px] text-slate-400">Today, 2:15 PM</p>
              </div>

              <div className="relative space-y-0.5">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900"></div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Won Quarter-Final Match</p>
                <p className="text-[10px] text-slate-400">Yesterday, 6:30 PM</p>
              </div>

              <div className="relative space-y-0.5">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-white dark:ring-slate-900"></div>
                <p className="font-bold text-slate-900 dark:text-slate-100">Earned MVP Runner Badge</p>
                <p className="text-[10px] text-slate-400">3 days ago</p>
              </div>
            </div>
          </div>

          {/* Quick Event Recommendations */}
          <div className="material-card p-6 space-y-4">
            <h3 className="font-bold text-base font-outfit flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" /> Recommended For You
            </h3>

            <div className="space-y-3">
              {recommendedTournaments.map(t => (
                <div 
                  key={t.id}
                  onClick={() => { setSelectedTournamentId(t.id); setCurrentView('tournament-details'); }}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-colors text-xs space-y-1"
                >
                  <span className="badge badge-primary text-[9px]">{t.sport}</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{t.name}</p>
                  <p className="text-[10px] text-slate-500">Prize Pool: ${t.prizePool}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
