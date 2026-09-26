import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Users, Award, ChevronRight, Trophy } from 'lucide-react';

export const TournamentCard = ({ tournament, onRegisterClick }) => {
  const { setSelectedTournamentId, setCurrentView } = useApp();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Live':
        return <span className="badge badge-danger flex items-center gap-1"><span className="live-indicator"></span> LIVE NOW</span>;
      case 'Registration Open':
        return <span className="badge badge-success">Registration Open</span>;
      case 'Upcoming':
        return <span className="badge badge-primary">Upcoming</span>;
      case 'Completed':
        return <span className="badge badge-info">Completed</span>;
      default:
        return <span className="badge badge-warning">{status}</span>;
    }
  };

  const progressPercent = Math.min(100, Math.round((tournament.registeredCount / tournament.maxParticipants) * 100));

  const handleCardClick = () => {
    setSelectedTournamentId(tournament.id);
    setCurrentView('tournament-details');
  };

  return (
    <div className="material-card overflow-hidden flex flex-col group cursor-pointer animate-float-in" onClick={handleCardClick}>
      
      {/* Card Image Header */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
        <img 
          src={tournament.bannerImage} 
          alt={tournament.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>
        
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {getStatusBadge(tournament.status)}
          <span className="badge bg-slate-900/80 text-white backdrop-blur-md">
            {tournament.sport}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 bg-emerald-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1">
          <Award className="w-3.5 h-3.5" />
          Prize: ${tournament.prizePool.toLocaleString()}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-base line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-outfit">
            {tournament.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {tournament.description}
          </p>
        </div>

        {/* Metadata info */}
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span>{tournament.startDate} - {tournament.endDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span className="truncate">{tournament.venue}</span>
          </div>
        </div>

        {/* Participant Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
            <span>Slots Registered</span>
            <span>{tournament.registeredCount} / {tournament.maxParticipants} ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="gradient-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Fee: {tournament.entryFee === 0 ? 'FREE' : `$${tournament.entryFee}`}
          </span>

          <div className="flex items-center gap-2">
            {tournament.status === 'Registration Open' && onRegisterClick && (
              <button 
                onClick={(e) => { e.stopPropagation(); onRegisterClick(tournament); }}
                className="btn btn-primary btn-sm"
              >
                Register
              </button>
            )}
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
