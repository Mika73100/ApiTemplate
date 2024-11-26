import React from 'react';
import { Users, Utensils, CheckSquare, ChevronDown, ChevronUp, ArrowUpDown, ArrowDownUp } from 'lucide-react';
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
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isRestaurantsOpen, setIsRestaurantsOpen] = useState(false);
  const [userSort, setUserSort] = useState<{ field: 'name' | 'email', ascending: boolean }>({ field: 'name', ascending: true });
  const [restaurantSort, setRestaurantSort] = useState<{ field: 'name' | 'rating', ascending: boolean }>({ field: 'rating', ascending: false });

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

      {/* Restaurants Accordion */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <button
          className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setIsRestaurantsOpen(!isRestaurantsOpen)}
        >
          <div className="flex items-center gap-3">
            <Utensils className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Restaurants List</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRestaurantSort(prev => ({ field: 'name', ascending: prev.field === 'name' ? !prev.ascending : true }));
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                ${restaurantSort.field === 'name' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Name
              {restaurantSort.field === 'name' && (
                restaurantSort.ascending ? <ArrowUpDown size={16} /> : <ArrowDownUp size={16} />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRestaurantSort(prev => ({ field: 'rating', ascending: prev.field === 'rating' ? !prev.ascending : true }));
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                ${restaurantSort.field === 'rating' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Rating
              {restaurantSort.field === 'rating' && (
                restaurantSort.ascending ? <ArrowUpDown size={16} /> : <ArrowDownUp size={16} />
              )}
            </button>
            <div className="bg-gray-100 p-1 rounded-full ml-2">
              {isRestaurantsOpen ? 
                <ChevronUp className="w-5 h-5 text-gray-600" /> : 
                <ChevronDown className="w-5 h-5 text-gray-600" />
              }
            </div>
          </div>
        </button>
        {isRestaurantsOpen && (
          <div className="divide-y divide-gray-200">
            {restaurants
              .sort((a, b) => {
                const modifier = restaurantSort.ascending ? 1 : -1;
                if (restaurantSort.field === 'rating') {
                  return (a.rating - b.rating) * modifier;
                }
                return a.name.localeCompare(b.name) * modifier;
              })
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
        )}
      </div>

      {/* Users Accordion */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <button
          className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setIsUsersOpen(!isUsersOpen)}
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Users List</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUserSort(prev => ({ field: 'name', ascending: prev.field === 'name' ? !prev.ascending : true }));
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                ${userSort.field === 'name' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Name
              {userSort.field === 'name' && (
                userSort.ascending ? <ArrowUpDown size={16} /> : <ArrowDownUp size={16} />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUserSort(prev => ({ field: 'email', ascending: prev.field === 'email' ? !prev.ascending : true }));
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                ${userSort.field === 'email' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Email
              {userSort.field === 'email' && (
                userSort.ascending ? <ArrowUpDown size={16} /> : <ArrowDownUp size={16} />
              )}
            </button>
            <div className="bg-gray-100 p-1 rounded-full ml-2">
              {isUsersOpen ? 
                <ChevronUp className="w-5 h-5 text-gray-600" /> : 
                <ChevronDown className="w-5 h-5 text-gray-600" />
              }
            </div>
          </div>
        </button>
        {isUsersOpen && (
          <div className="divide-y divide-gray-200">
            {users
              .sort((a, b) => {
                const modifier = userSort.ascending ? 1 : -1;
                if (userSort.field === 'email') {
                  return a.email.localeCompare(b.email) * modifier;
                }
                return a.name.localeCompare(b.name) * modifier;
              })
              .map(user => (
                <div key={user.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};