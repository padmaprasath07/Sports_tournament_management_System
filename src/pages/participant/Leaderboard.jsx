import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_LEADERBOARD } from '../../data/mockData';
import { Trophy, Award, Search, Crown, Flame, Medal, Info, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

export const Leaderboard = () => {
  const { leaderboard: contextLeaderboard } = useApp();
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState('All');
  const [showRulesInfo, setShowRulesInfo] = useState(false);

  const rawData = (contextLeaderboard && contextLeaderboard.length > 0) ? contextLeaderboard : MOCK_LEADERBOARD;

  // Dynamically calculate and sort leaderboard strictly based on official conditions:
  // Condition 1: Sort primarily by Points (descending)
  // Condition 2: Tie-breaker by Wins (descending), then Win Rate
  const sortedData = [...rawData].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    const aRate = parseFloat(a.winRate) || 0;
    const bRate = parseFloat(b.winRate) || 0;
    return bRate - aRate;
  }).map((item, index) => {
    const matches = Number(item.matches) || 0;
    const wins = Number(item.wins) || 0;
    const calculatedRate = matches > 0 ? ((wins / matches) * 100).toFixed(1) + '%' : '0.0%';
    
    // Dynamic ranking: 1-indexed rank from sorted position
    const rank = index + 1;
    
    // Dynamic badge assignment
    let badge = item.badge || 'Contender';
    if (rank === 1 || item.points >= 1200) badge = 'Gold Champion';
    else if (rank === 2 || item.points >= 1050) badge = 'Silver MVP';
    else if (rank === 3 || item.points >= 950) badge = 'Bronze Elite';
    else if (item.points >= 800) badge = 'Pro Contender';

    return {
      ...item,
      rank,
      winRate: calculatedRate,
      badge
    };
  });

  const filtered = sortedData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          (item.team && item.team.toLowerCase().includes(search.toLowerCase()));
    const matchesSport = sportFilter === 'All' || item.sport.toLowerCase() === sportFilter.toLowerCase();
    return matchesSearch && matchesSport;
  });

  const top3 = sortedData.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>Official Global Rankings</span>
        </div>
        <h1 className="text-3xl font-extrabold font-outfit text-slate-900 dark:text-white">
          Athletes & Team Leaderboard
        </h1>
        <p className="text-xs text-slate-500">
          Ranked strictly by verified tournament match victories, accumulated points, and win percentages.
        </p>

        {/* Explain Conditions Trigger Button */}
        <div className="pt-1">
          <button
            onClick={() => setShowRulesInfo(!showRulesInfo)}
            className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showRulesInfo ? 'Hide Scoring Conditions' : 'How is Leaderboard Calculated? (Scoring Conditions)'}</span>
          </button>
        </div>
      </div>

      {/* DETAILED SCORING CONDITIONS BANNER */}
      {showRulesInfo && (
        <div className="material-card p-6 border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 space-y-4 rounded-2xl animate-fade-in max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-2 border-b border-blue-200/60 dark:border-blue-900/60">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-sm font-outfit text-blue-950 dark:text-blue-100">
                Official Leaderboard Calculation Rules & Conditions
              </h3>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-200/60 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              Deterministic Logic
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>1. Win Rate Formula</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                <strong className="text-slate-700 dark:text-slate-300">Win Rate = (Wins / Matches) × 100%</strong>. Rounded to 1 decimal place. Ensures athletes with higher efficiency are ranked accurately.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>2. Points Accumulation</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                <strong className="text-slate-700 dark:text-slate-300">Points = (Wins × 75) + (Matches × 10) + Bonus</strong>. Final Champions receive a +150 point tournament winner bonus.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>3. Ranking Priority</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Rankings sort primarily by <strong className="text-slate-700 dark:text-slate-300">Total Points (Desc)</strong>. Ties broken by <strong className="text-slate-700 dark:text-slate-300">Total Wins</strong>, followed by <strong className="text-slate-700 dark:text-slate-300">Win Rate %</strong>.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span className="font-bold text-slate-700 dark:text-slate-300">Badge Tiers:</span>
            <span className="badge bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-400/40 font-bold">Gold Champion (Rank 1 / ≥1200 pts)</span>
            <span className="badge bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold">Silver MVP (Rank 2 / ≥1050 pts)</span>
            <span className="badge bg-amber-700/10 text-amber-800 dark:text-amber-400 border border-amber-700/30 font-bold">Bronze Elite (Rank 3 / ≥950 pts)</span>
            <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold">Pro Contender (≥800 pts)</span>
          </div>
        </div>
      )}

      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto items-end pt-4">
        
        {/* Rank 2 (Silver) */}
        {top3[1] && (
          <div className="material-card p-4 text-center space-y-2 border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl shadow-md">
            <div className="w-10 h-10 rounded-full bg-slate-300 text-slate-900 mx-auto flex items-center justify-center font-extrabold text-sm shadow">2</div>
            <h3 className="font-bold text-xs line-clamp-1">{top3[1].name}</h3>
            <p className="text-[10px] text-slate-500 truncate">{top3[1].team}</p>
            <span className="badge bg-slate-200 text-slate-700 text-[9px] font-bold">{top3[1].points} pts</span>
          </div>
        )}

        {/* Rank 1 (Gold Champion) */}
        {top3[0] && (
          <div className="material-card p-5 text-center space-y-2 border-amber-400 shadow-xl bg-gradient-to-b from-amber-500/10 to-transparent transform -translate-y-4 rounded-2xl">
            <Crown className="w-6 h-6 text-amber-500 mx-auto animate-bounce" />
            <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-900 mx-auto flex items-center justify-center font-extrabold text-base shadow-md">1</div>
            <h3 className="font-extrabold text-sm font-outfit text-slate-900 dark:text-slate-100">{top3[0].name}</h3>
            <p className="text-[11px] text-slate-500 font-medium truncate">{top3[0].team}</p>
            <span className="badge bg-amber-500 text-white text-[10px] font-bold">{top3[0].points} PTS</span>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {top3[2] && (
          <div className="material-card p-4 text-center space-y-2 border-amber-700/40 bg-amber-950/5 rounded-2xl shadow-md">
            <div className="w-10 h-10 rounded-full bg-amber-700 text-white mx-auto flex items-center justify-center font-extrabold text-sm shadow">3</div>
            <h3 className="font-bold text-xs line-clamp-1">{top3[2].name}</h3>
            <p className="text-[10px] text-slate-500 truncate">{top3[2].team}</p>
            <span className="badge bg-amber-100 text-amber-800 text-[9px] font-bold">{top3[2].points} pts</span>
          </div>
        )}

      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 material-card p-4 rounded-2xl">
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
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                sportFilter === s 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
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
              <th className="text-center font-bold text-blue-600 dark:text-blue-400">Total Points</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row._id || row.id || row.name}>
                <td className="text-center font-extrabold text-slate-900 dark:text-white">
                  {row.rank === 1 ? '🥇 1' : row.rank === 2 ? '🥈 2' : row.rank === 3 ? '🥉 3' : row.rank}
                </td>
                <td className="font-bold flex items-center gap-2">
                  <span>{row.name}</span>
                  <span className="badge badge-primary text-[8px]">{row.badge}</span>
                </td>
                <td className="text-slate-500">{row.team}</td>
                <td>
                  <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                    {row.sport}
                  </span>
                </td>
                <td className="text-center font-medium">{row.matches}</td>
                <td className="text-center text-emerald-600 font-bold">{row.wins}</td>
                <td className="text-center font-semibold text-blue-600 dark:text-blue-400">{row.winRate}</td>
                <td className="text-center font-extrabold text-blue-600 dark:text-blue-400 text-base">
                  {row.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
