import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userEmail: {
      type: String,
      default: 'all',
      index: true,
      lowercase: true,
      trim: true,
    },
    userId: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: 'all',
      enum: ['all', 'participant', 'admin', 'guest'],
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      default: 'Just now',
    },
    unread: {
      type: Boolean,
      default: true,
      index: true,
    },
    type: {
      type: String,
      default: 'info',
      enum: ['info', 'success', 'warning', 'error'],
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model('Notification', notificationSchema);
