// SportPulse API Service - Connects React Frontend to Express & MongoDB Backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper to make HTTP requests with timeout
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn(`[API Error: ${endpoint}]`, err.message);
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

  // Fixtures & Match Scores
  async getFixtures() {
    return request('/fixtures');
  },

  async updateMatchScore(tournamentId, { stage, matchId, score1, score2, winnerName }) {
    return request(`/fixtures/${tournamentId}/match`, {
      method: 'PUT',
      body: JSON.stringify({ stage, matchId, score1, score2, winnerName }),
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

  async updateRegistrationStatus(id, status) {
    return request(`/registrations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Leaderboard & Notifications & Stats
  async getLeaderboard(sport = 'All') {
    const qs = sport && sport !== 'All' ? `?sport=${encodeURIComponent(sport)}` : '';
    return request(`/leaderboard${qs}`);
  },

  async getNotifications() {
    return request('/notifications');
  },

  async markNotificationRead(id) {
    return request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  async getAdminStats() {
    return request('/stats');
  },
};
