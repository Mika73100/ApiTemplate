import React from 'react';
import { Users, Utensils, CheckSquare } from 'lucide-react';
import { DataCard } from '../components/DataCard';
import { ErrorMessage } from '../components/ErrorMessage';
import { supabase } from '../Config/Supabase';
import type { User, Restaurant } from '../types';
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

export const Overview: React.FC = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les utilisateurs
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*');
        
        if (usersError) {
          console.error('Users error:', usersError);
          throw usersError;
        }
        setUsers(usersData);

        // Récupérer les restaurants
        const { data: restaurantsData, error: restaurantsError } = await supabase
          .from('restaurants')
          .select('*')
          .order('rating', { ascending: false });
        
        if (restaurantsError) {
          console.error('Restaurants error:', restaurantsError);
          throw restaurantsError;
        }
        setRestaurants(restaurantsData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load dashboard data');
      }
    };

    fetchData();
  }, []);

  // Ajout d'un état de chargement
  if (!users || !restaurants) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="ml-10 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DataCard
          title="Total Users"
          value={users?.length || 0}
          icon={<Users size={24} />}
          loading={!users}
        />
        <DataCard
          title="Total Restaurants"
          value={restaurants?.length || 0}
          icon={<Utensils size={24} />}
          loading={!restaurants}
        />
        <DataCard
          title="Active Restaurants"
          value={restaurants?.filter(r => r.rating >= 4).length || 0}
          icon={<CheckSquare size={24} />}
          loading={!restaurants}
        />
      </div>

      {restaurants && restaurants.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Top Rated Restaurants</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {restaurants
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 5)
              .map(restaurant => (
                <div key={restaurant.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{restaurant.name}</p>
                      <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
                    </div>
                    <div className="flex items-center text-yellow-400">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        {restaurant.rating}
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};