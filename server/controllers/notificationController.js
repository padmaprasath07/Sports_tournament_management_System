import { Notification } from '../models/Notification.js';

// GET /api/notifications - Get individual notifications for the requesting user/account
export const getNotifications = async (req, res) => {
  try {
    const { email, role } = req.query;
    let filter = {};

    if (email && email !== 'guest') {
      const normalizedEmail = email.toLowerCase().trim();
      const userRole = role === 'admin' ? 'admin' : 'participant';
      
      if (userRole === 'admin') {
        filter = {
          $or: [
            { userEmail: normalizedEmail },
            { userEmail: 'admin@sportpulse.com' },
            { $and: [{ userEmail: 'all' }, { role: { $in: ['all', 'admin'] } }] },
            { $and: [{ userEmail: { $exists: false } }, { role: { $in: ['all', 'admin'] } }] },
          ],
        };
      } else {
        filter = {
          $or: [
            { userEmail: normalizedEmail },
            { $and: [{ userEmail: 'all' }, { role: { $in: ['all', 'participant'] } }] },
            { $and: [{ userEmail: { $exists: false } }, { role: { $in: ['all', 'participant'] } }] },
          ],
        };
      }
    } else if (role === 'admin') {
      filter = {
        $or: [
          { role: 'admin' },
          { userEmail: 'admin@sportpulse.com' },
          { $and: [{ userEmail: 'all' }, { role: { $in: ['all', 'admin'] } }] },
        ],
      };
    } else {
      // Guest or public explorer - only general broadcasts
      filter = {
        $or: [
          { $and: [{ userEmail: 'all' }, { role: { $in: ['all', 'guest'] } }] },
          { $and: [{ userEmail: { $exists: false } }, { role: { $in: ['all', 'guest'] } }] },
        ],
      };
    }

    const notifications = await Notification.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/notifications - Create account-specific notification
export const createNotification = async (req, res) => {
  try {
    const { title, message, userEmail, role, type, time } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, error: 'Title and message are required' });
    }

    const newNotif = new Notification({
      id: req.body.id || `notif-${Date.now().toString().slice(-5)}`,
      userEmail: userEmail ? userEmail.toLowerCase().trim() : 'all',
      role: role || 'all',
      title,
      message,
      type: type || 'info',
      time: time || 'Just now',
      unread: true,
    });

    const saved = await newNotif.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/notifications/:id/read - Mark individual notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { id: req.params.id },
      { $set: { unread: false } },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/notifications/:id - Delete individual notification
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
