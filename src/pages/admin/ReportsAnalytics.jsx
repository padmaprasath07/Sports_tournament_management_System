import React from 'react';
import { useApp } from '../../context/AppContext';
import { RevenueTrendChart, SportsPopularityChart, PerformanceBarChart } from '../../components/ChartsContainer';
import { BarChart3, Download, FileText, Calendar, Filter } from 'lucide-react';

export const ReportsAnalytics = () => {
  const { addToast, tournaments, adminStats } = useApp();

  const handlePrintPDF = () => {
    window.print();
    addToast('Opening print dialog to generate PDF analytics report...', 'info');
  };

  const handleExportCSV = () => {
    const headers = ['Tournament Name', 'Sport', 'Category', 'Format', 'Status', 'Registered Athletes', 'Max Capacity', 'Entry Fee (₹)', 'Total Revenue (₹)'];
    const rows = tournaments.map(t => [
      `"${t.name}"`,
      t.sport,
      t.category,
      t.format,
      t.status,
      t.registeredCount,
      t.maxParticipants,
      t.entryFee,
      t.registeredCount * t.entryFee
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `SportPulse_Financial_Analytics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    addToast('Downloaded financial & registration analytics CSV report!', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black font-urbanist tracking-tight">Reports & System Analytics</h1>
          <p className="text-xs text-slate-500">In-depth financial revenue metrics, registration trends, and sports popularity.</p>
        </div>

        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="btn btn-outline text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer">
            <Download className="w-4 h-4 text-emerald-500" /> Export CSV Data
          </button>
          <button onClick={handlePrintPDF} className="btn btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer">
            <FileText className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Financial & Registration Trends Chart */}
      <div className="material-card p-6 space-y-4">
        <h3 className="font-bold text-base font-outfit">Financial Revenue & Registration Growth (2026)</h3>
        <RevenueTrendChart />
      </div>

      {/* Grid for Doughnut & Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="material-card p-6 space-y-4">
          <h3 className="font-bold text-base font-outfit">Sports Discipline Share</h3>
          <SportsPopularityChart />
        </div>

        <div className="material-card p-6 space-y-4">
          <h3 className="font-bold text-base font-outfit">Tournament Slot Occupancy Rate</h3>
          <PerformanceBarChart />
        </div>

      </div>

    </div>
  );
};
