import React from 'react';
import { Loader2 } from 'lucide-react';

interface DataCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading?: boolean;
}

export const DataCard: React.FC<DataCardProps> = ({ 
  title, 
  value, 
  icon,
  loading = false 
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin mt-1" />
          ) : (
            <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          )}
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
};