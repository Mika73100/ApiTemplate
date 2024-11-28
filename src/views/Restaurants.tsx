import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Loader2, Star, Plus } from 'lucide-react';
import { ErrorMessage } from '../components/ErrorMessage';
import { Form } from '../components/Form';
import { supabase } from '../Config/Supabase';
import { Restaurant } from '../types';


export const Restaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Charger les restaurants
  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setRestaurants(data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Failed to load restaurants');
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleDelete = async (restaurantId: number) => {
    setLoading(restaurantId);
    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', restaurantId);

      if (error) throw error;
      
      // Mettre à jour la liste localement
      setRestaurants(restaurants?.filter(restaurant => restaurant.id !== restaurantId) || null);
    } catch (error) {
      console.error('Failed to delete restaurant:', error);
    }
    setLoading(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      const { data: newRestaurant, error } = await supabase
        .from('restaurants')
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      // Ajouter le nouveau restaurant à la liste
      setRestaurants(restaurants ? [...restaurants, newRestaurant] : [newRestaurant]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add restaurant:', error);
      alert('Failed to add restaurant');
    }
  };

  if (error) return <ErrorMessage message={error} />;
  if (!restaurants) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="ml-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Restaurants</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {showForm ? 'Cancel' : (
            <>
              <Plus className="w-5 h-5" /> Restaurant
            </>
          )}
        </button>
      </div>

      <Form
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