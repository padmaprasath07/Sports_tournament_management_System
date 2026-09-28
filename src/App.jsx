import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

// Public Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

// Participant Pages
import { ParticipantDashboard } from './pages/participant/ParticipantDashboard';
import { BrowseTournaments } from './pages/participant/BrowseTournaments';
import { TournamentDetails } from './pages/participant/TournamentDetails';
import { MyRegistrations } from './pages/participant/MyRegistrations';
import { MatchSchedule } from './pages/participant/MatchSchedule';
import { Leaderboard } from './pages/participant/Leaderboard';
import { NotificationsPage } from './pages/participant/NotificationsPage';
import { UserProfile } from './pages/participant/UserProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CreateTournamentWizard } from './pages/admin/CreateTournamentWizard';
import { ManageTournaments } from './pages/admin/ManageTournaments';
import { RegisteredParticipants } from './pages/admin/RegisteredParticipants';
import { FixtureManagement } from './pages/admin/FixtureManagement';
import { LiveScoreConsole } from './pages/admin/LiveScoreConsole';
import { ReportsAnalytics } from './pages/admin/ReportsAnalytics';
import { AdminProfile } from './pages/admin/AdminProfile';

const ViewRouter = () => {
  const { currentView } = useApp();

  switch (currentView) {
    case 'home':
      return <Home />;
    case 'login':
      return <Login />;
    case 'register':
      return <Register />;
    case 'about':
      return <About />;
    case 'contact':
      return <Contact />;

    // Participant Module
    case 'participant-dashboard':
      return <ParticipantDashboard />;
    case 'browse-tournaments':
      return <BrowseTournaments />;
    case 'tournament-details':
      return <TournamentDetails />;
    case 'my-registrations':
      return <MyRegistrations />;
    case 'match-schedule':
      return <MatchSchedule />;
    case 'leaderboard':
      return <Leaderboard />;
    case 'notifications':
      return <NotificationsPage />;
    case 'participant-profile':
      return <UserProfile />;

    // Admin Module
    case 'admin-dashboard':
      return <AdminDashboard />;
    case 'create-tournament':
      return <CreateTournamentWizard />;
    case 'manage-tournaments':
      return <ManageTournaments />;
    case 'registered-participants':
      return <RegisteredParticipants />;
    case 'fixture-management':
      return <FixtureManagement />;
    case 'live-score':
      return <LiveScoreConsole />;
    case 'reports-analytics':
      return <ReportsAnalytics />;
    case 'admin-profile':
      return <AdminProfile />;

    default:
      return <Home />;
  }
};

const MainContent = () => {
  const { role, currentView } = useApp();
  const isAuthPage = currentView === 'login' || currentView === 'register';

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-surface text-main">
      <div className="flex flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6 gap-4">
        {/* Role Sidebar (Hidden for guest or during auth) */}
        {role !== 'guest' && !isAuthPage && <Sidebar />}

        {/* Main View Target */}
        <main className="flex-1 w-full min-w-0 pb-12 transition-all duration-300">
          <ViewRouter />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <Navbar />
      <MainContent />
      <ToastContainer />
    </AppProvider>
  );
}

export default App;
