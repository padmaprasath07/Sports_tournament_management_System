import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const RevenueTrendChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        fill: true,
        label: 'Revenue (₹)',
        data: [18000, 24000, 31000, 28000, 42000, 56000, 68000, 75500],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        tension: 0.4
      },
      {
        fill: true,
        label: 'Registrations',
        data: [120, 160, 210, 190, 310, 420, 490, 560],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(226, 232, 240, 0.5)' } }
    }
  };

  return (
    <div className="h-64 w-full">
      <Line data={data} options={options} />
    </div>
  );
};

export const SportsPopularityChart = () => {
  const data = {
    labels: ['Cricket', 'Football', 'Basketball', 'Badminton', 'Tennis', 'Others'],
    datasets: [
      {
        data: [35, 28, 15, 12, 6, 4],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#8b5cf6',
          '#ec4899',
          '#64748b'
        ],
        borderWidth: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' }
    }
  };

  return (
    <div className="h-64 w-full flex items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export const PerformanceBarChart = () => {
  const data = {
    labels: ['NPL T20', 'Champions Football', '3x3 Basketball', 'Badminton Singles', 'Open Chess'],
    datasets: [
      {
        label: 'Occupancy Rate (%)',
        data: [85, 100, 72, 100, 65],
        backgroundColor: '#2563eb',
        borderRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { max: 100 }
    }
  };

  return (
    <div className="h-64 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};
