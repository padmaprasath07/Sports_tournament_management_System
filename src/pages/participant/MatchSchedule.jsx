import React, { useState } from 'react';
import { Calendar, MapPin, Trophy, Zap, Search } from 'lucide-react';

export const MatchSchedule = () => {
  const [sportFilter, setSportFilter] = useState('All');

  const matches = [
    { id: 'm-1', sport: 'Football', team1: 'Thunder FC', team2: 'Blue Panthers', score1: 2, score2: 1, time: "78' LIVE", status: 'Live', venue: 'Green Valley Arena', date: '2026-08-05' },
    { id: 'm-2', sport: 'Cricket', team1: 'Royal Chargers', team2: 'City Strikers', score1: '-', score2: '-', time: '4:00 PM', status: 'Upcoming', venue: 'Metropolitan Oval', date: '2026-08-06' },
    { id: 'm-3', sport: 'Basketball', team1: 'Hoop Kings', team2: 'Street Legends', score1: 72, score2: 68, time: 'Full Time', status: 'Completed', venue: 'Downtown Hub', date: '2026-08-04' },
    { id: 'm-4', sport: 'Badminton', team1: 'Alex Mercer', team2: 'David Chen', score1: 2, score2: 0, time: 'Full Time', status: 'Completed', venue: 'Indoor Court 3', date: '2026-08-03' }
  ];

  const filteredMatches = sportFilter === 'All' ? matches : matches.filter(m => m.sport.toLowerCase() === sportFilter.toLowerCase());

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-outfit">Match Schedule & Fixtures</h1>
          <p className="text-xs text-slate-500">Live score updates, match venues, and fixture calendar.</p>
        </div>

        <div className="flex gap-2">
          {['All', 'Football', 'Cricket', 'Basketball', 'Badminton'].map(s => (
            <button
              key={s}
              onClick={() => setSportFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${sportFilter === s ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredMatches.map(m => (
          <div key={m.id} className="material-card p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="badge badge-primary text-[9px]">{m.sport}</span>
              {m.status === 'Live' ? (
                <span className="badge badge-danger text-[9px] flex items-center gap-1">
                  <span className="live-indicator"></span> {m.time}
                </span>
              ) : (
                <span className="badge badge-info text-[9px]">{m.status}</span>
              )}
            </div>

            {/* Teams VS layout */}
            <div className="flex items-center justify-center gap-6 w-full md:w-1/2 py-2">
              <div className="text-right flex-1">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block truncate">{m.team1}</span>
              </div>
              
              <div className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-extrabold text-sm text-blue-600 dark:text-blue-400 font-outfit">
                {m.status === 'Upcoming' ? 'VS' : `${m.score1} - ${m.score2}`}
              </div>

              <div className="text-left flex-1">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block truncate">{m.team2}</span>
              </div>
            </div>

            <div className="text-xs text-slate-500 text-right w-full md:w-auto">
              <p className="flex items-center justify-end gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> {m.venue}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{m.date} • {m.time}</p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
