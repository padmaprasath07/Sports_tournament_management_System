import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeleteConfirmModal } from '../../components/Modals';
import { 
  Trophy, 
  Search, 
  PlusCircle, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Filter
} from 'lucide-react';

export const ManageTournaments = () => {
  const { tournaments, deleteTournament, updateTournamentStatus, setSelectedTournamentId, setCurrentView, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [sportFilter, setSportFilter] = useState('All');

  const filtered = tournaments.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.venue.toLowerCase().includes(search.toLowerCase());
    const matchesSport = sportFilter === 'All' || t.sport === sportFilter;
    return matchesSearch && matchesSport;
  });

  const deletingTournament = tournaments.find(t => t.id === deletingId);

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit">Manage All Tournaments</h1>
          <p className="text-xs text-slate-500">Edit, publish, monitor slots, or remove tournaments.</p>
        </div>

        <button 
          onClick={() => setCurrentView('create-tournament')}
          className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" /> Create New Event
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 material-card p-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tournament..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 py-2 text-xs"
          />
        </div>

        <div className="flex gap-2">
          <select 
            value={sportFilter} 
            onChange={e => setSportFilter(e.target.value)}
            className="input-field py-2 text-xs"
          >
            <option value="All">All Sports</option>
            <option value="Cricket">Cricket</option>
            <option value="Football">Football</option>
            <option value="Basketball">Basketball</option>
            <option value="Badminton">Badminton</option>
          </select>
        </div>
      </div>

      {/* Tournaments Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tournament Name</th>
              <th>Sport</th>
              <th>Format</th>
              <th className="text-center">Slots</th>
              <th className="text-center">Entry Fee (₹)</th>
              <th className="text-center">Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td className="font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-outfit text-slate-900 dark:text-slate-100">{t.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{t.venue}</span>
                    </div>
                  </div>
                </td>
                <td><span className="badge bg-slate-100 dark:bg-slate-800 text-slate-700">{t.sport}</span></td>
                <td className="text-xs text-slate-500">{t.format}</td>
                <td className="text-center font-semibold">{t.registeredCount} / {t.maxParticipants}</td>
                <td className="text-center font-bold">₹{t.entryFee}</td>
                <td className="text-center">
                  <select
                    value={t.status}
                    onChange={e => updateTournamentStatus(t.id, e.target.value)}
                    className="input-field py-2 text-xs"
                  >
                    {['Registration Open', 'Registration Close', 'Live', 'Completed'].map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button 
                      onClick={() => { setSelectedTournamentId(t.id); setCurrentView('tournament-details'); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setDeletingId(t.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <DeleteConfirmModal 
          title={deletingTournament ? deletingTournament.name : ''}
          onConfirm={() => deleteTournament(deletingId)}
          onClose={() => setDeletingId(null)}
        />
      )}

    </div>
  );
};
