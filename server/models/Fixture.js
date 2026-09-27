import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    team1: { type: String, default: 'TBD' },
    score1: { type: Number, default: 0 },
    team2: { type: String, default: 'TBD' },
    score2: { type: Number, default: 0 },
    winner: { type: String, default: '' },
    status: {
      type: String,
      default: 'Scheduled',
      enum: ['Scheduled', 'Live', 'Completed'],
    },
    time: { type: String, default: '' },
    court: { type: String, default: '' },
  },
  { _id: false }
);

const fixtureSchema = new mongoose.Schema(
  {
    tournamentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    quarterFinals: {
      type: [matchSchema],
      default: [],
    },
    semiFinals: {
      type: [matchSchema],
      default: [],
    },
    final: {
      type: [matchSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Fixture = mongoose.model('Fixture', fixtureSchema);
