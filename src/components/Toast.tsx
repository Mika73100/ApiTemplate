import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Disparaît après 5 secondes

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const backgrounds = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={`fixed bottom-5 right-5 flex items-center p-4 rounded-lg border ${backgrounds[type]} shadow-lg animate-slide-up`}>
      {icons[type]}
      <span className="mx-3 text-gray-800">{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
}; 