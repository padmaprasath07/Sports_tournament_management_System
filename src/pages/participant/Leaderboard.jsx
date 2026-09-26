import React, { useState } from 'react';
import { MOCK_LEADERBOARD } from '../../data/mockData';
import { Trophy, Award, Search, Crown, Flame, Medal } from 'lucide-react';

export const Leaderboard = () => {
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState('All');

  const filtered = MOCK_LEADERBOARD.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.team.toLowerCase().includes(search.toLowerCase());
    const matchesSport = sportFilter === 'All' || item.sport === sportFilter;
    return matchesSearch && matchesSport;
  });

  const top3 = MOCK_LEADERBOARD.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="badge badge-primary">Global Rankings</span>
        <h1 className="text-3xl font-extrabold font-outfit">Athletes & Team Leaderboard</h1>
        <p className="text-xs text-slate-500">Ranked by tournament victories, points accumulated, and win rates.</p>
      </div>

      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto items-end pt-4">
        
        {/* Rank 2 (Silver) */}
        {top3[1] && (
          <div className="material-card p-4 text-center space-y-2 border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="w-10 h-10 rounded-full bg-slate-300 text-slate-900 mx-auto flex items-center justify-center font-extrabold text-sm">2</div>
            <h3 className="font-bold text-xs line-clamp-1">{top3[1].name}</h3>
            <p className="text-[10px] text-slate-500 truncate">{top3[1].team}</p>
            <span className="badge bg-slate-200 text-slate-700 text-[9px]">{top3[1].points} pts</span>
          </div>
        )}

        {/* Rank 1 (Gold Champion) */}
        {top3[0] && (
          <div className="material-card p-5 text-center space-y-2 border-amber-400 shadow-xl bg-gradient-to-b from-amber-500/10 to-transparent transform -translate-y-4">
            <Crown className="w-6 h-6 text-amber-500 mx-auto animate-bounce" />
            <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-900 mx-auto flex items-center justify-center font-extrabold text-base shadow-md">1</div>
            <h3 className="font-extrabold text-sm font-outfit text-slate-900 dark:text-slate-100">{top3[0].name}</h3>
            <p className="text-[11px] text-slate-500 font-medium truncate">{top3[0].team}</p>
            <span className="badge bg-amber-500 text-white text-[10px] font-bold">{top3[0].points} PTS</span>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {top3[2] && (
          <div className="material-card p-4 text-center space-y-2 border-amber-700/40 bg-amber-950/5">
            <div className="w-10 h-10 rounded-full bg-amber-700 text-white mx-auto flex items-center justify-center font-extrabold text-sm">3</div>
            <h3 className="font-bold text-xs line-clamp-1">{top3[2].name}</h3>
            <p className="text-[10px] text-slate-500 truncate">{top3[2].team}</p>
            <span className="badge bg-amber-100 text-amber-800 text-[9px]">{top3[2].points} pts</span>
          </div>
        )}

      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 material-card p-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search player or team name..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 py-2 text-xs"
          />
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {['All', 'Football', 'Cricket', 'Basketball', 'Badminton', 'Chess'].map(s => (
            <button 
              key={s} 
              onClick={() => setSportFilter(s)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${sportFilter === s ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12 text-center">Rank</th>
              <th>Athlete Name</th>
              <th>Team / Club</th>
              <th>Sport</th>
              <th className="text-center">Matches</th>
              <th className="text-center">Wins</th>
              <th className="text-center">Win Rate</th>
              <th className="text-center font-bold text-blue-600">Points</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id}>
                <td className="text-center font-extrabold">{row.rank}</td>
                <td className="font-bold flex items-center gap-2">
                  <span>{row.name}</span>
                  <span className="badge badge-primary text-[8px]">{row.badge}</span>
                </td>
                <td className="text-slate-500">{row.team}</td>
                <td><span className="badge bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{row.sport}</span></td>
                <td className="text-center">{row.matches}</td>
                <td className="text-center text-emerald-600 font-semibold">{row.wins}</td>
                <td className="text-center font-semibold text-blue-600">{row.winRate}</td>
                <td className="text-center font-extrabold text-blue-600 dark:text-blue-400 text-base">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
