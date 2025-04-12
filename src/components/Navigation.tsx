import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ChefHat, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth';

export function Navigation() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 md:top-0 md:bottom-auto md:border-b md:border-t-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around md:justify-end md:gap-4 h-16">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
              }`
            }
          >
            <Home size={20} />
            <span className="hidden md:inline">Cardápio</span>
          </NavLink>

          <NavLink
            to="/kitchen"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
              }`
            }
          >
            <ChefHat size={20} />
            <span className="hidden md:inline">Cozinha</span>
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
              }`
            }
          >
            <Settings size={20} />
            <span className="hidden md:inline">Admin</span>
          </NavLink>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span className="hidden md:inline">Sair</span>
          </button>
        </div>
      </div>
    </nav>
  );
}