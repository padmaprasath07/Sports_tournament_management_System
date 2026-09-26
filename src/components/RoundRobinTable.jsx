import React from 'react';
import { MOCK_ROUND_ROBIN } from '../data/mockData';
import { Trophy, TrendingUp } from 'lucide-react';

export const RoundRobinTable = ({ standings = MOCK_ROUND_ROBIN, sport = 'Football' }) => {
  const sportName = sport || 'General';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold font-outfit">{sportName} Points Table</h3>
          <p className="text-xs text-slate-500">Live points table for this tournament, updated after every match result.</p>
        </div>
        <span className="badge badge-success flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> Live Points Table
        </span>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-12 text-center">Rank</th>
              <th>Team Name</th>
              <th className="text-center">P</th>
              <th className="text-center">W</th>
              <th className="text-center">D</th>
              <th className="text-center">L</th>
              <th className="text-center">GF/GA</th>
              <th className="text-center font-bold text-blue-600 dark:text-blue-400">PTS</th>
            </tr>
          </thead>
          <tbody>
            {standings.map(row => (
              <tr key={row.team} className={row.rank <= 2 ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''}>
                <td className="text-center font-bold">
                  {row.rank === 1 ? (
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-extrabold text-xs inline-flex items-center justify-center">1</span>
                  ) : row.rank === 2 ? (
                    <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-extrabold text-xs inline-flex items-center justify-center">2</span>
                  ) : (
                    row.rank
                  )}
                </td>
                <td className="font-semibold flex items-center gap-2">
                  <span>{row.team}</span>
                  {row.rank <= 2 && (
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                      Qualified
                    </span>
                  )}
                </td>
                <td className="text-center">{row.played}</td>
                <td className="text-center text-emerald-600 font-semibold">{row.won}</td>
                <td className="text-center text-amber-600">{row.drawn}</td>
                <td className="text-center text-rose-600">{row.lost}</td>
                <td className="text-center text-xs text-slate-500">{row.gf} : {row.ga}</td>
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
