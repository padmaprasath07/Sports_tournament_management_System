import React, { useState } from 'react';
import { X, CheckCircle, Trophy, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

// Tournament Registration Modal
export const RegistrationModal = ({ tournament, onClose }) => {
  const { registerForTournament, userProfile } = useApp();
  const isGuest = !userProfile?.email || userProfile?.role === 'Guest' || userProfile?.role === 'guest';
  const [formData, setFormData] = useState({
    participantName: isGuest ? '' : (userProfile?.name || ''),
    email: isGuest ? '' : (userProfile?.email || ''),
    phone: isGuest ? '' : (userProfile?.phone || ''),
    teamName: tournament.type === 'Team' ? '' : 'Individual',
    paymentMethod: 'Credit Card'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await registerForTournament(tournament.id || tournament._id, {
        ...formData,
        tournamentName: tournament.name,
        sport: tournament.sport,
      });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onClose();
    } catch (err) {
      setSubmitError(err.message || 'Failed to complete tournament registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-lg font-outfit">Tournament Registration</h3>
            <p className="text-xs text-slate-500">{tournament.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitError && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 flex justify-between items-center">
            <div>
              <p className="font-bold text-blue-900 dark:text-blue-200">{tournament.sport} • {tournament.type} Format</p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400">Venue: {tournament.venue}</p>
            </div>
            <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
              ${tournament.entryFee}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.participantName}
                onChange={e => setFormData({ ...formData, participantName: e.target.value })}
                className="input-field py-2"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="input-field py-2"
              />
            </div>
          </div>

          {tournament.type === 'Team' && (
            <div className="form-group">
              <label className="form-label">Team Name</label>
              <input 
                type="text" 
                required
                value={formData.teamName}
                onChange={e => setFormData({ ...formData, teamName: e.target.value })}
                className="input-field py-2"
                placeholder="Enter team name"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="input-field py-2"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select 
                value={formData.paymentMethod}
                onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="input-field py-2"
              >
                <option>Credit / Debit Card</option>
                <option>UPI / Netbanking</option>
                <option>College Wallet</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-outline py-2 text-xs">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary py-2 text-xs">
              <CheckCircle className="w-4 h-4" /> Confirm & Pay ${tournament.entryFee}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

// Live Score Update Modal (Admin)
export const LiveScoreModal = ({ tournamentId, stage, match, sport, onClose }) => {
  const { updateMatchScore } = useApp();
  const [score1, setScore1] = useState(match ? match.score1 : 0);
  const [score2, setScore2] = useState(match ? match.score2 : 0);
  const [winner, setWinner] = useState(match ? match.winner || match.team1 : match?.team1 || 'Team 1');

  if (!match) return null;

  const sportKey = (sport || 'Football').toLowerCase();
  const getScorecardConfig = () => {
    if (sportKey.includes('cricket')) {
      return {
        title: 'Cricket Scorecard',
        scoreLabel: 'Runs',
        secondaryLabel: 'Wickets'
      };
    }

    if (sportKey.includes('badminton') || sportKey.includes('tennis') || sportKey.includes('table')) {
      return {
        title: 'Rally Scorecard',
        scoreLabel: 'Sets',
        secondaryLabel: 'Games'
      };
    }

    if (sportKey.includes('chess')) {
      return {
        title: 'Chess Result Card',
        scoreLabel: 'Points',
        secondaryLabel: 'Outcome'
      };
    }

    if (sportKey.includes('basketball')) {
      return {
        title: 'Basketball Scorecard',
        scoreLabel: 'Points',
        secondaryLabel: null
      };
    }

    return {
      title: 'Match Scorecard',
      scoreLabel: 'Goals',
      secondaryLabel: null
    };
  };

  const scorecardConfig = getScorecardConfig();

  const handleSave = () => {
    updateMatchScore(tournamentId, stage, match.id, score1, score2, winner);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
            <h3 className="font-bold text-base font-outfit">{scorecardConfig.title}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Score Increment Interface */}
          <div className="grid grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 text-center space-y-2">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate block">{match.team1}</span>
              <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-outfit">{score1}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{scorecardConfig.scoreLabel}</div>
              <div className="flex justify-center gap-1">
                <button onClick={() => setScore1(prev => Math.max(0, prev - 1))} className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded font-bold border border-slate-200 shadow-sm">-1</button>
                <button onClick={() => setScore1(prev => prev + 1)} className="px-2.5 py-1 bg-blue-600 text-white rounded font-bold shadow-sm">+1</button>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 text-center space-y-2">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate block">{match.team2}</span>
              <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-outfit">{score2}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{scorecardConfig.scoreLabel}</div>
              <div className="flex justify-center gap-1">
                <button onClick={() => setScore2(prev => Math.max(0, prev - 1))} className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded font-bold border border-slate-200 shadow-sm">-1</button>
                <button onClick={() => setScore2(prev => prev + 1)} className="px-2.5 py-1 bg-blue-600 text-white rounded font-bold shadow-sm">+1</button>
              </div>
            </div>

          </div>

          {scorecardConfig.secondaryLabel && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-[11px] text-slate-600 dark:text-slate-300">
              <span className="font-semibold">{scorecardConfig.secondaryLabel}:</span> {sport || 'Sport'} specific scoring details can be added here for this tournament format.
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Set Winner / Match Status</label>
            <select 
              value={winner} 
              onChange={e => setWinner(e.target.value)}
              className="input-field py-2"
            >
              <option value={match.team1}>{match.team1} (Winner)</option>
              <option value={match.team2}>{match.team2} (Winner)</option>
              <option value="Draw">Match Draw</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button onClick={onClose} className="btn btn-outline py-2 text-xs">Cancel</button>
            <button onClick={handleSave} className="btn btn-primary py-2 text-xs">
              Update Scorecard
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

// Delete Confirmation Modal
export const DeleteConfirmModal = ({ title, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-base font-outfit">Delete Confirmation</h3>
          <p className="text-xs text-slate-500 mt-1">Are you sure you want to delete "{title}"? This action cannot be undone.</p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <button onClick={onClose} className="btn btn-outline py-1.5 text-xs">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="btn btn-primary bg-red-600 hover:bg-red-700 py-1.5 text-xs">
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};
