import api from '../../../services/api';
import { ApiResponse } from '../../../types/api';
import { Task } from '../../../types/models';

export const taskService = {
  getTasks: async (projectId: string, filters?: Record<string, any>): Promise<Task[]> => {
    const response = await api.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks`, {
      params: filters || {},
    });
    return response.data.data;
  },

  createTask: async (projectId: string, task: Omit<Task, 'id' | 'project_id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>(`/projects/${projectId}/tasks`, task);
    return response.data.data;
  },

  updateTask: async (taskId: string, updates: Partial<Omit<Task, 'id' | 'project_id' | 'created_by' | 'created_at' | 'updated_at'>>): Promise<Task> => {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${taskId}`, updates);
    return response.data.data;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await api.delete<ApiResponse<any>>(`/tasks/${taskId}`);
  },
};

export default taskService;
