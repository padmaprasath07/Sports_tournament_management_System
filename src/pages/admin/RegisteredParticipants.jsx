import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Users, Search, Download, CheckCircle, Clock, RefreshCw, Ticket, Database } from 'lucide-react';

export const RegisteredParticipants = () => {
  const { recentParticipants, addToast, refreshDbHealth } = useApp();
  const [search, setSearch] = useState('');
  const [participants, setParticipants] = useState(recentParticipants);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Keep synced with AppContext recentParticipants
  useEffect(() => {
    setParticipants(recentParticipants);
  }, [recentParticipants]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.getRegistrations();
      if (res.success && res.data) {
        const normalized = res.data.map(r => ({
          ...r,
          name: r.participantName || r.name || 'Student Athlete',
          participantName: r.participantName || r.name || 'Student Athlete',
          tournament: r.tournamentName || r.tournament || 'Tournament Event',
          tournamentName: r.tournamentName || r.tournament || 'Tournament Event',
          team: r.team || 'Individual',
          amount: typeof r.amount === 'number' ? r.amount : (r.fee ? parseInt(String(r.fee).replace(/\D/g, '') || 0) : 0),
          paymentStatus: r.paymentStatus || 'Paid',
          date: r.date || (r.createdAt ? r.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]),
        }));
        setParticipants(normalized);
        if (refreshDbHealth) refreshDbHealth();
        addToast('Synced latest registrations from MongoDB database!', 'success');
      }
    } catch (err) {
      addToast(`Sync error: ${err.message}`, 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Athlete Name', 'Email', 'Tournament', 'Team', 'Fee', 'Payment Status', 'Ticket Code', 'Date'];
    const rows = participants.map(p => [
      p.id,
      p.participantName || p.name,
      p.email,
      p.tournamentName || p.tournament,
      p.team,
      p.amount,
      p.paymentStatus,
      p.ticketCode || 'N/A',
      p.date
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SportPulse_Registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Exported participant list to CSV format!', 'success');
  };

  const togglePayment = async (id) => {
    const target = participants.find(p => p.id === id);
    if (!target) return;
    const nextStatus = target.paymentStatus === 'Paid' ? 'Pending' : 'Paid';

    // Optimistic UI update
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, paymentStatus: nextStatus };
      }
      return p;
    }));

    addToast(`Updated participant payment status to ${nextStatus}`, 'info');

    // Async sync with MongoDB
    try {
      await api.updateRegistrationStatus(id, { paymentStatus: nextStatus });
    } catch (err) {
      console.warn('[DB Sync Note]', err.message);
    }
  };

  const filtered = participants.filter(p => {
    const nameStr = (p.participantName || p.name || '').toLowerCase();
    const trnStr = (p.tournamentName || p.tournament || '').toLowerCase();
    const emailStr = (p.email || '').toLowerCase();
    const ticketStr = (p.ticketCode || '').toLowerCase();
    const q = search.toLowerCase();
    return nameStr.includes(q) || trnStr.includes(q) || emailStr.includes(q) || ticketStr.includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-outfit">Registered Participants & Payments</h1>
            <span className="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono">
              <Database className="w-3 h-3 inline mr-1" />
              Live DB
            </span>
          </div>
          <p className="text-xs text-slate-500">View athlete enrollments, fee payment receipts, and team lists from MongoDB.</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="btn btn-outline text-xs py-2 px-3 flex items-center gap-1.5"
            title="Refresh from MongoDB"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={handleExportCSV} className="btn btn-primary text-xs py-2 px-3 flex items-center gap-1.5">
            <Download className="w-4 h-4" /> Export CSV Data
          </button>
        </div>
      </div>

      <div className="material-card p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search participant, tournament, ticket..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 py-2 text-xs w-full rounded-xl"
          />
        </div>
        <div className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-800 dark:text-slate-200">{filtered.length}</span> registered participant{filtered.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="table-container material-card overflow-hidden">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th>Athlete Name</th>
              <th>Email & Contact</th>
              <th>Enrolled Tournament</th>
              <th>Team Name</th>
              <th className="text-center">Ticket Code</th>
              <th className="text-center">Fee ($)</th>
              <th className="text-center">Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-slate-400 text-xs">
                  No registered participants found matching your query.
                </td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr key={p.id}>
                  <td className="font-bold text-slate-900 dark:text-slate-100">
                    {p.participantName || p.name}
                  </td>
                  <td className="text-xs text-slate-500">
                    <div>{p.email}</div>
                    {p.phone && <div className="text-[10px] text-slate-400">{p.phone}</div>}
                  </td>
                  <td className="text-slate-600 dark:text-slate-300 font-medium">
                    {p.tournamentName || p.tournament}
                  </td>
                  <td>
                    <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {p.team || 'Individual'}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
                      {p.ticketCode || 'SP-SPT-1001'}
                    </span>
                  </td>
                  <td className="text-center font-bold text-slate-900 dark:text-slate-100">
                    ${p.amount}
                  </td>
                  <td className="text-center">
                    <span className={`badge ${p.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td className="text-right">
                    <button 
                      onClick={() => togglePayment(p.id)}
                      className="btn btn-outline btn-sm text-[10px] py-1 px-2.5 rounded-lg cursor-pointer"
                    >
                      Toggle Paid
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
