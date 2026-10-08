import React from 'react';
import { Database } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DbStatusBadge = () => {
  const { dbStatus } = useApp();

  const isConnected = dbStatus?.connected;
  const isCloud = dbStatus?.isAtlasCloud;

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm select-none pointer-events-none cursor-default ${
        isConnected
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
      }`}
      title="Live MongoDB Atlas Cloud Connectivity"
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
        {isConnected ? (isCloud !== false ? 'MongoDB Atlas' : 'MongoDB Live') : 'Connecting...'}
      </span>
    </div>
  );
};
