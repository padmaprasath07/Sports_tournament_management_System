import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KnockoutBracket } from '../../components/KnockoutBracket';
import { RegistrationModal } from '../../components/Modals';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Award, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  ArrowLeft, 
  Share2, 
  Trophy,
  Download,
  Printer,
  Lock,
  Clock
} from 'lucide-react';

export const TournamentDetails = () => {
  const { selectedTournament, setCurrentView, addToast, role, userProfile, fixtures } = useApp();
  const isGuest = role === 'guest' || !userProfile?.email || userProfile?.role === 'Guest' || userProfile?.role === 'guest';
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'matches' | 'rules' | 'bracket'
  const [showRegModal, setShowRegModal] = useState(false);

  if (!selectedTournament) return null;

  const progressPercent = Math.min(100, Math.round((selectedTournament.registeredCount / selectedTournament.maxParticipants) * 100));

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        addToast('Championship link copied to clipboard!', 'success');
      } else {
        addToast('Championship Link: ' + url, 'info');
      }
    } catch (e) {
      addToast('Championship link ready to share!', 'info');
    }
  };

  const userEmail = (userProfile?.email || '').toLowerCase().trim();
  const existingUserPass = (userProfile?.registrations || []).find(
    r => (r.tournamentId === selectedTournament.id || r.tournamentName === selectedTournament.name)
  );
  const isAlreadyRegistered = Boolean(existingUserPass);

  const handleDownloadRules = () => {
    const content = `========================================================
SPORTSPULSE INTER-COLLEGIATE ATHLETIC FEDERATION
OFFICIAL TOURNAMENT RULEBOOK & COMPETITION GUIDELINES
========================================================
Event Name: ${selectedTournament.name}
Sport Discipline: ${selectedTournament.sport}
Tournament Format: ${selectedTournament.format}
Host Venue: ${selectedTournament.venue}
Sanctioned By: ${selectedTournament.organizer}
Event Schedule: ${selectedTournament.startDate} to ${selectedTournament.endDate}
Total Prize Pool: ₹${selectedTournament.prizePool?.toLocaleString()}
Entry Fee: ₹${selectedTournament.entryFee}
Registration Deadline: ${selectedTournament.registrationDeadline}
Max Participants / Teams: ${selectedTournament.maxParticipants}

--------------------------------------------------------
SECTION 1: GENERAL ELIGIBILITY & CONDUCT
--------------------------------------------------------
1. All participants must present a valid collegiate digital sports pass.
2. Teams must report to the official check-in desk 45 minutes prior to scheduled start.
3. Unsportsmanlike conduct will result in immediate disqualification without refund.
4. Official referee decisions on field infractions are final.

--------------------------------------------------------
SECTION 2: OFFICIAL COMPETITION RULES
--------------------------------------------------------
${selectedTournament.rules.map((rule, idx) => `${idx + 1}. ${rule}`).join('\n')}

--------------------------------------------------------
SECTION 3: DISPUTE RESOLUTION & SAFETY
--------------------------------------------------------
- Medical personnel and first-aid response units are stationed on-site.
- Any formal appeals must be submitted within 30 minutes of match completion.
- SportPulse Fair Play & Anti-Doping protocols strictly enforced.

Official Verification Code: SP-${selectedTournament.id?.toUpperCase() || 'TRN'}-${Date.now().toString(36).toUpperCase()}
Issued by SportPulse Collegiate Sports Network
========================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedTournament.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_official_rules.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('Official rulebook downloaded successfully!', 'success');
  };

  const handlePrintRules = () => {
    window.print();
  };

  const trnFix = (fixtures && (fixtures[selectedTournament.id] || fixtures['trn-102'])) || {};
  const allScheduledMatches = [
    ...(trnFix.quarterFinals || []).map(m => ({ ...m, stageLabel: 'Quarterfinal' })),
    ...(trnFix.semiFinals || []).map(m => ({ ...m, stageLabel: 'Semifinal' })),
    ...(trnFix.final || []).map(m => ({ ...m, stageLabel: 'Grand Championship Final' }))
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setCurrentView('browse-tournaments')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tournaments
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <Share2 className="w-4 h-4" /> Share Championship
        </button>
      </div>

      {/* HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden material-card border-none shadow-xl bg-slate-900 text-white">
        <img 
          src={selectedTournament.bannerImage} 
          alt={selectedTournament.name} 
          className="w-full h-72 object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="badge bg-blue-600 text-white font-bold">{selectedTournament.sport}</span>
              <span className="badge bg-white/20 text-white backdrop-blur-md">{selectedTournament.format}</span>
              <span className={`badge ${selectedTournament.status === 'Completed' ? 'bg-blue-600' : 'bg-emerald-500'} text-white`}>
                {selectedTournament.status}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold font-urbanist tracking-tight text-white">
              {selectedTournament.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-blue-400" /> {selectedTournament.startDate} - {selectedTournament.endDate}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-400" /> {selectedTournament.venue}</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-purple-400" /> {selectedTournament.organizer}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="btn bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold py-3 px-4 rounded-xl flex items-center gap-1.5 backdrop-blur-md transition-all"
              title="Share Championship"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
            {selectedTournament.status === 'Completed' ? (
              <div className="px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center gap-2 font-bold text-xs backdrop-blur-md shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Tournament Completed • Registration Closed</span>
              </div>
            ) : isAlreadyRegistered ? (
              <div className="px-5 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-white flex items-center gap-2 font-bold text-xs backdrop-blur-md shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Already Registered (Ticket: {existingUserPass.ticketCode})</span>
              </div>
            ) : (
              <button 
                onClick={() => setShowRegModal(true)}
                className="btn btn-accent btn-lg font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer"
              >
                {isGuest ? <Lock className="w-5 h-5 text-amber-300" /> : <Trophy className="w-5 h-5" />}
                {isGuest ? 'Sign In to Register' : `Register Now (${selectedTournament.entryFee === 0 ? 'FREE' : `₹${selectedTournament.entryFee}`})`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KEY METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="material-card p-4 text-center space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Prize Pool</span>
          <p className="text-2xl font-extrabold text-amber-500 font-urbanist">₹{selectedTournament.prizePool.toLocaleString()}</p>
        </div>
        <div className="material-card p-4 text-center space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Entry Fee</span>
          <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-urbanist">{selectedTournament.entryFee === 0 ? 'FREE' : `₹${selectedTournament.entryFee}`}</p>
        </div>
        <div className="material-card p-4 text-center space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Max Participants</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-urbanist">{selectedTournament.registeredCount} / {selectedTournament.maxParticipants}</p>
        </div>
        <div className="material-card p-4 text-center space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Deadline</span>
          <p className="text-xl font-bold text-slate-700 dark:text-slate-200 font-urbanist">{selectedTournament.registrationDeadline}</p>
        </div>
      </div>

      {/* DETAILS TAB CONTENT */}
      <div className="material-card p-6 space-y-6">
        
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold overflow-x-auto pb-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-3 transition-all whitespace-nowrap ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
          >
            Overview & Description
          </button>
          <button 
            onClick={() => setActiveTab('matches')}
            className={`pb-3 transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'matches' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
          >
            <span>Scheduled Matches & Results</span>
            {allScheduledMatches.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold">
                {allScheduledMatches.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('rules')}
            className={`pb-3 transition-all whitespace-nowrap ${activeTab === 'rules' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
          >
            Official Rules
          </button>
          <button 
            onClick={() => setActiveTab('bracket')}
            className={`pb-3 transition-all whitespace-nowrap ${activeTab === 'bracket' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
          >
            Bracket Preview
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {selectedTournament.status === 'Completed' && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">Tournament Concluded & Results Finalized</h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">All scheduled tournament matches have been completed and official match scores verified.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('matches')}
                  className="btn btn-primary text-xs py-2 px-3.5 flex-shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  View Overall Scheduled Matches &rarr;
                </button>
              </div>
            )}

            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">About the Championship</h3>
            <p>{selectedTournament.description}</p>
            
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-800 space-y-2">
              <h4 className="font-bold text-blue-900 dark:text-blue-200">Registration Guidelines</h4>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                <li>Individual & team captains must verify their player identities before the deadline.</li>
                <li>Digital ticket passes will be generated immediately upon successful payment confirmation.</li>
                <li>Check-in opens 45 minutes prior to scheduled matches at the official grounds booth.</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Overall Scheduled & Completed Matches</h3>
                <p className="text-slate-500 text-[11px]">Official fixtures timetable, venue allocations, and confirmed match results for {selectedTournament.name}.</p>
              </div>
              {selectedTournament.status === 'Completed' && (
                <span className="badge badge-success text-[10px] font-bold self-start sm:self-auto">
                  ✓ Tournament Completed ({allScheduledMatches.length} Matches)
                </span>
              )}
            </div>

            {allScheduledMatches.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-600 dark:text-slate-400">No scheduled matches found for this tournament yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">Organizers will publish match schedules once team registration closes.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allScheduledMatches.map(m => {
                  const isCompleted = m.status === 'Completed' || (m.status && m.status.startsWith('Champion')) || (typeof m.score1 === 'number' && typeof m.score2 === 'number' && (m.score1 > 0 || m.score2 > 0));
                  return (
                    <div 
                      key={m.id}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                            {m.stageLabel}
                          </span>
                          <span className="text-slate-400 text-[10px]">Match {m.id}</span>
                          <span className={`badge ${isCompleted ? 'badge-success' : 'badge-primary'} text-[9px] font-bold`}>
                            {isCompleted ? '✓ Completed' : '📅 Scheduled'}
                          </span>
                        </div>
                        <div className="flex items-center flex-wrap gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                          {m.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> {m.date}</span>}
                          {m.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {m.time}</span>}
                          {m.court && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {m.court}</span>}
                        </div>
                      </div>

                      {/* Score / Teams Card */}
                      <div className="flex items-center gap-4 bg-white dark:bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm min-w-[280px] sm:min-w-[340px] justify-between">
                        <div className={`text-right flex-1 truncate ${m.winner === m.team1 ? 'font-extrabold text-blue-600 dark:text-blue-400' : 'font-medium text-slate-800 dark:text-slate-200'}`}>
                          <span>{m.team1 || 'TBD'}</span>
                          {isCompleted && <span className="ml-2 font-black text-slate-900 dark:text-white text-sm">{m.score1}</span>}
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold px-1.5">VS</span>
                        <div className={`text-left flex-1 truncate ${m.winner === m.team2 ? 'font-extrabold text-blue-600 dark:text-blue-400' : 'font-medium text-slate-800 dark:text-slate-200'}`}>
                          {isCompleted && <span className="mr-2 font-black text-slate-900 dark:text-white text-sm">{m.score2}</span>}
                          <span>{m.team2 || 'TBD'}</span>
                        </div>
                      </div>

                      {/* Winner / Status Pill */}
                      <div className="text-right flex-shrink-0 min-w-[130px]">
                        {isCompleted && m.winner ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200/60 dark:border-amber-800/60">
                            <Trophy className="w-3 h-3 text-amber-500" /> {m.winner}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">Scheduled Match</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Official Tournament Playing Rules</h3>
                <p className="text-slate-500 text-[11px]">Sanctioned by {selectedTournament.organizer} for all registered participants.</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleDownloadRules}
                  className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download (.TXT)
                </button>
                <button 
                  onClick={handlePrintRules}
                  className="btn btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Rulebook
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {selectedTournament.rules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-700 dark:text-slate-200">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bracket' && (
          <KnockoutBracket tournamentId={selectedTournament.id} />
        )}

      </div>

      {/* Registration Modal */}
      {showRegModal && (
        <RegistrationModal 
          tournament={selectedTournament} 
          onClose={() => setShowRegModal(false)} 
        />
      )}

    </div>
  );
};
