import api from '../../../services/api';
import { ApiResponse } from '../../../types/api';
import { DashboardData } from '../../../types/models';

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    const response = await api.get<ApiResponse<DashboardData>>('/projects/dashboard');
    return response.data.data;
  },
};

export default dashboardService;
