import { Leaderboard } from '../models/Leaderboard.js';

// GET /api/leaderboard - Get dynamic athlete rankings calculated by points & win rates
export const getLeaderboard = async (req, res) => {
  try {
    const { sport } = req.query;
    const filter = {};
    if (sport && sport.toLowerCase() !== 'all') {
      filter.sport = new RegExp(`^${sport}$`, 'i');
    }

    // Sort primarily by points (descending), secondarily by wins (descending)
    const rawList = await Leaderboard.find(filter).sort({ points: -1, wins: -1 });

    // Dynamically calculate and normalize win rate percentage, rank index, and badge
    const leaderboard = rawList.map((item, index) => {
      const doc = item.toObject ? item.toObject() : { ...item };
      const matches = Number(doc.matches) || 0;
      const wins = Number(doc.wins) || 0;
      
      // Condition 1: Win rate calculation formula: (wins / matches) * 100%
      const winRateNum = matches > 0 ? (wins / matches) * 100 : 0;
      doc.winRate = winRateNum.toFixed(1) + '%';
      
      // Condition 2: Dynamic 1-indexed rank based on sorted points
      doc.rank = index + 1;

      // Condition 3: Dynamic achievement tier badge
      if (doc.rank === 1 || doc.points >= 1200) {
        doc.badge = 'Gold Champion';
      } else if (doc.rank === 2 || doc.points >= 1050) {
        doc.badge = 'Silver MVP';
      } else if (doc.rank === 3 || doc.points >= 950) {
        doc.badge = 'Bronze Elite';
      } else if (doc.points >= 800) {
        doc.badge = 'Pro Contender';
      } else {
        doc.badge = 'Contender';
      }

      return doc;
    });

    res.json({ success: true, count: leaderboard.length, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
