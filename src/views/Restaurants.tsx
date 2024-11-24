import React, { useState } from 'react';
import useSWR from 'swr';
import { Pencil, Trash2, Loader2, Star } from 'lucide-react';
import { ErrorMessage } from '../components/ErrorMessage';
import type { Restaurant } from '../types';
import { GenericForm } from '../components/Form';

// Simulated restaurant data since JSONPlaceholder doesn't have restaurants
const mockRestaurants: Restaurant[] = [
  { id: 1, name: "Le Petit Bistro", cuisine: "French", rating: 4.5, address: "123 Culinary Lane" },
  { id: 2, name: "Sushi Master", cuisine: "Japanese", rating: 4.8, address: "456 Foodie Street" },
  { id: 3, name: "La Pizzeria", cuisine: "Italian", rating: 4.3, address: "789 Gourmet Avenue" },
  { id: 4, name: "Taj Mahal", cuisine: "Indian", rating: 4.6, address: "321 Spice Road" },
  { id: 5, name: "Dragon Wok", cuisine: "Chinese", rating: 4.4, address: "654 Asian Boulevard" },
];

const fetcher = () => Promise.resolve(mockRestaurants);

export const Restaurants: React.FC = () => {
  const { data: restaurants, error, mutate } = useSWR<Restaurant[]>(
    'restaurants',
    fetcher
  );
  const [loading, setLoading] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (restaurantId: number) => {
    setLoading(restaurantId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Optimistically remove the restaurant from the list
      mutate(restaurants?.filter(restaurant => restaurant.id !== restaurantId), false);
    } catch (error) {
      console.error('Failed to delete restaurant:', error);
    }
    setLoading(null);
  };

  const handleSubmit = (data: any) => {
    console.log('New restaurant:', data);
    // Logique d'ajout du restaurant
    setShowForm(false);
  };

  if (error) return <ErrorMessage message="Failed to load restaurants" />;
  if (!restaurants) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Restaurants</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Restaurant'}
        </button>
      </div>

      <GenericForm
        type="restaurant"
        show={showForm}
        onSubmit={handleSubmit}
        onCancel={() => setShowForm(false)}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuisine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {restaurants.map(restaurant => (
                <tr key={restaurant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{restaurant.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {restaurant.cuisine}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-gray-500">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {restaurant.rating}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {restaurant.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={() => alert('Edit functionality would go here')}
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 transition-colors"
                        onClick={() => handleDelete(restaurant.id)}
                        disabled={loading === restaurant.id}
                      >
                        {loading === restaurant.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};