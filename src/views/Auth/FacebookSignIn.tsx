import React from 'react';
import { supabase } from '../../Config/Supabase';

export const FacebookSignIn: React.FC = () => {
  const handleFacebookSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Erreur de connexion Facebook:', error);
    }
  };

  return (
    <button
      onClick={handleFacebookSignIn}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <img 
        src="https://www.facebook.com/favicon.ico" 
        alt="Facebook" 
        className="w-5 h-5"
      />
      Continuer avec Facebook
    </button>
  );
}; 