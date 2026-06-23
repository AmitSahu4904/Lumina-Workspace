import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, User, LogOut, X } from 'lucide-react';
import { useAuthActions } from '../../features/auth/hooks/useAuthActions';
import ROUTES from '../../constants/routes';

interface SidebarProps {
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { logout, isLoggingOut } = useAuthActions();

  const navItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: 'Projects', path: ROUTES.PROJECTS, icon: FolderKanban },
    { name: 'Profile', path: ROUTES.PROFILE, icon: User },
  ];

  return (
    <div className="flex flex-col h-full p-6 text-slate-800 dark:text-zinc-100">
      {/* Header section with closing option on mobile */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
          Lumina Workspace
        </h2>
        <button 
          onClick={onClose}
          className="md:hidden p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-500 dark:text-zinc-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            end={item.path === ROUTES.DASHBOARD}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md'
                  : 'hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-600 dark:text-zinc-300'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout segment */}
      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
        <button
          onClick={() => {
            onClose();
            logout();
          }}
          disabled={isLoggingOut}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-50 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
