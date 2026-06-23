import React from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckSquare, Edit, Trash2, Calendar } from 'lucide-react';
import { Project } from '../../../types/models';
import useAuth from '../../../hooks/useAuth';
import ROUTES from '../../../constants/routes';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isOwner = project.owner_id === user?.id;

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(project);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(project.id);
  };

  return (
    <Link 
      to={ROUTES.PROJECT_DETAIL.replace(':id', project.id)}
      className="block group bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative text-slate-800 dark:text-zinc-100"
    >
      {/* Title & Actions */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors pr-8 line-clamp-1">
          {project.title}
        </h3>
        
        {isOwner && (
          <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity absolute top-4 right-4">
            <button
              onClick={handleEditClick}
              className="p-1.5 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white rounded-lg transition-colors"
              title="Edit Project"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1.5 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              title="Delete Project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-2 h-10 mb-6">
        {project.description || 'No description provided.'}
      </p>

      {/* Metadata Metrics Row */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 pt-4 border-t border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1" title={`${project.members_count} Members`}>
            <Users className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
            <span className="font-semibold text-slate-700 dark:text-zinc-300">
              {project.members_count}
            </span>
          </div>

          <div className="flex items-center space-x-1" title={`${project.tasks_count} Tasks`}>
            <CheckSquare className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
            <span className="font-semibold text-slate-700 dark:text-zinc-300">
              {project.tasks_count}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-slate-400 dark:text-zinc-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(project.updated_at).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
