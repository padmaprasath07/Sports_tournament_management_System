import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Settings, 
  Bell, 
  SlidersHorizontal, 
  X, 
  Shield, 
  CheckCircle2,
  Trophy,
  Activity,
  Flame,
  Eye,
  Filter,
  PlusCircle,
  Edit3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScheduleMatchModal, UpdateMatchResultModal } from '../../components/Modals';

export const MatchSchedule = () => {
  const { setCurrentView, addToast, role, tournaments, fixtures } = useApp();
  const isAdmin = role === 'admin';
  
  // Filters & State
  const [sportFilter, setSportFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [resultModalMatch, setResultModalMatch] = useState(null);

  // Default clean sports fixtures
  const defaultFixtures = [
    {
      id: 'fix-1',
      matchId: 'm1',
      tournamentId: 'trn-102',
      stage: 'quarterFinals',
      stageLabel: 'Quarterfinal 1',
      sport: 'Football',
      sportIcon: '⚽',
      tournament: 'Champions Football Cup 2026',
      team1: { name: 'Thunderbolts FC', code: 'TBF', score: 2, logo: '⚡' },
      team2: { name: 'Blue Panthers', code: 'BLP', score: 1, logo: '🐆' },
      status: 'Completed',
      date: 'Oct 18, 2026',
      time: '04:00 PM',
      venue: 'Main Campus Stadium • Pitch 1',
      winner: 'Thunderbolts FC'
    },
    {
      id: 'fix-2',
      matchId: 'm2',
      tournamentId: 'trn-101',
      stage: 'quarterFinals',
      stageLabel: 'Group Clash (Match #12)',
      sport: 'Cricket',
      sportIcon: '🏏',
      tournament: 'National Premier League T20',
      team1: { name: 'Royal Chargers', code: 'RCH', score: 178, logo: '🦁' },
      team2: { name: 'City Strikers', code: 'CST', score: 175, logo: '🎯' },
      status: 'Completed',
      date: 'Oct 18, 2026',
      time: '02:30 PM',
      venue: 'Metropolitan Oval Ground',
      winner: 'Royal Chargers'
    },
    {
      id: 'fix-3',
      matchId: 'm3',
      tournamentId: 'trn-103',
      stage: 'semiFinals',
      stageLabel: 'Semifinal A',
      sport: 'Basketball',
      sportIcon: '🏀',
      tournament: 'Metropolitan 3x3 Basketball Showdown',
      team1: { name: 'Hoop Kings', code: 'HPK', score: 72, logo: '👑' },
      team2: { name: 'Street Legends', code: 'STL', score: 68, logo: '🔥' },
      status: 'Completed',
      date: 'Oct 17, 2026',
      time: '06:00 PM',
      venue: 'Indoor Arena • Court 1',
      winner: 'Hoop Kings'
    },
    {
      id: 'fix-4',
      matchId: 'm4',
      tournamentId: 'trn-105',
      stage: 'quarterFinals',
      stageLabel: 'Singles Quarterfinal',
      sport: 'Badminton',
      sportIcon: '🏸',
      tournament: 'State Badminton Singles Trophy',
      team1: { name: 'Alex Mercer', code: 'MER', score: 21, logo: '🏸' },
      team2: { name: 'David Chen', code: 'CHN', score: 18, logo: '🏸' },
      status: 'Completed',
      date: 'Oct 17, 2026',
      time: '11:00 AM',
      venue: 'Indoor Complex • Court 3',
      winner: 'Alex Mercer'
    },
    {
      id: 'fix-5',
      matchId: 'm5',
      tournamentId: 'trn-102',
      stage: 'semiFinals',
      stageLabel: 'Semifinal 1',
      sport: 'Football',
      sportIcon: '⚽',
      tournament: 'Champions Football Cup 2026',
      team1: { name: 'Thunderbolts FC', code: 'TBF', score: 0, logo: '⚡' },
      team2: { name: 'Apex Wolves', code: 'APX', score: 0, logo: '🐺' },
      status: 'Scheduled',
      date: 'Oct 20, 2026',
      time: '06:30 PM',
      venue: 'Main Campus Stadium • Pitch 2',
      winner: ''
    },
    {
      id: 'fix-6',
      matchId: 'm6',
      tournamentId: 'trn-103',
      stage: 'final',
      stageLabel: 'Championship Final',
      sport: 'Basketball',
      sportIcon: '🏀',
      tournament: 'Metropolitan 3x3 Basketball Showdown',
      team1: { name: 'Hoop Kings', code: 'HPK', score: 0, logo: '👑' },
      team2: { name: 'Titan Ballers', code: 'TIB', score: 0, logo: '🛡️' },
      status: 'Scheduled',
      date: 'Oct 21, 2026',
      time: '05:00 PM',
      venue: 'Indoor Sports Hub • Court 1',
      winner: ''
    }
  ];

  // Dynamically resolve all fixtures from AppContext + fallback
  const getFixturesList = () => {
    const list = [];
    if (tournaments && tournaments.length > 0) {
      tournaments.forEach(trn => {
        const trnFix = fixtures[trn.id];
        if (trnFix) {
          ['quarterFinals', 'semiFinals', 'final'].forEach(stg => {
            (trnFix[stg] || []).forEach(m => {
              const isCompleted = m.status === 'Completed' || (m.status && m.status.startsWith('Champion'));
              const stageLabel = stg === 'quarterFinals' ? 'Quarterfinal' : (stg === 'semiFinals' ? 'Semifinal' : 'Championship Final');
              const sportIcon = trn.sport === 'Football' ? '⚽' : (trn.sport === 'Cricket' ? '🏏' : (trn.sport === 'Basketball' ? '🏀' : (trn.sport === 'Badminton' ? '🏸' : (trn.sport === 'Chess' ? '♟️' : '🏆'))));
              list.push({
                id: `${trn.id}-${m.id}`,
                matchId: m.id,
                tournamentId: trn.id,
                stage: stg,
                stageLabel,
                sport: trn.sport,
                sportIcon,
                tournament: trn.name,
                team1: { name: m.team1 || 'Team 1', code: (m.team1 || 'T1').slice(0, 3).toUpperCase(), score: typeof m.score1 === 'number' ? m.score1 : 0, logo: '⚡' },
                team2: { name: m.team2 || 'Team 2', code: (m.team2 || 'T2').slice(0, 3).toUpperCase(), score: typeof m.score2 === 'number' ? m.score2 : 0, logo: '🐆' },
                status: isCompleted ? 'Completed' : 'Scheduled',
                date: m.date || trn.startDate || 'Upcoming',
                time: m.time || '10:00 AM',
                venue: m.court || trn.venue || 'Campus Arena',
                winner: m.winner || (isCompleted ? (m.score1 > m.score2 ? m.team1 : m.team2) : ''),
                rawMatch: m
              });
            });
          });
        }
      });
    }

    return list.length > 0 ? list : defaultFixtures;
  };

  const fixturesData = getFixturesList();

  // Filtering
  const filteredFixtures = fixturesData.filter(m => {
    if (sportFilter !== 'All' && m.sport.toLowerCase() !== sportFilter.toLowerCase()) return false;
    if (statusFilter === 'Scheduled' && m.status !== 'Scheduled') return false;
    if (statusFilter === 'Completed' && m.status !== 'Completed') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTeams = m.team1.name.toLowerCase().includes(q) || m.team2.name.toLowerCase().includes(q);
      const matchVenue = m.venue.toLowerCase().includes(q);
      const matchTourney = m.tournament.toLowerCase().includes(q);
      if (!matchTeams && !matchVenue && !matchTourney) return false;
    }

    return true;
  });

  return (
    <div className="clario-canvas animate-fade-in -mt-4">
      {/* MASTER CONTAINER */}
      <div className="clario-master-card p-6 md:p-9 max-w-[1340px] mx-auto relative">
        
        {/* HEADER: TITLE & CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Official Tournament Schedule</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-outfit text-slate-900 dark:text-white tracking-tight">
              Match Fixtures & Timetable
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Browse official tournament match schedules, venue allocations, and confirmed match results.
            </p>
          </div>

          {/* Quick Action & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            {isAdmin && (
              <button 
                onClick={() => setScheduleModalOpen(true)}
                className="btn btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <PlusCircle className="w-4 h-4" /> Schedule Match
              </button>
            )}

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search team or venue..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-2 text-xs rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none w-44 sm:w-56 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <button 
              onClick={() => {
                setSportFilter('All');
                setStatusFilter('All');
                setSearchQuery('');
              }}
              className="clario-pill text-xs font-bold px-3.5 py-2 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* PILL FILTER BARS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-b border-slate-100 dark:border-slate-800/60">
          
          {/* Sports Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Football', 'Cricket', 'Basketball', 'Badminton', 'Chess'].map(s => (
              <button
                key={s}
                onClick={() => setSportFilter(s)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${sportFilter === s ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                {s === 'Football' ? '⚽ Football' : s === 'Cricket' ? '🏏 Cricket' : s === 'Basketball' ? '🏀 Basketball' : s === 'Badminton' ? '🏸 Badminton' : s === 'Chess' ? '♟️ Chess' : 'All Sports'}
              </button>
            ))}
          </div>

          {/* Status Tabs Pills (All, Scheduled, Completed) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-full border border-slate-200/60 dark:border-slate-700/60 self-start sm:self-auto">
            {['All', 'Scheduled', 'Completed'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${statusFilter === st ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                {st === 'Scheduled' ? '📅 Scheduled' : st === 'Completed' ? '✓ Completed' : 'All Matches'}
              </button>
            ))}
          </div>
        </div>

        {/* FIXTURES LIST GRID */}
        <div className="pt-6 space-y-4">
          {filteredFixtures.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
              <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300 text-base">No matches found</h3>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your sport or status filters.</p>
            </div>
          ) : (
            filteredFixtures.map(match => {
              const isCompleted = match.status === 'Completed';
              return (
                <div 
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#15203c] border transition-all hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500/50 ${
                    selectedMatch?.id === match.id 
                      ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' 
                      : 'border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  {/* Top Header Bar: Tournament Meta & Venue */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800/80 text-xs">
                    {/* Left: Sport Icon + Tournament + Stage + Date */}
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-base leading-none p-1 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                        {match.sportIcon}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white font-outfit text-xs sm:text-sm">
                        {match.tournament}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">
                        {match.stageLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        <CalendarIcon className="w-3 h-3 text-slate-400" />
                        {match.date}
                      </span>
                    </div>

                    {/* Right: Venue + Time + Admin Result Button */}
                    <div className="flex items-center flex-wrap gap-3">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="max-w-[180px] sm:max-w-[240px] truncate">{match.venue}</span>
                        <span className="mx-1 opacity-40">•</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">{match.time}</span>
                      </div>

                      {isAdmin && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setResultModalMatch({
                              tournamentId: match.tournamentId,
                              stage: match.stage,
                              match: {
                                id: match.matchId,
                                team1: match.team1.name,
                                team2: match.team2.name,
                                score1: match.team1.score,
                                score2: match.team2.score,
                                winner: match.winner
                              },
                              sport: match.sport
                            });
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm flex-shrink-0 cursor-pointer ${
                            isCompleted 
                              ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{isCompleted ? 'Edit Result' : 'Enter Result'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Main Matchup Score Card */}
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-11 items-center gap-3 sm:gap-4">
                    {/* Team 1 */}
                    <div className="sm:col-span-4 flex items-center justify-start sm:justify-end gap-3 text-left sm:text-right">
                      <div className="order-2 sm:order-1 min-w-0">
                        <span className={`font-bold text-sm sm:text-base block font-outfit truncate ${match.winner === match.team1.name ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-slate-900 dark:text-white'}`}>
                          {match.team1.name}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                          {match.team1.code}
                        </span>
                      </div>
                      <div className="order-1 sm:order-2 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                        {match.team1.logo}
                      </div>
                    </div>

                    {/* Center Score / VS Pill */}
                    <div className="sm:col-span-3 flex flex-col items-center justify-center my-1 sm:my-0">
                      {isCompleted ? (
                        <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-sm sm:text-base font-outfit shadow-inner border border-slate-200 dark:border-slate-700">
                          <span>{match.team1.score} - {match.team2.score}</span>
                        </div>
                      ) : (
                        <div className="px-4 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-extrabold text-xs sm:text-sm font-outfit border border-amber-200/60 dark:border-amber-800/60">
                          VS
                        </div>
                      )}
                      <span className="text-[10px] text-slate-400 font-medium mt-1">
                        {isCompleted ? (match.winner ? `Winner: ${match.winner}` : 'Final Result') : `Scheduled (${match.time})`}
                      </span>
                    </div>

                    {/* Team 2 */}
                    <div className="sm:col-span-4 flex items-center justify-start gap-3 text-left">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                        {match.team2.logo}
                      </div>
                      <div className="min-w-0">
                        <span className={`font-bold text-sm sm:text-base block font-outfit truncate ${match.winner === match.team2.name ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-slate-900 dark:text-white'}`}>
                          {match.team2.name}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                          {match.team2.code}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Schedule Match Modal */}
      {scheduleModalOpen && (
        <ScheduleMatchModal 
          onClose={() => setScheduleModalOpen(false)}
        />
      )}

      {/* Update Match Result Modal */}
      {resultModalMatch && (
        <UpdateMatchResultModal 
          tournamentId={resultModalMatch.tournamentId}
          stage={resultModalMatch.stage}
          match={resultModalMatch.match}
          sport={resultModalMatch.sport}
          onClose={() => setResultModalMatch(null)}
        />
      )}
    </div>
  );
};
