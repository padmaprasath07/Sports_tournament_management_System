import React from 'react';
import { Trophy, Zap, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const KnockoutBracket = ({ tournamentId = 'trn-102', onMatchClick }) => {
  const { fixtures, role } = useApp();
  const isAdmin = role === 'admin';
  const trnFixtures = fixtures[tournamentId] || fixtures['trn-102'];

  if (!trnFixtures) {
    return (
      <div className="p-8 text-center text-slate-500">
        No fixture tree generated for this tournament yet.
      </div>
    );
  }

  const { quarterFinals = [], semiFinals = [], final = [] } = trnFixtures;

  const renderTeam = (teamName, score, isWinner) => {
    const isTBD = !teamName || teamName.includes('TBD');
    return (
      <div className={`bracket-team ${isWinner ? 'winner' : ''} ${isTBD ? 'opacity-70' : ''}`}>
        <span className={`truncate ${isTBD ? 'italic text-slate-400 font-normal text-xs' : 'font-semibold'}`}>
          {teamName || 'TBD'}
        </span>
        <span className={`bracket-score ${isTBD ? 'text-slate-400 font-normal' : ''}`}>{isTBD ? '-' : score}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold font-outfit">Knockout Tournament Tree</h3>
          <p className="text-xs text-slate-500">
            {isAdmin 
              ? 'Click any match node to inspect scorecard or record official results (winners advance automatically).' 
              : 'Live tournament elimination tree & verified scores (Read-Only).'}
          </p>
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
              onClick={() => isAdmin && onMatchClick && onMatchClick(tournamentId, 'quarterFinals', m)}
              className={`bracket-match w-56 ${isAdmin ? 'hover:border-blue-500 cursor-pointer' : 'cursor-default'}`}
              title={isAdmin ? 'Click to record official score (winner advances)' : 'Official match details (Read-Only)'}
            >
              {renderTeam(m.team1, m.score1, m.winner === m.team1)}
              <div className="mt-1">
                {renderTeam(m.team2, m.score2, m.winner === m.team2)}
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
              onClick={() => isAdmin && onMatchClick && onMatchClick(tournamentId, 'semiFinals', m)}
              className={`bracket-match w-56 ${isAdmin ? 'hover:border-blue-500 cursor-pointer' : 'cursor-default'} my-auto`}
              title={isAdmin ? 'Click to record official score (winner advances to Final)' : 'Official match details (Read-Only)'}
            >
              {renderTeam(m.team1, m.score1, m.winner === m.team1)}
              <div className="mt-1">
                {renderTeam(m.team2, m.score2, m.winner === m.team2)}
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
              onClick={() => isAdmin && onMatchClick && onMatchClick(tournamentId, 'final', m)}
              className={`bracket-match w-60 border-2 border-amber-400/80 shadow-lg ${isAdmin ? 'hover:border-amber-500 cursor-pointer' : 'cursor-default'} bg-gradient-to-br from-amber-500/5 to-blue-500/5 my-auto`}
              title={isAdmin ? 'Click to record Grand Final result' : 'Grand Final championship match (Read-Only)'}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`badge ${m.status === 'Completed' || m.winner ? 'badge-success' : 'badge-primary'} text-[9px] flex items-center gap-1 font-bold`}>
                  {m.status === 'Completed' || m.winner ? '✓ Final Result' : '📅 Scheduled'}
                </span>
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
              </div>
              {renderTeam(m.team1, m.score1, m.winner === m.team1)}
              <div className="mt-1.5">
                {renderTeam(m.team2, m.score2, m.winner === m.team2)}
              </div>
              <div className="mt-2 pt-1.5 border-t border-amber-200/50 dark:border-slate-800 text-[10px] text-center font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                {m.status?.includes('Champion') || (m.status === 'Completed' && m.winner) ? (
                  <span className="text-amber-500 font-extrabold flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-500" /> {m.status?.includes('Champion') ? m.status : `Champion: ${m.winner}`}
                  </span>
                ) : (
                  <span>CHAMPIONSHIP MATCH</span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
