import { useMutation, useQueryClient } from '@tanstack/react-query';
import profileService from '../services/profileService';
import useAuth from '../../../hooks/useAuth';
import queryKeys from '../../../constants/queryKeys';
import toast from 'react-hot-toast';

export const useProfileMutations = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  const updateNameMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: (data) => {
      // Update contextual user state directly
      updateUser(data);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      toast.success('Profile updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update name');
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: profileService.uploadAvatar,
    onSuccess: (avatarUrl) => {
      // Update query client cache for me
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      
      // Update the contextual state
      queryClient.setQueryData(queryKeys.auth.me, (old: any) => {
        if (!old) return old;
        return { ...old, avatar_url: avatarUrl };
      });
      
      toast.success('Avatar uploaded successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to upload avatar image');
    },
  });

  return {
    updateName: updateNameMutation.mutateAsync,
    isUpdatingName: updateNameMutation.isPending,
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    isUploadingAvatar: uploadAvatarMutation.isPending,
  };
};
