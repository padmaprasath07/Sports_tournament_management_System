import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema(
  {
    rank: {
      type: Number,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    team: {
      type: String,
      default: 'Independent',
    },
    sport: {
      type: String,
      required: true,
      index: true,
    },
    points: {
      type: Number,
      default: 0,
      index: true,
    },
    wins: {
      type: Number,
      default: 0,
    },
    matches: {
      type: Number,
      default: 0,
    },
    winRate: {
      type: String,
      default: '0%',
    },
    badge: {
      type: String,
      default: 'Contender',
    },
  },
  {
    timestamps: true,
  }
);

export const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
