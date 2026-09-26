import React from 'react';
import { Trophy, Zap, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const KnockoutBracket = ({ tournamentId = 'trn-102', onMatchClick }) => {
  const { fixtures } = useApp();
  const trnFixtures = fixtures[tournamentId] || fixtures['trn-102'];

  if (!trnFixtures) {
    return (
      <div className="p-8 text-center text-slate-500">
        No fixture tree generated for this tournament yet.
      </div>
    );
  }

  const { quarterFinals = [], semiFinals = [], final = [] } = trnFixtures;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold font-outfit">Knockout Tournament Tree</h3>
          <p className="text-xs text-slate-500">Click any match node to inspect scorecard or update live results.</p>
        </div>
        <span className="badge badge-primary flex items-center gap-1">
          <Trophy className="w-3 h-3" /> Elimination Bracket
        </span>
      </div>

      <div className="bracket-wrapper overflow-x-auto pb-4 pt-2">
        
        {/* Quarter Finals */}
        <div className="bracket-round flex-shrink-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center block mb-2 font-outfit">
            Quarter Finals
          </span>
          {quarterFinals.map(m => (
            <div 
              key={m.id} 
              onClick={() => onMatchClick && onMatchClick(tournamentId, 'quarterFinals', m)}
              className="bracket-match w-56 hover:border-blue-500 cursor-pointer"
            >
              <div className={`bracket-team ${m.winner === m.team1 ? 'winner' : ''}`}>
                <span className="truncate">{m.team1}</span>
                <span className="bracket-score">{m.score1}</span>
              </div>
              <div className={`bracket-team ${m.winner === m.team2 ? 'winner' : ''} mt-1`}>
                <span className="truncate">{m.team2}</span>
                <span className="bracket-score">{m.score2}</span>
              </div>
              <div className="mt-1.5 pt-1 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[10px] text-slate-400">
                <span>QF-{m.id}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{m.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Semi Finals */}
        <div className="bracket-round flex-shrink-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center block mb-2 font-outfit">
            Semi Finals
          </span>
          {semiFinals.map(m => (
            <div 
              key={m.id} 
              onClick={() => onMatchClick && onMatchClick(tournamentId, 'semiFinals', m)}
              className="bracket-match w-56 hover:border-blue-500 cursor-pointer my-auto"
            >
              <div className={`bracket-team ${m.winner === m.team1 ? 'winner' : ''}`}>
                <span className="truncate">{m.team1}</span>
                <span className="bracket-score">{m.score1}</span>
              </div>
              <div className={`bracket-team ${m.winner === m.team2 ? 'winner' : ''} mt-1`}>
                <span className="truncate">{m.team2}</span>
                <span className="bracket-score">{m.score2}</span>
              </div>
              <div className="mt-1.5 pt-1 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[10px] text-slate-400">
                <span>SF-{m.id}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{m.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Finals */}
        <div className="bracket-round flex-shrink-0">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider text-center block mb-2 font-outfit flex items-center justify-center gap-1">
            <Trophy className="w-3.5 h-3.5" /> Grand Final
          </span>
          {final.map(m => (
            <div 
              key={m.id} 
              onClick={() => onMatchClick && onMatchClick(tournamentId, 'final', m)}
              className="bracket-match w-60 border-2 border-amber-400/80 shadow-lg hover:border-amber-500 cursor-pointer bg-gradient-to-br from-amber-500/5 to-blue-500/5 my-auto"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="badge badge-danger text-[9px] flex items-center gap-1">
                  <span className="live-indicator"></span> LIVE {m.time}
                </span>
                <Zap className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
              </div>
              <div className={`bracket-team ${m.winner === m.team1 ? 'winner' : ''}`}>
                <span className="font-bold text-sm truncate">{m.team1}</span>
                <span className="bracket-score text-base bg-blue-600 text-white">{m.score1}</span>
              </div>
              <div className={`bracket-team ${m.winner === m.team2 ? 'winner' : ''} mt-1.5`}>
                <span className="font-bold text-sm truncate">{m.team2}</span>
                <span className="bracket-score text-base bg-blue-600 text-white">{m.score2}</span>
              </div>
              <div className="mt-2 pt-1.5 border-t border-amber-200/50 dark:border-slate-800 text-[10px] text-center font-bold text-amber-600 dark:text-amber-400">
                CHAMPIONSHIP MATCH
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
