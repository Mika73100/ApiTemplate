import React from 'react';
import { Users, Utensils, CheckSquare, Star, ArrowUpDown, ChevronDown } from 'lucide-react';
import { DataCard } from '../components/DataCard';
import { ErrorMessage } from '../components/ErrorMessage';
import { supabase } from '../Config/Supabase';
import type { User, Restaurant } from '../types';
import { useEffect, useState } from 'react';

export const Overview: React.FC = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: 'name' | 'rating';
    direction: 'asc' | 'desc';
  }>({ key: 'rating', direction: 'desc' });
  const [isUsersExpanded, setIsUsersExpanded] = useState(false);
  const [userSortConfig, setUserSortConfig] = useState<{
    key: 'email' | 'created_at';
    direction: 'asc' | 'desc';
  }>({ key: 'email', direction: 'asc' });
  

  const handleSort = (key: 'name' | 'rating') => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleUserSort = (key: 'email' | 'created_at') => {
    setUserSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

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
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-6 py-4 border-b border-gray-200"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">Top Rated Restaurants</h2>
              <ChevronDown 
                className={`w-5 h-5 transition-transform duration-200 ${
                  isExpanded ? 'transform rotate-180' : ''
                }`}
              />
            </div>
          </button>
          
          {isExpanded && (
            <>
              <div className="px-6 py-3 border-b border-gray-200">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleSort('name')}
                    className={`flex items-center gap-1 px-3 py-1 rounded ${
                      sortConfig.key === 'name' ? 'bg-gray-100' : ''
                    }`}
                  >
                    Name <ArrowUpDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSort('rating')}
                    className={`flex items-center gap-1 px-3 py-1 rounded ${
                      sortConfig.key === 'rating' ? 'bg-gray-100' : ''
                    }`}
                  >
                    Rating <ArrowUpDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {restaurants
                  .sort((a, b) => {
                    if (sortConfig.key === 'name') {
                      return sortConfig.direction === 'asc'
                        ? a.name.localeCompare(b.name)
                        : b.name.localeCompare(a.name);
                    } else {
                      return sortConfig.direction === 'asc'
                        ? a.rating - b.rating
                        : b.rating - a.rating;
                    }
                  })
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
            </>
          )}
        </div>
      )}

      {users && users.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button 
            onClick={() => setIsUsersExpanded(!isUsersExpanded)}
            className="w-full px-6 py-4 border-b border-gray-200"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">Registered Users</h2>
              <ChevronDown 
                className={`w-5 h-5 transition-transform duration-200 ${
                  isUsersExpanded ? 'transform rotate-180' : ''
                }`}
              />
            </div>
          </button>
          
          {isUsersExpanded && (
            <>
              <div className="px-6 py-3 border-b border-gray-200">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleUserSort('email')}
                    className={`flex items-center gap-1 px-3 py-1 rounded ${
                      userSortConfig.key === 'email' ? 'bg-gray-100' : ''
                    }`}
                  >
                    Email <ArrowUpDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleUserSort('created_at')}
                    className={`flex items-center gap-1 px-3 py-1 rounded ${
                      userSortConfig.key === 'created_at' ? 'bg-gray-100' : ''
                    }`}
                  >
                    Date <ArrowUpDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {users
                  .sort((a, b) => {
                    if (userSortConfig.key === 'email') {
                      return userSortConfig.direction === 'asc'
                        ? a.email.localeCompare(b.email)
                        : b.email.localeCompare(a.email);
                    } else {
                      return userSortConfig.direction === 'asc'
                        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    }
                  })
                  .slice(0, 5)
                  .map(user => (
                    <div key={user.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.address}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};