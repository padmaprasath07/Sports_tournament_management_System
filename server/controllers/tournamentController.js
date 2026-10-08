import { Tournament } from '../models/Tournament.js';
import { Registration } from '../models/Registration.js';
import { Fixture } from '../models/Fixture.js';

// GET /api/tournaments
export const getTournaments = async (req, res) => {
  try {
    const { sport, status, search, featured } = req.query;
    const filter = {};

    if (sport && sport.toLowerCase() !== 'all') {
      filter.sport = new RegExp(`^${sport}$`, 'i');
    }

    if (status && status.toLowerCase() !== 'all') {
      filter.status = status;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sport: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
      ];
    }

    const tournaments = await Tournament.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: tournaments.length, data: tournaments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/tournaments/:id
export const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findOne({ id: req.params.id });
    if (!tournament) {
      return res.status(404).json({ success: false, error: 'Tournament not found' });
    }
    res.json({ success: true, data: tournament });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/tournaments
export const createTournament = async (req, res) => {
  try {
    const data = req.body;
    let id = data.id || `trn-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const existing = await Tournament.findOne({ id });
    if (existing) {
      id = `trn-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    }
    
    if (!data.name || !data.sport) {
      return res.status(400).json({ success: false, error: 'Tournament name and sport discipline are required.' });
    }

    // Ensure rules is an array
    let rules = data.rules;
    if (typeof rules === 'string') {
      rules = rules.split('\n').filter(r => r.trim());
    }

    const today = new Date().toISOString().split('T')[0];
    const newTournament = new Tournament({
      ...data,
      id,
      startDate: data.startDate || today,
      endDate: data.endDate || today,
      rules: rules || ['Standard rules apply.'],
      registeredCount: data.registeredCount || 0,
      status: data.status || 'Registration Open',
    });

    const saved = await newTournament.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT /api/tournaments/:id
export const updateTournament = async (req, res) => {
  try {
    const updated = await Tournament.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Tournament not found' });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// DELETE /api/tournaments/:id
export const deleteTournament = async (req, res) => {
  try {
    const deleted = await Tournament.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Tournament not found' });
    }

    // Cascade delete fixtures and registrations
    await Promise.all([
      Fixture.deleteMany({ tournamentId: req.params.id }),
      Registration.deleteMany({ tournamentId: req.params.id })
    ]);

    res.json({ success: true, message: 'Tournament and related records deleted', data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/stats - Aggregated metrics calculated strictly from actual MongoDB database collections
export const getAdminStats = async (req, res) => {
  try {
    const [totalTournaments, activeTournaments, totalParticipants, registrations, fixturesList] = await Promise.all([
      Tournament.countDocuments(),
      Tournament.countDocuments({ status: { $in: ['Registration Open', 'Upcoming'] } }),
      Registration.countDocuments(),
      Registration.find({}, 'amount fee'),
      Fixture.find({}, 'quarterFinals semiFinals final')
    ]);

    const totalRevenue = registrations.reduce((sum, reg) => {
      const num = typeof reg.amount === 'number' ? reg.amount : parseInt(String(reg.fee).replace(/[^0-9]/g, '')) || 0;
      return sum + num;
    }, 0);

    // Count real scheduled (upcoming) matches from Fixtures collection
    let upcomingMatchesCount = 0;
    fixturesList.forEach(fix => {
      ['quarterFinals', 'semiFinals', 'final'].forEach(stage => {
        (fix[stage] || []).forEach(m => {
          if (m.status !== 'Completed' && !m.status?.startsWith('Champion')) {
            upcomingMatchesCount++;
          }
        });
      });
    });

    res.json({
      success: true,
      data: {
        totalTournaments,
        activeTournaments,
        totalParticipants,
        totalRevenue,
        upcomingMatchesCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
