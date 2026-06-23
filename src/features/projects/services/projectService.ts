import api from '../../../services/api';
import { ApiResponse } from '../../../types/api';
import { Project } from '../../../types/models';

export const projectService = {
  getProjects: async (search?: string): Promise<Project[]> => {
    const response = await api.get<ApiResponse<Project[]>>('/projects', {
      params: search ? { search } : {},
    });
    return response.data.data;
  },

  getProjectDetail: async (id: string): Promise<Project> => {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data;
  },

  createProject: async (project: { title: string; description?: string | null }): Promise<Project> => {
    const response = await api.post<ApiResponse<Project>>('/projects', project);
    return response.data.data;
  },

  updateProject: async (id: string, updates: { title?: string; description?: string | null }): Promise<Project> => {
    const response = await api.patch<ApiResponse<Project>>(`/projects/${id}`, updates);
    return response.data.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await api.delete<ApiResponse<any>>(`/projects/${id}`);
  },
};

export default projectService;
