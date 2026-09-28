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
  Radio,
  Eye,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MatchSchedule = () => {
  const { setCurrentView, addToast } = useApp();
  
  // Filters & State
  const [sportFilter, setSportFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Real sports match fixtures
  const fixturesData = [
    {
      id: 'fix-1',
      sport: 'Football',
      sportIcon: '⚽',
      tournament: 'Champions Football Cup 2026',
      stage: 'Quarterfinal 1',
      team1: { name: 'Thunderbolts FC', code: 'TBF', score: 2, logo: '⚡' },
      team2: { name: 'Blue Panthers', code: 'BLP', score: 1, logo: '🐆' },
      status: 'Live',
      matchTime: "78' Live",
      date: 'Today, Oct 18',
      time: '04:00 PM',
      venue: 'Main Campus Stadium • Pitch 1',
      referee: 'David Miller (FIFA Certified)',
      officials: [
        { name: 'David M.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
        { name: 'Sarah K.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80' }
      ]
    },
    {
      id: 'fix-2',
      sport: 'Cricket',
      sportIcon: '🏏',
      tournament: 'National Premier League T20',
      stage: 'Group Clash (Match #12)',
      team1: { name: 'Royal Chargers', code: 'RCH', score: '178/4 (18.2 ov)', logo: '🦁' },
      team2: { name: 'City Strikers', code: 'CST', score: '175/7 (20 ov)', logo: '🎯' },
      status: 'Live',
      matchTime: 'Chase in progress',
      date: 'Today, Oct 18',
      time: '02:30 PM',
      venue: 'Metropolitan Oval Ground',
      referee: 'Umpire Richard Kettleborough',
      officials: [
        { name: 'Richard K.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80' }
      ]
    },
    {
      id: 'fix-3',
      sport: 'Basketball',
      sportIcon: '🏀',
      tournament: 'Varsity Basketball Championship',
      stage: 'Semifinal A',
      team1: { name: 'Hoop Kings', code: 'HPK', score: 72, logo: '👑' },
      team2: { name: 'Street Legends', code: 'STL', score: 68, logo: '🔥' },
      status: 'Completed',
      matchTime: 'Full Time',
      date: 'Yesterday, Oct 17',
      time: '06:00 PM',
      venue: 'Indoor Arena • Court 1',
      referee: 'Elena Rostova',
      officials: [
        { name: 'Elena R.', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80' }
      ]
    },
    {
      id: 'fix-4',
      sport: 'Badminton',
      sportIcon: '🏸',
      tournament: 'Shuttle Masters Open',
      stage: 'Men’s Singles Quarterfinal',
      team1: { name: 'Alex Mercer', code: 'MER', score: '21, 21', logo: '🏸' },
      team2: { name: 'David Chen', code: 'CHN', score: '18, 14', logo: '🏸' },
      status: 'Completed',
      matchTime: 'Final Result',
      date: 'Yesterday, Oct 17',
      time: '11:00 AM',
      venue: 'Indoor Complex • Court 3',
      referee: 'Umpire Susan Vance',
      officials: []
    },
    {
      id: 'fix-5',
      sport: 'Football',
      sportIcon: '⚽',
      tournament: 'Champions Football Cup 2026',
      stage: 'Quarterfinal 2',
      team1: { name: 'Viper Vanguards', code: 'VIP', score: '-', logo: '🐍' },
      team2: { name: 'Apex Wolves', code: 'APX', score: '-', logo: '🐺' },
      status: 'Upcoming',
      matchTime: '06:30 PM',
      date: 'Today, Oct 18',
      time: '06:30 PM',
      venue: 'Main Campus Stadium • Pitch 2',
      referee: 'Arthur Shelby (Senior Official)',
      officials: [
        { name: 'Arthur S.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' }
      ]
    },
    {
      id: 'fix-6',
      sport: 'Basketball',
      sportIcon: '🏀',
      tournament: 'Varsity Basketball Championship',
      stage: 'Semifinal B',
      team1: { name: 'Titan Ballers', code: 'TIB', score: '-', logo: '🛡️' },
      team2: { name: 'Cyber Hawks', code: 'CYH', score: '-', logo: '🦅' },
      status: 'Upcoming',
      matchTime: 'Tomorrow 05:00 PM',
      date: 'Tomorrow, Oct 19',
      time: '05:00 PM',
      venue: 'Indoor Sports Hub • Court 1',
      referee: 'Sarah Jenkins',
      officials: []
    }
  ];

  // Filtering
  const filteredFixtures = fixturesData.filter(m => {
    if (sportFilter !== 'All' && m.sport.toLowerCase() !== sportFilter.toLowerCase()) return false;
    if (statusFilter === 'Live' && m.status !== 'Live') return false;
    if (statusFilter === 'Upcoming' && m.status !== 'Upcoming') return false;
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

  const handleOpenLiveConsole = () => {
    addToast('⚡ Opening Official Referee Console...', 'info');
    setCurrentView('live-score-console');
  };

  return (
    <div className="clario-canvas animate-fade-in -mt-4">
      {/* MASTER ROUNDED CLARIO CONTAINER */}
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
              Browse live match scores, upcoming games, and stadium court schedules.
            </p>
          </div>

          {/* Quick Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
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

        {/* TACTILE PILL FILTER BARS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-b border-slate-100 dark:border-slate-800/60">
          
          {/* Sports Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Football', 'Cricket', 'Basketball', 'Badminton'].map(s => (
              <button
                key={s}
                onClick={() => setSportFilter(s)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${sportFilter === s ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                {s === 'Football' ? '⚽ Football' : s === 'Cricket' ? '🏏 Cricket' : s === 'Basketball' ? '🏀 Basketball' : s === 'Badminton' ? '🏸 Badminton' : 'All Sports'}
              </button>
            ))}
          </div>

          {/* Status Tabs Pills (All, Live, Upcoming, Completed) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-full border border-slate-200/60 dark:border-slate-700/60 self-start sm:self-auto">
            {['All', 'Live', 'Upcoming', 'Completed'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${statusFilter === st ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                {st === 'Live' ? '🔴 Live' : st}
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
            filteredFixtures.map(match => (
              <div 
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#15203c] border transition-all cursor-pointer hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500/50 ${
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
                      {match.stage}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <CalendarIcon className="w-3 h-3 text-slate-400" />
                      {match.date}
                    </span>
                  </div>

                  {/* Right: Venue + Time + Details button */}
                  <div className="flex items-center flex-wrap gap-3">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="max-w-[180px] sm:max-w-[240px] truncate">{match.venue}</span>
                      <span className="mx-1 opacity-40">•</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">{match.time}</span>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMatch(match);
                      }}
                      className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm flex-shrink-0 cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-blue-500" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>

                {/* Main Arena: Clean 3-column match layout using full card width */}
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-11 items-center gap-3 sm:gap-4">
                  {/* Team 1: 4 columns */}
                  <div className="sm:col-span-4 flex items-center justify-start sm:justify-end gap-3 text-left sm:text-right">
                    <div className="order-2 sm:order-1 min-w-0">
                      <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white block font-outfit truncate">
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

                  {/* Center Score / VS Pill: 3 columns */}
                  <div className="sm:col-span-3 flex flex-col items-center justify-center my-1 sm:my-0">
                    {match.status === 'Live' ? (
                      <div className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-extrabold text-sm sm:text-base font-outfit shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span>{match.team1.score} : {match.team2.score}</span>
                      </div>
                    ) : match.status === 'Completed' ? (
                      <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-sm sm:text-base font-outfit shadow-inner border border-slate-200 dark:border-slate-700">
                        <span>{match.team1.score} - {match.team2.score}</span>
                      </div>
                    ) : (
                      <div className="px-4 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold text-xs sm:text-sm font-outfit border border-blue-200/60 dark:border-blue-800/60">
                        VS
                      </div>
                    )}
                    <span className="text-[10px] text-slate-400 font-medium mt-1">
                      {match.status === 'Live' ? `${match.matchTime} • In Progress` : (match.status === 'Completed' ? 'Full Time' : match.matchTime)}
                    </span>
                  </div>

                  {/* Team 2: 4 columns */}
                  <div className="sm:col-span-4 flex items-center justify-start gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                      {match.team2.logo}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white block font-outfit truncate">
                        {match.team2.name}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        {match.team2.code}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========================================================
          DARK FLOATING MATCH INSPECTOR CARD (THEME SHOWCASE)
         ======================================================== */}
      {selectedMatch && (
        <div className="fixed bottom-6 right-6 w-84 max-w-[90vw] clario-dark-inspector z-50 animate-float-in">
          
          {/* Top Bar with internal badge, settings, close */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-blue-400">
              <Shield className="w-3 h-3 text-blue-400" />
              <span>{selectedMatch.stage}</span>
            </div>

            <button 
              onClick={() => setSelectedMatch(null)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Match Title */}
          <h3 className="font-outfit font-extrabold text-base text-white mt-3 mb-1 leading-tight">
            {selectedMatch.team1.name} vs {selectedMatch.team2.name}
          </h3>
          <span className="text-[11px] text-slate-400 block mb-4">{selectedMatch.tournament}</span>

          {/* Dark Inset Pill Rows */}
          <div className="space-y-2 mb-4">
            <div className="clario-dark-pill">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedMatch.date}</span>
            </div>

            <div className="clario-dark-pill">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedMatch.time} ({selectedMatch.matchTime})</span>
            </div>

            <div className="clario-dark-pill">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate">{selectedMatch.venue}</span>
            </div>
          </div>

          {/* Referee / Official Info */}
          <div className="mb-5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
              Match Official Assigned
            </span>
            <p className="text-xs text-slate-200 font-semibold">{selectedMatch.referee}</p>
          </div>

          {/* High Contrast White Rounded CTA Button */}
          <button 
            onClick={handleOpenLiveConsole}
            className="w-full py-3 px-4 rounded-full bg-white text-slate-950 font-outfit font-extrabold text-xs tracking-tight hover:bg-slate-100 transition-colors shadow-lg shadow-white/10 flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Open Live Score Console</span>
          </button>
        </div>
      )}
    </div>
  );
};
