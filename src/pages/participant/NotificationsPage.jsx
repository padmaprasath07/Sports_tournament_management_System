import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, AlertTriangle, Info, Trash2, Check, UserCheck, ShieldCheck, Globe } from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, setNotifications, markNotificationRead, deleteNotification, userProfile, role, addToast } = useApp();

  const markAllRead = () => {
    notifications.forEach(n => {
      if (n.unread && markNotificationRead) {
        markNotificationRead(n.id);
      }
    });
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    addToast('All notifications marked as read', 'info');
  };

  const clearAll = () => {
    setNotifications([]);
    addToast('Notification view cleared', 'warning');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      
      {/* Account Context Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-blue-500/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            {role === 'admin' ? (
              <ShieldCheck className="w-5 h-5" />
            ) : role === 'participant' ? (
              <UserCheck className="w-5 h-5" />
            ) : (
              <Globe className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm font-outfit text-slate-900 dark:text-white">
                {role === 'admin' ? 'Administrator Notifications' : role === 'participant' ? `${userProfile.name}'s Inbox` : 'Public Announcements'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                {role}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {userProfile.email ? `Filtered specifically for ${userProfile.email}` : 'Showing open campus tournament bulletins'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
            {notifications.filter(n => n.unread).length} Unread
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-outfit">Notifications Center</h1>
          <p className="text-xs text-slate-500">System alerts, registration approvals, and live match updates.</p>
        </div>

        <div className="flex gap-2">
          {notifications.length > 0 && (
            <>
              <button onClick={markAllRead} className="btn btn-outline text-xs py-1.5 px-3 cursor-pointer">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark All Read
              </button>
              <button onClick={clearAll} className="btn btn-ghost text-xs text-red-600 py-1.5 px-3 cursor-pointer">
                <Trash2 className="w-3.5 h-3.5" /> Clear View
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="material-card p-10 text-center text-xs text-slate-500 space-y-2">
            <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">No notifications in your inbox</p>
            <p className="text-slate-400">When you register for tournaments or match scores update, alerts will appear here.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id} 
              className={`material-card p-4 flex items-start gap-3.5 transition-all ${
                n.unread ? 'border-l-4 border-l-blue-600 bg-blue-50/20 dark:bg-blue-950/20' : ''
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm ${
                n.type === 'success' 
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' 
                  : n.type === 'warning'
                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                  : 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
              }`}>
                <Bell className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 space-y-1 text-xs">
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{n.title}</h4>
                    {n.unread && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{n.message}</p>
              </div>

              {/* Actions for individual notification */}
              <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
                {n.unread && markNotificationRead && (
                  <button 
                    onClick={() => markNotificationRead(n.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    title="Mark as read"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
                {deleteNotification && (
                  <button 
                    onClick={() => deleteNotification(n.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    title="Dismiss notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
