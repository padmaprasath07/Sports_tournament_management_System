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
  MessageSquare, 
  Plus, 
  Phone, 
  CheckSquare, 
  FileText, 
  Edit3, 
  SlidersHorizontal, 
  X, 
  Trash2, 
  Shield, 
  Sparkles, 
  CheckCircle2,
  Trophy,
  Activity,
  Flame,
  Radio
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MatchSchedule = () => {
  const { setCurrentView, addToast } = useApp();
  
  // View states
  const [selectedView, setSelectedView] = useState('Week');
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('October 2026');
  const [selectedMiniDate, setSelectedMiniDate] = useState(17);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createType, setCreateType] = useState('Match');

  // Active sports match for the floating dark inspector
  const [selectedMatch, setSelectedMatch] = useState({
    title: 'Championship Final: Thunderbolts FC vs Viper Vanguards',
    stage: 'Championship Final • Pitch 1',
    sport: 'Football',
    date: 'Saturday, 18 October',
    time: '06:00 PM - 07:45 PM',
    venue: 'Main Campus Stadium • Pitch 1',
    attendees: '22 Athletes • 4 Match Officials',
    approvedBy: [
      { name: 'Ref David M.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
      { name: 'Official Sarah K.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80' },
      { name: 'Dr. Helen V.', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80' }
    ],
    plusCount: 2
  });

  const miniCalendarDays = [
    { num: 1, inMonth: true }, { num: 2, inMonth: true }, { num: 3, inMonth: true }, { num: 4, inMonth: true }, { num: 5, inMonth: true }, { num: 6, inMonth: true }, { num: 7, inMonth: true },
    { num: 8, inMonth: true }, { num: 9, inMonth: true }, { num: 10, inMonth: true }, { num: 11, inMonth: true }, { num: 12, inMonth: true }, { num: 13, inMonth: true }, { num: 14, inMonth: true },
    { num: 15, inMonth: true, inPill: true }, { num: 16, inMonth: true, inPill: true }, { num: 17, inMonth: true, inPill: true, isSelected: true }, { num: 18, inMonth: true, inPill: true }, { num: 19, inMonth: true, inPill: true }, { num: 20, inMonth: true, inPill: true }, { num: 21, inMonth: true, inPill: true },
    { num: 22, inMonth: true }, { num: 23, inMonth: true }, { num: 24, inMonth: true }, { num: 25, inMonth: true }, { num: 26, inMonth: true }, { num: 27, inMonth: true }, { num: 28, inMonth: true },
    { num: 29, inMonth: true }, { num: 30, inMonth: true }, { num: 1, inMonth: false }, { num: 2, inMonth: false }, { num: 3, inMonth: false }
  ];

  const handleCreateClick = (type) => {
    setCreateType(type);
    setCreateModalOpen(true);
  };

  const handleOpenLiveConsole = () => {
    addToast('⚡ Opening Referee Scorekeeper Console...', 'info');
    setCurrentView('live-score-console');
  };

  return (
    <div className="clario-canvas animate-fade-in -mt-4">
      {/* MASTER ROUNDED CLARIO CONTAINER */}
      <div className="clario-master-card p-6 md:p-9 max-w-[1400px] mx-auto relative">
        
        {/* SUBHEADER: TITLE & SCHEDULING CONTROLS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/60">
          <div>
            <h1 className="text-3xl font-extrabold font-outfit text-slate-900 dark:text-white tracking-tight">
              Match Scheduling
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Master calendar of tournament fixtures, live matches, and practice sessions.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Today Pill & Month Stepper */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => addToast('Viewing today’s live tournament schedule', 'info')}
                className="clario-pill text-xs font-bold px-4 py-2 hover:shadow-sm"
              >
                Today
              </button>

              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-200 px-2">
                <span>{currentMonth}</span>
                <div className="flex items-center ml-1">
                  <button 
                    onClick={() => setCurrentMonth('September 2026')}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setCurrentMonth('November 2026')}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search Pill */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search matches..."
                className="pl-8 pr-4 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 outline-none w-36 focus:w-48 transition-all"
              />
            </div>

            {/* View Selector (Week / Day / Month) */}
            <div className="relative">
              <button 
                onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
                className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <span>{selectedView}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {viewDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-1.5 z-30">
                  {['Week', 'Day', 'Month'].map(v => (
                    <button
                      key={v}
                      onClick={() => {
                        setSelectedView(v);
                        setViewDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      {v} View
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Slider Icon */}
            <button className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MAIN BODY: 2-COLUMN CLARIO TACTILE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 pt-6">
          
          {/* ========================================================
              LEFT COLUMN: MINI CALENDAR + CREATE BUTTONS + OVERVIEW
             ======================================================== */}
          <div className="lg:col-span-3 space-y-7">
            
            {/* 1. Mini Calendar Box */}
            <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-3xl p-5 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-outfit font-bold text-sm text-slate-800 dark:text-white">
                  October, 2026
                </span>
                <div className="flex items-center gap-1">
                  <button className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-slate-200/60 dark:hover:bg-slate-700 text-slate-400">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-slate-200/60 dark:hover:bg-slate-700 text-slate-400">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Day Headers S M T W T F S */}
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 mb-2">
                <span>S</span>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
              </div>

              {/* Days Grid with Dark Active Pill */}
              <div className="grid grid-cols-7 gap-y-1.5 text-center text-xs font-semibold">
                {miniCalendarDays.slice(0, 14).map((d, i) => (
                  <div key={i} className="py-1 text-slate-700 dark:text-slate-300">
                    {d.num}
                  </div>
                ))}
              </div>

              {/* Dark Pill Week Encapsulation (15 16 17 18 19 20 21) */}
              <div className="my-1 py-1 px-1 bg-slate-900 dark:bg-slate-950 text-white rounded-full grid grid-cols-7 text-center text-xs font-bold items-center shadow-md">
                <span className="py-1">15</span>
                <span className="py-1">16</span>
                <span className="w-6 h-6 mx-auto rounded-full bg-slate-700 flex items-center justify-center ring-2 ring-slate-500">17</span>
                <span className="py-1">18</span>
                <span className="py-1">19</span>
                <span className="py-1">20</span>
                <span className="py-1">21</span>
              </div>

              <div className="grid grid-cols-7 gap-y-1.5 text-center text-xs font-semibold mt-1">
                {miniCalendarDays.slice(21).map((d, i) => (
                  <div key={i} className={`py-1 ${d.inMonth ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600'}`}>
                    {d.num}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Create Section with 6 Tactile Claymorphic Buttons */}
            <div>
              <h3 className="font-outfit font-bold text-sm text-slate-900 dark:text-white mb-3">
                Create
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  onClick={() => handleCreateClick('Match')}
                  className="clario-tactile-btn"
                >
                  <Trophy className="w-3.5 h-3.5 text-blue-500" />
                  <span>Match</span>
                </button>
                <button 
                  onClick={() => handleCreateClick('Referee Call')}
                  className="clario-tactile-btn"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Call</span>
                </button>
                <button 
                  onClick={() => handleCreateClick('Practice Task')}
                  className="clario-tactile-btn"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Task</span>
                </button>
                <button 
                  onClick={() => handleCreateClick('Match Reminder')}
                  className="clario-tactile-btn"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-500" />
                  <span>Reminder</span>
                </button>
                <button 
                  onClick={() => handleCreateClick('Rule Document')}
                  className="clario-tactile-btn"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Document</span>
                </button>
                <button 
                  onClick={() => handleCreateClick('Scout Note')}
                  className="clario-tactile-btn"
                >
                  <Edit3 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Note</span>
                </button>
              </div>
            </div>

            {/* 3. Week Overview Box with Segmented Progress Bar */}
            <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-3xl p-5 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
              <h3 className="font-outfit font-bold text-sm text-slate-900 dark:text-white mb-3">
                Tournament Overview
              </h3>
              
              <div className="flex items-center gap-2.5 mb-3 text-xs">
                <div className="w-6 h-6 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                </div>
                <div className="flex-1 flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span className="font-medium">Completed matches</span>
                  <span className="font-bold text-slate-900 dark:text-white">12 of 18</span>
                </div>
              </div>

              {/* Segmented Neon Green Progress Bar */}
              <div className="flex gap-1.5 h-1.5 w-full">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="flex-1 rounded-full bg-emerald-500"></div>
                ))}
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-1 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: GRID CALENDAR + GLOWING SPORTS MATCH CARDS
             ======================================================== */}
          <div className="lg:col-span-9 bg-slate-50/40 dark:bg-slate-900/30 rounded-3xl p-5 border border-slate-200/60 dark:border-slate-800/60 relative overflow-hidden">
            
            {/* Grid Header Days: Sun Mon Tue Wed Thu Fri Sat */}
            <div className="grid grid-cols-7 gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800/80 text-center">
              {[
                { day: 'Sun', date: '15' },
                { day: 'Mon', date: '16' },
                { day: 'Tue', date: '17' },
                { day: 'Wed', date: '18' },
                { day: 'Thu', date: '19' },
                { day: 'Fri', date: '20' },
                { day: 'Sat', date: '21' }
              ].map((c, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{c.day}</span>
                  <span className="text-[11px] font-bold text-slate-300 dark:text-slate-600">{c.date}</span>
                </div>
              ))}
            </div>

            {/* Time Grid Rows & Event Placements */}
            <div className="relative min-h-[580px] mt-4">
              
              {/* Horizontal Hour Lines (1pm - 7pm) */}
              {['1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm'].map((hr) => (
                <div key={hr} className="flex items-center text-[11px] text-slate-400 font-medium h-20 border-b border-dashed border-slate-200/70 dark:border-slate-800/70">
                  <span className="w-10 flex-shrink-0 text-slate-400">{hr}</span>
                  <div className="flex-1 h-full"></div>
                </div>
              ))}

              {/* ========================================================
                  REAL SPORTS MATCH EVENT CARDS (WITH TACTILE SHAPES)
                 ======================================================== */}
              
              {/* 1. Sunday 1:00 PM: Frosted Lavender Card - Football Match */}
              <div 
                onClick={() => {
                  setSelectedMatch({
                    title: 'Quarterfinal 1: Thunderbolts FC vs Cyber Strikers',
                    stage: 'Main Campus Stadium • Pitch 1',
                    sport: 'Football',
                    date: 'Sunday, 15 October',
                    time: '01:00 PM - 02:30 PM',
                    venue: 'Pitch 1 (North Arena)',
                    attendees: '22 Athletes • 3 Match Officials',
                    approvedBy: [
                      { name: 'Ref David M.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
                      { name: 'Marcus C.', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80' }
                    ],
                    plusCount: 3
                  });
                  setInspectorOpen(true);
                }}
                className="absolute left-[13%] top-2 w-[14%] clario-card-lavender z-10"
              >
                <div className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-indigo-900 mb-0.5">
                  <Trophy className="w-3 h-3" />
                  <span>QF 1 Match</span>
                </div>
                <h4 className="font-outfit font-bold text-xs leading-snug">Thunderbolts vs Cyber Strikers</h4>
                <p className="text-[10px] opacity-80 mt-0.5 font-medium">1:00 PM - 2:30 PM</p>
                <div className="flex items-center -space-x-1.5 mt-2">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" className="w-4 h-4 rounded-full ring-1 ring-white object-cover" alt="" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" className="w-4 h-4 rounded-full ring-1 ring-white object-cover" alt="" />
                  <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[8px] flex items-center justify-center font-bold ring-1 ring-white">+3</span>
                </div>
              </div>

              {/* 2. Tuesday 1:00 PM: Violet Pill - Opening Ceremony */}
              <div className="absolute left-[39%] top-6 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold shadow-md shadow-indigo-500/30 flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform z-10">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>★ Opening Ceremony</span>
              </div>

              {/* 3. Tuesday 2:00 PM: Cyan Pill - Captains Meeting */}
              <div className="absolute left-[39%] top-20 px-3 py-1 rounded-full bg-cyan-500 text-white text-[10px] font-bold shadow-md shadow-cyan-500/30 flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform z-10">
                <Users className="w-3 h-3" />
                <span>Captains Briefing</span>
              </div>

              {/* 4. Wednesday 3:00 PM: Frosted Rose / Magenta Glowing Card - Basketball Derby */}
              <div 
                onClick={() => {
                  setSelectedMatch({
                    title: 'Semi-Final 1: Hoop Kings vs Street Legends',
                    stage: 'Indoor Sports Arena • Court A',
                    sport: 'Basketball',
                    date: 'Wednesday, 18 October',
                    time: '03:00 PM - 04:30 PM',
                    venue: 'Court A • Indoor Sports Hub',
                    attendees: '10 Starters • 2 Referees',
                    approvedBy: [
                      { name: 'Elena', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80' },
                      { name: 'Sarah', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80' }
                    ],
                    plusCount: 3
                  });
                  setInspectorOpen(true);
                }}
                className="absolute left-[54%] top-64 w-[14%] clario-card-rose z-10"
              >
                <div className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-rose-100 mb-0.5">
                  <Flame className="w-3 h-3 text-amber-300" />
                  <span>Semi-Final</span>
                </div>
                <h4 className="font-outfit font-bold text-xs leading-snug">Hoop Kings vs Street Legends</h4>
                <p className="text-[10px] opacity-90 mt-0.5 font-medium">3:00 PM - 4:30 PM</p>
                <div className="flex items-center -space-x-1.5 mt-2">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" className="w-4 h-4 rounded-full ring-1 ring-white object-cover" alt="" />
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" className="w-4 h-4 rounded-full ring-1 ring-white object-cover" alt="" />
                  <span className="w-4 h-4 rounded-full bg-slate-900 text-white text-[8px] flex items-center justify-center font-bold ring-1 ring-white">+3</span>
                </div>
              </div>

              {/* 5. Monday 4:00 PM: Vibrant Lime Green Card - Championship Final */}
              <div 
                onClick={() => {
                  setSelectedMatch({
                    title: 'Championship Final: Thunderbolts FC vs Viper Vanguards',
                    stage: 'Main Campus Stadium • Pitch 1',
                    sport: 'Football',
                    date: 'Saturday, 18 October',
                    time: '06:00 PM - 07:45 PM',
                    venue: 'Main Campus Stadium • Pitch 1',
                    attendees: '22 Athletes • 4 Match Officials',
                    approvedBy: [
                      { name: 'Ref David M.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
                      { name: 'Sarah K.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80' },
                      { name: 'Helen V.', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80' }
                    ],
                    plusCount: 2
                  });
                  setInspectorOpen(true);
                }}
                className="absolute left-[26%] top-72 w-[14%] clario-card-lime z-10"
              >
                <div className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-emerald-950 mb-0.5">
                  <Trophy className="w-3 h-3 text-emerald-900" />
                  <span>Grand Final 🏆</span>
                </div>
                <h4 className="font-outfit font-bold text-xs leading-snug">Thunderbolts vs Viper Vanguards</h4>
                <p className="text-[10px] text-emerald-900 mt-1 font-semibold">Pitch 1 • Live Broadcast</p>
                <div className="mt-3 bg-slate-900 text-white px-2.5 py-1 rounded-full text-[9px] font-bold inline-block shadow-sm">
                  All Events
                </div>
              </div>

              {/* 6. Friday 1:00 PM: Coral Rose Pill - Team Warmup Session */}
              <div className="absolute left-[81%] top-6 px-3 py-1 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-md shadow-rose-500/30 flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform z-10">
                <Activity className="w-3 h-3" />
                <span>Warmup Drills</span>
              </div>

              {/* 7. Sunday 7:00 PM: Lime Green Trophy Presentation Pill */}
              <div className="absolute left-[13%] top-[480px] px-3 py-1.5 rounded-full bg-lime-400 text-slate-900 text-[10px] font-extrabold shadow-md shadow-lime-500/30 flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform z-10">
                <Trophy className="w-3 h-3 text-slate-900" />
                <span>Awards Ceremony</span>
              </div>

              {/* 8. Free Time Diagonal Hatched Box */}
              <div className="absolute left-[40%] top-[420px] w-[14%] h-20 clario-hatch-pattern flex items-center justify-center text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                Pitch Maintenance
              </div>

              {/* ========================================================
                  DARK FLOATING MATCH INSPECTOR CARD (MATCHING REFERENCE!)
                 ======================================================== */}
              {inspectorOpen && (
                <div className="absolute right-4 bottom-4 w-80 clario-dark-inspector z-20">
                  
                  {/* Top Bar with internal badge, settings, trash, close */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300">
                      <Shield className="w-3 h-3 text-blue-400" />
                      <span>{selectedMatch.stage}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <button className="w-6 h-6 rounded flex items-center justify-center hover:text-white">
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-6 h-6 rounded flex items-center justify-center hover:text-rose-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setInspectorOpen(false)}
                        className="w-6 h-6 rounded flex items-center justify-center hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Large Match Title */}
                  <h3 className="font-outfit font-extrabold text-base text-white mt-3 mb-4 leading-tight">
                    {selectedMatch.title}
                  </h3>

                  {/* Dark Inset Pill Rows */}
                  <div className="space-y-2 mb-4">
                    <div className="clario-dark-pill">
                      <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedMatch.date}</span>
                    </div>

                    <div className="clario-dark-pill">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedMatch.time}</span>
                    </div>

                    <div className="clario-dark-pill">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedMatch.attendees}</span>
                    </div>
                  </div>

                  {/* Approved By Avatar Row */}
                  <div className="mb-5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                      Match Officials Assigned
                    </span>
                    <div className="flex items-center -space-x-2">
                      {selectedMatch.approvedBy.map((usr, i) => (
                        <img 
                          key={i}
                          src={usr.img} 
                          alt={usr.name}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-900"
                        />
                      ))}
                      <span className="w-7 h-7 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-900">
                        +{selectedMatch.plusCount}
                      </span>
                    </div>
                  </div>

                  {/* High Contrast White Rounded CTA Button */}
                  <button 
                    onClick={handleOpenLiveConsole}
                    className="w-full py-3 px-4 rounded-full bg-white text-slate-950 font-outfit font-extrabold text-sm tracking-tight hover:bg-slate-100 transition-colors shadow-lg shadow-white/10 flex items-center justify-center gap-2"
                  >
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>Open Live Score Console</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CREATE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-outfit font-extrabold text-xl text-slate-900 dark:text-white">
                Schedule New {createType}
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              addToast(`✅ ${createType} successfully scheduled in calendar!`, 'success');
              setCreateModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Match / Fixture Title</label>
                <input 
                  type="text" 
                  placeholder={`e.g. Thunderbolts FC vs Viper Vanguards`} 
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs outline-none" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Date</label>
                  <input type="date" defaultValue="2026-10-18" className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Time</label>
                  <input type="time" defaultValue="18:00" className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs outline-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Venue / Pitch</label>
                <input 
                  type="text" 
                  placeholder="e.g. Main Campus Stadium • Pitch 1" 
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-xs outline-none" 
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCreateModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-500">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/30">
                  Add to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
