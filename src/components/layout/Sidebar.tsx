import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, Users, User, Settings, HelpCircle, Heart } from 'lucide-react';
import { cn } from '../../utils/cn';

const navigation = [
  { name: 'Notes', to: '/app', icon: FileText },
  { name: 'Clients', to: '/app/clients', icon: Users },
  { name: 'Profile', to: '/app/profile', icon: User },
  { name: 'Help', to: '/app/help', icon: HelpCircle },
  { name: 'Donate', to: '/app/donate', icon: Heart },
  { name: 'Settings', to: '/app/settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar content */}
      <div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-200 ease-in-out",
          "lg:translate-x-0 border-r border-gray-200 dark:border-gray-700",
          "top-[64px] lg:top-0", // Account for header height
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="h-[calc(100vh-64px)] lg:h-full flex flex-col space-y-1 p-4 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.to === '/app'}
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors touch-target",
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
}