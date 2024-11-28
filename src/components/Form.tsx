import React, { useState } from 'react';
import { UserIcon, StoreIcon } from 'lucide-react';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel';
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

interface Form {
  title: string | React.ReactNode;
  fields: Field[];
}

const form: { [key: string]: Form } = {
  restaurant: {
    title: (
      <div className="flex items-center gap-2">
        <StoreIcon className="w-6 h-6" />
        <span>Restaurant</span>
      </div>
    ),
    fields: [
      { name: 'name', label: 'Restaurant Name', type: 'text', required: true },
      { name: 'cuisine', label: 'Cuisine Type', type: 'text', required: true },
      { name: 'rating', label: 'Rating', type: 'number', required: true, min: 0, max: 5, step: 0.1 },
      { name: 'address', label: 'Address', type: 'text', required: true },
    ]
  },
  user: {
    title: (
      <div className="flex items-center gap-2">
        <UserIcon className="w-6 h-6" />
        <span>User</span>
      </div>
    ),
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'tel' },
      { name: 'address', label: 'Address', type: 'text' },
    ]
  }
};

interface FormProps {
  type: 'restaurant' | 'user';
  onSubmit: (data: any) => void;
  onCancel: () => void;
  show: boolean;
}

export const Form: React.FC<FormProps> = ({ type, onSubmit, onCancel, show }) => {
  const config = form[type];
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSubmit(formData);
      setFormData({});
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      alert('Une erreur est survenue lors de l\'ajout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {config.title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(
                  field.name,
                  field.type === 'number' ? parseFloat(e.target.value) : e.target.value
                )}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 
                         focus:ring-blue-500"
                required={field.required}
                min={field.min}
                max={field.max}
                step={field.step}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 
                     dark:bg-gray-700 rounded-lg hover:bg-gray-200 
                     dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
};