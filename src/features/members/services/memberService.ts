import api from '../../../services/api';
import { ApiResponse } from '../../../types/api';
import { ProjectMember, Profile } from '../../../types/models';

export const memberService = {
  getMembers: async (projectId: string): Promise<ProjectMember[]> => {
    const response = await api.get<ApiResponse<ProjectMember[]>>(`/projects/${projectId}/members`);
    return response.data.data;
  },

  addMember: async (projectId: string, email: string): Promise<ProjectMember> => {
    const response = await api.post<ApiResponse<ProjectMember>>(`/projects/${projectId}/members`, { email });
    return response.data.data;
  },

  removeMember: async (projectId: string, userId: string): Promise<void> => {
    await api.delete<ApiResponse<any>>(`/projects/${projectId}/members/${userId}`);
  },

  searchUsers: async (email: string, excludeProjectId?: string): Promise<Profile[]> => {
    const response = await api.get<ApiResponse<Profile[]>>('/users/search', {
      params: {
        email,
        ...(excludeProjectId ? { excludeProjectId } : {}),
      },
    });
    return response.data.data;
  },
};

export default memberService;
