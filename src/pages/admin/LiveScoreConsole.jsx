import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, Radio, CheckCircle, Flame, Plus, Minus, Send } from 'lucide-react';

export const LiveScoreConsole = () => {
  const { addToast, updateMatchScore } = useApp();
  const [team1Score, setTeam1Score] = useState(2);
  const [team2Score, setTeam2Score] = useState(1);
  const [matchStatus, setMatchStatus] = useState('78\' Second Half');
  const [commentaryLog, setCommentaryLog] = useState([
    { time: "78'", text: "GOAL! Thunder FC winger scores a brilliant header into the top right corner!" },
    { time: "65'", text: "Yellow card issued to Blue Panthers defender for tactical foul." },
    { time: "45'", text: "Half-time whistle. Score 1 - 1." }
  ]);
  const [newComment, setNewComment] = useState('');

  const handleBroadcastScore = async () => {
    if (updateMatchScore) {
      await updateMatchScore(
        'trn-102', 
        'final', 
        'm7', 
        team1Score, 
        team2Score, 
        team1Score > team2Score ? 'Thunder FC' : (team2Score > team1Score ? 'Blue Panthers' : 'Draw')
      );
    }
    addToast(`Live score ${team1Score} - ${team2Score} synchronized with MongoDB fixtures!`, 'success');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setCommentaryLog([{ time: "82'", text: newComment }, ...commentaryLog]);
      setNewComment('');
      addToast('Broadcast commentary published to live feed', 'success');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black font-urbanist tracking-tight">Live Match Score Console</h1>
          <p className="text-xs text-slate-500">Update scores in real-time and stream commentary logs to spectators.</p>
        </div>

        <span className="badge badge-danger text-xs px-3 py-1.5 flex items-center gap-1.5">
          <Radio className="w-4 h-4 animate-pulse" /> STREAMING LIVE
        </span>
      </div>

      {/* Live Match Scorecard Control Box */}
      <div className="material-card p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-none rounded-3xl space-y-6 shadow-xl">
        
        <div className="flex justify-between items-center text-xs">
          <span className="badge bg-blue-500/20 text-blue-300 font-bold">Champions Football Cup 2026 • Final</span>
          <span className="font-bold text-amber-400 font-mono">{matchStatus}</span>
        </div>

        {/* Score Control Grid */}
        <div className="grid grid-cols-3 gap-6 items-center text-center">
          
          <div className="space-y-3">
            <span className="font-bold text-lg font-urbanist text-white block">Thunder FC</span>
            <div className="text-5xl font-black font-urbanist text-blue-400">{team1Score}</div>
            <div className="flex justify-center gap-2">
              <button onClick={() => setTeam1Score(prev => Math.max(0, prev - 1))} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold cursor-pointer">-1</button>
              <button onClick={() => setTeam1Score(prev => prev + 1)} className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold px-4 cursor-pointer">+1 Score</button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-white/10 mx-auto flex items-center justify-center font-extrabold text-sm text-slate-300">
              VS
            </div>
            <span className="text-[10px] text-slate-400 block font-semibold">Green Valley Arena</span>
            <button 
              onClick={handleBroadcastScore}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-1 mx-auto"
            >
              <Zap className="w-3.5 h-3.5" /> Sync Scoreboard
            </button>
          </div>

          <div className="space-y-3">
            <span className="font-bold text-lg font-urbanist text-white block">Blue Panthers</span>
            <div className="text-5xl font-black font-urbanist text-emerald-400">{team2Score}</div>
            <div className="flex justify-center gap-2">
              <button onClick={() => setTeam2Score(prev => Math.max(0, prev - 1))} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold cursor-pointer">-1</button>
              <button onClick={() => setTeam2Score(prev => prev + 1)} className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold px-4 cursor-pointer">+1 Score</button>
            </div>
          </div>

        </div>

      </div>

      {/* Live Commentary Publisher */}
      <div className="material-card p-6 space-y-4">
        <h3 className="font-bold text-base font-outfit">Live Broadcast Commentary Feed</h3>

        <form onSubmit={handleAddComment} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Type live match update (e.g. Yellow card, Goal, Penalty)..." 
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className="input-field py-2 text-xs"
          />
          <button type="submit" className="btn btn-primary text-xs px-4 flex-shrink-0">
            <Send className="w-4 h-4" /> Publish
          </button>
        </form>

        <div className="space-y-2 pt-2">
          {commentaryLog.map((log, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex gap-3 items-start">
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">{log.time}</span>
              <p className="text-slate-700 dark:text-slate-200">{log.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
