import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_TOURNAMENTS, 
  MOCK_NOTIFICATIONS, 
  MOCK_PARTICIPANT_PROFILE,
  MOCK_ADMIN_STATS,
  MOCK_RECENT_PARTICIPANTS,
  MOCK_FIXTURES
} from '../data/mockData';
import { api } from '../services/api';

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
  
  // Database status tracking
  const [dbStatus, setDbStatus] = useState({
    connected: false,
    engine: 'MongoDB v8.2 + Mongoose',
    host: 'localhost:27017',
    isAtlasCloud: false,
    counts: { tournaments: 5, fixtures: 1, registrations: 4 }
  });

  // Toggle Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Toast Notification System
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Check Database & Load live data from MongoDB
  const loadDatabaseData = useCallback(async () => {
    try {
      const health = await api.checkHealth();
      if (health && health.status === 'healthy') {
        setDbStatus({
          connected: true,
          engine: `${health.database.type} (Mongoose ODM)`,
          host: health.database.host,
          isAtlasCloud: health.database.isAtlasCloud,
          counts: health.database.counts,
        });

        // Parallel fetch live collections from MongoDB
        const [trnRes, fixRes, regRes, notifRes, statsRes] = await Promise.allSettled([
          api.getTournaments(),
          api.getFixtures(),
          api.getRegistrations(),
          api.getNotifications(),
          api.getAdminStats(),
        ]);

        if (trnRes.status === 'fulfilled' && trnRes.value.data?.length > 0) {
          setTournaments(trnRes.value.data);
        }
        if (fixRes.status === 'fulfilled' && fixRes.value.data) {
          setFixtures(fixRes.value.data);
        }
        if (regRes.status === 'fulfilled' && regRes.value.data?.length > 0) {
          setUserProfile(prev => ({
            ...prev,
            registrations: regRes.value.data
          }));
          setRecentParticipants(regRes.value.data.slice(0, 5));
        }
        if (notifRes.status === 'fulfilled' && notifRes.value.data?.length > 0) {
          setNotifications(notifRes.value.data);
        }
        if (statsRes.status === 'fulfilled' && statsRes.value.data) {
          setAdminStats(statsRes.value.data);
        }
      }
    } catch {
      // Backend not running or in offline demo mode - keep mockData gracefully
      setDbStatus(prev => ({ ...prev, connected: false }));
    }
  }, []);

  useEffect(() => {
    loadDatabaseData();
  }, [loadDatabaseData]);

  // Reseed Database Handler
  const reseedDatabase = async () => {
    try {
      await api.reseedDatabase(true);
      await loadDatabaseData();
      addToast('Database successfully reseeded with fresh sports records!', 'success');
    } catch (err) {
      addToast(`Reseed error: ${err.message}`, 'error');
    }
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

  // Create Tournament Handler - persists to MongoDB
  const createTournament = async (newTrnData) => {
    const id = `trn-${Date.now().toString().slice(-4)}`;
    const newTrn = {
      id,
      ...newTrnData,
      status: 'Registration Open',
      registeredCount: 0,
      bannerImage: newTrnData.bannerImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80',
      rules: newTrnData.rules ? (typeof newTrnData.rules === 'string' ? newTrnData.rules.split('\n') : newTrnData.rules) : ['Standard rules apply.']
    };

    // Optimistic UI update
    setTournaments(prev => [newTrn, ...prev]);
    setAdminStats(prev => ({
      ...prev,
      totalTournaments: prev.totalTournaments + 1
    }));
    addToast(`Tournament "${newTrn.name}" created successfully!`, 'success');
    setCurrentView('manage-tournaments');

    // Async write to MongoDB
    try {
      await api.createTournament(newTrn);
      setDbStatus(prev => ({
        ...prev,
        counts: { ...prev.counts, tournaments: (prev.counts?.tournaments || 0) + 1 }
      }));
    } catch (err) {
      console.warn('[DB Sync Note] Saved to local memory:', err.message);
    }
  };

  // Delete Tournament Handler - cascades in MongoDB
  const deleteTournament = async (id) => {
    setTournaments(prev => prev.filter(t => t.id !== id));
    setAdminStats(prev => ({
      ...prev,
      totalTournaments: Math.max(0, prev.totalTournaments - 1)
    }));
    addToast('Tournament deleted', 'warning');

    try {
      await api.deleteTournament(id);
      setDbStatus(prev => ({
        ...prev,
        counts: { ...prev.counts, tournaments: Math.max(0, (prev.counts?.tournaments || 1) - 1) }
      }));
    } catch (err) {
      console.warn('[DB Sync Note]', err.message);
    }
  };

  // Toggle Publish / Status
  const togglePublishTournament = async (id) => {
    let nextStatus = 'Registration Open';
    setTournaments(prev => prev.map(t => {
      if (t.id === id) {
        nextStatus = t.status === 'Draft' ? 'Registration Open' : 'Draft';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
    addToast('Tournament status updated', 'info');

    try {
      await api.updateTournament(id, { status: nextStatus });
    } catch (err) {
      console.warn('[DB Sync Note]', err.message);
    }
  };

  const updateTournamentStatus = async (id, status) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status };
      }
      return t;
    }));
    addToast(`Tournament status changed to ${status}`, 'info');

    try {
      await api.updateTournament(id, { status });
    } catch (err) {
      console.warn('[DB Sync Note]', err.message);
    }
  };

  // Participant Register for Tournament - creates Registration document in MongoDB
  const registerForTournament = async (trnId, regForm = {}) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === trnId) {
        return { ...t, registeredCount: Math.min(t.maxParticipants, t.registeredCount + 1) };
      }
      return t;
    }));

    const trn = tournaments.find(t => t.id === trnId);
    const sportPrefix = (trn?.sport || 'SPT').substring(0, 3).toUpperCase();
    const newReg = {
      id: `reg-${Date.now().toString().slice(-4)}`,
      tournamentId: trnId,
      tournamentName: trn ? trn.name : 'Registered Event',
      participantName: regForm.name || userProfile.name,
      email: regForm.email || userProfile.email,
      team: regForm.team || 'Individual',
      sport: trn ? trn.sport : 'Sports',
      date: trn ? trn.startDate : new Date().toISOString().split('T')[0],
      fee: `$${trn ? trn.entryFee : 0}`,
      status: 'Approved',
      ticketCode: `SP-${sportPrefix}-${Math.floor(1000 + Math.random() * 9000)}`
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

    // Async write to MongoDB
    try {
      await api.createRegistration(newReg);
      setDbStatus(prev => ({
        ...prev,
        counts: { ...prev.counts, registrations: (prev.counts?.registrations || 0) + 1 }
      }));
    } catch (err) {
      console.warn('[DB Sync Note]', err.message);
    }
  };

  // Update Live Match Score - persists to MongoDB
  const updateMatchScore = async (trnId, stage, matchId, score1, score2, winnerName) => {
    const s1 = parseInt(score1);
    const s2 = parseInt(score2);

    setFixtures(prev => {
      const trnFixtures = prev[trnId] || {};
      const stageMatches = trnFixtures[stage] || [];
      const updatedMatches = stageMatches.map(m => {
        if (m.id === matchId) {
          return {
            ...m,
            score1: s1,
            score2: s2,
            winner: winnerName || (s1 > s2 ? m.team1 : m.team2),
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

    addToast('Match scorecard updated and saved to MongoDB!', 'success');

    // Async write to MongoDB
    try {
      await api.updateMatchScore(trnId, {
        stage,
        matchId,
        score1: s1,
        score2: s2,
        winnerName
      });
    } catch (err) {
      console.warn('[DB Sync Note]', err.message);
    }
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
        setSelectedSportFilter,
        dbStatus,
        refreshDbHealth: loadDatabaseData,
        reseedDatabase
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
