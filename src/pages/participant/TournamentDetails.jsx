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
  Trophy 
} from 'lucide-react';

export const TournamentDetails = () => {
  const { selectedTournament, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'rules' | 'bracket'
  const [showRegModal, setShowRegModal] = useState(false);

  if (!selectedTournament) return null;

  const progressPercent = Math.min(100, Math.round((selectedTournament.registeredCount / selectedTournament.maxParticipants) * 100));

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Back Navigation */}
      <button 
        onClick={() => setCurrentView('browse-tournaments')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Tournaments
      </button>

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
              <span className="badge bg-emerald-500 text-white">{selectedTournament.status}</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold font-outfit text-white">
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
              onClick={() => setShowRegModal(true)}
              className="btn btn-accent btn-lg font-bold shadow-lg shadow-emerald-500/25"
            >
              <Trophy className="w-5 h-5" /> Register Now (${selectedTournament.entryFee})
            </button>
          </div>
        </div>
      </div>

      {/* KEY METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="material-card p-4 text-center space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Prize Pool</span>
          <p className="text-2xl font-extrabold text-amber-500 font-outfit">${selectedTournament.prizePool.toLocaleString()}</p>
        </div>
        <div className="material-card p-4 text-center space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Entry Fee</span>
          <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-outfit">${selectedTournament.entryFee}</p>
        </div>
        <div className="material-card p-4 text-center space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Max Participants</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-outfit">{selectedTournament.registeredCount} / {selectedTournament.maxParticipants}</p>
        </div>
        <div className="material-card p-4 text-center space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Deadline</span>
          <p className="text-xl font-bold text-slate-700 dark:text-slate-200 font-outfit">{selectedTournament.registrationDeadline}</p>
        </div>
      </div>

      {/* DETAILS TAB CONTENT */}
      <div className="material-card p-6 space-y-6">
        
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-3 transition-all ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
          >
            Overview & Description
          </button>
          <button 
            onClick={() => setActiveTab('rules')}
            className={`pb-3 transition-all ${activeTab === 'rules' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
          >
            Official Rules
          </button>
          <button 
            onClick={() => setActiveTab('bracket')}
            className={`pb-3 transition-all ${activeTab === 'bracket' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
          >
            Bracket Preview
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">About the Championship</h3>
            <p>{selectedTournament.description}</p>
            
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-800 space-y-2">
              <h4 className="font-bold text-blue-900 dark:text-blue-200">Registration Guidelines</h4>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                <li>Individual & team captains must verify their player identities before the deadline.</li>
                <li>Digital ticket passes will be generated immediately upon successful payment confirmation.</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Official Tournament Playing Rules</h3>
            <div className="space-y-2">
              {selectedTournament.rules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{rule}</span>
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
