import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';

// POST /api/users/register - Register a new athlete or admin account in MongoDB
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, preferredSports, bio, location } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Email address is required' });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({ success: false, error: 'Password must be at least 4 characters long' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: `An account with email "${normalizedEmail}" already exists. Please log in instead.` 
      });
    }

    const userId = `usr-${Date.now().toString().slice(-5)}`;
    const userRole = role === 'admin' ? 'admin' : 'participant';

    const newUser = new User({
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      password: password, // In production hash with bcrypt
      role: userRole,
      phone: phone || '',
      preferredSports: Array.isArray(preferredSports) && preferredSports.length > 0 ? preferredSports : ['Football', 'Cricket'],
      location: location || 'Campus Sports Arena',
      bio: bio || (userRole === 'admin' ? 'Sports Tournament Director & Event Organizer.' : 'Passionate athlete and tournament competitor.'),
      stats: {
        registeredTournaments: 0,
        upcomingMatches: 0,
        wins: 0,
        certificates: 0,
      },
    });

    const savedUser = await newUser.save();

    // Return safe user object (omit password)
    const userObj = savedUser.toObject();
    delete userObj.password;

    // Create personalized welcome notification for the newly registered user in MongoDB
    try {
      const welcomeNotif = new Notification({
        id: `notif-${Date.now().toString().slice(-4)}`,
        userEmail: userObj.email,
        role: userObj.role,
        title: `Welcome to SportPulse, ${userObj.name}!`,
        message: userObj.role === 'admin' 
          ? 'Your administrator console is active. You can create tournaments, seed fixtures, and review participants.'
          : 'Your athlete account is activated! Browse open tournaments and register your team.',
        time: 'Just now',
        unread: true,
        type: 'success',
      });
      await welcomeNotif.save();
    } catch {}

    res.status(201).json({
      success: true,
      message: `Account created successfully! Welcome, ${userObj.name}.`,
      data: userObj,
    });
  } catch (error) {
    console.error('[User Registration Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/users/login - Sign into SportPulse
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    // Fallback for default demo accounts if not yet in database
    if (!user) {
      if (normalizedEmail === 'admin@sportpulse.com') {
        user = new User({
          id: 'usr-admin',
          name: 'Admin Director',
          email: 'admin@sportpulse.com',
          password: 'password123',
          role: 'admin',
          location: 'Athletic Department HQ',
          bio: 'Campus Sports Administrator & Tournament Organizer.',
        });
        await user.save();
      } else if (normalizedEmail === 'ashwin.player@sportpulse.com') {
        user = new User({
          id: 'usr-ashwin',
          name: 'Ashwin Kumar',
          email: 'ashwin.player@sportpulse.com',
          password: 'password123',
          role: 'participant',
          phone: '+91 98765 43210',
          preferredSports: ['Cricket', 'Football', 'Badminton'],
          location: 'Bangalore, Karnataka',
          bio: 'Passionate amateur cricketer and football winger. Played state-level tournaments.',
          stats: { registeredTournaments: 3, upcomingMatches: 2, wins: 12, certificates: 3 },
        });
        await user.save();
      } else {
        return res.status(401).json({ success: false, error: 'No account found with this email address' });
      }
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, error: 'Incorrect password. Please verify your credentials.' });
    }

    if (role === 'admin' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied: This account does not possess Tournament Administrator privileges.'
      });
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      data: userObj,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/users - Get all registered users
export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/users/:emailOrId - Get profile by email, custom id, or ObjectId
export const getUserProfile = async (req, res) => {
  try {
    const { emailOrId } = req.params;
    const cleanId = (emailOrId || '').trim();
    const isObjectId = mongoose.Types.ObjectId.isValid(cleanId);

    const user = await User.findOne({
      $or: [
        { id: cleanId },
        ...(isObjectId ? [{ _id: cleanId }] : []),
        { email: cleanId.toLowerCase() },
      ],
    }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/users/:id - Update user profile by custom id, ObjectId, or email
export const updateUserProfile = async (req, res) => {
  try {
    const identifier = (req.params.id || '').trim();
    const { name, email, phone, preferredSports, location, bio, stats, role } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) updates.email = email.toLowerCase().trim();
    if (phone !== undefined) updates.phone = phone;
    if (preferredSports) updates.preferredSports = preferredSports;
    if (location !== undefined) updates.location = location;
    if (bio !== undefined) updates.bio = bio;
    if (stats) updates.stats = stats;
    if (role) updates.role = role;

    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    const searchConditions = [
      { id: identifier },
      ...(isObjectId ? [{ _id: identifier }] : []),
      { email: { $regex: new RegExp(`^${identifier}$`, 'i') } }
    ];

    if (req.body.id) {
      searchConditions.push({ id: req.body.id });
    }
    if (req.body.email) {
      searchConditions.push({ email: { $regex: new RegExp(`^${req.body.email.trim()}$`, 'i') } });
    }

    const updatedUser = await User.findOneAndUpdate(
      { $or: searchConditions },
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User not found in database' });
    }

    res.json({ 
      success: true, 
      message: 'Profile updated successfully in MongoDB', 
      data: updatedUser 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
