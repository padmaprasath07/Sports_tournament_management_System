import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, AlertTriangle, Info, Trash2 } from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, setNotifications, addToast } = useApp();

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    addToast('All notifications marked as read', 'info');
  };

  const clearAll = () => {
    setNotifications([]);
    addToast('Notification history cleared', 'warning');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-outfit">Notifications Center</h1>
          <p className="text-xs text-slate-500">System alerts, registration approvals, and live match updates.</p>
        </div>

        <div className="flex gap-2">
          <button onClick={markAllRead} className="btn btn-outline text-xs py-1.5 px-3">
            <CheckCircle2 className="w-3.5 h-3.5" /> Mark All Read
          </button>
          <button onClick={clearAll} className="btn btn-ghost text-xs text-red-600 py-1.5 px-3">
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="material-card p-8 text-center text-xs text-slate-500">
            No notifications available.
          </div>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id} 
              className={`material-card p-4 flex items-start gap-4 transition-all ${
                n.unread ? 'border-l-4 border-l-blue-600 bg-blue-50/20 dark:bg-blue-950/20' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>

              <div className="flex-1 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
