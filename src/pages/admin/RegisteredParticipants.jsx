import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, Download, CheckCircle, Clock } from 'lucide-react';

export const RegisteredParticipants = () => {
  const { recentParticipants, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [participants, setParticipants] = useState(recentParticipants);

  const handleExportCSV = () => {
    addToast('Exported participant list to CSV format!', 'success');
  };

  const togglePayment = (id) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, paymentStatus: p.paymentStatus === 'Paid' ? 'Pending' : 'Paid' };
      }
      return p;
    }));
    addToast('Updated participant payment status', 'info');
  };

  const filtered = participants.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.tournament.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit">Registered Participants & Payments</h1>
          <p className="text-xs text-slate-500">View athlete enrollments, fee payment receipts, and team lists.</p>
        </div>

        <button onClick={handleExportCSV} className="btn btn-outline text-xs py-2 px-3 flex items-center gap-1.5">
          <Download className="w-4 h-4" /> Export CSV Data
        </button>
      </div>

      <div className="material-card p-4 flex justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search participant name..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 py-2 text-xs"
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Athlete Name</th>
              <th>Email</th>
              <th>Enrolled Tournament</th>
              <th>Team Name</th>
              <th className="text-center">Fee ($)</th>
              <th className="text-center">Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td className="font-bold">{p.name}</td>
                <td className="text-xs text-slate-500">{p.email}</td>
                <td className="text-slate-600 dark:text-slate-300">{p.tournament}</td>
                <td><span className="badge bg-slate-100 dark:bg-slate-800 text-slate-700">{p.team}</span></td>
                <td className="text-center font-bold">${p.amount}</td>
                <td className="text-center">
                  <span className={`badge ${p.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                    {p.paymentStatus}
                  </span>
                </td>
                <td className="text-right">
                  <button 
                    onClick={() => togglePayment(p.id)}
                    className="btn btn-outline btn-sm text-[10px]"
                  >
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
