import { Registration } from '../models/Registration.js';
import { Tournament } from '../models/Tournament.js';

// GET /api/registrations
export const getRegistrations = async (req, res) => {
  try {
    const { tournamentId, email, status } = req.query;
    const filter = {};

    if (tournamentId) filter.tournamentId = tournamentId;
    if (email) filter.email = email;
    if (status) filter.status = status;

    const registrations = await Registration.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/registrations
export const createRegistration = async (req, res) => {
  try {
    const { tournamentId, participantName, email, phone, team, sport } = req.body;

    const tournament = await Tournament.findOne({ id: tournamentId });
    if (!tournament) {
      return res.status(404).json({ success: false, error: 'Tournament not found' });
    }

    if (tournament.registeredCount >= tournament.maxParticipants) {
      return res.status(400).json({ success: false, error: 'Tournament registration is full' });
    }

    const regId = `reg-${Date.now().toString().slice(-4)}`;
    const sportPrefix = (tournament.sport || 'SPT').substring(0, 3).toUpperCase();
    const ticketCode = `SP-${sportPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRegistration = new Registration({
      id: regId,
      tournamentId,
      tournamentName: tournament.name,
      participantName: participantName || 'Student Athlete',
      email: email || 'athlete@campus.edu',
      phone: phone || '',
      team: team || 'Individual',
      sport: sport || tournament.sport,
      fee: `$${tournament.entryFee}`,
      amount: tournament.entryFee,
      status: 'Approved',
      paymentStatus: tournament.entryFee > 0 ? 'Paid' : 'Waived',
      ticketCode,
    });

    const saved = await newRegistration.save();

    // Increment registeredCount in Tournament document
    await Tournament.findOneAndUpdate(
      { id: tournamentId },
      { $inc: { registeredCount: 1 } }
    );

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT /api/registrations/:id/status
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const registration = await Registration.findOneAndUpdate(
      { id: req.params.id },
      { $set: { status } },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ success: false, error: 'Registration not found' });
    }

    res.json({ success: true, data: registration });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
