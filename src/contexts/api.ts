import type { Restaurant } from '../types';

// Utiliser l'URL de Supabase au lieu du localhost
const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL;


export const restaurantApi = {
  

  //Get all restaurants
  getAll: async (): Promise<Restaurant[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rest/v1/restaurants`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
      }
      console.error('API Error:', error);
      throw new Error('Impossible de récupérer les restaurants');
    }
  },

  //Get a restaurant by id
  getById: async (id: number): Promise<Restaurant> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rest/v1/restaurants?id=eq.${id}`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Restaurant non trouvé');
    }
  },

  //Create a restaurant
  create: async (restaurant: Omit<Restaurant, 'id'>): Promise<Restaurant> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rest/v1/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(restaurant),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Impossible de créer le restaurant');
    }
  },

  //Update a restaurant
  update: async (id: number, restaurant: Partial<Restaurant>): Promise<Restaurant> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rest/v1/restaurants?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(restaurant),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Impossible de mettre à jour le restaurant');
    }
  },

  //Delete a restaurant
  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rest/v1/restaurants?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Impossible de supprimer le restaurant');
    }
  },

  // Ajoutez cette route de test
  test: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rest/v1/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Impossible de tester le serveur');
    }
  },

  // Ajoutez une méthode pour vérifier la connexion
  checkConnection: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rest/v1/health?select=status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Impossible de vérifier la connexion');
    }
  }
}; 