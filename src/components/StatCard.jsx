import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colorMap = {
    blue: 'from-blue-500 to-indigo-600 text-blue-600 bg-blue-50 dark:bg-blue-950/50',
    emerald: 'from-emerald-500 to-teal-600 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50',
    purple: 'from-purple-500 to-indigo-600 text-purple-600 bg-purple-50 dark:bg-purple-950/50',
    amber: 'from-amber-500 to-orange-600 text-amber-600 bg-amber-50 dark:bg-amber-950/50',
    rose: 'from-rose-500 to-pink-600 text-rose-600 bg-rose-50 dark:bg-rose-950/50'
  };

  return (
    <div className="material-card p-5 flex items-center justify-between hover:-translate-y-1 animate-float-in">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-outfit">
          {title}
        </span>
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-outfit">
          {value}
        </h3>
        
        {trendValue && (
          <div className="flex items-center gap-1 text-[11px] font-bold">
            {trend === 'up' ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +{trendValue}
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" /> -{trendValue}
              </span>
            )}
            <span className="text-slate-400 font-normal">vs last month</span>
          </div>
        )}
      </div>

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorMap[color] || colorMap.blue}`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
    </div>
  );
};
