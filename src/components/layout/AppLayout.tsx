import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-zinc-950 overflow-hidden transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <Sidebar onClose={() => {}} />
      </div>

      {/* Mobile Sidebar Backing Drawer */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <div 
            className="w-64 max-w-xs h-full bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 relative z-50 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onClose={() => setIsMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 h-full overflow-hidden">
        <Topbar onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
