import React, { useEffect, useState } from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-900/75 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Toggle Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-600 dark:text-zinc-300"
        >
          <Menu className="w-5 h-5" />
        </button>

        <img
          src="/logo.svg"
          alt="Lumina Logo"
          className="hidden md:block h-14 w-auto object-contain"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl text-slate-500 dark:text-zinc-400 transition-colors"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* User Details Profile Tag */}
        {user && (
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-zinc-800">
            <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-zinc-300">
              {user.name}
            </span>
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center text-xs font-bold font-sans">
                {getInitials(user.name)}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
