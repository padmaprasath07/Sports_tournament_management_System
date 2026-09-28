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

export const GUEST_PROFILE = {
  name: 'Guest Explorer',
  email: '',
  role: 'Guest',
  phone: '',
  location: '',
  preferredSports: [],
  bio: 'Exploring campus tournaments and live scoreboards.',
  stats: { registeredTournaments: 0, upcomingMatches: 0, wins: 0, certificates: 0 },
  registrations: []
};

export const ADMIN_PROFILE = {
  name: 'Admin Director',
  email: 'admin@sportpulse.com',
  role: 'admin',
  phone: '+91 80 2345 6789',
  location: 'Athletic Department HQ',
  preferredSports: ['Football', 'Cricket', 'Basketball', 'Badminton'],
  bio: 'Campus Sports Administrator & Tournament Organizer.',
  stats: {
    registeredTournaments: 5,
    upcomingMatches: 14,
    wins: 0,
    certificates: 0
  },
  registrations: []
};

export const PUBLIC_ANNOUNCEMENTS = [
  { id: 'pub-1', userEmail: 'all', role: 'all', title: 'Schedule Update', message: 'Champions Football Cup semi-final match time updated to 6:00 PM.', time: '2 hours ago', unread: true, type: 'warning' },
  { id: 'pub-2', userEmail: 'all', role: 'all', title: 'Live Match Alert', message: 'Thunder FC vs Blue Panthers Final match is now LIVE!', time: '1 day ago', unread: false, type: 'info' }
];

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [role, setRoleState] = useState('guest'); // 'guest' | 'participant' | 'admin'
  const [theme, setTheme] = useState('light');
  const [currentView, setCurrentView] = useState('home');
  const [tournaments, setTournaments] = useState(INITIAL_TOURNAMENTS);
  const [selectedTournamentId, setSelectedTournamentId] = useState('trn-101');
  const [notifications, setNotifications] = useState(PUBLIC_ANNOUNCEMENTS);
  const [userProfile, setUserProfile] = useState(GUEST_PROFILE);
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
    counts: { tournaments: 5, fixtures: 1, registrations: 4, users: 1 }
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

  // Load individual user-specific notifications and registrations
  const loadUserSpecificData = useCallback(async (email, targetRole) => {
    try {
      const activeRole = targetRole || 'guest';
      const cleanEmail = email ? email.toLowerCase().trim() : '';

      // 1. Fetch targeted notifications for this specific account
      const notifRes = await api.getNotifications({
        email: cleanEmail,
        role: activeRole,
      });
      if (notifRes?.data) {
        setNotifications(notifRes.data);
      }

      // 2. Fetch individual registrations for participant
      if (activeRole === 'participant' && cleanEmail) {
        const regRes = await api.getRegistrations({ email: cleanEmail });
        if (regRes?.data) {
          const userRegs = regRes.data.map(r => ({
            ...r,
            name: r.participantName || r.name || 'Student Athlete',
            participantName: r.participantName || r.name || 'Student Athlete',
            tournament: r.tournamentName || r.tournament || 'Tournament Event',
            tournamentName: r.tournamentName || r.tournament || 'Tournament Event',
            team: r.team || 'Individual',
            amount: typeof r.amount === 'number' ? r.amount : (r.fee ? parseInt(String(r.fee).replace(/\D/g, '') || 0) : 0),
            paymentStatus: r.paymentStatus || 'Paid',
            date: r.date || (r.createdAt ? r.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]),
          }));

          setUserProfile(prev => ({
            ...prev,
            registrations: userRegs,
            stats: {
              ...prev.stats,
              registeredTournaments: userRegs.length,
            },
          }));
        }
      } else if (activeRole === 'admin') {
        // Admin supervises all registrations across campus
        const regRes = await api.getRegistrations();
        if (regRes?.data) {
          const allRegs = regRes.data.map(r => ({
            ...r,
            name: r.participantName || r.name || 'Student Athlete',
            participantName: r.participantName || r.name || 'Student Athlete',
            tournament: r.tournamentName || r.tournament || 'Tournament Event',
            tournamentName: r.tournamentName || r.tournament || 'Tournament Event',
            team: r.team || 'Individual',
            amount: typeof r.amount === 'number' ? r.amount : (r.fee ? parseInt(String(r.fee).replace(/\D/g, '') || 0) : 0),
            paymentStatus: r.paymentStatus || 'Paid',
            date: r.date || (r.createdAt ? r.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]),
          }));
          setRecentParticipants(allRegs);
        }
      } else if (activeRole === 'guest') {
        // Guest has 0 registrations and only sees public announcements
        setUserProfile(GUEST_PROFILE);
      }
    } catch (err) {
      console.warn('[User Data Sync Note]', err.message);
      if (!cleanEmail) {
        setNotifications(PUBLIC_ANNOUNCEMENTS);
      }
    }
  }, []);

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

        // Parallel fetch global tournaments, fixtures, all registrations (for admin feed), and stats
        const [trnRes, fixRes, regRes, statsRes] = await Promise.allSettled([
          api.getTournaments(),
          api.getFixtures(),
          api.getRegistrations(),
          api.getAdminStats(),
        ]);

        if (trnRes.status === 'fulfilled' && trnRes.value.data?.length > 0) {
          setTournaments(trnRes.value.data);
        }
        if (fixRes.status === 'fulfilled' && fixRes.value.data) {
          setFixtures(fixRes.value.data);
        }
        if (regRes.status === 'fulfilled' && regRes.value.data?.length > 0) {
          const allRegs = regRes.value.data.map(r => ({
            ...r,
            name: r.participantName || r.name || 'Student Athlete',
            participantName: r.participantName || r.name || 'Student Athlete',
            tournament: r.tournamentName || r.tournament || 'Tournament Event',
            tournamentName: r.tournamentName || r.tournament || 'Tournament Event',
            team: r.team || 'Individual',
            amount: typeof r.amount === 'number' ? r.amount : (r.fee ? parseInt(String(r.fee).replace(/\D/g, '') || 0) : 0),
            paymentStatus: r.paymentStatus || 'Paid',
            date: r.date || (r.createdAt ? r.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]),
          }));
          setRecentParticipants(allRegs);
        }
        if (statsRes.status === 'fulfilled' && statsRes.value.data) {
          setAdminStats(statsRes.value.data);
        }

        // Determine current authenticated user session
        let activeUser = null;
        try {
          const stored = localStorage.getItem('sportpulse_user');
          if (stored) activeUser = JSON.parse(stored);
        } catch {}

        if (activeUser && activeUser.email) {
          const userRole = activeUser.role || 'participant';
          setRoleState(userRole);
          setUserProfile(prev => ({
            ...prev,
            ...activeUser,
            stats: activeUser.stats || prev.stats,
          }));
          await loadUserSpecificData(activeUser.email, userRole);
        } else {
          // Default to Guest with clean isolated public view
          setRoleState('guest');
          setUserProfile(GUEST_PROFILE);
          await loadUserSpecificData('', 'guest');
        }
      }
    } catch {
      // Backend not running or in offline demo mode - keep mockData gracefully
      setDbStatus(prev => ({ ...prev, connected: false }));
    }
  }, [loadUserSpecificData]);

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

  // Switch User Role with auto navigation and data reload
  const setRole = (newRole) => {
    setRoleState(newRole);
    if (newRole === 'guest') {
      logout();
    } else if (newRole === 'participant') {
      let activeUser = null;
      try {
        const stored = localStorage.getItem('sportpulse_user');
        if (stored) activeUser = JSON.parse(stored);
      } catch {}

      if (activeUser && activeUser.role === 'participant') {
        setUserProfile(activeUser);
        loadUserSpecificData(activeUser.email, 'participant');
      } else {
        setUserProfile(MOCK_PARTICIPANT_PROFILE);
        loadUserSpecificData('ashwin.player@sportpulse.com', 'participant');
      }
      setCurrentView('participant-dashboard');
      addToast('Switched to Athlete / Participant Portal', 'info');
    } else if (newRole === 'admin') {
      setUserProfile(ADMIN_PROFILE);
      loadUserSpecificData('admin@sportpulse.com', 'admin');
      setCurrentView('admin-dashboard');
      addToast('Switched to Tournament Admin Console', 'info');
    }
  };

  // Continue as Guest handler for public access
  const continueAsGuest = () => {
    localStorage.removeItem('sportpulse_user');
    setRoleState('guest');
    setUserProfile(GUEST_PROFILE);
    loadUserSpecificData('', 'guest');
    setCurrentView('browse-tournaments');
    addToast('Exploring SportPulse tournaments and live brackets as Guest', 'info');
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('sportpulse_user');
    setRoleState('guest');
    setUserProfile(GUEST_PROFILE);
    loadUserSpecificData('', 'guest');
    setCurrentView('home');
    addToast('Logged out successfully. Switched to public view.', 'info');
  };

  // Register New User Account in MongoDB
  const registerUserAccount = async (accountData) => {
    try {
      const res = await api.registerUser(accountData);
      if (res.success && res.data) {
        const user = res.data;
        try {
          localStorage.setItem('sportpulse_user', JSON.stringify(user));
        } catch {}
        setUserProfile(prev => ({
          ...prev,
          ...user,
          registrations: [], // brand new user starts with 0 registrations
          stats: user.stats || { registeredTournaments: 0, upcomingMatches: 0, wins: 0, certificates: 0 },
        }));
        setRoleState(user.role);
        setCurrentView(user.role === 'admin' ? 'admin-dashboard' : 'participant-dashboard');
        setDbStatus(prev => ({
          ...prev,
          counts: { ...prev.counts, users: (prev.counts?.users || 0) + 1 }
        }));
        // Load individual notifications and registrations for this new user
        await loadUserSpecificData(user.email, user.role);
        return { success: true, data: user };
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  // Log into User Account via MongoDB
  const loginUserAccount = async (credentials) => {
    try {
      const res = await api.loginUser(credentials);
      if (res.success && res.data) {
        const user = res.data;
        try {
          localStorage.setItem('sportpulse_user', JSON.stringify(user));
        } catch {}
        setUserProfile(prev => ({
          ...prev,
          ...user,
          stats: user.stats || prev.stats,
        }));
        setRoleState(user.role);
        setCurrentView(user.role === 'admin' ? 'admin-dashboard' : 'participant-dashboard');
        // Load individual notifications and registrations for this user
        await loadUserSpecificData(user.email, user.role);
        return { success: true, data: user };
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  // Tournament Creation Handler - persists to MongoDB
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
    const trn = tournaments.find(t => t.id === trnId);
    const sportPrefix = (trn?.sport || 'SPT').substring(0, 3).toUpperCase();
    const participantName = regForm.participantName || regForm.name || userProfile.name || 'Student Athlete';
    const email = regForm.email || userProfile.email || 'athlete@campus.edu';
    const phone = regForm.phone || userProfile.phone || '';
    const team = regForm.teamName || regForm.team || 'Individual';
    const entryFee = trn ? trn.entryFee : 0;
    const fee = `$${entryFee}`;
    const amount = entryFee;
    const paymentStatus = entryFee > 0 ? (regForm.paymentMethod ? 'Paid' : 'Paid') : 'Waived';
    const sport = trn ? trn.sport : 'Sports';
    const regId = `reg-${Date.now().toString().slice(-4)}`;
    const ticketCode = `SP-${sportPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReg = {
      id: regId,
      tournamentId: trnId,
      tournamentName: trn ? trn.name : 'Registered Event',
      tournament: trn ? trn.name : 'Registered Event',
      participantName,
      name: participantName,
      email,
      phone,
      team,
      sport,
      date: trn ? trn.startDate : new Date().toISOString().split('T')[0],
      fee,
      amount,
      status: 'Approved',
      paymentStatus,
      ticketCode
    };

    // Update tournaments registeredCount
    setTournaments(prev => prev.map(t => {
      if (t.id === trnId) {
        return { ...t, registeredCount: Math.min(t.maxParticipants, t.registeredCount + 1) };
      }
      return t;
    }));

    // Prepend to recent participants for live admin view
    setRecentParticipants(prev => [newReg, ...prev]);

    // Update participant's registered events if this is the active user session
    const isCurrentAthlete = (userProfile?.email && userProfile.email.toLowerCase().trim() === email.toLowerCase().trim()) || (role === 'participant' && (!userProfile?.email || userProfile.email.includes('ashwin')));
    if (isCurrentAthlete) {
      setUserProfile(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          registeredTournaments: (prev.stats?.registeredTournaments || 0) + 1
        },
        registrations: [newReg, ...(prev.registrations || [])]
      }));
    }

    addToast(`Successfully registered for ${trn ? trn.name : 'tournament'}!`, 'success');

    // Async write to MongoDB
    try {
      await api.createRegistration(newReg);
      setDbStatus(prev => ({
        ...prev,
        counts: { ...prev.counts, registrations: (prev.counts?.registrations || 0) + 1 }
      }));
      // Immediately reload account-specific notifications and registrations
      const reloadEmail = userProfile?.email || email;
      if (reloadEmail) {
        await loadUserSpecificData(reloadEmail, role);
      }
    } catch (err) {
      console.warn('[DB Sync Note]', err.message);
    }
  };

  // Mark notification as read
  const markNotificationRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    try {
      await api.markNotificationRead(id);
    } catch (err) {
      console.warn('[Notification Read]', err.message);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await api.deleteNotification(id);
      addToast('Notification dismissed', 'info');
    } catch (err) {
      console.warn('[Notification Delete]', err.message);
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

  // Update Profile Data and persist across app and local storage
  const updateUserProfile = async (updates) => {
    setUserProfile(prev => {
      const merged = { ...prev, ...updates };
      try {
        localStorage.setItem('sportpulse_user', JSON.stringify(merged));
      } catch {}
      return merged;
    });

    addToast('Profile changes saved successfully!', 'success');

    // Async sync to MongoDB backend if user has an id or email
    try {
      if (userProfile?._id || userProfile?.id) {
        await api.updateUserProfile(userProfile._id || userProfile.id, updates);
      }
    } catch (err) {
      console.warn('[Profile Sync Note]', err.message);
    }
  };

  // Auto-generate / re-seed tournament knockout bracket
  const autoGenerateBracket = (trnId) => {
    const targetTrnId = trnId || selectedTournamentId || 'trn-102';
    const teams = [
      'Thunderbolts FC', 'Blue Panthers', 'Vipers SC', 'Phoenix Warriors',
      'Spartans United', 'Titan Strikers', 'Red Eagles', 'Apex Predators'
    ];
    const shuffled = [...teams].sort(() => Math.random() - 0.5);

    const newQuarterFinals = [
      { id: 'm1', team1: shuffled[0], score1: 0, team2: shuffled[1], score2: 0, winner: null, status: 'Upcoming', time: '10:00 AM' },
      { id: 'm2', team1: shuffled[2], score1: 0, team2: shuffled[3], score2: 0, winner: null, status: 'Upcoming', time: '12:00 PM' },
      { id: 'm3', team1: shuffled[4], score1: 0, team2: shuffled[5], score2: 0, winner: null, status: 'Upcoming', time: '02:30 PM' },
      { id: 'm4', team1: shuffled[6], score1: 0, team2: shuffled[7], score2: 0, winner: null, status: 'Upcoming', time: '04:30 PM' }
    ];

    const newSemiFinals = [
      { id: 'm5', team1: shuffled[0], score1: 0, team2: shuffled[2], score2: 0, winner: null, status: 'TBD', time: 'Tomorrow' },
      { id: 'm6', team1: shuffled[4], score1: 0, team2: shuffled[6], score2: 0, winner: null, status: 'TBD', time: 'Tomorrow' }
    ];

    const newFinal = [
      { id: 'm7', team1: shuffled[0], score1: 0, team2: shuffled[4], score2: 0, winner: null, status: 'Grand Final', time: 'Sunday 6:00 PM' }
    ];

    setFixtures(prev => ({
      ...prev,
      [targetTrnId]: {
        quarterFinals: newQuarterFinals,
        semiFinals: newSemiFinals,
        final: newFinal
      }
    }));

    addToast('Balanced tournament elimination bracket regenerated with seeded teams!', 'success');
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
        registerUserAccount,
        loginUserAccount,
        continueAsGuest,
        logout,
        updateMatchScore,
        updateUserProfile,
        autoGenerateBracket,
        notifications,
        setNotifications,
        markNotificationRead,
        deleteNotification,
        userProfile,
        setUserProfile,
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
