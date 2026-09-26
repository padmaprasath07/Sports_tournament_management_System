import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-xs w-full pointer-events-none">
      {toasts.map(t => {
        const isSuccess = t.type === 'success';
        const isWarning = t.type === 'warning';
        const isInfo = t.type === 'info';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-xl border text-xs font-semibold backdrop-blur-md animate-fade-in transition-all ${
              isSuccess
                ? 'bg-emerald-900/90 text-white border-emerald-700'
                : isWarning
                ? 'bg-amber-900/90 text-white border-amber-700'
                : 'bg-slate-900/90 text-white border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
              {isWarning && <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
              {isInfo && <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />}
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-md hover:bg-white/20 transition-colors ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
