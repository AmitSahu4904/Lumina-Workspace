import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import projectService from '../services/projectService';
import queryKeys from '../../../constants/queryKeys';
import toast from 'react-hot-toast';

export const useProjects = (search?: string) => {
  return useQuery({
    queryKey: queryKeys.projects.all(search),
    queryFn: () => projectService.getProjects(search),
  });
};

export const useProjectDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => projectService.getProjectDetail(id),
    enabled: !!id,
  });
};

export const useProjectMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: projectService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
      toast.success('Project created successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create project');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: { title?: string; description?: string | null } }) =>
      projectService.updateProject(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
      toast.success('Project updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update project');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: projectService.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
      toast.success('Project deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    },
  });

  return {
    createProject: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateProject: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteProject: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
