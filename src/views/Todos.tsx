import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { restaurantApi } from '../contexts/api';
import type { Restaurant } from '../types';

export const Todos: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await restaurantApi.getAll();
        setRestaurants(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading restaurants');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Composant pour le loader
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );


  // Composant pour la liste des restaurants
  const RestaurantList = ({ restaurants }: { restaurants: Restaurant[] }) => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Restaurants</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        {restaurants.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucun restaurant trouvé</p>
        ) : (
          <ul className="space-y-4">
            {restaurants.map((restaurant) => (
              <li 
                key={restaurant.id} 
                className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                  <p className="text-gray-600">{restaurant.cuisine}</p>
                </div>

                <div className="flex items-center gap-3 justify-center">
                  <span className="text-gray-500 text-sm text-center">
                    {restaurant.address}
                  </span>
                  <span className="text-yellow-500 flex items-center">
                    {restaurant.rating}
                  </span>
                  <span className="text-yellow-500 mr-1">★</span>
                </div>
                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    console.error('Error:', error);
  }

  return <RestaurantList restaurants={restaurants} />;
};
