import React, { useState } from 'react';
import { FolderPlus, Search } from 'lucide-react';
import { useProjects, useProjectMutations } from '../hooks/useProjects';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import EmptyState from '../../../components/shared/EmptyState';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { useDebounce } from '../../../hooks/useDebounce';
import { Project } from '../../../types/models';

export const ProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: projects, isLoading, error } = useProjects(debouncedSearch);
  const { createProject, updateProject, deleteProject, isCreating, isUpdating, isDeleting } = useProjectMutations();

  // Modal forms states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formInitialValues, setFormInitialValues] = useState<Project | null>(null);
  
  // Confirm delete states
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleCreateClick = () => {
    setFormInitialValues(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (project: Project) => {
    setFormInitialValues(project);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleFormSubmit = async (values: any) => {
    if (formInitialValues) {
      await updateProject({ id: formInitialValues.id, updates: values });
    } else {
      await createProject(values);
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId) {
      await deleteProject(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-zinc-100">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Workspaces
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">
            Manage your collaborative project boards.
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-950 font-semibold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-md self-start sm:self-auto"
        >
          <FolderPlus className="w-4.5 h-4.5" />
          <span>Create Project</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md w-full">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-zinc-500 pointer-events-none">
          <Search className="w-4.5 h-4.5" />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all text-slate-900 dark:text-white text-sm shadow-sm"
        />
      </div>

      {/* Projects Grid content */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500 font-semibold">Failed to fetch projects list.</p>
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={searchTerm ? 'No search matches' : 'No projects workspace'}
          description={
            searchTerm
              ? 'No projects matching your search term were found. Try another query.'
              : 'Create a collaborative project board to start tracking your tasks and milestones.'
          }
          icon={FolderPlus}
          actionText={searchTerm ? undefined : 'Create New Project'}
          onActionClick={searchTerm ? undefined : handleCreateClick}
        />
      )}

      {/* Forms Overlay Dialog */}
      <ProjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={formInitialValues}
        title={formInitialValues ? 'Edit Project Settings' : 'Create New Project'}
        isSubmitting={formInitialValues ? isUpdating : isCreating}
      />

      {/* Delete confirmation overlay */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Delete Project Workspace"
        description="Are you absolutely sure you want to delete this project? This action will permanently remove all tasks and member records associated with this workspace. This action cannot be undone."
        confirmText="Delete Workspace"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
        isConfirming={isDeleting}
      />
    </div>
  );
};

export default ProjectsPage;
