import { Leaderboard } from '../models/Leaderboard.js';

// GET /api/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { sport } = req.query;
    const filter = {};
    if (sport && sport.toLowerCase() !== 'all') {
      filter.sport = new RegExp(`^${sport}$`, 'i');
    }

    const leaderboard = await Leaderboard.find(filter).sort({ points: -1 });
    res.json({ success: true, count: leaderboard.length, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
