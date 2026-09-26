import React from 'react';
import { Trophy, ShieldCheck, Zap, Activity, Users, Award, Sparkles } from 'lucide-react';

export const About = () => {
  return (
    <div className="space-y-12 animate-fade-in py-6 max-w-5xl mx-auto">
      
      {/* Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="badge badge-primary">About SportPulse</span>
        <h1 className="text-3xl md:text-4xl font-extrabold font-outfit">
          Empowering Sports Communities Through Technology
        </h1>
        <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
          SportPulse is an all-in-one tournament management system engineered for educational institutions, sports academies, and professional league organizers.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="material-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base font-outfit">Automatic Brackets</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Instant Knockout tree diagrams and Round Robin points tables calculated dynamically upon result entry.
          </p>
        </div>

        <div className="material-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base font-outfit">Real-Time Scorekeeping</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Live score updating console with match event logging and instant spectator notifications.
          </p>
        </div>

        <div className="material-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base font-outfit">Dual Role Security</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Role-based dashboard permissions for Participants and Admin event managers with full audit tracking.
          </p>
        </div>
      </div>

      {/* Tech Spec Box */}
      <div className="material-card p-8 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl border-none space-y-4">
        <h3 className="text-xl font-bold font-outfit text-white">System Architecture & Standards</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Built following modern Web Technology guidelines and Angular Material design principles. Incorporates CSS custom properties, glassmorphic UI cards, Chart.js analytical visualizations, and accessible responsive layouts across desktop, tablet, and mobile displays.
        </p>
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="px-3 py-1 rounded-full bg-white/10 text-white font-medium">React 18</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-white font-medium">CSS Variables</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-white font-medium">Material Design Aesthetic</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-white font-medium">Chart.js Analytics</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-white font-medium">Dark Mode System</span>
        </div>
      </div>

    </div>
  );
};
