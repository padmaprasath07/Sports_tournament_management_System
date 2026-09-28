import express from 'express';
import mongoose from 'mongoose';
import {
  getTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  getAdminStats,
} from '../controllers/tournamentController.js';
import {
  getAllFixtures,
  getFixturesByTournament,
  updateMatchScore,
} from '../controllers/fixtureController.js';
import {
  getRegistrations,
  createRegistration,
  updateRegistrationStatus,
} from '../controllers/registrationController.js';
import { getLeaderboard } from '../controllers/leaderboardController.js';
import {
  getNotifications,
  createNotification,
  markNotificationRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import {
  registerUser,
  loginUser,
  getUsers,
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { seedDatabase } from '../seed/seed.js';
import { Tournament } from '../models/Tournament.js';
import { Fixture } from '../models/Fixture.js';
import { Registration } from '../models/Registration.js';
import { User } from '../models/User.js';

const router = express.Router();

// Health Check & Database Diagnostic Endpoint
router.get('/health', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const isConnected = dbState === 1;

  let counts = { tournaments: 0, fixtures: 0, registrations: 0, users: 0 };
  if (isConnected) {
    try {
      const [tCount, fCount, rCount, uCount] = await Promise.all([
        Tournament.countDocuments(),
        Fixture.countDocuments(),
        Registration.countDocuments(),
        User.countDocuments(),
      ]);
      counts = { tournaments: tCount, fixtures: fCount, registrations: rCount, users: uCount };
    } catch {
      // Ignored if query fails
    }
  }

  res.json({
    status: isConnected ? 'healthy' : 'degraded',
    database: {
      type: 'MongoDB',
      state: states[dbState] || 'Unknown',
      host: mongoose.connection.host || 'localhost',
      name: mongoose.connection.name || 'sportpulse_db',
      isAtlasCloud: (mongoose.connection.host || '').includes('mongodb.net'),
      counts,
    },
    serverTime: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Reseed / Initialize Database
router.post('/seed', async (req, res) => {
  try {
    const { force } = req.body || {};
    const result = await seedDatabase(Boolean(force));
    res.json({ success: true, message: 'Database seeded successfully', details: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User Authentication & Profiles (Database-backed)
router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
router.get('/users', getUsers);
router.get('/users/:emailOrId', getUserProfile);
router.put('/users/:id', updateUserProfile);

// Tournament Routes
router.route('/tournaments')
  .get(getTournaments)
  .post(createTournament);

router.route('/tournaments/:id')
  .get(getTournamentById)
  .put(updateTournament)
  .delete(deleteTournament);

// Fixtures & Match Scores
router.get('/fixtures', getAllFixtures);
router.get('/fixtures/:tournamentId', getFixturesByTournament);
router.put('/fixtures/:tournamentId/match', updateMatchScore);

// Registrations
router.route('/registrations')
  .get(getRegistrations)
  .post(createRegistration);

router.put('/registrations/:id/status', updateRegistrationStatus);

// Leaderboard & Notifications & Stats
router.get('/leaderboard', getLeaderboard);
// Notifications
router.route('/notifications')
  .get(getNotifications)
  .post(createNotification);

router.put('/notifications/:id/read', markNotificationRead);
router.delete('/notifications/:id', deleteNotification);
router.get('/stats', getAdminStats);

export default router;
