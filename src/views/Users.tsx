import React, { useState } from 'react';
import useSWR from 'swr';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { ErrorMessage } from '../components/ErrorMessage';
import type { User } from '../types';
import { GenericForm } from '../components/Form';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const Users: React.FC = () => {
  const { data: users, error, mutate } = useSWR<User[]>(
    'https://jsonplaceholder.typicode.com/users',
    fetcher
  );
  const [loading, setLoading] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (userId: number) => {
    setLoading(userId);
    try {
      await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
        method: 'DELETE',
      });
      // Optimistically remove the user from the list
      mutate(users?.filter(user => user.id !== userId), false);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
    setLoading(null);
  };

  const handleSubmit = (data: any) => {
    console.log('New user:', data);
    // Logique d'ajout de l'utilisateur
    setShowForm(false);
  };

  if (error) return <ErrorMessage message="Failed to load users" />;
  if (!users) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="ml-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      <GenericForm
        type="user"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {user.company.name}
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
                        onClick={() => handleDelete(user.id)}
                        disabled={loading === user.id}
                      >
                        {loading === user.id ? (
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