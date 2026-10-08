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
  const { userProfile, tournaments, fixtures, setCurrentView, setSelectedTournamentId } = useApp();

  const recommendedTournaments = tournaments.slice(0, 3);

  // Compute registered tournament IDs and names
  const registeredTournaments = userProfile.registrations || [];
  const registeredTrnIdentifiers = new Set(
    registeredTournaments.flatMap(r => [
      r.tournamentId,
      r.tournamentName?.toLowerCase().trim(),
      r.tournament?.toLowerCase().trim()
    ]).filter(Boolean)
  );

  // Extract all matches belonging to the participant's registered tournaments
  const participantMatches = [];
  if (fixtures && typeof fixtures === 'object') {
    Object.entries(fixtures).forEach(([trnKey, stages]) => {
      const isRegistered = registeredTournaments.some(
        r => r.tournamentId === trnKey || 
             r.tournamentName?.toLowerCase().trim() === trnKey.toLowerCase().trim()
      );
      if (isRegistered && stages && typeof stages === 'object') {
        const trnMeta = tournaments.find(t => t.id === trnKey || t.name?.toLowerCase().trim() === trnKey.toLowerCase().trim());
        Object.entries(stages).forEach(([stageName, matchList]) => {
          if (Array.isArray(matchList)) {
            matchList.forEach(m => {
              participantMatches.push({
                ...m,
                stage: stageName,
                tournamentId: trnKey,
                tournamentName: trnMeta?.name || r?.tournamentName || 'Campus Tournament',
                venue: trnMeta?.venue || 'Campus Sports Arena'
              });
            });
          }
        });
      }
    });
  }

  // Filter next scheduled / upcoming fixture for the participant
  const nextFixture = participantMatches.find(m => m.status !== 'Completed') || null;
  const completedMatches = participantMatches.filter(m => m.status === 'Completed');
  const userTeamNames = new Set(registeredTournaments.map(r => r.team?.toLowerCase().trim()).filter(Boolean));
  const victoriesCount = completedMatches.filter(m => {
    if (!m.winner) return false;
    const w = m.winner.toLowerCase().trim();
    return userTeamNames.has(w) || w === (userProfile.name || '').toLowerCase().trim();
  }).length;

  const completedTournamentsCount = registeredTournaments.filter(reg => {
    const trn = tournaments.find(t => t.id === reg.tournamentId || t.name === reg.tournamentName);
    return trn?.status === 'Completed';
  }).length;

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
            {registeredTournaments.length > 0 
              ? `You have ${registeredTournaments.length} official tournament pass${registeredTournaments.length === 1 ? '' : 'es'} verified in the database.` 
              : 'Welcome to your athlete portal. Explore open championships and register for your first match!'}
          </p>
        </div>

        <button 
          onClick={() => setCurrentView('browse-tournaments')}
          className="btn btn-accent btn-md rounded-2xl flex-shrink-0 cursor-pointer"
        >
          <Trophy className="w-4 h-4" /> Explore Events
        </button>
      </div>

      {/* KPI Statistics Cards Grid - Derived strictly from database records */}
      <div className="grid-stats">
        <StatCard 
          title="Registered Events" 
          value={registeredTournaments.length} 
          icon={Ticket} 
          color="blue"
        />
        <StatCard 
          title="Upcoming Matches" 
          value={nextFixture ? 1 : 0} 
          icon={Calendar} 
          color="emerald"
        />
        <StatCard 
          title="Total Victories" 
          value={victoriesCount} 
          icon={Trophy} 
          color="amber"
        />
        <StatCard 
          title="Completed Events" 
          value={completedTournamentsCount} 
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
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Full Schedule &rarr;
              </button>
            </div>

            {nextFixture ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="badge badge-primary flex items-center gap-1 font-bold">
                    {nextFixture.time || 'Scheduled Match'}
                  </span>
                  <span className="font-semibold text-slate-500">{nextFixture.venue}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="text-center space-y-1 w-1/3">
                    <div className="w-10 h-10 mx-auto rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {(nextFixture.team1 || 'T1').slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-bold text-xs block truncate">{nextFixture.team1}</span>
                  </div>

                  <div className="text-center font-extrabold text-lg text-slate-400 font-outfit">
                    VS
                  </div>

                  <div className="text-center space-y-1 w-1/3">
                    <div className="w-10 h-10 mx-auto rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {(nextFixture.team2 || 'T2').slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-bold text-xs block truncate">{nextFixture.team2}</span>
                  </div>
                </div>

                <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 font-medium">Tournament: {nextFixture.tournamentName} ({nextFixture.stage})</span>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
                <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {registeredTournaments.length > 0 
                    ? 'No scheduled matches yet for your enrolled tournaments.' 
                    : 'You have not registered for any upcoming tournaments yet.'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {registeredTournaments.length > 0 
                    ? 'Fixtures will appear here once scheduled by the tournament administrator.' 
                    : 'Browse open tournaments and register your team to view your match fixtures.'}
                </p>
              </div>
            )}
          </div>

          {/* Active Registrations Preview */}
          <div className="material-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base font-outfit flex items-center gap-2">
                <Ticket className="w-4 h-4 text-emerald-500" /> Active Tournament Passes
              </h3>
              <button 
                onClick={() => setCurrentView('my-registrations')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                View All ({registeredTournaments.length}) &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {registeredTournaments.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 space-y-2">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No active tournament passes registered yet.</p>
                  <button 
                    onClick={() => setCurrentView('browse-tournaments')}
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer block mx-auto"
                  >
                    Register for your first tournament &rarr;
                  </button>
                </div>
              ) : (
                registeredTournaments.slice(0, 3).map(reg => (
                  <div key={reg.id || reg._id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs hover:border-blue-400 transition-colors">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{reg.tournamentName}</p>
                      <p className="text-[11px] text-slate-500">{reg.sport} • Ticket: <span className="font-mono text-blue-600 font-bold">{reg.ticketCode}</span></p>
                    </div>
                    <span className="badge badge-success">{reg.status || 'Approved'}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Recommended & Activity Timeline */}
        <div className="space-y-6">
          
          {/* Authentic Activity Timeline Derived from DB Registrations */}
          <div className="material-card p-6 space-y-4">
            <h3 className="font-bold text-base font-outfit flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" /> Activity Timeline
            </h3>

            {registeredTournaments.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No activity recorded yet in database. Register for a tournament to start your activity timeline.</p>
            ) : (
              <div className="space-y-4 text-xs relative pl-4 border-l-2 border-slate-200 dark:border-slate-800">
                {registeredTournaments.slice(0, 4).map((reg, idx) => (
                  <div key={reg.id || reg._id || idx} className="relative space-y-0.5">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-900"></div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      Enrolled: {reg.tournamentName}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Pass #{reg.ticketCode} • {reg.sport} ({reg.date || 'Active'})
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Event Recommendations */}
          <div className="material-card p-6 space-y-4">
            <h3 className="font-bold text-base font-outfit flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" /> Recommended For You
            </h3>

            <div className="space-y-3">
              {recommendedTournaments.map(t => (
                <div 
                  key={t.id || t._id}
                  onClick={() => { setSelectedTournamentId(t.id || t._id); setCurrentView('tournament-details'); }}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-colors text-xs space-y-1"
                >
                  <span className="badge badge-primary text-[9px]">{t.sport}</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{t.name}</p>
                  <p className="text-[10px] text-slate-500">Prize Pool: ₹{t.prizePool?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
