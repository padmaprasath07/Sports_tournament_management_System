import mongoose from 'mongoose';
import { Registration } from '../models/Registration.js';
import { Tournament } from '../models/Tournament.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';

// GET /api/registrations
export const getRegistrations = async (req, res) => {
  try {
    const { tournamentId, email, status } = req.query;
    const filter = {};

    if (tournamentId) filter.tournamentId = tournamentId;
    if (email) filter.email = { $regex: new RegExp(`^${email.trim()}$`, 'i') };
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
    const { 
      tournamentId, 
      participantName, 
      email, 
      phone, 
      team, 
      sport,
      fee,
      amount,
      paymentStatus,
      date 
    } = req.body;

    let tournament = null;
    if (tournamentId) {
      const isObjectId = mongoose.Types.ObjectId.isValid(tournamentId);
      tournament = await Tournament.findOne({
        $or: [
          { id: tournamentId },
          ...(isObjectId ? [{ _id: tournamentId }] : []),
          { name: tournamentId },
        ],
      });
    }
    if (!tournament && (req.body.tournamentName || req.body.tournament)) {
      const title = req.body.tournamentName || req.body.tournament;
      tournament = await Tournament.findOne({ name: title });
    }

    if (tournament && tournament.registeredCount >= tournament.maxParticipants) {
      tournament.maxParticipants = tournament.registeredCount + 8;
      await Tournament.updateOne({ _id: tournament._id }, { $set: { maxParticipants: tournament.maxParticipants } });
    }

    const regId = req.body.id || `reg-${Date.now().toString().slice(-4)}`;
    const effectiveTournamentName = tournament ? tournament.name : (req.body.tournamentName || req.body.tournament || 'Campus Sports Championship');
    const effectiveSport = sport || (tournament ? tournament.sport : 'Sports');
    const sportPrefix = effectiveSport.substring(0, 3).toUpperCase();
    const ticketCode = req.body.ticketCode || `SP-${sportPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const effectiveFee = fee || (tournament ? `$${tournament.entryFee}` : '$0');
    const effectiveAmount = typeof amount === 'number' ? amount : (tournament ? tournament.entryFee : 0);
    const effectivePaymentStatus = paymentStatus || (effectiveAmount > 0 ? 'Paid' : 'Waived');

    const newRegistration = new Registration({
      id: regId,
      tournamentId: tournament ? tournament.id : (tournamentId || 'trn-101'),
      tournamentName: effectiveTournamentName,
      participantName: participantName || 'Student Athlete',
      email: (email || 'athlete@campus.edu').toLowerCase().trim(),
      phone: phone || '',
      team: team || 'Individual',
      sport: effectiveSport,
      date: date || (tournament ? tournament.startDate : new Date().toISOString().split('T')[0]),
      fee: effectiveFee,
      amount: effectiveAmount,
      status: 'Approved',
      paymentStatus: effectivePaymentStatus,
      ticketCode,
    });

    const saved = await newRegistration.save();

    // Increment registeredCount in Tournament document if matched
    if (tournament) {
      await Tournament.updateOne(
        { _id: tournament._id },
        { $inc: { registeredCount: 1 } }
      );
    }

    // If user exists with this email, increment their registeredTournaments stat
    if (email) {
      await User.findOneAndUpdate(
        { email: email.toLowerCase().trim() },
        { $inc: { 'stats.registeredTournaments': 1 } }
      ).catch(() => {});
    }

    // Create individual confirmation notification for the participant in MongoDB
    try {
      const notif = new Notification({
        id: `notif-${Date.now().toString().slice(-4)}`,
        userEmail: email ? email.toLowerCase().trim() : 'all',
        role: 'participant',
        title: 'Registration Confirmed',
        message: `Registered for "${tournament.name}" (${newRegistration.sport}). Entry Ticket: ${ticketCode}`,
        time: 'Just now',
        unread: true,
        type: 'success',
      });
      await notif.save();

      // Create notification for Tournament Admin
      const adminNotif = new Notification({
        id: `notif-adm-${Date.now().toString().slice(-4)}`,
        userEmail: 'admin@sportpulse.com',
        role: 'admin',
        title: 'New Participant Registration',
        message: `${newRegistration.participantName} enrolled in "${tournament.name}" (${newRegistration.team}).`,
        time: 'Just now',
        unread: true,
        type: 'info',
      });
      await adminNotif.save();
    } catch {
      // Ignored if notification creation fails
    }

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error('[Registration Error]', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// PUT /api/registrations/:id/status
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const registration = await Registration.findOneAndUpdate(
      { id: req.params.id },
      { $set: updates },
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
