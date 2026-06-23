import api from '../../../services/api';
import { ApiResponse } from '../../../types/api';
import { Profile } from '../../../types/models';

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface AuthResponse {
  user: Profile;
  session: AuthSession;
}

export const authService = {
  login: async (credentials: Record<string, string>): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  signup: async (userData: Record<string, string>): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/signup', userData);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post<ApiResponse<any>>('/auth/logout');
  },
};

export default authService;
