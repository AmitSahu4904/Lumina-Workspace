import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import memberService from '../services/memberService';
import queryKeys from '../../../constants/queryKeys';
import toast from 'react-hot-toast';

export const useMembers = (projectId: string) => {
  return useQuery({
    queryKey: queryKeys.members.list(projectId),
    queryFn: () => memberService.getMembers(projectId),
    enabled: !!projectId,
  });
};

export const useUserSearch = (email: string, excludeProjectId?: string) => {
  return useQuery({
    queryKey: queryKeys.users.search(email, excludeProjectId),
    queryFn: () => memberService.searchUsers(email, excludeProjectId),
    enabled: !!email && email.trim().length >= 2,
    staleTime: 30 * 1000, // Search results valid for 30s
  });
};

export const useMemberMutations = (projectId: string) => {
  const queryClient = useQueryClient();

  const addMemberMutation = useMutation({
    mutationFn: (email: string) => memberService.addMember(projectId, email),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.list(projectId) });
      queryClient.invalidateQueries({ queryKey: ['projects'] }); // Refetches project member counts
      toast.success('Member added successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add member to project');
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) => memberService.removeMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members.list(projectId) });
      queryClient.invalidateQueries({ queryKey: ['projects'] }); // Refetches project member counts
      toast.success('Member removed successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to remove member from project');
    },
  });

  return {
    addMember: addMemberMutation.mutateAsync,
    isAdding: addMemberMutation.isPending,
    removeMember: removeMemberMutation.mutateAsync,
    isRemoving: removeMemberMutation.isPending,
  };
};
