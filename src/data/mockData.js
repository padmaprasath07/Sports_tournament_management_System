// Mock data for SportPulse Sports Tournament Management System

export const SPORTS_CATEGORIES = [
  { id: 'football', name: 'Football', icon: 'Futbol', count: 18, color: 'from-blue-500 to-indigo-600', description: '11-a-side and 7-a-side tournaments' },
  { id: 'cricket', name: 'Cricket', icon: 'Trophy', count: 24, color: 'from-amber-500 to-orange-600', description: 'T20, T10, and leather ball cups' },
  { id: 'basketball', name: 'Basketball', icon: 'Dribbble', count: 14, color: 'from-orange-500 to-red-600', description: 'Full court and 3x3 street leagues' },
  { id: 'volleyball', name: 'Volleyball', icon: 'CircleDot', count: 9, color: 'from-emerald-500 to-teal-600', description: 'Indoor spike & beach volleyball' },
  { id: 'tennis', name: 'Tennis', icon: 'Target', count: 12, color: 'from-lime-500 to-emerald-600', description: 'Singles and doubles grand slams' },
  { id: 'badminton', name: 'Badminton', icon: 'Activity', count: 16, color: 'from-cyan-500 to-blue-600', description: 'Shuttle open tournaments' },
  { id: 'chess', name: 'Chess', icon: 'Crown', count: 8, color: 'from-purple-500 to-indigo-600', description: 'Rapid, Classical & Blitz FIDE rated' },
  { id: 'table-tennis', name: 'Table Tennis', icon: 'Zap', count: 11, color: 'from-rose-500 to-pink-600', description: 'Fast-paced ping pong cups' },
  { id: 'kabaddi', name: 'Kabaddi', icon: 'Flame', count: 7, color: 'from-red-500 to-rose-700', description: 'High intensity pro kabaddi clash' },
  { id: 'athletics', name: 'Athletics', icon: 'Medal', count: 10, color: 'from-yellow-500 to-amber-600', description: 'Track & field championship' }
];

export const INITIAL_TOURNAMENTS = [
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

export const MOCK_FIXTURES = {
  'trn-102': {
    quarterFinals: [
      { id: 'm1', team1: 'Thunder FC', score1: 3, team2: 'Strikers United', score2: 1, winner: 'Thunder FC', status: 'Completed' },
      { id: 'm2', team1: 'Vipers SC', score1: 2, team2: 'Phoenix Warriors', score2: 0, winner: 'Vipers SC', status: 'Completed' },
      { id: 'm3', team1: 'Spartans FC', score1: 1, team2: 'Titan Strikers', score2: 2, winner: 'Titan Strikers', status: 'Completed' },
      { id: 'm4', team1: 'Red Eagles', score1: 0, team2: 'Blue Panthers', score2: 2, winner: 'Blue Panthers', status: 'Completed' }
    ],
    semiFinals: [
      { id: 'm5', team1: 'Thunder FC', score1: 2, team2: 'Vipers SC', score2: 1, winner: 'Thunder FC', status: 'Completed' },
      { id: 'm6', team1: 'Titan Strikers', score1: 1, team2: 'Blue Panthers', score2: 3, winner: 'Blue Panthers', status: 'Completed' }
    ],
    final: [
      { id: 'm7', team1: 'Thunder FC', score1: 2, team2: 'Blue Panthers', score2: 1, winner: 'Thunder FC', status: 'Live', time: "78'" }
    ]
  }
};

export const MOCK_ROUND_ROBIN = [
  { rank: 1, team: 'Thunder FC', played: 5, won: 4, drawn: 1, lost: 0, gf: 12, ga: 3, points: 13 },
  { rank: 2, team: 'Blue Panthers', played: 5, won: 3, drawn: 2, lost: 0, gf: 9, ga: 4, points: 11 },
  { rank: 3, team: 'Titan Strikers', played: 5, won: 2, drawn: 1, lost: 2, gf: 7, ga: 7, points: 7 },
  { rank: 4, team: 'Vipers SC', played: 5, won: 1, drawn: 2, lost: 2, gf: 5, ga: 6, points: 5 },
  { rank: 5, team: 'Spartans FC', played: 5, won: 1, drawn: 0, lost: 4, gf: 4, ga: 10, points: 3 },
  { rank: 6, team: 'Strikers United', played: 5, won: 0, drawn: 2, lost: 3, gf: 2, ga: 9, points: 2 }
];

export const MOCK_LEADERBOARD = [
  { id: 1, rank: 1, name: 'Alex Mercer', team: 'Thunder FC', sport: 'Football', points: 1280, wins: 14, matches: 16, winRate: '87.5%', badge: 'Gold Champion' },
  { id: 2, rank: 2, name: 'Rohan Sharma', team: 'Mumbai Super Kings', sport: 'Cricket', points: 1190, wins: 12, matches: 15, winRate: '80.0%', badge: 'Silver MVP' },
  { id: 3, rank: 3, name: 'Sarah Jenkins', team: 'Hoop Pioneers', sport: 'Basketball', points: 1050, wins: 11, matches: 14, winRate: '78.5%', badge: 'Bronze Elite' },
  { id: 4, rank: 4, name: 'David Chen', team: 'Dragon Smashers', sport: 'Badminton', points: 940, wins: 10, matches: 13, winRate: '76.9%', badge: 'Pro contender' },
  { id: 5, rank: 5, name: 'Elena Rostova', team: 'Grandmasters Club', sport: 'Chess', points: 910, wins: 9, matches: 11, winRate: '81.8%', badge: 'Grandmaster' }
];

export const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'Registration Confirmed', message: 'You are successfully registered for National Premier League T20.', time: '10 minutes ago', unread: true, type: 'success' },
  { id: 'n2', title: 'Schedule Update', message: 'Champions Football Cup semi-final match time updated to 6:00 PM.', time: '2 hours ago', unread: true, type: 'warning' },
  { id: 'n3', title: 'Live Match Alert', message: 'Thunder FC vs Blue Panthers Final match is now LIVE!', time: '1 day ago', unread: false, type: 'info' },
  { id: 'n4', title: 'Payment Receipt', message: 'Payment of $1,500 processed successfully for Cricket T20 entry fee.', time: '2 days ago', unread: false, type: 'success' }
];

export const MOCK_PARTICIPANT_PROFILE = {
  name: 'Ashwin Kumar',
  email: 'ashwin.player@sportpulse.com',
  role: 'Participant',
  phone: '+91 98765 43210',
  location: 'Bangalore, Karnataka',
  preferredSports: ['Cricket', 'Football', 'Badminton'],
  bio: 'Passionate amateur cricketer and football winger. Played state-level tournaments and love competitive sports.',
  stats: {
    registeredTournaments: 3,
    upcomingMatches: 2,
    wins: 12,
    certificates: 3
  },
  registrations: [
    { id: 'reg-01', tournamentName: 'National Premier League T20 2026', sport: 'Cricket', date: '2026-08-20', fee: '$1,500', status: 'Approved', ticketCode: 'SP-CRK-9921' },
    { id: 'reg-02', tournamentName: 'Champions Football Cup 2026', sport: 'Football', date: '2026-08-01', fee: '$2,000', status: 'Active', ticketCode: 'SP-FTB-4410' },
    { id: 'reg-03', tournamentName: 'Metropolitan 3x3 Basketball', sport: 'Basketball', date: '2026-09-05', fee: '$800', status: 'Pending Approval', ticketCode: 'SP-BSK-7712' }
  ]
};

export const MOCK_ADMIN_STATS = {
  totalTournaments: 28,
  activeTournaments: 6,
  totalParticipants: 412,
  totalRevenue: 342500,
  upcomingMatchesCount: 14
};

export const MOCK_RECENT_PARTICIPANTS = [
  { id: 'p1', name: 'Vikramaditya Singh', email: 'vikram@gmail.com', tournament: 'National Premier League T20', team: 'Royal Chargers', date: '2026-08-04', paymentStatus: 'Paid', amount: 1500 },
  { id: 'p2', name: 'Ananya Deshmukh', email: 'ananya.d@gmail.com', tournament: 'State Badminton Singles', team: 'Individual', date: '2026-08-04', paymentStatus: 'Paid', amount: 600 },
  { id: 'p3', name: 'Rahul Nair', email: 'rahul.n@yahoo.com', tournament: 'Metropolitan 3x3 Basketball', team: 'Street Legends', date: '2026-08-03', paymentStatus: 'Pending', amount: 800 },
  { id: 'p4', name: 'Kevin Peterson', email: 'kevin.p@gmail.com', tournament: 'Champions Football Cup', team: 'Blue Panthers', date: '2026-08-02', paymentStatus: 'Paid', amount: 2000 }
];
