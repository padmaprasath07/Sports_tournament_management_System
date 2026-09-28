import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KnockoutBracket } from '../../components/KnockoutBracket';
import { RoundRobinTable } from '../../components/RoundRobinTable';
import { LiveScoreModal } from '../../components/Modals';
import { GitBranch, RefreshCw, Trophy, Table } from 'lucide-react';

export const FixtureManagement = () => {
  const { selectedTournament, setSelectedTournamentId, tournaments, autoGenerateBracket } = useApp();
  const [activeFormat, setActiveFormat] = useState('knockout'); // 'knockout' | 'points'
  const [selectedMatch, setSelectedMatch] = useState(null);

  const handleAutoGenerate = () => {
    autoGenerateBracket(selectedTournament?.id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit">Fixture & Bracket Management</h1>
          <p className="text-xs text-slate-500">Generate, re-seed, and inspect live tournament progression trees.</p>
        </div>

        <div className="flex gap-2">
          <select 
            value={selectedTournament.id} 
            onChange={e => setSelectedTournamentId(e.target.value)}
            className="input-field py-2 text-xs"
          >
            {tournaments.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.format})</option>
            ))}
          </select>

          <button onClick={handleAutoGenerate} className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Auto-Generate Brackets
          </button>
        </div>
      </div>

      {/* Layout Tabs */}
      <div className="material-card p-6 space-y-6">
        
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
          <button 
            onClick={() => setActiveFormat('knockout')}
            className={`pb-3 flex items-center gap-2 transition-all ${activeFormat === 'knockout' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
          >
            <GitBranch className="w-4 h-4" /> Knockout Elimination Bracket
          </button>
          <button 
            onClick={() => setActiveFormat('points')}
            className={`pb-3 flex items-center gap-2 transition-all ${activeFormat === 'points' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
          >
            <Table className="w-4 h-4" /> Points Table
          </button>
        </div>

        {activeFormat === 'knockout' ? (
          <KnockoutBracket 
            tournamentId={selectedTournament.id} 
            onMatchClick={(trnId, stage, match) => setSelectedMatch({ trnId, stage, match })}
          />
        ) : (
          <RoundRobinTable sport={selectedTournament?.sport || 'Football'} />
        )}

      </div>

      {/* Live Score Controller Modal */}
      {selectedMatch && (
        <LiveScoreModal 
          tournamentId={selectedMatch.trnId}
          stage={selectedMatch.stage}
          match={selectedMatch.match}
          sport={selectedTournament?.sport}
          onClose={() => setSelectedMatch(null)}
        />
      )}

    </div>
  );
};
