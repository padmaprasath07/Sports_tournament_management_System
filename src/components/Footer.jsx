import React from 'react';
import { Trophy, Mail, Globe, Share2, ShieldCheck, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="mt-16 border-t border-border bg-card transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl font-outfit gradient-text">SportPulse</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Enterprise-grade Sports Tournament Management System designed for colleges, clubs, and sports federations to organize, track, and stream events seamlessly.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><Globe className="w-4 h-4" /></a>
              <a href="#" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><Share2 className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 font-outfit">Platform Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('home')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Home Page</button></li>
              <li><button onClick={() => setCurrentView('browse-tournaments')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Browse All Tournaments</button></li>
              <li><button onClick={() => setCurrentView('match-schedule')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Match Schedule & Fixtures</button></li>
              <li><button onClick={() => setCurrentView('leaderboard')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Player Leaderboard</button></li>
              <li><button onClick={() => setCurrentView('about')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">About Platform</button></li>
              <li><button onClick={() => setCurrentView('contact')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Contact & FAQs</button></li>
            </ul>
          </div>

          {/* Column 3: Sports Categories */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 font-outfit">Sports Categories</h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['Cricket', 'Football', 'Basketball', 'Volleyball', 'Tennis', 'Badminton', 'Chess', 'Table Tennis', 'Kabaddi', 'Athletics'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setCurrentView('browse-tournaments')}
                  className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-outfit">Stay Updated</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Subscribe for upcoming tournament alerts and live result digests.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="input-field py-1.5 text-xs rounded-xl"
              />
              <button className="btn btn-primary text-xs px-3 py-1.5 rounded-xl">
                Join
              </button>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© 2026 SportPulse System. Designed for Web Technology Project.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>using React & Material Design Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
