import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Folder, CheckSquare, CheckCircle, Clock, Plus, ArrowRight } from 'lucide-react';
import useDashboardData from '../hooks/useDashboardData';
import useAuth from '../../../hooks/useAuth';
import ROUTES from '../../../constants/routes';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-bold text-red-600">Failed to load dashboard data</h3>
        <p className="text-sm text-slate-500">Please verify backend server status and try again.</p>
      </div>
    );
  }

  const { stats, recentProjects } = data;

  const cards = [
    {
      title: 'Total Projects',
      value: stats.total_projects,
      icon: Folder,
      colorClass: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20',
    },
    {
      title: 'Total Tasks',
      value: stats.total_tasks,
      icon: CheckSquare,
      colorClass: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20',
    },
    {
      title: 'Completed Tasks',
      value: stats.completed_tasks,
      icon: CheckCircle,
      colorClass: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20',
    },
    {
      title: 'Pending Tasks',
      value: stats.pending_tasks,
      icon: Clock,
      colorClass: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-zinc-100">
      {/* Greetings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Welcome, {user?.name}
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">
            Here is a snapshot of your collaborative workspaces today.
          </p>
        </div>
        <button
          onClick={() => navigate(ROUTES.PROJECTS)}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-950 font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Grid of Dashboard Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="p-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                {card.title}
              </span>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
                {card.value}
              </p>
            </div>
            <div className={`p-3 rounded-xl shrink-0 ${card.colorClass}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects Section */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Recent Projects
          </h3>
          <Link
            to={ROUTES.PROJECTS}
            className="flex items-center space-x-1 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="text-center py-10 bg-slate-50/50 dark:bg-zinc-800/20 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800">
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              No projects created yet. Let's create your first workspace!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white hover:underline">
                    <Link to={ROUTES.PROJECT_DETAIL.replace(':id', project.id)}>
                      {project.title}
                    </Link>
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5 line-clamp-1 max-w-lg">
                    {project.description || 'No description provided'}
                  </p>
                </div>
                <span className="text-xs text-slate-400 dark:text-zinc-500 shrink-0">
                  Updated {new Date(project.updated_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
