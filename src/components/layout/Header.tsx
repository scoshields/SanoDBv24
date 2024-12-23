import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ThemeToggle } from '../ThemeToggle';
import { LogOut, Menu, X } from 'lucide-react';
import type { Profile } from '../../types/profile';

interface HeaderProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export function Header({ isSidebarOpen, onSidebarToggle }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
      }
    }

    loadProfile();
  }, [user?.id]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow dark:bg-gray-800 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 relative">
          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={onSidebarToggle}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            )}
            <Link to="/" className="flex items-center space-x-2">
              <img src="/favicon.svg" alt="Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Sano{' '}
                <span className="hidden sm:inline">
                  <span className="mx-2 text-gray-400 dark:text-gray-600">|</span>
                  <span className="text-lg text-gray-500 dark:text-gray-400">Clinical Documentation Assistant</span>
                </span>
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4 relative">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {profile?.first_name ? `Hi, ${profile.first_name}` : user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/auth"
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?signup=true"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-blue-800"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}