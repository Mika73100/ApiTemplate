import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Login } from './views/Auth/Login';
import { Sidebar } from './components/Sidebar';
import { Overview } from './views/Overview';
import { Users } from './views/Users';
import { Restaurants } from './views/Restaurants';
import { Todos } from './views/Todos';
import { Settings } from './views/Settings';
import { Register } from './views/Auth/Register';

function App() {
  const [activeView, setActiveView] = useState('overview');
  const [showLogin, setShowLogin] = useState(true);
  const { isAuthenticated } = useAuth();

  // Si non authentifié, afficher soit login soit register
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-10 flex items-center justify-center">
        <div className="w-full max-w-md">
          {showLogin ? (
            <Login onSwitchToRegister={() => setShowLogin(false)} />
          ) : (
            <Register onSwitchToLogin={() => setShowLogin(true)} />
          )}
        </div>
      </div>
    );
  }

  // Si authentifié, afficher l'interface principale
  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="pl-64 p-8">
        {activeView === 'overview' && <Overview />}
        {activeView === 'users' && <Users />}
        {activeView === 'restaurants' && <Restaurants />}
        {activeView === 'todos' && <Todos />}
        {activeView === 'settings' && <Settings />}
      </main>
    </div>
  );
}

export default App;