import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { KanbanSquare, Users, UserPlus, Plus, ArrowLeft, Settings, Trash2 } from 'lucide-react';
import { useProjectDetail, useProjectMutations } from '../hooks/useProjects';
import { useMembers, useMemberMutations } from '../../members/hooks/useMembers';
import { useTasks, useTaskMutations } from '../../tasks/hooks/useTasks';
import KanbanBoard from '../../tasks/components/KanbanBoard';
import TaskFilters from '../../tasks/components/TaskFilters';
import TaskForm from '../../tasks/components/TaskForm';
import MemberList from '../../members/components/MemberList';
import AddMemberDialog from '../../members/components/AddMemberDialog';
import ConfirmDialog from '../../../components/shared/ConfirmDialog';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import useAuth from '../../../hooks/useAuth';
import ROUTES from '../../../constants/routes';
import { Task } from '../../../types/models';
import { TaskStatus } from '../../../types/enums';
import useRealtime from '../../../hooks/useRealtime';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id || '';
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  // Active realtime listener subscription for this project board
  useRealtime(projectId);

  // Active Tab: 'tasks' | 'members'
  const [activeTab, setActiveTab] = useState<'tasks' | 'members'>('tasks');

  // Load project context
  const { data: project, isLoading: isProjectLoading, error: projectError } = useProjectDetail(projectId);
  const { deleteProject, isDeleting: isDeletingProject } = useProjectMutations();
  
  // Load tasks context
  const [taskSearch, setTaskSearch] = useState('');
  const [taskPriority, setTaskPriority] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const { data: tasks, isLoading: isTasksLoading } = useTasks(projectId, {
    search: taskSearch || undefined,
    priority: taskPriority || undefined,
    assignedTo: taskAssignee || undefined,
  });

  // Load members context
  const { data: members, isLoading: isMembersLoading } = useMembers(projectId);
  const { addMember, removeMember, isAdding: isAddingMember, isRemoving: isRemovingMember } = useMemberMutations(projectId);

  // Task Mutations
  const { createTask, updateTask, deleteTask, isCreating: isCreatingTask, isUpdating: isUpdatingTask, isDeleting: isDeletingTask } = useTaskMutations(projectId);

  // Modals / Overlays States
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskInitialValues, setTaskInitialValues] = useState<Task | null>(null);
  const [taskDeleteTargetId, setTaskDeleteTargetId] = useState<string | null>(null);
  
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);

  const isOwner = project?.owner_id === currentUser?.id;

  const handleCreateTaskClick = () => {
    setTaskInitialValues(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTaskClick = (task: Task) => {
    setTaskInitialValues(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskFormSubmit = async (values: any) => {
    if (taskInitialValues) {
      await updateTask({ taskId: taskInitialValues.id, updates: values });
    } else {
      await createTask(values);
    }
    setIsTaskFormOpen(false);
  };

  const handleMoveTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    await updateTask({ taskId, updates: { status: newStatus } });
  };

  const handleConfirmTaskDelete = async () => {
    if (taskDeleteTargetId) {
      await deleteTask(taskDeleteTargetId);
      setTaskDeleteTargetId(null);
    }
  };

  const handleAddMember = async (email: string) => {
    await addMember(email);
  };

  const handleDeleteProjectConfirm = async () => {
    await deleteProject(projectId);
    navigate(ROUTES.PROJECTS);
  };

  if (isProjectLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-bold text-red-500">Failed to load project details</h3>
        <p className="text-sm text-slate-500 mt-1">Make sure you are a member of this workspace.</p>
        <button
          onClick={() => navigate(ROUTES.PROJECTS)}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold"
        >
          Back to Workspaces
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-zinc-100 pb-10">
      {/* Top Breadcrumb Header navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(ROUTES.PROJECTS)}
          className="flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Workspaces</span>
        </button>

        {isOwner && (
          <button
            onClick={() => setIsDeleteProjectOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 rounded-xl text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Workspace</span>
          </button>
        )}
      </div>

      {/* Project Banner Meta info */}
      <div className="space-y-2 text-left">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
          {project.title}
        </h2>
        <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-2xl">
          {project.description || 'No description provided.'}
        </p>
      </div>

      {/* Navigation tabs controls & tab actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-zinc-800 gap-4">
        {/* Tabs selectors */}
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center space-x-2 py-3 border-b-2 text-sm font-semibold transition-all ${
              activeTab === 'tasks'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
            }`}
          >
            <KanbanSquare className="w-4 h-4" />
            <span>Task Board</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`flex items-center space-x-2 py-3 border-b-2 text-sm font-semibold transition-all ${
              activeTab === 'members'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Members ({members?.length || 0})</span>
          </button>
        </div>

        {/* Tab actions (Create Task or Add Member) */}
        <div className="pb-2 sm:pb-0">
          {activeTab === 'tasks' ? (
            <button
              onClick={handleCreateTaskClick}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-950 font-semibold text-sm rounded-xl focus:outline-none transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          ) : (
            isOwner && (
              <button
                onClick={() => setIsAddMemberOpen(true)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-950 font-semibold text-sm rounded-xl focus:outline-none transition-all shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Member</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Render selected tab panel */}
      {activeTab === 'tasks' ? (
        <div className="space-y-6">
          <TaskFilters
            search={taskSearch}
            onSearchChange={setTaskSearch}
            priority={taskPriority}
            onPriorityChange={setTaskPriority}
            assigneeId={taskAssignee}
            onAssigneeIdChange={setTaskAssignee}
            members={members || []}
          />

          {isTasksLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="md" />
            </div>
          ) : tasks ? (
            <KanbanBoard
              tasks={tasks}
              onEditTask={handleEditTaskClick}
              onDeleteTask={setTaskDeleteTargetId}
              onMoveStatus={handleMoveTaskStatus}
            />
          ) : null}
        </div>
      ) : (
        <div>
          {isMembersLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="md" />
            </div>
          ) : members ? (
            <MemberList
              members={members}
              projectOwnerId={project.owner_id}
              onRemoveMember={removeMember}
              isRemoving={isRemovingMember}
            />
          ) : null}
        </div>
      )}

      {/* Task Creation / Editing Dialog */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSubmit={handleTaskFormSubmit}
        initialValues={taskInitialValues}
        members={members || []}
        title={taskInitialValues ? 'Edit Task Details' : 'Create New Task'}
        isSubmitting={taskInitialValues ? isUpdatingTask : isCreatingTask}
      />

      {/* Task Deletion Confirmation Dialog */}
      <ConfirmDialog
        isOpen={taskDeleteTargetId !== null}
        title="Delete Task"
        description="Are you sure you want to permanently delete this task? This action cannot be undone."
        confirmText="Delete Task"
        cancelText="Cancel"
        onConfirm={handleConfirmTaskDelete}
        onCancel={() => setTaskDeleteTargetId(null)}
        isConfirming={isDeletingTask}
      />

      {/* Add Member Dialog panel */}
      <AddMemberDialog
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAddMember={handleAddMember}
        projectId={projectId}
        isAdding={isAddingMember}
      />

      {/* Project Deletion Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteProjectOpen}
        title="Delete Workspace Board"
        description="Are you absolutely sure you want to delete this workspace? This will remove all project members, milestones, and tasks permanently. This action cannot be undone."
        confirmText="Delete Workspace"
        cancelText="Cancel"
        onConfirm={handleDeleteProjectConfirm}
        onCancel={() => setIsDeleteProjectOpen(false)}
        isConfirming={isDeletingProject}
      />
    </div>
  );
};

export default ProjectDetailPage;
