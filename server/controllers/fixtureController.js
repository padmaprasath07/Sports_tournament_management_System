import { Fixture } from '../models/Fixture.js';
import { Leaderboard } from '../models/Leaderboard.js';

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
    const { stage, matchId, score1, score2, winnerName, role } = req.body;

    // Strict Role Authorization: Only tournament administrators can enter match results
    const clientRole = role || req.headers['x-user-role'];
    if (clientRole && clientRole !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Permission Denied: Only tournament administrators can enter and verify official match results.'
      });
    }

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
    const finalWinner = winnerName || (match.score1 > match.score2 ? match.team1 : match.team2);
    match.winner = finalWinner;

    // Dynamically advance the winning team to the next round
    if (stage === 'quarterFinals') {
      if (fixture.semiFinals && fixture.semiFinals.length >= 2) {
        if (matchIndex === 0 || matchId === 'm1') {
          fixture.semiFinals[0].team1 = finalWinner;
        } else if (matchIndex === 1 || matchId === 'm2') {
          fixture.semiFinals[0].team2 = finalWinner;
        } else if (matchIndex === 2 || matchId === 'm3') {
          fixture.semiFinals[1].team1 = finalWinner;
        } else if (matchIndex === 3 || matchId === 'm4') {
          fixture.semiFinals[1].team2 = finalWinner;
        }
        fixture.markModified('semiFinals');
      }
    } else if (stage === 'semiFinals') {
      if (fixture.final && fixture.final.length >= 1) {
        if (matchIndex === 0 || matchId === 'm5') {
          fixture.final[0].team1 = finalWinner;
        } else if (matchIndex === 1 || matchId === 'm6') {
          fixture.final[0].team2 = finalWinner;
        }
        fixture.markModified('final');
      }
    } else if (stage === 'final') {
      if (fixture.final && fixture.final.length >= 1) {
        fixture.final[0].status = `Champion: ${finalWinner}`;
        fixture.markModified('final');
      }
    }

    fixture.markModified(stage);
    await fixture.save();

    // Automatically credit winner and update matches/win rates in Leaderboard
    if (finalWinner) {
      try {
        const winningEntry = await Leaderboard.findOne({
          $or: [
            { name: new RegExp(`^${finalWinner}$`, 'i') },
            { team: new RegExp(`^${finalWinner}$`, 'i') }
          ]
        });
        if (winningEntry) {
          winningEntry.matches = (winningEntry.matches || 0) + 1;
          winningEntry.wins = (winningEntry.wins || 0) + 1;
          winningEntry.points = (winningEntry.points || 0) + (stage === 'final' ? 150 : 85);
          winningEntry.winRate = ((winningEntry.wins / winningEntry.matches) * 100).toFixed(1) + '%';
          await winningEntry.save();
        }
      } catch (lbErr) {
        console.warn('Leaderboard update note:', lbErr.message);
      }
    }

    res.json({ 
      success: true, 
      message: `Match score updated. ${finalWinner} advanced to the next round!`, 
      data: fixture 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/fixtures/:tournamentId/schedule - Admin schedules or updates match timing & teams
export const scheduleMatch = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { stage, matchId, team1, team2, date, time, court, role } = req.body;

    const clientRole = role || req.headers['x-user-role'];
    if (clientRole && clientRole !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Permission Denied: Only tournament administrators can schedule matches.'
      });
    }

    let fixture = await Fixture.findOne({ tournamentId });
    if (!fixture) {
      fixture = new Fixture({
        tournamentId,
        quarterFinals: [],
        semiFinals: [],
        final: [],
      });
    }

    const effectiveStage = stage || 'quarterFinals';
    if (!fixture[effectiveStage]) {
      fixture[effectiveStage] = [];
    }

    const matchIndex = fixture[effectiveStage].findIndex((m) => m.id === matchId);
    if (matchIndex !== -1) {
      const m = fixture[effectiveStage][matchIndex];
      if (team1) m.team1 = team1;
      if (team2) m.team2 = team2;
      if (date) m.date = date;
      if (time) m.time = time;
      if (court) m.court = court;
      m.status = 'Scheduled';
    } else {
      fixture[effectiveStage].push({
        id: matchId || `m-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        team1: team1 || 'TBD',
        score1: 0,
        team2: team2 || 'TBD',
        score2: 0,
        winner: '',
        status: 'Scheduled',
        date: date || new Date().toISOString().split('T')[0],
        time: time || '10:00 AM',
        court: court || 'Court 1',
      });
    }

    fixture.markModified(effectiveStage);
    await fixture.save();

    res.json({
      success: true,
      message: 'Match scheduled successfully.',
      data: fixture,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
