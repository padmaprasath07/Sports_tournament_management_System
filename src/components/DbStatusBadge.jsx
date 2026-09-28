import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, RefreshCw, X, Server, HardDrive, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DbStatusBadge = () => {
  const { dbStatus, refreshDbHealth, reseedDatabase } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isReseeding, setIsReseeding] = useState(false);

  const isConnected = dbStatus?.connected;
  const isCloud = dbStatus?.isAtlasCloud;

  const handleReseed = async () => {
    setIsReseeding(true);
    await reseedDatabase();
    setIsReseeding(false);
  };

  return (
    <>
      {/* Clickable Pill Badge */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-200 shadow-sm cursor-pointer ${
          isConnected
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
        }`}
        title="Click to view Database Connection Diagnostics"
      >
        <span className="relative flex h-2 w-2">
          {isConnected && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isConnected ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          ></span>
        </span>
        <Database className="w-3.5 h-3.5" />
        <span className="hidden sm:inline font-mono">
          {isConnected ? (isCloud ? 'MongoDB Atlas' : 'MongoDB Live') : 'Demo Mode'}
        </span>
      </button>

      {/* Database Diagnostic Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-surface border border-theme rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-main">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-theme">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${isConnected ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'}`}>
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Database Diagnostics</h3>
                  <p className="text-xs text-muted">SportPulse Full-Stack MERN Architecture</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-main hover:bg-surface-elevated transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Diagnostic Metrics */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-theme">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Server className="w-4 h-4 text-primary" />
                  <span>Connection State</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  {isConnected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-500 font-mono">Connected & Active</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span className="text-amber-500 font-mono">Fallback Mode</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-theme">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <HardDrive className="w-4 h-4 text-primary" />
                  <span>Database Engine</span>
                </div>
                <span className="text-xs font-mono font-medium">
                  {dbStatus?.engine || 'MongoDB v8.2 + Mongoose'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-theme">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Cluster / Host</span>
                </div>
                <span className="text-xs font-mono font-medium truncate max-w-[200px]">
                  {dbStatus?.host || 'localhost:27017'}
                </span>
              </div>

              {/* Collections Status */}
              <div className="p-3 rounded-xl bg-surface-elevated border border-theme">
                <span className="text-xs font-semibold text-muted block mb-2">Live MongoDB Collections:</span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-surface border border-theme">
                    <div className="text-base font-bold font-mono text-primary">
                      {dbStatus?.counts?.tournaments ?? 5}
                    </div>
                    <div className="text-[10px] text-muted uppercase">Tournaments</div>
                  </div>
                  <div className="p-2 rounded-lg bg-surface border border-theme">
                    <div className="text-base font-bold font-mono text-primary">
                      {dbStatus?.counts?.fixtures ?? 1}
                    </div>
                    <div className="text-[10px] text-muted uppercase">Brackets</div>
                  </div>
                  <div className="p-2 rounded-lg bg-surface border border-theme">
                    <div className="text-base font-bold font-mono text-primary">
                      {dbStatus?.counts?.registrations ?? 4}
                    </div>
                    <div className="text-[10px] text-muted uppercase">Entries</div>
                  </div>
                  <div className="p-2 rounded-lg bg-surface border border-theme">
                    <div className="text-base font-bold font-mono text-emerald-500">
                      {dbStatus?.counts?.users ?? 1}
                    </div>
                    <div className="text-[10px] text-muted uppercase">Users</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-2">
              <button
                onClick={refreshDbHealth}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border border-theme hover:bg-surface-elevated transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Check
              </button>
              {isConnected && (
                <button
                  onClick={handleReseed}
                  disabled={isReseeding}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-xl bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isReseeding ? 'animate-spin' : ''}`} />
                  {isReseeding ? 'Reseeding...' : 'Reseed Data'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
