import React from 'react';
import { LayoutDashboard, Users, Utensils, CheckSquare, Settings } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-blue-50 text-blue-600' 
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">D</span>
        </div>
        <span className="font-bold text-xl">Dashboard</span>
      </div>
      
      <nav className="mt-8 space-y-1">
        <NavItem
          icon={<LayoutDashboard size={20} />}
          label="Overview"
          active={activeView === 'overview'}
          onClick={() => onViewChange('overview')}
        />
        <NavItem
          icon={<Users size={20} />}
          label="Users"
          active={activeView === 'users'}
          onClick={() => onViewChange('users')}
        />
        <NavItem
          icon={<Utensils size={20} />}
          label="Restaurants"
          active={activeView === 'restaurants'}
          onClick={() => onViewChange('restaurants')}
        />
        <NavItem
          icon={<CheckSquare size={20} />}
          label="Todos"
          active={activeView === 'todos'}
          onClick={() => onViewChange('todos')}
        />
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <NavItem
          icon={<Settings size={20} />}
          label="Settings"
          active={activeView === 'settings'}
          onClick={() => onViewChange('settings')}
        />
      </div>
    </div>
  );
};