import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SPORTS_CATEGORIES } from '../data/mockData';
import { TournamentCard } from '../components/TournamentCard';
import { RegistrationModal } from '../components/Modals';
import { 
  Trophy, 
  Search, 
  Calendar, 
  Users, 
  Award, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Flame,
  ShieldCheck,
  Activity,
  Crown,
  Medal
} from 'lucide-react';

export const Home = () => {
  const { tournaments, setCurrentView, setSelectedSportFilter, setRole, setSearchQuery } = useApp();
  const [selectedRegTournament, setSelectedRegTournament] = useState(null);
  const [homeSearch, setHomeSearch] = useState('');

  const featuredTournaments = tournaments.filter(t => t.featured);
  const upcomingTournaments = tournaments.slice(0, 4);

  const handleHeroSearch = (e) => {
    if (e) e.preventDefault();
    if (homeSearch.trim()) {
      setSearchQuery(homeSearch.trim());
    }
    setCurrentView('browse-tournaments');
  };

  const handleCategoryClick = (sportName) => {
    setSelectedSportFilter(sportName);
    setCurrentView('browse-tournaments');
  };

  return (
    <div className="space-y-16 animate-fade-in">
      
      {/* HERO BANNER SECTION */}
      <section className="relative rounded-3xl overflow-hidden gradient-hero text-white p-8 md:p-14 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Next-Gen Sports Tournament Ecosystem</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-urbanist leading-tight">
            Elevate College & Professional <span className="gradient-text">Sports Tournaments</span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed font-sans">
            Register for premier leagues, track live brackets, view real-time scoreboards, and climb global athletic rankings on one seamless platform.
          </p>

          {/* Quick Hero Search Input */}
          <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Cricket, Football, Tennis, Basketball..."
                value={homeSearch}
                onChange={e => setHomeSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md"
              />
            </div>
            <button 
              type="submit"
              className="btn btn-primary btn-lg rounded-2xl"
            >
              Explore Tournaments <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Buttons */}
          <div className="pt-4 flex items-center gap-4 text-xs text-slate-400">
            <span>Instant Role Demos:</span>
            <button onClick={() => setRole('participant')} className="underline hover:text-emerald-400 font-semibold">Participant View</button>
            <span>•</span>
            <button onClick={() => setRole('admin')} className="underline hover:text-blue-400 font-semibold">Admin SaaS View</button>
          </div>
        </div>
      </section>

      {/* SPORTS CATEGORIES GRID (10 Categories) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h2 className="text-2xl font-bold font-outfit">Sports Categories</h2>
            <p className="text-xs text-slate-500">Explore active tournaments across 10 major sports disciplines.</p>
          </div>
          <button 
            onClick={() => setCurrentView('browse-tournaments')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View All Categories &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {SPORTS_CATEGORIES.map(cat => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="material-card p-4 text-center cursor-pointer group hover:border-blue-500 transition-all space-y-2"
            >
              <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm font-outfit text-slate-900 dark:text-slate-100">{cat.name}</h3>
              <span className="text-[10px] font-semibold text-slate-400 block">{cat.count} Active Events</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED TOURNAMENTS */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold font-outfit">Featured Tournaments</h2>
            <p className="text-xs text-slate-500">High-stakes championships with maximum prize pools & broadcasts.</p>
          </div>
          <button 
            onClick={() => setCurrentView('browse-tournaments')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Browse All &rarr;
          </button>
        </div>

        <div className="grid-tournaments">
          {featuredTournaments.map(trn => (
            <TournamentCard 
              key={trn.id} 
              tournament={trn} 
              onRegisterClick={(t) => setSelectedRegTournament(t)}
            />
          ))}
        </div>
      </section>

      {/* PLATFORM STATISTICS SECTION */}
      <section className="material-card p-8 bg-gradient-to-r from-blue-900 to-indigo-950 text-white border-none rounded-3xl space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Impact Numbers</span>
          <h2 className="text-3xl font-extrabold font-outfit text-white">Trusted by Top Sports Federations</h2>
          <p className="text-xs text-slate-300">Empowering thousands of athletes and event directors across state and national leagues.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold font-outfit text-blue-400">120+</h3>
            <p className="text-xs text-slate-300 font-medium">Tournaments Hosted</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold font-outfit text-emerald-400">15,000+</h3>
            <p className="text-xs text-slate-300 font-medium">Registered Athletes</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold font-outfit text-amber-400">$500K+</h3>
            <p className="text-xs text-slate-300 font-medium">Prize Money Awarded</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold font-outfit text-purple-400">4.9/5</h3>
            <p className="text-xs text-slate-300 font-medium">Organizer Satisfaction</p>
          </div>
        </div>
      </section>

      {/* UPCOMING TOURNAMENTS LIST */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold font-outfit">Upcoming Events</h2>
        <div className="grid-tournaments">
          {upcomingTournaments.map(trn => (
            <TournamentCard 
              key={trn.id} 
              tournament={trn} 
              onRegisterClick={(t) => setSelectedRegTournament(t)}
            />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold font-outfit">What Athletes & Admins Say</h2>
          <p className="text-xs text-slate-500">Real feedback from players and sports directors.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="material-card p-6 space-y-4">
            <div className="flex text-amber-400 text-xs gap-1">★★★★★</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic">
              "SportPulse made managing our college T20 cricket tournament completely effortless. Live score updates and bracket generation saved us hours of manual entry!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full gradient-primary text-white flex items-center justify-center font-bold text-xs">RK</div>
              <div>
                <p className="font-bold text-xs font-outfit">Rajesh K.</p>
                <p className="text-[10px] text-slate-400">State Sports Coordinator</p>
              </div>
            </div>
          </div>

          <div className="material-card p-6 space-y-4">
            <div className="flex text-amber-400 text-xs gap-1">★★★★★</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic">
              "As a player, being able to register online, download my entry ticket, and view live standings directly on my phone is awesome. Best sports UI ever."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">AM</div>
              <div>
                <p className="font-bold text-xs font-outfit">Alex Mercer</p>
                <p className="text-[10px] text-slate-400">Football Captain, Thunder FC</p>
              </div>
            </div>
          </div>

          <div className="material-card p-6 space-y-4">
            <div className="flex text-amber-400 text-xs gap-1">★★★★★</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic">
              "The SaaS analytics dashboard and automatic revenue reporting gives our committee complete financial transparency for all events."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">SJ</div>
              <div>
                <p className="font-bold text-xs font-outfit">Sarah Jenkins</p>
                <p className="text-[10px] text-slate-400">Event Organizer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTRATION MODAL */}
      {selectedRegTournament && (
        <RegistrationModal 
          tournament={selectedRegTournament} 
          onClose={() => setSelectedRegTournament(null)} 
        />
      )}

    </div>
  );
};
