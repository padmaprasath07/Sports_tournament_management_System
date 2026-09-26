import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_TOURNAMENTS, 
  MOCK_NOTIFICATIONS, 
  MOCK_PARTICIPANT_PROFILE,
  MOCK_ADMIN_STATS,
  MOCK_RECENT_PARTICIPANTS,
  MOCK_FIXTURES
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [role, setRoleState] = useState('guest'); // 'guest' | 'participant' | 'admin'
  const [theme, setTheme] = useState('light');
  const [currentView, setCurrentView] = useState('home');
  const [tournaments, setTournaments] = useState(INITIAL_TOURNAMENTS);
  const [selectedTournamentId, setSelectedTournamentId] = useState('trn-101');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [userProfile, setUserProfile] = useState(MOCK_PARTICIPANT_PROFILE);
  const [adminStats, setAdminStats] = useState(MOCK_ADMIN_STATS);
  const [recentParticipants, setRecentParticipants] = useState(MOCK_RECENT_PARTICIPANTS);
  const [fixtures, setFixtures] = useState(MOCK_FIXTURES);
  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSportFilter, setSelectedSportFilter] = useState('All');

  // Toggle Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Switch User Role with auto navigation
  const setRole = (newRole) => {
    setRoleState(newRole);
    if (newRole === 'guest') {
      setCurrentView('home');
      addToast('Switched to Guest / Public View', 'info');
    } else if (newRole === 'participant') {
      setCurrentView('participant-dashboard');
      addToast('Switched to Participant Dashboard', 'success');
    } else if (newRole === 'admin') {
      setCurrentView('admin-dashboard');
      addToast('Switched to Admin Portal', 'success');
    }
  };

  // Toast Notification System
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Create Tournament Handler
  const createTournament = (newTrnData) => {
    const newTrn = {
      id: `trn-${Date.now().toString().slice(-4)}`,
      ...newTrnData,
      status: 'Registration Open',
      registeredCount: 0,
      bannerImage: newTrnData.bannerImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80',
      rules: newTrnData.rules ? newTrnData.rules.split('\n') : ['Standard rules apply.']
    };
    setTournaments(prev => [newTrn, ...prev]);
    setAdminStats(prev => ({
      ...prev,
      totalTournaments: prev.totalTournaments + 1
    }));
    addToast(`Tournament "${newTrn.name}" created successfully!`, 'success');
    setCurrentView('manage-tournaments');
  };

  // Delete Tournament Handler
  const deleteTournament = (id) => {
    setTournaments(prev => prev.filter(t => t.id !== id));
    setAdminStats(prev => ({
      ...prev,
      totalTournaments: Math.max(0, prev.totalTournaments - 1)
    }));
    addToast('Tournament deleted', 'warning');
  };

  // Toggle Publish / Status
  const togglePublishTournament = (id) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Draft' ? 'Registration Open' : 'Draft';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
    addToast('Tournament status updated', 'info');
  };

  const updateTournamentStatus = (id, status) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status };
      }
      return t;
    }));
    addToast(`Tournament status changed to ${status}`, 'info');
  };

  // Participant Register for Tournament
  const registerForTournament = (trnId, regForm) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === trnId) {
        return { ...t, registeredCount: Math.min(t.maxParticipants, t.registeredCount + 1) };
      }
      return t;
    }));

    const trn = tournaments.find(t => t.id === trnId);
    const newReg = {
      id: `reg-${Date.now().toString().slice(-4)}`,
      tournamentName: trn ? trn.name : 'Registered Event',
      sport: trn ? trn.sport : 'Sports',
      date: trn ? trn.startDate : '2026-08-30',
      fee: `$${trn ? trn.entryFee : 0}`,
      status: 'Approved',
      ticketCode: `SP-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setUserProfile(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        registeredTournaments: prev.stats.registeredTournaments + 1
      },
      registrations: [newReg, ...prev.registrations]
    }));

    addToast(`Successfully registered for ${trn ? trn.name : 'tournament'}!`, 'success');
  };

  // Update Live Match Score
  const updateMatchScore = (trnId, stage, matchId, score1, score2, winnerName) => {
    setFixtures(prev => {
      const trnFixtures = prev[trnId] || {};
      const stageMatches = trnFixtures[stage] || [];
      const updatedMatches = stageMatches.map(m => {
        if (m.id === matchId) {
          return {
            ...m,
            score1: parseInt(score1),
            score2: parseInt(score2),
            winner: winnerName || (score1 > score2 ? m.team1 : m.team2),
            status: 'Completed'
          };
        }
        return m;
      });
      return {
        ...prev,
        [trnId]: {
          ...trnFixtures,
          [stage]: updatedMatches
        }
      };
    });
    addToast('Match scorecard updated successfully!', 'success');
  };

  const selectedTournament = tournaments.find(t => t.id === selectedTournamentId) || tournaments[0];

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        theme,
        toggleTheme,
        currentView,
        setCurrentView,
        tournaments,
        selectedTournament,
        setSelectedTournamentId,
        createTournament,
        deleteTournament,
        togglePublishTournament,
        updateTournamentStatus,
        registerForTournament,
        updateMatchScore,
        notifications,
        setNotifications,
        userProfile,
        adminStats,
        recentParticipants,
        fixtures,
        toasts,
        addToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        selectedSportFilter,
        setSelectedSportFilter
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
