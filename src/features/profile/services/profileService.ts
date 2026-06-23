import api from '../../../services/api';
import { ApiResponse } from '../../../types/api';
import { Profile } from '../../../types/models';

export const profileService = {
  updateProfile: async (name: string): Promise<Profile> => {
    const response = await api.patch<ApiResponse<Profile>>('/profile', { name });
    return response.data.data;
  },

  uploadAvatar: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post<ApiResponse<{ avatar_url: string }>>('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data.avatar_url;
  },
};

export default profileService;
