import mongoose from 'mongoose';
import { Tournament } from '../models/Tournament.js';
import { Fixture } from '../models/Fixture.js';
import { Registration } from '../models/Registration.js';
import { Leaderboard } from '../models/Leaderboard.js';
import { Notification } from '../models/Notification.js';

export const SEED_TOURNAMENTS = [
  {
    id: 'trn-101',
    name: 'National Premier League T20 2026',
    sport: 'Cricket',
    category: 'cricket',
    format: 'Knockout',
    type: 'Team',
    status: 'Upcoming',
    startDate: '2026-08-20',
    endDate: '2026-08-28',
    registrationDeadline: '2026-08-15',
    venue: 'Metropolitan Stadium, City Center',
    organizer: 'State Sports Academy',
    entryFee: 1500,
    prizePool: 50000,
    maxParticipants: 16,
    registeredCount: 12,
    bannerImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    description: 'The flagship inter-state T20 cricket tournament bringing together top talent from across the region. White ball, colored apparel provided.',
    rules: [
      'Official ICC T20 playing conditions apply.',
      'Team roster limit: maximum 15 players.',
      'All players must wear team jerseys with numbers.',
      'Umpire decisions are final and binding.'
    ]
  },
  {
    id: 'trn-102',
    name: 'Champions Football Cup 2026',
    sport: 'Football',
    category: 'football',
    format: 'Knockout',
    type: 'Team',
    status: 'Live',
    startDate: '2026-08-01',
    endDate: '2026-08-10',
    registrationDeadline: '2026-07-28',
    venue: 'Green Valley Arena',
    organizer: 'FC United Club',
    entryFee: 2000,
    prizePool: 75000,
    maxParticipants: 8,
    registeredCount: 8,
    bannerImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    description: 'High-octane 11-a-side knockout tournament. Full broadcast commentary and digital video replay available for knockout rounds.',
    rules: [
      'FIFA standard 90-minute matches (45 min halves).',
      'Maximum 5 substitutes allowed per match.',
      'Yellow/Red card disciplinary point accumulation rules enforced.'
    ]
  },
  {
    id: 'trn-103',
    name: 'Metropolitan 3x3 Basketball Showdown',
    sport: 'Basketball',
    category: 'basketball',
    format: 'Round Robin',
    type: 'Team',
    status: 'Registration Open',
    startDate: '2026-09-05',
    endDate: '2026-09-06',
    registrationDeadline: '2026-08-30',
    venue: 'Downtown Sports Hub',
    organizer: 'StreetHoops Federation',
    entryFee: 800,
    prizePool: 25000,
    maxParticipants: 16,
    registeredCount: 9,
    bannerImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    description: 'FIBA 3x3 rules apply. High energy street basketball competition with live DJ, dunk contest, and prizes.',
    rules: [
      'FIBA 3x3 official game ball & rules.',
      '10-minute game clock or first team to 21 points.',
      '12-second shot clock.'
    ]
  },
  {
    id: 'trn-104',
    name: 'Grandmasters Open Chess Championship',
    sport: 'Chess',
    category: 'chess',
    format: 'Swiss',
    type: 'Individual',
    status: 'Registration Open',
    startDate: '2026-09-12',
    endDate: '2026-09-14',
    registrationDeadline: '2026-09-08',
    venue: 'Royal Convention Center',
    organizer: 'Chess India Association',
    entryFee: 500,
    prizePool: 30000,
    maxParticipants: 64,
    registeredCount: 42,
    bannerImage: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    description: '7-round Swiss system tournament. FIDE rated event open to all classical chess enthusiasts.',
    rules: [
      'Time control: 90 minutes + 30 sec increment from move 1.',
      'FIDE Anti-Cheating protocols strictly enforced.'
    ]
  },
  {
    id: 'trn-105',
    name: 'State Badminton Singles Trophy',
    sport: 'Badminton',
    category: 'badminton',
    format: 'Knockout',
    type: 'Individual',
    status: 'Completed',
    startDate: '2026-07-15',
    endDate: '2026-07-18',
    registrationDeadline: '2026-07-10',
    venue: 'Indoor Sports Complex',
    organizer: 'Badminton Academy',
    entryFee: 600,
    prizePool: 20000,
    maxParticipants: 32,
    registeredCount: 32,
    bannerImage: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    description: 'Men & Women open singles championship featuring BWF standard feather shuttles.',
    rules: ['Best of 3 games of 21 points BWF scoring system.']
  }
];

export const SEED_FIXTURES = [
  {
    tournamentId: 'trn-102',
    quarterFinals: [
      { id: 'm1', team1: 'Thunder FC', score1: 3, team2: 'Strikers United', score2: 1, winner: 'Thunder FC', status: 'Completed', time: 'FT' },
      { id: 'm2', team1: 'Vipers SC', score1: 2, team2: 'Phoenix Warriors', score2: 0, winner: 'Vipers SC', status: 'Completed', time: 'FT' },
      { id: 'm3', team1: 'Spartans FC', score1: 1, team2: 'Titan Strikers', score2: 2, winner: 'Titan Strikers', status: 'Completed', time: 'FT' },
      { id: 'm4', team1: 'Red Eagles', score1: 0, team2: 'Blue Panthers', score2: 2, winner: 'Blue Panthers', status: 'Completed', time: 'FT' }
    ],
    semiFinals: [
      { id: 'm5', team1: 'Thunder FC', score1: 2, team2: 'Vipers SC', score2: 1, winner: 'Thunder FC', status: 'Completed', time: 'FT' },
      { id: 'm6', team1: 'Titan Strikers', score1: 1, team2: 'Blue Panthers', score2: 3, winner: 'Blue Panthers', status: 'Completed', time: 'FT' }
    ],
    final: [
      { id: 'm7', team1: 'Thunder FC', score1: 2, team2: 'Blue Panthers', score2: 1, winner: 'Thunder FC', status: 'Live', time: "78'" }
    ]
  }
];

export const SEED_REGISTRATIONS = [
  { id: 'reg-01', tournamentId: 'trn-101', tournamentName: 'National Premier League T20 2026', participantName: 'Ashwin Kumar', email: 'ashwin.player@sportpulse.com', team: 'Royal Chargers', sport: 'Cricket', date: '2026-08-20', fee: '$1,500', amount: 1500, status: 'Approved', paymentStatus: 'Paid', ticketCode: 'SP-CRK-9921' },
  { id: 'reg-02', tournamentId: 'trn-102', tournamentName: 'Champions Football Cup 2026', participantName: 'Kevin Peterson', email: 'kevin.p@gmail.com', team: 'Blue Panthers', sport: 'Football', date: '2026-08-01', fee: '$2,000', amount: 2000, status: 'Active', paymentStatus: 'Paid', ticketCode: 'SP-FTB-4410' },
  { id: 'reg-03', tournamentId: 'trn-103', tournamentName: 'Metropolitan 3x3 Basketball Showdown', participantName: 'Rahul Nair', email: 'rahul.n@yahoo.com', team: 'Street Legends', sport: 'Basketball', date: '2026-09-05', fee: '$800', amount: 800, status: 'Pending Approval', paymentStatus: 'Pending', ticketCode: 'SP-BSK-7712' },
  { id: 'reg-04', tournamentId: 'trn-105', tournamentName: 'State Badminton Singles Trophy', participantName: 'Ananya Deshmukh', email: 'ananya.d@gmail.com', team: 'Individual', sport: 'Badminton', date: '2026-07-15', fee: '$600', amount: 600, status: 'Approved', paymentStatus: 'Paid', ticketCode: 'SP-BDM-3321' }
];

export const SEED_LEADERBOARD = [
  { rank: 1, name: 'Alex Mercer', team: 'Thunder FC', sport: 'Football', points: 1280, wins: 14, matches: 16, winRate: '87.5%', badge: 'Gold Champion' },
  { rank: 2, name: 'Rohan Sharma', team: 'Mumbai Super Kings', sport: 'Cricket', points: 1190, wins: 12, matches: 15, winRate: '80.0%', badge: 'Silver MVP' },
  { rank: 3, name: 'Sarah Jenkins', team: 'Hoop Pioneers', sport: 'Basketball', points: 1050, wins: 11, matches: 14, winRate: '78.5%', badge: 'Bronze Elite' },
  { rank: 4, name: 'David Chen', team: 'Dragon Smashers', sport: 'Badminton', points: 940, wins: 10, matches: 13, winRate: '76.9%', badge: 'Pro contender' },
  { rank: 5, name: 'Elena Rostova', team: 'Grandmasters Club', sport: 'Chess', points: 910, wins: 9, matches: 11, winRate: '81.8%', badge: 'Grandmaster' }
];

export const SEED_NOTIFICATIONS = [
  { id: 'n1', title: 'Registration Confirmed', message: 'You are successfully registered for National Premier League T20.', time: '10 minutes ago', unread: true, type: 'success' },
  { id: 'n2', title: 'Schedule Update', message: 'Champions Football Cup semi-final match time updated to 6:00 PM.', time: '2 hours ago', unread: true, type: 'warning' },
  { id: 'n3', title: 'Live Match Alert', message: 'Thunder FC vs Blue Panthers Final match is now LIVE!', time: '1 day ago', unread: false, type: 'info' },
  { id: 'n4', title: 'Payment Receipt', message: 'Payment of $1,500 processed successfully for Cricket T20 entry fee.', time: '2 days ago', unread: false, type: 'success' }
];

export const seedDatabase = async (force = false) => {
  try {
    const tournamentCount = await Tournament.countDocuments();
    if (tournamentCount > 0 && !force) {
      console.log(`[Database Seed] Data already exists (${tournamentCount} tournaments). Skipping auto-seed.`);
      return { seeded: false, message: 'Database already populated' };
    }

    if (force) {
      console.log('[Database Seed] Clearing existing collections...');
      await Promise.all([
        Tournament.deleteMany({}),
        Fixture.deleteMany({}),
        Registration.deleteMany({}),
        Leaderboard.deleteMany({}),
        Notification.deleteMany({}),
      ]);
    }

    console.log('[Database Seed] Seeding initial tournament data to MongoDB...');
    await Tournament.insertMany(SEED_TOURNAMENTS);
    await Fixture.insertMany(SEED_FIXTURES);
    await Registration.insertMany(SEED_REGISTRATIONS);
    await Leaderboard.insertMany(SEED_LEADERBOARD);
    await Notification.insertMany(SEED_NOTIFICATIONS);

    console.log('[Database Seed] ✅ Database successfully seeded with sports tournaments, brackets & registrations!');
    return { seeded: true, count: SEED_TOURNAMENTS.length };
  } catch (error) {
    console.error('[Database Seed Error]', error);
    throw error;
  }
};

// Standalone execution: node seed/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  import('../config/db.js').then(async ({ connectDB }) => {
    import('dotenv').then(async (dotenv) => {
      dotenv.default.config();
      await connectDB();
      await seedDatabase(true);
      await mongoose.disconnect();
      console.log('[Database Seed] Disconnected. Process exit.');
      process.exit(0);
    });
  });
}
