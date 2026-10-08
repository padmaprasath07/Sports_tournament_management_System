import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    tournamentId: {
      type: String,
      required: true,
      index: true,
    },
    tournamentName: {
      type: String,
      required: true,
    },
    participantName: {
      type: String,
      default: 'Student Athlete',
    },
    email: {
      type: String,
      default: 'athlete@campus.edu',
    },
    phone: {
      type: String,
      default: '',
    },
    team: {
      type: String,
      default: 'Individual',
    },
    sport: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    fee: {
      type: String,
      default: '₹0',
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'Approved',
      enum: ['Approved', 'Active', 'Pending Approval', 'Rejected', 'Waitlisted'],
      index: true,
    },
    paymentStatus: {
      type: String,
      default: 'Paid',
      enum: ['Paid', 'Pending', 'Waived', 'Refunded'],
    },
    ticketCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure fast checks on tournamentId + email
registrationSchema.index({ tournamentId: 1, email: 1 });

export const Registration = mongoose.model('Registration', registrationSchema);
