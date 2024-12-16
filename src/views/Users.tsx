import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Loader2, Plus } from 'lucide-react';
import { ErrorMessage } from '../components/ErrorMessage';
import type { User } from '../types';
import { Form } from '../components/Form';
import { supabase } from '../Config/Supabase';
import { Toast, ToastType } from '../components/Toast';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<ToastType>('success');

  // Charger les utilisateurs
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: number) => {
    setLoading(userId);
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Mettre à jour la liste localement
      setUsers(users?.filter(user => user.id !== userId) || null);
      setToastMessage('Utilisateur supprimé avec succès');
      setToastType('success');
    } catch (error) {
      console.error('Failed to delete user:', error);
      setToastMessage('Erreur lors de la suppression de l\'utilisateur');
      setToastType('error');
    }
    setLoading(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      // Insérer dans la base de données
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour l'état local
      setUsers(users ? [...users, newUser] : [newUser]);
      setShowForm(false);
      setToastMessage('Utilisateur ajouté avec succès');
      setToastType('success');
    } catch (error) {
      console.error('Failed to add user:', error);
      setToastMessage('Erreur lors de l\'ajout de l\'utilisateur');
      setToastType('error');
    }
  };

  if (error) return <ErrorMessage message={error} />;
  if (!users) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="ml-10 space-y-6">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {showForm ? 'Cancel' : (
            <>
              <Plus className="w-5 h-5" /> User
            </>
          )}
        </button>
      </div>

      <Form
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
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
                    {user.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {user.address || '-'}
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