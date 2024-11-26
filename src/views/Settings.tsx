import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, LogOut } from 'lucide-react';

export const Settings: React.FC = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });
  
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 min-h-screen full-width ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <h1 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Paramètres</h1>

      {/* Section Thème */}
      <div className="mb-8">
        <h2 className={`font-semibold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Thème</h2>
        <div className="flex items-center space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={theme === 'light'}
              onChange={() => setTheme('light')}
              className="form-radio text-blue-600"
            />
            <span className={`ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Mode clair</span>
          </label>

          <label className="inline-flex items-center">
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={theme === 'dark'}
              onChange={() => setTheme('dark')}
              className="form-radio text-blue-600"
            />
            <span className={`ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Mode sombre</span>
          </label>
        </div>
      </div>

      {/* Section Déconnexion */}
      <div className="mt-8 border-t pt-6">
        <h2 className={`font-semibold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Session</h2>
        <button
          onClick={handleLogout}
          disabled={loading}
          className={`
            inline-flex items-center justify-center px-4 py-2 
            border border-transparent text-sm font-medium rounded-md 
            text-white bg-red-600 hover:bg-red-700 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 
            disabled:bg-red-400 transition-colors duration-200
            ${theme === 'dark' ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}
          `}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <LogOut className="w-5 h-5 mr-2" />
              Se déconnecter
            </>
          )}
        </button>
      </div>
      
    </div>
  );
};
