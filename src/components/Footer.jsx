import React, { useState } from 'react';
import { Mail, Globe, Share2, ShieldCheck, Heart, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SportPulseLogo } from './SportPulseLogo';

export const Footer = () => {
  const { setCurrentView, setSelectedSportFilter, addToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast('Please enter a valid email address.', 'warning');
      return;
    }
    addToast(`Subscribed! Live tournament digests will be sent to ${newsletterEmail}`, 'success');
    setNewsletterEmail('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin);
    addToast('SportPulse tournament portal link copied to clipboard!', 'info');
  };

  return (
    <footer className="mt-16 border-t border-border bg-card transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="cursor-pointer" onClick={() => setCurrentView('home')}>
              <SportPulseLogo size="md" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Enterprise-grade Sports Tournament Management System designed for colleges, academies, and federations to organize, track live brackets, and stream live match scores.
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <button 
                onClick={handleShare} 
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-500 transition-colors cursor-pointer"
                title="Share Platform Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentView('about')} 
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-500 transition-colors cursor-pointer"
                title="System Architecture"
              >
                <Globe className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 font-urbanist">Platform Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setCurrentView('home')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Home Page</button></li>
              <li><button onClick={() => setCurrentView('browse-tournaments')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Browse All Tournaments</button></li>
              <li><button onClick={() => setCurrentView('match-schedule')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Match Schedule & Fixtures</button></li>
              <li><button onClick={() => setCurrentView('leaderboard')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Player Leaderboard</button></li>
              <li><button onClick={() => setCurrentView('about')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">About Platform</button></li>
              <li><button onClick={() => setCurrentView('contact')} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Contact & FAQs</button></li>
            </ul>
          </div>

          {/* Column 3: Sports Categories */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 font-urbanist">Sports Categories</h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['Cricket', 'Football', 'Basketball', 'Volleyball', 'Tennis', 'Badminton', 'Chess', 'Table Tennis', 'Kabaddi', 'Athletics'].map(s => (
                <button 
                  key={s} 
                  onClick={() => {
                    setSelectedSportFilter(s);
                    setCurrentView('browse-tournaments');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-urbanist">Tournament Alerts</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Subscribe for championship registrations and live scoreboard digests.</p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input 
                type="email" 
                required
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder="athlete@campus.edu" 
                className="input-field py-1.5 text-xs rounded-xl flex-1"
              />
              <button type="submit" className="btn btn-primary text-xs px-3 py-1.5 rounded-xl cursor-pointer flex-shrink-0">
                Join
              </button>
            </form>
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
