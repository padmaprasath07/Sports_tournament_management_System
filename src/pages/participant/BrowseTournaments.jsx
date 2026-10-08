import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TournamentCard } from '../../components/TournamentCard';
import { RegistrationModal } from '../../components/Modals';
import { Search, Filter, Grid, List, RefreshCw, Trophy } from 'lucide-react';

export const BrowseTournaments = () => {
  const { tournaments, selectedSportFilter, setSelectedSportFilter } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedFee, setSelectedFee] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [selectedRegTournament, setSelectedRegTournament] = useState(null);

  const sportsList = ['All', 'Football', 'Cricket', 'Basketball', 'Volleyball', 'Tennis', 'Badminton', 'Chess', 'Table Tennis', 'Kabaddi', 'Athletics'];

  // Apply filters
  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSportFilter === 'All' || t.sport.toLowerCase() === selectedSportFilter.toLowerCase();
    const matchesFormat = selectedFormat === 'All' || t.format === selectedFormat;
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    const matchesFee = selectedFee === 'All' || (selectedFee === 'Free' ? t.entryFee === 0 : t.entryFee > 0);
    return matchesSearch && matchesSport && matchesFormat && matchesStatus && matchesFee;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSportFilter('All');
    setSelectedFormat('All');
    setSelectedStatus('All');
    setSelectedFee('All');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-outfit">Browse Sports Tournaments</h1>
          <p className="text-xs text-slate-500">Discover and register for competitive championships across sports.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-semibold ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs font-semibold ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button onClick={resetFilters} className="btn btn-outline text-xs py-2 px-3 flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Advanced Filter Controls Bar */}
      <div className="material-card p-5 space-y-4">
        
        {/* Search and Primary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          
          <div className="form-group col-span-1 sm:col-span-2 md:col-span-1">
            <label className="form-label">Search Keywords</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tournament name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input-field pl-9 py-2"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Sport Category</label>
            <select 
              value={selectedSportFilter}
              onChange={e => setSelectedSportFilter(e.target.value)}
              className="input-field py-2"
            >
              {sportsList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tournament Format</label>
            <select 
              value={selectedFormat}
              onChange={e => setSelectedFormat(e.target.value)}
              className="input-field py-2"
            >
              <option value="All">All Formats</option>
              <option value="Knockout">Knockout</option>
              <option value="Round Robin">Round Robin</option>
              <option value="Swiss">Swiss System</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select 
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="input-field py-2"
            >
              <option value="All">All Statuses</option>
              <option value="Registration Open">Registration Open</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

        </div>

        {/* Sport Pill Filter Chips */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          {sportsList.map(sport => (
            <button
              key={sport}
              onClick={() => setSelectedSportFilter(sport)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                selectedSportFilter === sport
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
        <span>Showing {filteredTournaments.length} tournaments</span>
      </div>

      {/* Empty State */}
      {filteredTournaments.length === 0 ? (
        <div className="material-card p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-lg font-outfit">No Tournaments Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting search filters or selecting a different sport category.</p>
          </div>
          <button onClick={resetFilters} className="btn btn-primary btn-sm">
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid-tournaments' : 'space-y-4'}>
          {filteredTournaments.map(trn => (
            <TournamentCard 
              key={trn.id} 
              tournament={trn} 
              onRegisterClick={(t) => {
                if (t && t.status !== 'Completed') {
                  setSelectedRegTournament(t);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Registration Modal */}
      {selectedRegTournament && (
        <RegistrationModal 
          tournament={selectedRegTournament} 
          onClose={() => setSelectedRegTournament(null)} 
        />
      )}

    </div>
  );
};
