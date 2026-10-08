import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/StatCard';
import { RevenueTrendChart, SportsPopularityChart } from '../../components/ChartsContainer';
import { 
  Trophy, 
  Users, 
  DollarSign, 
  Calendar, 
  PlusCircle, 
  GitBranch, 
  FileText, 
  ArrowRight,
  TrendingUp,
  Activity
} from 'lucide-react';

export const AdminDashboard = () => {
  const { adminStats, recentParticipants, setCurrentView } = useApp();

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top SaaS Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 material-card bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white border-none rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="badge bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              Admin Portal
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-outfit text-white">
            Sports Operations Dashboard 🏆
          </h1>
          <p className="text-xs text-slate-300">
            Real-time analytics across all 10 sports disciplines, registrations, and revenue.
          </p>
        </div>

        {/* Quick Action Buttons for the 4 Core Features */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setCurrentView('create-tournament')}
            className="btn btn-accent btn-sm rounded-xl font-bold cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Create Tournament
          </button>
          <button 
            onClick={() => setCurrentView('fixture-management')}
            className="btn btn-outline btn-sm text-white border-white/20 hover:bg-white/10 rounded-xl cursor-pointer"
          >
            <Calendar className="w-4 h-4" /> Schedule Match
          </button>
          <button 
            onClick={() => setCurrentView('score-management')}
            className="btn btn-outline btn-sm text-white border-white/20 hover:bg-white/10 rounded-xl cursor-pointer"
          >
            <Trophy className="w-4 h-4" /> Score & Results
          </button>
        </div>
      </div>

      {/* KPI Analytics Cards Grid */}
      <div className="grid-stats">
        <StatCard 
          title="Total Tournaments" 
          value={adminStats.totalTournaments} 
          icon={Trophy} 
          color="blue"
          trend="up"
          trendValue="4 new"
        />
        <StatCard 
          title="Active Leagues" 
          value={adminStats.activeTournaments} 
          icon={Activity} 
          color="emerald"
        />
        <StatCard 
          title="Total Athletes" 
          value={adminStats.totalParticipants} 
          icon={Users} 
          color="purple"
          trend="up"
          trendValue="18%"
        />
        <StatCard 
          title="Revenue Generated" 
          value={`₹${(adminStats.totalRevenue || 0).toLocaleString()}`} 
          icon={DollarSign} 
          color="amber"
          trend="up"
          trendValue="Live DB"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue & Registration Trend (Area Chart) */}
        <div className="lg:col-span-2 material-card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base font-outfit">Revenue & Registration Growth</h3>
              <p className="text-xs text-slate-500">Monthly financial and registration metrics.</p>
            </div>
            <button 
              onClick={() => setCurrentView('reports-analytics')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Full Analytics &rarr;
            </button>
          </div>
          <RevenueTrendChart />
        </div>

        {/* Sports Popularity Distribution (Doughnut Chart) */}
        <div className="material-card p-6 space-y-4">
          <div>
            <h3 className="font-bold text-base font-outfit">Sports Distribution</h3>
            <p className="text-xs text-slate-500">Share of registrations by sport category.</p>
          </div>
          <SportsPopularityChart />
        </div>

      </div>

      {/* Recent Registrations Preview Table */}
      <div className="material-card p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-base font-outfit">Recent Participant Registrations</h3>
          <button 
            onClick={() => setCurrentView('registered-participants')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Manage All ({recentParticipants.length}) &rarr;
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Participant Name</th>
                <th>Tournament</th>
                <th>Team</th>
                <th>Registration Date</th>
                <th className="text-center">Fee Paid</th>
                <th className="text-center">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {recentParticipants.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-400 text-xs">
                    No participant registrations found in the database.
                  </td>
                </tr>
              ) : (
                recentParticipants.slice(0, 5).map(p => (
                  <tr key={p.id}>
                    <td className="font-bold text-slate-900 dark:text-slate-100">{p.participantName || p.name}</td>
                    <td className="text-slate-600 dark:text-slate-300">{p.tournamentName || p.tournament}</td>
                    <td><span className="badge bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{p.team || 'Individual'}</span></td>
                    <td className="text-slate-500">{p.date}</td>
                    <td className="text-center font-bold">₹{p.amount}</td>
                    <td className="text-center">
                      <span className={`badge ${p.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                        {p.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
