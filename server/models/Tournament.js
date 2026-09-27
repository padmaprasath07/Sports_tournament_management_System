import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Tournament name is required'],
      trim: true,
    },
    sport: {
      type: String,
      required: [true, 'Sport discipline is required'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      default: 'general',
      index: true,
    },
    format: {
      type: String,
      default: 'Knockout',
      enum: ['Knockout', 'Round Robin', 'Swiss', 'League'],
    },
    type: {
      type: String,
      default: 'Team',
      enum: ['Team', 'Individual'],
    },
    status: {
      type: String,
      default: 'Registration Open',
      enum: ['Upcoming', 'Live', 'Registration Open', 'Completed', 'Draft'],
      index: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    registrationDeadline: {
      type: String,
      default: '',
    },
    venue: {
      type: String,
      default: 'Campus Sports Arena',
    },
    organizer: {
      type: String,
      default: 'Athletics Committee',
    },
    entryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    prizePool: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxParticipants: {
      type: Number,
      default: 16,
      min: 2,
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80',
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    rules: {
      type: [String],
      default: ['Standard league regulations apply.'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for registration progress percentage
tournamentSchema.virtual('capacityPercentage').get(function () {
  if (!this.maxParticipants) return 0;
  return Math.min(100, Math.round((this.registeredCount / this.maxParticipants) * 100));
});

export const Tournament = mongoose.model('Tournament', tournamentSchema);
