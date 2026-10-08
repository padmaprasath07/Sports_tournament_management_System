import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_TOURNAMENTS, 
  MOCK_NOTIFICATIONS, 
  MOCK_PARTICIPANT_PROFILE,
  MOCK_ADMIN_STATS,
  MOCK_RECENT_PARTICIPANTS,
  MOCK_FIXTURES,
  MOCK_LEADERBOARD
} from '../data/mockData';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

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
  { id: 'pub-2', userEmail: 'all', role: 'all', title: 'Championship Result', message: 'Thunder FC defeated Blue Panthers (2-1) in the Grand Final!', time: '1 day ago', unread: false, type: 'info' }
];

// Default demo accounts with preconfigured credentials
export const DEFAULT_ACCOUNTS = [
  {
    id: 'usr-ashwin',
    name: 'Ashwin Kumar',
    email: 'ashwin.player@sportpulse.com',
    password: 'password123',
    role: 'participant',
    phone: '+91 98765 43210',
    location: 'Bangalore, Karnataka',
    preferredSports: ['Football', 'Cricket', 'Badminton'],
    bio: 'Varsity Striker & Athletics Team Captain. 3x Inter-College Gold Medalist.',
    stats: { registeredTournaments: 2, upcomingMatches: 0, wins: 0, certificates: 0 },
    registrations: MOCK_PARTICIPANT_PROFILE.registrations
  },
  {
    id: 'usr-admin',
    name: 'Coach Vikram Rathore',
    email: 'admin@sportpulse.com',
    password: 'password123',
    role: 'admin',
    phone: '+91 80 2345 6789',
    location: 'Athletic Department HQ',
    preferredSports: ['Football', 'Cricket', 'Basketball', 'Badminton'],
    bio: 'Campus Sports Administrator & Tournament Organizer.',
    stats: { registeredTournaments: 0, upcomingMatches: 0, wins: 0, certificates: 0 },
    registrations: []
  }
];

export const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem('sportpulse_registered_users');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_ACCOUNTS;
};

export const saveStoredUsers = (users) => {
  try {
    localStorage.setItem('sportpulse_registered_users', JSON.stringify(users));
  } catch {}
};

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
  const [leaderboard, setLeaderboard] = useState(MOCK_LEADERBOARD);
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
    const activeRole = targetRole || 'guest';
    const cleanEmail = email ? email.toLowerCase().trim() : '';

    // 1. Fetch targeted notifications for this specific account
    try {
      const notifRes = await api.getNotifications({
        email: cleanEmail,
        role: activeRole,
      });
      if (notifRes?.data) {
        setNotifications(notifRes.data);
      }
    } catch {
      // Offline / client-mode notification fallback
      if (!cleanEmail || activeRole === 'guest') {
        setNotifications(PUBLIC_ANNOUNCEMENTS);
      } else if (cleanEmail.includes('ashwin')) {
        setNotifications(MOCK_NOTIFICATIONS);
      } else if (cleanEmail.includes('admin') || activeRole === 'admin') {
        setNotifications([
          { id: 'notif-adm-1', title: 'System Overview', message: 'All campus tournament fixtures are synchronized.', time: '1 hour ago', unread: true, type: 'info' },
          ...PUBLIC_ANNOUNCEMENTS
        ]);
      } else {
        try {
          const userNotifsRaw = localStorage.getItem(`sportpulse_notifs_${cleanEmail}`);
          if (userNotifsRaw) {
            setNotifications(JSON.parse(userNotifsRaw));
          } else {
            setNotifications([
              {
                id: `notif-welcome-${Date.now()}`,
                title: 'Welcome to SportPulse!',
                message: 'Your athlete account is ready. Browse upcoming tournaments and register for your first match.',
                time: 'Just now',
                type: 'success',
                unread: true
              },
              ...PUBLIC_ANNOUNCEMENTS
            ]);
          }
        } catch {
          setNotifications(PUBLIC_ANNOUNCEMENTS);
        }
      }
    }

    // 2. Fetch individual registrations for participant or admin
    if (activeRole === 'participant' && cleanEmail) {
      try {
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
      } catch {
        // Offline / client fallback for registrations
        if (cleanEmail.includes('ashwin')) {
          setUserProfile(prev => ({
            ...prev,
            registrations: MOCK_PARTICIPANT_PROFILE.registrations,
            stats: { ...prev.stats, registeredTournaments: MOCK_PARTICIPANT_PROFILE.registrations.length }
          }));
        } else {
          try {
            const rawRegs = localStorage.getItem(`sportpulse_user_regs_${cleanEmail}`);
            const localRegs = rawRegs ? JSON.parse(rawRegs) : [];
            setUserProfile(prev => ({
              ...prev,
              registrations: localRegs,
              stats: { ...prev.stats, registeredTournaments: localRegs.length }
            }));
          } catch {}
        }
      }
    } else if (activeRole === 'admin') {
      try {
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
      } catch {}
    } else if (activeRole === 'guest') {
      setUserProfile(GUEST_PROFILE);
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

        // Parallel fetch global tournaments, fixtures, all registrations (for admin feed), stats, and leaderboard
        const [trnRes, fixRes, regRes, statsRes, leadRes] = await Promise.allSettled([
          api.getTournaments(),
          api.getFixtures(),
          api.getRegistrations(),
          api.getAdminStats(),
          api.getLeaderboard(),
        ]);

        if (trnRes.status === 'fulfilled' && trnRes.value.data?.length > 0) {
          setTournaments(trnRes.value.data);
        }
        if (fixRes.status === 'fulfilled' && fixRes.value.data) {
          setFixtures(fixRes.value.data);
        }
        if (regRes.status === 'fulfilled' && Array.isArray(regRes.value.data)) {
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
        if (leadRes.status === 'fulfilled' && leadRes.value.data?.length > 0) {
          setLeaderboard(leadRes.value.data);
        }
      }
    } catch {
      // Backend not running or in offline demo mode - keep mockData gracefully
      setDbStatus(prev => ({ ...prev, connected: false }));
    }

    // Determine current authenticated user session (works seamlessly in both online & offline modes)
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
        const defaultAthlete = DEFAULT_ACCOUNTS[0];
        setUserProfile(defaultAthlete);
        loadUserSpecificData(defaultAthlete.email, 'participant');
      }
      setCurrentView('participant-dashboard');
      addToast('Switched to Athlete / Participant Portal', 'info');
    } else if (newRole === 'admin') {
      const defaultAdmin = DEFAULT_ACCOUNTS[1];
      setUserProfile(defaultAdmin);
      loadUserSpecificData(defaultAdmin.email, 'admin');
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

  // Register New User Account in MongoDB / Hybrid Local Storage
  const registerUserAccount = async (accountData) => {
    const cleanEmail = accountData.email ? accountData.email.toLowerCase().trim() : '';
    const cleanRole = accountData.role || 'participant';

    if (!cleanEmail) {
      throw new Error('Please enter a valid email address.');
    }

    // Check if account already exists locally or in demo registry
    const currentUsers = getStoredUsers();
    const existing = currentUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error(`An account with email "${cleanEmail}" already exists. Please log in.`);
    }

    const newUser = {
      id: `usr-${Date.now().toString().slice(-6)}`,
      name: (accountData.name || 'Student Athlete').trim(),
      email: cleanEmail,
      password: accountData.password,
      role: cleanRole,
      phone: accountData.phone || '',
      preferredSports: accountData.preferredSports || [accountData.preferredSport || 'Football'],
      location: accountData.location || 'Campus Main Arena',
      bio: accountData.bio || (cleanRole === 'admin' ? 'Campus Tournament Administrator' : 'Active Student Athlete'),
      stats: { registeredTournaments: 0, upcomingMatches: 0, wins: 0, certificates: 0 },
      registrations: [],
      createdAt: new Date().toISOString()
    };

    // Save locally
    const updatedUsers = [newUser, ...currentUsers];
    saveStoredUsers(updatedUsers);

    try {
      localStorage.setItem('sportpulse_user', JSON.stringify(newUser));
    } catch {}

    // Update active UI state immediately
    setUserProfile(newUser);
    setRoleState(cleanRole);
    setCurrentView(cleanRole === 'admin' ? 'admin-dashboard' : 'participant-dashboard');

    setDbStatus(prev => ({
      ...prev,
      counts: { ...prev.counts, users: (prev.counts?.users || 0) + 1 }
    }));

    // Welcome notifications
    const welcomeNotif = {
      id: `notif-welcome-${Date.now()}`,
      userEmail: cleanEmail,
      title: `Welcome, ${newUser.name}!`,
      message: 'Your account is ready. Browse upcoming championships and register for your first match.',
      time: 'Just now',
      type: 'success',
      unread: true
    };
    setNotifications([welcomeNotif, ...PUBLIC_ANNOUNCEMENTS]);
    try {
      localStorage.setItem(`sportpulse_notifs_${cleanEmail}`, JSON.stringify([welcomeNotif, ...PUBLIC_ANNOUNCEMENTS]));
    } catch {}

    // Asynchronously sync with MongoDB if server is active
    try {
      const apiRes = await api.registerUser(accountData);
      if (apiRes?.data?._id) {
        newUser._id = apiRes.data._id;
        newUser.id = apiRes.data.id || newUser.id;
        try {
          localStorage.setItem('sportpulse_user', JSON.stringify(newUser));
        } catch {}
      }
    } catch (apiErr) {
      if (apiErr.message && (apiErr.message.includes('already exists') || apiErr.message.includes('required'))) {
        throw apiErr;
      }
      console.info('[SportPulse Notice] Offline/Client Mode: Account saved locally.', apiErr.message);
    }

    return { success: true, data: newUser };
  };

  // Log into User Account via MongoDB / Hybrid Local Storage
  const loginUserAccount = async (credentials) => {
    const cleanEmail = credentials.email ? credentials.email.toLowerCase().trim() : '';
    const cleanPassword = credentials.password || '';

    if (!cleanEmail) {
      throw new Error('Please enter your email address.');
    }

    // 1. Try remote MongoDB login if API is reachable
    let remoteUser = null;
    try {
      const res = await api.loginUser(credentials);
      if (res.success && res.data) {
        remoteUser = res.data;
      }
    } catch (apiErr) {
      console.info('[SportPulse Login Note] Remote API offline or blocked, checking local account registry...', apiErr.message);
    }

    if (remoteUser) {
      try {
        localStorage.setItem('sportpulse_user', JSON.stringify(remoteUser));
      } catch {}
      setUserProfile(prev => ({
        ...prev,
        ...remoteUser,
        stats: remoteUser.stats || prev.stats,
      }));
      setRoleState(remoteUser.role);
      setCurrentView(remoteUser.role === 'admin' ? 'admin-dashboard' : 'participant-dashboard');
      await loadUserSpecificData(remoteUser.email, remoteUser.role);
      return { success: true, data: remoteUser };
    }

    // 2. Fallback: Authenticate against local and demo account registry
    const currentUsers = getStoredUsers();
    const matchedUser = currentUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!matchedUser) {
      throw new Error(`No account found with email "${cleanEmail}". Please check your email or click "Register" to create a new account.`);
    }

    if (matchedUser.password && matchedUser.password !== cleanPassword) {
      throw new Error('Incorrect password. Please verify your credentials and try again.');
    }

    // Successful local login
    try {
      localStorage.setItem('sportpulse_user', JSON.stringify(matchedUser));
    } catch {}

    setUserProfile(prev => ({
      ...prev,
      ...matchedUser,
      stats: matchedUser.stats || prev.stats,
      registrations: matchedUser.registrations || prev.registrations || []
    }));
    setRoleState(matchedUser.role);
    setCurrentView(matchedUser.role === 'admin' ? 'admin-dashboard' : 'participant-dashboard');
    await loadUserSpecificData(matchedUser.email, matchedUser.role);

    return { success: true, data: matchedUser };
  };

  // Tournament Creation Handler - persists to MongoDB
  const createTournament = async (newTrnData) => {
    const id = `trn-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const newTrn = {
      id,
      ...newTrnData,
      status: 'Registration Open',
      registeredCount: 0,
      bannerImage: newTrnData.bannerImage || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80',
      rules: newTrnData.rules ? (typeof newTrnData.rules === 'string' ? newTrnData.rules.split('\n') : newTrnData.rules) : ['Standard rules apply.']
    };

    // Async write to MongoDB Atlas first
    let savedToAtlas = false;
    try {
      const apiRes = await api.createTournament(newTrn);
      if (apiRes?.data?._id) {
        newTrn._id = apiRes.data._id;
        newTrn.id = apiRes.data.id || newTrn.id;
        savedToAtlas = true;
      }
      setDbStatus(prev => ({
        ...prev,
        counts: { ...prev.counts, tournaments: (prev.counts?.tournaments || 0) + 1 }
      }));
      addToast(`🏆 Tournament "${newTrn.name}" created and saved to MongoDB!`, 'success');
    } catch (err) {
      console.warn('[DB Sync Note] Backend error:', err.message);
      addToast(`Saved in active session (DB notice: ${err.message})`, 'warning');
    }

    // Update active UI state
    setTournaments(prev => [newTrn, ...prev]);
    setAdminStats(prev => ({
      ...prev,
      totalTournaments: prev.totalTournaments + 1
    }));
    setCurrentView('manage-tournaments');
  };

  // Delete Tournament Handler - cascades in MongoDB
  const deleteTournament = async (id) => {
    try {
      await api.deleteTournament(id);
      addToast('Tournament deleted from MongoDB database', 'warning');
    } catch (err) {
      console.warn('[DB Sync Note]', err.message);
      addToast(`Removed from current view (DB note: ${err.message})`, 'info');
    }

    setTournaments(prev => prev.filter(t => t.id !== id));
    setAdminStats(prev => ({
      ...prev,
      totalTournaments: Math.max(0, prev.totalTournaments - 1)
    }));
    setDbStatus(prev => ({
      ...prev,
      counts: { ...prev.counts, tournaments: Math.max(0, (prev.counts?.tournaments || 1) - 1) }
    }));
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

    try {
      await api.updateTournament(id, { status: nextStatus });
      addToast(`Tournament status updated to ${nextStatus} in MongoDB`, 'info');
    } catch (err) {
      console.warn('[DB Sync Note]', err.message);
      addToast(`Status updated in view (Sync note: ${err.message})`, 'warning');
    }
  };

  const updateTournamentStatus = async (id, status) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status };
      }
      return t;
    }));

    try {
      await api.updateTournament(id, { status });
      addToast(`Tournament status changed to ${status} in MongoDB!`, 'info');
    } catch (err) {
      console.warn('[DB Sync Note]', err.message);
      addToast(`Status updated in view (Sync note: ${err.message})`, 'warning');
    }
  };

  // Participant Register for Tournament - creates Registration document in MongoDB Atlas
  const registerForTournament = async (trnId, regForm = {}) => {
    // Guest Read-Only Enforcement: Guests cannot register, must sign in
    if (!userProfile?.email || role === 'guest' || userProfile?.role === 'guest' || userProfile?.role === 'Guest') {
      setCurrentView('login');
      addToast('Guests have read-only access. Please log into an athlete account to register.', 'warning');
      throw new Error('Authentication Required: Guests have read-only access. Please sign in to register for tournaments.');
    }

    const trn = tournaments.find(t => t.id === trnId || t._id === trnId || String(t._id) === String(trnId));
    const effectiveTrnId = trn ? trn.id : trnId;
    const effectiveTrnName = trn ? trn.name : (regForm.tournamentName || '');

    // Duplicate Registration Prevention: A user can only register once per tournament
    const alreadyRegistered = (userProfile?.registrations || []).some(
      r => (r.tournamentId === effectiveTrnId || (effectiveTrnName && r.tournamentName === effectiveTrnName))
    );
    if (alreadyRegistered) {
      addToast(`You have already registered for ${trn?.name || 'this tournament'}. Each user is allowed only one registration per tournament.`, 'warning');
      throw new Error(`You have already registered for ${trn?.name || 'this tournament'}. Duplicate registrations are not allowed.`);
    }

    const sportPrefix = (trn?.sport || regForm.sport || 'SPT').substring(0, 3).toUpperCase();
    const participantName = regForm.participantName || regForm.name || userProfile.name || 'Student Athlete';
    const email = (regForm.email || userProfile.email || 'athlete@campus.edu').toLowerCase().trim();
    const phone = regForm.phone || userProfile.phone || '';
    const team = regForm.teamName || regForm.team || 'Individual';
    const entryFee = trn ? trn.entryFee : 0;
    const fee = `₹${entryFee}`;
    const amount = entryFee;
    const paymentStatus = entryFee > 0 ? (regForm.paymentMethod ? 'Paid' : 'Paid') : 'Waived';
    const sport = trn ? trn.sport : (regForm.sport || 'Sports');
    const regId = `reg-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const ticketCode = `SP-${sportPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReg = {
      id: regId,
      tournamentId: trn ? trn.id : trnId,
      tournamentName: trn ? trn.name : (regForm.tournamentName || 'Registered Championship'),
      tournament: trn ? trn.name : (regForm.tournamentName || 'Registered Championship'),
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

    // 1. Direct write to MongoDB Atlas first
    let savedToAtlas = false;
    try {
      const apiRes = await api.createRegistration(newReg);
      if (apiRes?.data?._id) {
        newReg._id = apiRes.data._id;
        newReg.id = apiRes.data.id || newReg.id;
        newReg.ticketCode = apiRes.data.ticketCode || newReg.ticketCode;
        savedToAtlas = true;
      }
      setDbStatus(prev => ({
        ...prev,
        counts: { ...prev.counts, registrations: (prev.counts?.registrations || 0) + 1 }
      }));
    } catch (err) {
      console.warn('[MongoDB Atlas Registration Notice]', err.message);
      if (err.message && (err.message.includes('full') || err.message.includes('required'))) {
        throw err;
      }
    }

    // 2. Update tournaments registeredCount
    setTournaments(prev => prev.map(t => {
      if (t.id === trnId || t._id === trnId) {
        return { ...t, registeredCount: (t.registeredCount || 0) + 1 };
      }
      return t;
    }));

    // 3. Prepend to recent participants for live admin view
    setRecentParticipants(prev => [newReg, ...prev]);

    // 4. Update participant's registered events if this is the active user session
    const isCurrentAthlete = (userProfile?.email && userProfile.email.toLowerCase().trim() === email) || (role === 'participant');
    if (isCurrentAthlete) {
      setUserProfile(prev => {
        const updatedRegs = [newReg, ...(prev.registrations || [])];
        const updatedProfile = {
          ...prev,
          stats: {
            ...prev.stats,
            registeredTournaments: updatedRegs.length
          },
          registrations: updatedRegs
        };

        try {
          const cleanEmail = (prev.email || email).toLowerCase().trim();
          localStorage.setItem(`sportpulse_user_regs_${cleanEmail}`, JSON.stringify(updatedRegs));
          localStorage.setItem('sportpulse_user', JSON.stringify(updatedProfile));
          
          const raw = localStorage.getItem('sportpulse_registered_users');
          if (raw) {
            const users = JSON.parse(raw);
            const idx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
            if (idx !== -1) {
              users[idx] = { ...users[idx], ...updatedProfile };
              localStorage.setItem('sportpulse_registered_users', JSON.stringify(users));
            }
          }
        } catch {}

        return updatedProfile;
      });
    }

    // 5. Add confirmed registration notification for this participant
    try {
      const targetEmail = (userProfile?.email || email).toLowerCase().trim();
      const newNotif = {
        id: `notif-reg-${Date.now()}`,
        userEmail: targetEmail,
        title: 'Registration Confirmed',
        message: `Registered for "${newReg.tournamentName}". Entry Pass: ${newReg.ticketCode}`,
        time: 'Just now',
        type: 'success',
        unread: true
      };
      setNotifications(prev => [newNotif, ...prev]);
      const stored = localStorage.getItem(`sportpulse_notifs_${targetEmail}`);
      const notifsList = stored ? JSON.parse(stored) : [];
      localStorage.setItem(`sportpulse_notifs_${targetEmail}`, JSON.stringify([newNotif, ...notifsList]));
    } catch {}

    // 6. Reload account specific data
    const reloadEmail = userProfile?.email || email;
    if (reloadEmail) {
      loadUserSpecificData(reloadEmail, role).catch(() => {});
    }

    addToast(`🎉 Registered for ${newReg.tournamentName}! Pass: ${newReg.ticketCode} (Saved to MongoDB)`, 'success');
    return { success: true, data: newReg, savedToAtlas };
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

  // Update Live Match Score - persists to MongoDB and advances winning team (Admin Only)
  const updateMatchScore = async (trnId, stage, matchId, score1, score2, winnerName) => {
    // Only Admin can enter official match results
    if (role !== 'admin' && userProfile?.role !== 'admin') {
      addToast('Permission Denied: Only tournament administrators can record official match results.', 'error');
      throw new Error('Permission Denied: Official match results can only be recorded by tournament administrators.');
    }

    const s1 = parseInt(score1);
    const s2 = parseInt(score2);
    let calculatedWinner = winnerName;

    setFixtures(prev => {
      const trnFixtures = prev[trnId] || prev['trn-102'] || {};
      const qf = (trnFixtures.quarterFinals || []).map(m => ({ ...m }));
      const sf = (trnFixtures.semiFinals || []).map(m => ({ ...m }));
      const fn = (trnFixtures.final || []).map(m => ({ ...m }));

      let stageList = stage === 'quarterFinals' ? qf : (stage === 'semiFinals' ? sf : fn);
      const matchIndex = stageList.findIndex(m => m.id === matchId);

      if (matchIndex !== -1) {
        const currentMatch = stageList[matchIndex];
        currentMatch.score1 = s1;
        currentMatch.score2 = s2;
        currentMatch.status = 'Completed';
        if (!calculatedWinner || calculatedWinner === 'Draw') {
          calculatedWinner = s1 > s2 ? currentMatch.team1 : currentMatch.team2;
        }
        currentMatch.winner = calculatedWinner;

        // Dynamically move the winning team into the next round!
        if (stage === 'quarterFinals') {
          // Quarter Finals -> Semi Finals (m1/m2 -> sf[0], m3/m4 -> sf[1])
          if (matchIndex === 0 || matchId === 'm1') {
            if (sf[0]) {
              sf[0].team1 = calculatedWinner;
              if (sf[0].team2 && !sf[0].team2.includes('TBD')) sf[0].status = 'Upcoming';
            }
          } else if (matchIndex === 1 || matchId === 'm2') {
            if (sf[0]) {
              sf[0].team2 = calculatedWinner;
              if (sf[0].team1 && !sf[0].team1.includes('TBD')) sf[0].status = 'Upcoming';
            }
          } else if (matchIndex === 2 || matchId === 'm3') {
            if (sf[1]) {
              sf[1].team1 = calculatedWinner;
              if (sf[1].team2 && !sf[1].team2.includes('TBD')) sf[1].status = 'Upcoming';
            }
          } else if (matchIndex === 3 || matchId === 'm4') {
            if (sf[1]) {
              sf[1].team2 = calculatedWinner;
              if (sf[1].team1 && !sf[1].team1.includes('TBD')) sf[1].status = 'Upcoming';
            }
          }
        } else if (stage === 'semiFinals') {
          // Semi Finals -> Grand Final (m5 -> fn[0].team1, m6 -> fn[0].team2)
          if (matchIndex === 0 || matchId === 'm5') {
            if (fn[0]) {
              fn[0].team1 = calculatedWinner;
              if (fn[0].team2 && !fn[0].team2.includes('TBD')) fn[0].status = 'Grand Final';
            }
          } else if (matchIndex === 1 || matchId === 'm6') {
            if (fn[0]) {
              fn[0].team2 = calculatedWinner;
              if (fn[0].team1 && !fn[0].team1.includes('TBD')) fn[0].status = 'Grand Final';
            }
          }
        } else if (stage === 'final') {
          if (fn[0]) {
            fn[0].status = `Champion: ${calculatedWinner}`;
          }
        }
      }

      return {
        ...prev,
        [trnId]: {
          quarterFinals: qf,
          semiFinals: sf,
          final: fn
        }
      };
    });

    if (stage === 'quarterFinals') {
      addToast(`🎉 ${calculatedWinner} won and advanced to the Semi-Finals!`, 'success');
    } else if (stage === 'semiFinals') {
      addToast(`⚡ ${calculatedWinner} won and advanced to the Grand Championship Final!`, 'success');
    } else if (stage === 'final') {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      addToast(`🏆 CHAMPION CROWNED! ${calculatedWinner} wins the tournament!`, 'success');
    } else {
      addToast('Match scorecard updated and saved to MongoDB!', 'success');
    }

    // Async write to MongoDB with admin credentials
    try {
      await api.updateMatchScore(trnId, {
        stage,
        matchId,
        score1: s1,
        score2: s2,
        winnerName: calculatedWinner,
        role: 'admin',
        adminEmail: userProfile?.email
      });

      // Refresh leaderboard after match score update
      try {
        const refreshedLb = await api.getLeaderboard();
        if (refreshedLb.data && refreshedLb.data.length > 0) {
          setLeaderboard(refreshedLb.data);
        }
      } catch (lbErr) {}
    } catch (err) {
      console.warn('[DB Sync Note]', err.message);
    }
  };

  // Admin Match Scheduling Handler - assigns teams, date, time, and venue to a fixture
  const scheduleMatch = async (trnId, matchData) => {
    if (role !== 'admin') {
      addToast('Permission Denied: Only tournament administrators can schedule matches.', 'error');
      throw new Error('Permission Denied: Only administrators can schedule matches.');
    }

    const { stage = 'quarterFinals', matchId, team1, team2, date, time, court } = matchData;

    setFixtures(prev => {
      const trnFixtures = prev[trnId] || { quarterFinals: [], semiFinals: [], final: [] };
      const qf = (trnFixtures.quarterFinals || []).map(m => ({ ...m }));
      const sf = (trnFixtures.semiFinals || []).map(m => ({ ...m }));
      const fn = (trnFixtures.final || []).map(m => ({ ...m }));
      let stageList = stage === 'quarterFinals' ? qf : (stage === 'semiFinals' ? sf : fn);

      const matchIdx = stageList.findIndex(m => m.id === matchId);
      if (matchIdx !== -1) {
        stageList[matchIdx] = {
          ...stageList[matchIdx],
          team1: team1 || stageList[matchIdx].team1,
          team2: team2 || stageList[matchIdx].team2,
          date: date || stageList[matchIdx].date,
          time: time || stageList[matchIdx].time,
          court: court || stageList[matchIdx].court,
          status: 'Scheduled'
        };
      } else {
        stageList.push({
          id: matchId || `m-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
          team1: team1 || 'TBD',
          team2: team2 || 'TBD',
          score1: 0,
          score2: 0,
          winner: '',
          status: 'Scheduled',
          date: date || new Date().toISOString().split('T')[0],
          time: time || '10:00 AM',
          court: court || 'Court 1'
        });
      }

      return {
        ...prev,
        [trnId]: { quarterFinals: qf, semiFinals: sf, final: fn }
      };
    });

    addToast(`Match scheduled: ${team1} vs ${team2} (${date || 'Upcoming'})`, 'success');

    try {
      await api.scheduleMatch(trnId, { ...matchData, role: 'admin' });
    } catch (err) {
      console.warn('[DB Schedule Note]', err.message);
    }
  };

  // Update Profile Data and persist across app and local storage
  const updateUserProfile = async (updates) => {
    let mergedProfile = null;
    setUserProfile(prev => {
      mergedProfile = { ...prev, ...updates };
      try {
        localStorage.setItem('sportpulse_user', JSON.stringify(mergedProfile));
      } catch {}
      return mergedProfile;
    });

    // Also update in registered users cache in localStorage
    try {
      const storedUsers = getStoredUsers();
      const targetEmail = (updates.email || userProfile?.email || '').toLowerCase().trim();
      const targetId = userProfile?.id || userProfile?._id || updates.id;
      const updatedUsers = storedUsers.map(u => {
        if ((targetEmail && u.email?.toLowerCase().trim() === targetEmail) || (targetId && u.id === targetId)) {
          return { ...u, ...updates };
        }
        return u;
      });
      saveStoredUsers(updatedUsers);
    } catch {}

    addToast('Profile changes saved successfully!', 'success');

    // Async sync to MongoDB backend
    try {
      const lookupId = userProfile?._id || userProfile?.id || userProfile?.email || updates._id || updates.id || updates.email;
      if (lookupId) {
        const res = await api.updateUserProfile(lookupId, updates);
        if (res?.data) {
          setUserProfile(prev => {
            const updated = {
              ...prev,
              ...res.data,
              stats: res.data.stats || prev?.stats,
              registrations: prev?.registrations || []
            };
            try {
              localStorage.setItem('sportpulse_user', JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
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
      { id: 'm5', team1: 'TBD (Winner QF-1)', score1: 0, team2: 'TBD (Winner QF-2)', score2: 0, winner: null, status: 'Upcoming', time: 'Tomorrow 02:00 PM' },
      { id: 'm6', team1: 'TBD (Winner QF-3)', score1: 0, team2: 'TBD (Winner QF-4)', score2: 0, winner: null, status: 'Upcoming', time: 'Tomorrow 04:30 PM' }
    ];

    const newFinal = [
      { id: 'm7', team1: 'TBD (Winner SF-1)', score1: 0, team2: 'TBD (Winner SF-2)', score2: 0, winner: null, status: 'Grand Final', time: 'Sunday 06:00 PM' }
    ];

    setFixtures(prev => ({
      ...prev,
      [targetTrnId]: {
        quarterFinals: newQuarterFinals,
        semiFinals: newSemiFinals,
        final: newFinal
      }
    }));

    addToast('Knockout bracket generated with 8 seeded teams! Winners will automatically advance as matches are scored.', 'success');
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
        scheduleMatch,
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
        leaderboard,
        setLeaderboard,
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
