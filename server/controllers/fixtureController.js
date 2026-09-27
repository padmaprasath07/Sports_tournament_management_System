import { Fixture } from '../models/Fixture.js';

// GET /api/fixtures
export const getAllFixtures = async (req, res) => {
  try {
    const fixturesList = await Fixture.find();
    // Convert array to object keyed by tournamentId matching frontend structure
    const fixturesMap = {};
    fixturesList.forEach((fix) => {
      fixturesMap[fix.tournamentId] = {
        quarterFinals: fix.quarterFinals,
        semiFinals: fix.semiFinals,
        final: fix.final,
      };
    });
    res.json({ success: true, data: fixturesMap });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/fixtures/:tournamentId
export const getFixturesByTournament = async (req, res) => {
  try {
    const fixture = await Fixture.findOne({ tournamentId: req.params.tournamentId });
    if (!fixture) {
      return res.status(404).json({ success: false, error: 'Fixtures not found for this tournament' });
    }
    res.json({ success: true, data: fixture });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/fixtures/:tournamentId/match
export const updateMatchScore = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { stage, matchId, score1, score2, winnerName } = req.body;

    let fixture = await Fixture.findOne({ tournamentId });
    if (!fixture) {
      return res.status(404).json({ success: false, error: 'Tournament fixture bracket not found' });
    }

    if (!fixture[stage]) {
      return res.status(400).json({ success: false, error: `Invalid stage: ${stage}` });
    }

    const matchIndex = fixture[stage].findIndex((m) => m.id === matchId);
    if (matchIndex === -1) {
      return res.status(404).json({ success: false, error: `Match ${matchId} not found in stage ${stage}` });
    }

    const match = fixture[stage][matchIndex];
    match.score1 = parseInt(score1);
    match.score2 = parseInt(score2);
    match.status = 'Completed';
    match.winner = winnerName || (match.score1 > match.score2 ? match.team1 : match.team2);

    fixture.markModified(stage);
    await fixture.save();

    res.json({ success: true, message: 'Match score updated in MongoDB', data: fixture });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
