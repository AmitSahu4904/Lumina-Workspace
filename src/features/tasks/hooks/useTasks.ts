import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import taskService from '../services/taskService';
import queryKeys from '../../../constants/queryKeys';
import toast from 'react-hot-toast';

export const useTasks = (projectId: string, filters?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.tasks.list(projectId, filters),
    queryFn: () => taskService.getTasks(projectId, filters),
    enabled: !!projectId,
  });
};

export const useTaskMutations = (projectId: string) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (taskData: any) => taskService.createTask(projectId, taskData),
    onSuccess: () => {
      // Invalidate both full project listing and specific task listings
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] });
      toast.success('Task created successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create task');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: any }) =>
      taskService.updateTask(taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] });
      toast.success('Task updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update task');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] });
      toast.success('Task deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    },
  });

  return {
    createTask: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateTask: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTask: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
