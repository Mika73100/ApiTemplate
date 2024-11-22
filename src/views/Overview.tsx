import React from 'react';
import useSWR from 'swr';
import { Users, Utensils, CheckSquare } from 'lucide-react';
import { DataCard } from '../components/DataCard';
import { ErrorMessage } from '../components/ErrorMessage';
import type { User, Restaurant, Todo } from '../types';

const fetcher = (url: string) => fetch(url).then(res => res.json());
const mockRestaurants: Restaurant[] = [
  { id: 1, name: "Le Petit Bistro", cuisine: "French", rating: 4.5, address: "123 Culinary Lane" },
  { id: 2, name: "Sushi Master", cuisine: "Japanese", rating: 4.8, address: "456 Foodie Street" },
  { id: 3, name: "La Pizzeria", cuisine: "Italian", rating: 4.3, address: "789 Gourmet Avenue" },
  { id: 4, name: "Taj Mahal", cuisine: "Indian", rating: 4.6, address: "321 Spice Road" },
  { id: 5, name: "Dragon Wok", cuisine: "Chinese", rating: 4.4, address: "654 Asian Boulevard" },
];

export const Overview: React.FC = () => {
  const { data: users, error: usersError } = useSWR<User[]>(
    'https://jsonplaceholder.typicode.com/users',
    fetcher
  );
  
  const { data: restaurants } = useSWR<Restaurant[]>(
    'restaurants',
    () => Promise.resolve(mockRestaurants)
  );
  
  const { data: todos, error: todosError } = useSWR<Todo[]>(
    'https://jsonplaceholder.typicode.com/todos',
    fetcher
  );

  if (usersError || todosError) {
    return <ErrorMessage message="Failed to load dashboard data" />;
  }

  const completedTodos = todos?.filter(todo => todo.completed).length || 0;

  return (
    <div className="space-y-6">
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
          title="Completed Todos"
          value={completedTodos}
          icon={<CheckSquare size={24} />}
          loading={!todos}
        />
      </div>

      {restaurants && (
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
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{restaurant.rating}</span>
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