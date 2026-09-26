import React from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket, Calendar, CheckCircle2, Download, QrCode, ArrowRight } from 'lucide-react';

export const MyRegistrations = () => {
  const { userProfile, setCurrentView, addToast } = useApp();

  const handleDownloadTicket = (ticketCode) => {
    addToast(`Downloaded official sports pass PDF: ${ticketCode}`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-outfit">My Tournament Registrations</h1>
          <p className="text-xs text-slate-500">Access your digital entry passes, payment receipts, and team statuses.</p>
        </div>
        <button 
          onClick={() => setCurrentView('browse-tournaments')}
          className="btn btn-primary text-xs py-2 px-3"
        >
          + Register New Event
        </button>
      </div>

      <div className="space-y-4">
        {userProfile.registrations.map(reg => (
          <div key={reg.id} className="material-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="badge badge-primary text-[9px]">{reg.sport}</span>
                <span className="badge badge-success text-[9px]">{reg.status}</span>
              </div>
              <h3 className="font-bold text-base font-outfit text-slate-900 dark:text-slate-100">{reg.tournamentName}</h3>
              
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-500" /> Start Date: {reg.date}</span>
                <span>Fee Paid: <strong className="text-slate-900 dark:text-slate-100">{reg.fee}</strong></span>
              </div>
            </div>

            {/* Ticket Code Card */}
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 flex items-center gap-4 text-xs flex-shrink-0 w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 shadow-sm">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Entry Ticket Code</span>
                <span className="font-mono text-sm font-extrabold text-blue-600 dark:text-blue-400">{reg.ticketCode}</span>
              </div>
              <button 
                onClick={() => handleDownloadTicket(reg.ticketCode)}
                className="btn btn-outline btn-sm ml-auto text-xs"
                title="Download Pass"
              >
                <Download className="w-3.5 h-3.5" /> PDF Pass
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
