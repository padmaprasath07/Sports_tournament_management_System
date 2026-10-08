// SportPulse API Service - Connects React Frontend to Express & MongoDB Backend
const resolveApiBaseUrl = () => {
  // If running in browser on Vercel, the app's native serverless /api is directly available
  if (typeof window !== 'undefined') {
    if (window.location.hostname.endsWith('.vercel.app')) {
      return '/api';
    }
  }

  let base = import.meta.env.VITE_API_BASE_URL;
  if (base && typeof base === 'string' && base.trim()) {
    let clean = base.trim().replace(/\/+$/, '');
    // If it points to the documentation placeholder, ignore and use native /api
    if (clean.includes('sportpulse-api.onrender.com')) {
      return '/api';
    }
    if (!clean.endsWith('/api')) {
      clean = `${clean}/api`;
    }
    return clean;
  }
  // Standard relative /api endpoint works seamlessly in Vite dev (via proxy)
  // and in production on Vercel serverless function!
  return '/api';
};

const API_BASE_URL = resolveApiBaseUrl();

/**
 * Helper to make HTTP requests with timeout and resilient relative fallback
 */
async function request(endpoint, options = {}) {
  const primaryBase = resolveApiBaseUrl();
  const url = `${primaryBase}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const controller = new AbortController();
  // 60s timeout accommodates cold starts
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      // If external URL failed with 404 or 5xx, retry with native /api
      if (primaryBase !== '/api' && (response.status === 404 || response.status >= 500)) {
        try {
          const fallbackRes = await fetch(`/api${endpoint}`, { ...config });
          if (fallbackRes.ok) return await fallbackRes.json();
        } catch {}
      }
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    // If network error occurred with external base, retry with native /api
    if (primaryBase !== '/api') {
      try {
        const fallbackRes = await fetch(`/api${endpoint}`, { ...config });
        if (fallbackRes.ok) return await fallbackRes.json();
      } catch {}
    }
    if (err.name !== 'AbortError') {
      console.info(`[SportPulse API Sync Note: ${endpoint}]`, err.message);
    } else {
      console.warn(`[SportPulse API Timeout: ${endpoint}] Request timed out after 60s.`);
    }
    throw err;
  }
}

export const api = {
  // Database & Server Health Diagnostic
  async checkHealth() {
    return request('/health');
  },

  // Reseed Database
  async reseedDatabase(force = true) {
    return request('/seed', {
      method: 'POST',
      body: JSON.stringify({ force }),
    });
  },

  // User Accounts & Authentication (Database-backed)
  async registerUser(userData) {
    return request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async loginUser(credentials) {
    return request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async getUsers(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return request(`/users${qs ? `?${qs}` : ''}`);
  },

  async getUserProfile(emailOrId) {
    return request(`/users/${encodeURIComponent(emailOrId)}`);
  },

  async updateUserProfile(id, updates) {
    return request(`/users/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Tournaments CRUD
  async getTournaments(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.sport && params.sport !== 'All') searchParams.append('sport', params.sport);
    if (params.search) searchParams.append('search', params.search);
    if (params.status && params.status !== 'All') searchParams.append('status', params.status);
    
    const qs = searchParams.toString();
    const endpoint = `/tournaments${qs ? `?${qs}` : ''}`;
    return request(endpoint);
  },

  async getTournamentById(id) {
    return request(`/tournaments/${id}`);
  },

  async createTournament(tournamentData) {
    return request('/tournaments', {
      method: 'POST',
      body: JSON.stringify(tournamentData),
    });
  },

  async updateTournament(id, updates) {
    return request(`/tournaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteTournament(id) {
    return request(`/tournaments/${id}`, {
      method: 'DELETE',
    });
  },

  // Fixtures & Match Scheduling & Results
  async getFixtures() {
    return request('/fixtures');
  },

  async scheduleMatch(tournamentId, scheduleData) {
    return request(`/fixtures/${tournamentId}/schedule`, {
      method: 'PUT',
      body: JSON.stringify(scheduleData),
    });
  },

  async updateMatchScore(tournamentId, { stage, matchId, score1, score2, winnerName, status }) {
    return request(`/fixtures/${tournamentId}/match`, {
      method: 'PUT',
      body: JSON.stringify({ stage, matchId, score1, score2, winnerName, status }),
    });
  },

  // Registrations
  async getRegistrations(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return request(`/registrations${qs ? `?${qs}` : ''}`);
  },

  async createRegistration(registrationData) {
    return request('/registrations', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },

  async updateRegistrationStatus(id, statusData) {
    const payload = typeof statusData === 'string' ? { status: statusData } : statusData;
    return request(`/registrations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // Leaderboard & Notifications & Stats
  async getLeaderboard(sport = 'All') {
    const qs = sport && sport !== 'All' ? `?sport=${encodeURIComponent(sport)}` : '';
    return request(`/leaderboard${qs}`);
  },

  async getNotifications(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return request(`/notifications${qs ? `?${qs}` : ''}`);
  },

  async markNotificationRead(id) {
    return request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  async deleteNotification(id) {
    return request(`/notifications/${id}`, {
      method: 'DELETE',
    });
  },

  async getAdminStats() {
    return request('/stats');
  },
};
