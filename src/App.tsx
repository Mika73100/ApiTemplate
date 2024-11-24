import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Overview } from './views/Overview';
import { Users } from './views/Users';
import { Restaurants } from './views/Restaurants';
import { Settings } from './views/Settings';

function App() {
  const [activeView, setActiveView] = useState('overview');

  return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        
        <main className="pl-64 p-8">
          {activeView === 'overview' && <Overview />}
          {activeView === 'users' && <Users />}
          {activeView === 'restaurants' && <Restaurants />}
          {activeView === 'settings' && <Settings />}
        </main>
      </div>
  );
}

export default App;