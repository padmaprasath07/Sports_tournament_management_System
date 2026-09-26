import React from 'react';
import { useApp } from '../../context/AppContext';
import { RevenueTrendChart, SportsPopularityChart, PerformanceBarChart } from '../../components/ChartsContainer';
import { BarChart3, Download, FileText, Calendar, Filter } from 'lucide-react';

export const ReportsAnalytics = () => {
  const { addToast } = useApp();

  const handleExportPDF = () => {
    addToast('Exporting comprehensive analytics report as PDF...', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-outfit">Reports & System Analytics</h1>
          <p className="text-xs text-slate-500">In-depth financial revenue metrics, registration trends, and sports popularity.</p>
        </div>

        <button onClick={handleExportPDF} className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
          <Download className="w-4 h-4" /> Download PDF Report
        </button>
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
