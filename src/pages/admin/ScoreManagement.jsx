import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UpdateMatchResultModal, ScheduleMatchModal } from '../../components/Modals';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Filter, 
  Edit3, 
  ArrowRight,
  ShieldCheck,
  Lock
} from 'lucide-react';

export const ScoreManagement = () => {
  const { 
    tournaments, 
    selectedTournament, 
    selectedTournamentId, 
    setSelectedTournamentId, 
    fixtures, 
    role, 
    setCurrentView 
  } = useApp();

  const isAdmin = role === 'admin';
  const [stageFilter, setStageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedMatchForScore, setSelectedMatchForScore] = useState(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // If not admin, show friendly permission note
  if (!isAdmin) {
    return (
      <div className="material-card p-10 max-w-lg mx-auto text-center space-y-5 my-12 animate-fade-in shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold font-outfit text-slate-900 dark:text-slate-100">
            Admin Access Required
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed px-4">
            Official match results and final scores are verified and entered by tournament administrators after match completion.
          </p>
        </div>
        <button 
          onClick={() => setCurrentView('match-schedule')} 
          className="btn btn-primary text-xs py-2 px-4 mx-auto cursor-pointer"
        >
          View Public Match Schedule
        </button>
      </div>
    );
  }

  const activeTrnId = selectedTournamentId || (tournaments[0]?.id || 'trn-101');
  const trnFixtures = fixtures[activeTrnId] || fixtures['trn-102'] || {};
  const currentTournament = tournaments.find(t => t.id === activeTrnId) || tournaments[0] || {};

  // Flatten matches for clear list and filtering
  const allMatches = [
    ...(trnFixtures.quarterFinals || []).map(m => ({ ...m, stage: 'quarterFinals', stageLabel: 'Quarterfinals' })),
    ...(trnFixtures.semiFinals || []).map(m => ({ ...m, stage: 'semiFinals', stageLabel: 'Semifinals' })),
    ...(trnFixtures.final || []).map(m => ({ ...m, stage: 'final', stageLabel: 'Grand Championship Final' })),
  ];

  const filteredMatches = allMatches.filter(m => {
    const matchesStage = stageFilter === 'All' || m.stage === stageFilter;
    const matchesStatus = statusFilter === 'All' 
      ? true 
      : statusFilter === 'Completed' ? m.status === 'Completed' || (m.status && m.status.startsWith('Champion'))
      : m.status !== 'Completed' && !(m.status && m.status.startsWith('Champion'));
    return matchesStage && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit">Match Score & Result Management</h1>
          <p className="text-xs text-slate-500">
            Enter final scores and finalize match outcomes after game completion.
          </p>
        </div>

        <button 
          onClick={() => setScheduleModalOpen(true)}
          className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Schedule New Match
        </button>
      </div>

      {/* Filter and Selection Bar */}
      <div className="material-card p-4 flex flex-col md:flex-row justify-between gap-4">
        
        {/* Tournament Picker */}
        <div className="flex-1 max-w-xs">
          <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Tournament</label>
          <select 
            value={activeTrnId} 
            onChange={e => setSelectedTournamentId(e.target.value)}
            className="input-field py-1.5 text-xs font-semibold"
          >
            {tournaments.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.sport})</option>
            ))}
          </select>
        </div>

        {/* Stage and Status Filters */}
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Stage</label>
            <select 
              value={stageFilter} 
              onChange={e => setStageFilter(e.target.value)}
              className="input-field py-1.5 text-xs"
            >
              <option value="All">All Stages</option>
              <option value="quarterFinals">Quarterfinals</option>
              <option value="semiFinals">Semifinals</option>
              <option value="final">Final</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Result Status</label>
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="input-field py-1.5 text-xs"
            >
              <option value="All">All Matches</option>
              <option value="Pending">Pending Result</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

      </div>

      {/* Matches Grid */}
      {filteredMatches.length === 0 ? (
        <div className="material-card p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base font-outfit">No matches found for this filter</h3>
            <p className="text-xs text-slate-500 mt-1">Schedule a new match or auto-generate fixtures for this tournament.</p>
          </div>
          <button 
            onClick={() => setScheduleModalOpen(true)}
            className="btn btn-primary text-xs py-2 px-3 mx-auto"
          >
            <PlusCircle className="w-4 h-4 mr-1" /> Schedule Match
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map(match => {
            const isCompleted = match.status === 'Completed' || (match.status && match.status.startsWith('Champion'));
            return (
              <div 
                key={`${match.stage}-${match.id}`} 
                className="material-card p-5 space-y-4 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all"
              >
                {/* Card Top */}
                <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px]">
                      {match.stageLabel}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 text-[11px]">{match.court || 'Court 1'}</span>
                  </div>

                  <span className={`badge text-[10px] px-2.5 py-0.5 font-bold ${
                    isCompleted 
                      ? 'badge-success' 
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                  }`}>
                    {isCompleted ? 'Completed' : 'Pending Result'}
                  </span>
                </div>

                {/* Teams & Scores Comparison Box */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl space-y-3">
                  
                  {/* Team 1 */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center">
                        {match.team1?.charAt(0) || '1'}
                      </div>
                      <span className={`font-semibold text-sm ${match.winner === match.team1 ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}>
                        {match.team1}
                      </span>
                      {match.winner === match.team1 && (
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </div>
                    <span className="font-outfit font-extrabold text-xl text-slate-800 dark:text-slate-100">
                      {typeof match.score1 === 'number' ? match.score1 : 0}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700/60"></div>

                  {/* Team 2 */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                        {match.team2?.charAt(0) || '2'}
                      </div>
                      <span className={`font-semibold text-sm ${match.winner === match.team2 ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}>
                        {match.team2}
                      </span>
                      {match.winner === match.team2 && (
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </div>
                    <span className="font-outfit font-extrabold text-xl text-slate-800 dark:text-slate-100">
                      {typeof match.score2 === 'number' ? match.score2 : 0}
                    </span>
                  </div>

                </div>

                {/* Match Schedule Metadata & Action Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {match.date || currentTournament.startDate || 'Upcoming'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {match.time || '10:00 AM'}
                    </span>
                  </div>

                  <button 
                    onClick={() => setSelectedMatchForScore({
                      trnId: activeTrnId,
                      stage: match.stage,
                      match
                    })}
                    className={`btn text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer ${
                      isCompleted ? 'btn-outline' : 'btn-primary'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    {isCompleted ? 'Update Result' : 'Enter Match Result'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Update Score Modal */}
      {selectedMatchForScore && (
        <UpdateMatchResultModal 
          tournamentId={selectedMatchForScore.trnId}
          stage={selectedMatchForScore.stage}
          match={selectedMatchForScore.match}
          sport={currentTournament?.sport}
          onClose={() => setSelectedMatchForScore(null)}
        />
      )}

      {/* Schedule Match Modal */}
      {scheduleModalOpen && (
        <ScheduleMatchModal 
          tournamentId={activeTrnId}
          onClose={() => setScheduleModalOpen(false)}
        />
      )}

    </div>
  );
};
