import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket, Calendar, CheckCircle2, Download, QrCode, ArrowRight, Printer, X, ShieldCheck, MapPin, User, Activity } from 'lucide-react';
import { SportPulseLogo } from '../../components/SportPulseLogo';

export const MyRegistrations = () => {
  const { userProfile, setCurrentView, addToast } = useApp();
  const [selectedPass, setSelectedPass] = useState(null);

  const handlePrintPass = () => {
    window.print();
  };

  const handleDownloadPassFile = (reg) => {
    const passData = `SPORTPULSE OFFICIAL TOURNAMENT ENTRY PASS
-----------------------------------------------
TICKET CODE    : ${reg.ticketCode}
TOURNAMENT     : ${reg.tournamentName}
SPORT          : ${reg.sport}
ATHLETE NAME   : ${reg.participantName || userProfile.name}
EMAIL          : ${reg.email || userProfile.email}
TEAM           : ${reg.team || 'Individual'}
ENTRY DATE     : ${reg.date}
PAYMENT STATUS : ${reg.paymentStatus || 'Paid'} (${reg.fee})
VERIFICATION   : SECURE MONGO-HASH-${reg.id.toUpperCase()}
-----------------------------------------------
Present this pass or digital QR at the arena gate.`;

    const blob = new Blob([passData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SportPulse_Pass_${reg.ticketCode}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addToast(`Downloaded official digital sports pass: ${reg.ticketCode}`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-black font-urbanist tracking-tight">My Tournament Registrations</h1>
          <p className="text-xs text-slate-500">Access your digital entry passes, payment receipts, and team statuses.</p>
        </div>
        <button 
          onClick={() => setCurrentView('browse-tournaments')}
          className="btn btn-primary text-xs py-2 px-3 cursor-pointer"
        >
          + Register New Event
        </button>
      </div>

      <div className="space-y-4">
        {(!userProfile.registrations || userProfile.registrations.length === 0) ? (
          <div className="material-card p-12 text-center space-y-3">
            <Ticket className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">No Tournament Registrations Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't registered for any tournaments under this account. Explore open campus championships and claim your match ticket!
            </p>
            <button 
              onClick={() => setCurrentView('browse-tournaments')}
              className="btn btn-primary text-xs py-2 px-4 mt-2 cursor-pointer"
            >
              Browse Open Tournaments
            </button>
          </div>
        ) : (
          userProfile.registrations.map(reg => (
            <div key={reg.id} className="material-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="badge badge-primary text-[9px] font-bold">{reg.sport}</span>
                  <span className="badge badge-success text-[9px] font-bold">{reg.status}</span>
                </div>
                <h3 className="font-bold text-base font-urbanist text-slate-900 dark:text-slate-100">{reg.tournamentName}</h3>
                
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-500" /> Start Date: {reg.date}</span>
                  <span>Fee Paid: <strong className="text-slate-900 dark:text-slate-100">{reg.fee}</strong></span>
                </div>
              </div>

              {/* Ticket Code Card */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 flex items-center gap-4 text-xs flex-shrink-0 w-full md:w-auto">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 shadow-sm">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Entry Ticket Code</span>
                  <span className="font-mono text-sm font-extrabold text-blue-600 dark:text-blue-400">{reg.ticketCode}</span>
                </div>
                <button 
                  onClick={() => setSelectedPass(reg)}
                  className="btn btn-primary btn-sm ml-auto text-xs cursor-pointer flex items-center gap-1"
                  title="View & Download Official Pass"
                >
                  <Ticket className="w-3.5 h-3.5" /> View Pass
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Official Interactive Digital Entry Pass Modal */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#11192e] rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-up">
            
            {/* Ticket Header Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 p-5 text-white flex items-center justify-between">
              <SportPulseLogo size="sm" variant="white" />
              <button 
                onClick={() => setSelectedPass(null)} 
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pass Body Card */}
            <div className="p-6 space-y-5 text-xs">
              <div className="text-center space-y-1">
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px] uppercase tracking-wider">
                  Verified Official Entry Pass
                </span>
                <h3 className="font-black text-xl font-urbanist text-slate-900 dark:text-white pt-2">
                  {selectedPass.tournamentName}
                </h3>
                <p className="text-slate-500 font-medium">{selectedPass.sport} Championship</p>
              </div>

              {/* Athlete & Match Details Grid */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Athlete Name</span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs">{selectedPass.participantName || userProfile.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Team</span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs">{selectedPass.team || 'Individual Competitor'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Entry Fee Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">✓ {selectedPass.paymentStatus || 'Paid'} ({selectedPass.fee})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Event Start Date</span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs">{selectedPass.date}</span>
                </div>
              </div>

              {/* Barcode & QR Stamp */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-50/50 to-indigo-50/50 dark:from-slate-800 dark:to-slate-850 border-2 border-dashed border-blue-200 dark:border-blue-800 text-center space-y-2">
                <div className="flex justify-center items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <QrCode className="w-12 h-12 text-slate-900" />
                  </div>
                  <div className="text-left font-mono">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">PASS VALIDATION CODE</span>
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">{selectedPass.ticketCode}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">SCAN AT CAMPUS ARENA GATE</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handlePrintPass}
                  className="flex-1 btn btn-outline py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-blue-600" /> Print / Save PDF
                </button>
                <button 
                  onClick={() => handleDownloadPassFile(selectedPass)}
                  className="flex-1 btn btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Pass
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
