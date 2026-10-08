import React, { useState } from 'react';
import { X, CheckCircle, Trophy, Zap, AlertTriangle, ShieldCheck, Lock, LogIn, UserPlus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

// Tournament Registration Modal
export const RegistrationModal = ({ tournament, onClose }) => {
  const { registerForTournament, userProfile, role, setCurrentView, addToast } = useApp();
  const isGuest = role === 'guest' || !userProfile?.email || userProfile?.role === 'Guest' || userProfile?.role === 'guest';
  
  const isAlreadyRegistered = !isGuest && userProfile?.registrations?.some(
    r => (r.tournamentId && (r.tournamentId === tournament.id || r.tournamentId === tournament._id)) ||
         (r.tournamentName && r.tournamentName.toLowerCase().trim() === tournament.name?.toLowerCase().trim())
  );
  const existingReg = isAlreadyRegistered ? userProfile?.registrations?.find(
    r => (r.tournamentId && (r.tournamentId === tournament.id || r.tournamentId === tournament._id)) ||
         (r.tournamentName && r.tournamentName.toLowerCase().trim() === tournament.name?.toLowerCase().trim())
  ) : null;

  const [formData, setFormData] = useState({
    participantName: isGuest ? '' : (userProfile?.name || ''),
    email: isGuest ? '' : (userProfile?.email || ''),
    phone: isGuest ? '' : (userProfile?.phone || ''),
    teamName: tournament.type === 'Team' ? '' : 'Individual',
    paymentMethod: 'Credit Card'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // If user is a Guest, enforce read-only access and require Login
  if (isGuest) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Animated Lock Icon */}
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-2xl font-urbanist text-slate-900 dark:text-slate-100 tracking-tight">
              Sign In to Register
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">
              Guests have <strong>read-only access</strong>. To register your team or claim a ticket for <strong>"{tournament.name}"</strong>, please log in with your athlete account or sign up.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <div className="text-left">
              <p className="font-bold text-slate-800 dark:text-slate-200">{tournament.sport} • {tournament.type} Event</p>
              <p className="text-[11px] text-slate-400">{tournament.venue}</p>
            </div>
            <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
              {tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => {
                onClose();
                setCurrentView('login');
                addToast(`Please log in to register for "${tournament.name}".`, 'info');
              }}
              className="btn btn-primary w-full py-3 flex items-center justify-center gap-2 font-bold text-xs shadow-lg shadow-blue-500/25 cursor-pointer"
            >
              <LogIn className="w-4 h-4" /> Log In to Athlete Account
            </button>
            <button
              onClick={() => {
                onClose();
                setCurrentView('register');
                addToast('Create an account to start participating in tournaments.', 'info');
              }}
              className="btn btn-secondary w-full py-2.5 flex items-center justify-center gap-2 font-semibold text-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" /> Create New Account
            </button>
            <button
              onClick={onClose}
              className="btn btn-ghost w-full py-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Continue Browsing as Guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAlreadyRegistered) {
      setSubmitError('You have already registered for this tournament.');
      return;
    }
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
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isAlreadyRegistered && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Already Registered</span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
              You are already officially enrolled for this tournament. Each participant is allowed <strong>only one registration</strong>.
            </p>
            {existingReg?.ticketCode && (
              <p className="font-mono font-bold text-xs pt-1 text-emerald-900 dark:text-emerald-200">
                Ticket Code: {existingReg.ticketCode}
              </p>
            )}
          </div>
        )}

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
              ₹{tournament.entryFee}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                required
                disabled={isAlreadyRegistered}
                value={formData.participantName}
                onChange={e => setFormData({ ...formData, participantName: e.target.value })}
                className="input-field py-2 disabled:opacity-60"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                required
                disabled={isAlreadyRegistered}
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="input-field py-2 disabled:opacity-60"
              />
            </div>
          </div>

          {tournament.type === 'Team' && (
            <div className="form-group">
              <label className="form-label">Team Name</label>
              <input 
                type="text" 
                required
                disabled={isAlreadyRegistered}
                value={formData.teamName}
                onChange={e => setFormData({ ...formData, teamName: e.target.value })}
                className="input-field py-2 disabled:opacity-60"
                placeholder="Enter team name"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="text" 
                disabled={isAlreadyRegistered}
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="input-field py-2 disabled:opacity-60"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select 
                disabled={isAlreadyRegistered}
                value={formData.paymentMethod}
                onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="input-field py-2 disabled:opacity-60"
              >
                <option>UPI / Netbanking</option>
                <option>Credit / Debit Card</option>
                <option>College Sports Wallet</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-outline py-2 text-xs cursor-pointer">
              {isAlreadyRegistered ? 'Close' : 'Cancel'}
            </button>
            <button 
              type="submit" 
              disabled={isAlreadyRegistered || isSubmitting}
              className={`btn py-2 text-xs flex items-center gap-1.5 cursor-pointer ${
                isAlreadyRegistered ? 'btn-secondary opacity-60 cursor-not-allowed' : 'btn-primary'
              }`}
            >
              {isAlreadyRegistered ? (
                <>✓ Registered ({existingReg?.ticketCode || 'Active'})</>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" /> 
                  {isSubmitting ? 'Registering...' : `Confirm & Pay ₹${tournament.entryFee}`}
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

// Live Score Update Modal (Admin)
// Update Match Result Modal (Admin - Post-match score & outcome entry)
export const UpdateMatchResultModal = ({ tournamentId, stage, match, sport, onClose }) => {
  const { updateMatchScore, role, addToast } = useApp();
  const isAdmin = role === 'admin';
  const [score1, setScore1] = useState(match ? (typeof match.score1 === 'number' ? match.score1 : 0) : 0);
  const [score2, setScore2] = useState(match ? (typeof match.score2 === 'number' ? match.score2 : 0) : 0);
  const [winner, setWinner] = useState(match ? (match.winner || match.team1) : 'TBD');

  if (!match) return null;

  const handleScore1Change = (e) => {
    const val = Math.max(0, parseInt(e.target.value) || 0);
    setScore1(val);
    if (val > score2) setWinner(match.team1);
    else if (score2 > val) setWinner(match.team2);
  };

  const handleScore2Change = (e) => {
    const val = Math.max(0, parseInt(e.target.value) || 0);
    setScore2(val);
    if (val > score1) setWinner(match.team2);
    else if (score1 > val) setWinner(match.team1);
  };

  const handleSave = async () => {
    if (!isAdmin) {
      addToast('Permission Denied: Only tournament administrators can record official match scores.', 'error');
      onClose();
      return;
    }
    const finalWinner = (winner === 'Draw' || !winner) 
      ? (score1 >= score2 ? match.team1 : match.team2) 
      : winner;
    
    await updateMatchScore(tournamentId, stage, match.id, score1, score2, finalWinner);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base font-outfit">Update Match Result</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span>Enter the final score after the match. The winner will automatically advance in the tournament bracket.</span>
          </div>

          {/* Clean Final Score Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-2">
              <label className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate block">
                {match.team1}
              </label>
              <input 
                type="number"
                min="0"
                value={score1}
                onChange={handleScore1Change}
                className="input-field text-center font-extrabold text-2xl py-2 font-outfit text-blue-600 dark:text-blue-400"
              />
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Final Score</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-2">
              <label className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate block">
                {match.team2}
              </label>
              <input 
                type="number"
                min="0"
                value={score2}
                onChange={handleScore2Change}
                className="input-field text-center font-extrabold text-2xl py-2 font-outfit text-blue-600 dark:text-blue-400"
              />
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Final Score</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label font-bold">Official Match Winner</label>
            <select 
              value={winner} 
              onChange={e => setWinner(e.target.value)}
              className="input-field py-2 font-semibold text-xs"
            >
              <option value={match.team1}>{match.team1} (Winner &rarr; Advances)</option>
              <option value={match.team2}>{match.team2} (Winner &rarr; Advances)</option>
              <option value="Draw">Match Tied / Draw</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button onClick={onClose} className="btn btn-outline py-2 text-xs cursor-pointer">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary py-2 text-xs cursor-pointer flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Save Result & Complete Match
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

// Backward-compatible alias for existing imports
export const LiveScoreModal = UpdateMatchResultModal;

// Schedule Match Modal (Admin)
export const ScheduleMatchModal = ({ tournamentId, initialStage = 'quarterFinals', onClose }) => {
  const { scheduleMatch, tournaments, addToast } = useApp();
  const [selectedTrnId, setSelectedTrnId] = useState(tournamentId || (tournaments[0]?.id || 'trn-101'));
  const [stage, setStage] = useState(initialStage);
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('04:00 PM');
  const [court, setCourt] = useState('Campus Sports Arena • Court 1');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!team1.trim() || !team2.trim()) {
      addToast('Please enter both team names to schedule a match.', 'error');
      return;
    }

    try {
      await scheduleMatch(selectedTrnId, {
        stage,
        team1: team1.trim(),
        team2: team2.trim(),
        date,
        time,
        court: court.trim(),
        status: 'Scheduled'
      });
      onClose();
    } catch (err) {
      addToast(`Error scheduling match: ${err.message}`, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-lg font-outfit">Schedule Tournament Match</h3>
            <p className="text-xs text-slate-500">Assign teams, time, date, and venue for an upcoming fixture.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Tournament</label>
              <select 
                value={selectedTrnId} 
                onChange={e => setSelectedTrnId(e.target.value)}
                className="input-field py-2"
              >
                {tournaments.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.sport})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Stage / Round</label>
              <select 
                value={stage} 
                onChange={e => setStage(e.target.value)}
                className="input-field py-2"
              >
                <option value="quarterFinals">Quarterfinals</option>
                <option value="semiFinals">Semifinals</option>
                <option value="final">Championship Final</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Team / Participant 1</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Thunderbolts FC"
                value={team1}
                onChange={e => setTeam1(e.target.value)}
                className="input-field py-2"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Team / Participant 2</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Blue Panthers"
                value={team2}
                onChange={e => setTeam2(e.target.value)}
                className="input-field py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Match Date</label>
              <input 
                type="date" 
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="input-field py-2"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Match Time</label>
              <input 
                type="text" 
                required
                placeholder="e.g. 04:30 PM"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="input-field py-2"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Venue / Court</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Main Stadium Ground Pitch 1"
              value={court}
              onChange={e => setCourt(e.target.value)}
              className="input-field py-2"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-outline py-2 text-xs">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary py-2 text-xs flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Confirm Match Schedule
            </button>
          </div>

        </form>

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
