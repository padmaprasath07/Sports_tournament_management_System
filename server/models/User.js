import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['participant', 'admin'],
      default: 'participant',
    },
    phone: {
      type: String,
      default: '',
    },
    preferredSports: {
      type: [String],
      default: ['Football', 'Cricket'],
    },
    location: {
      type: String,
      default: 'Campus Sports Arena',
    },
    bio: {
      type: String,
      default: 'Passionate student athlete and competitive tournament player.',
    },
    stats: {
      registeredTournaments: { type: Number, default: 0 },
      upcomingMatches: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      certificates: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);
