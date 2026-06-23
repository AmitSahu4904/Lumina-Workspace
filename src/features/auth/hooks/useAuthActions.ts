import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import useAuth from '../../../hooks/useAuth';
import ROUTES from '../../../constants/routes';

export const useAuthActions = () => {
  const { login: setAuthContext, logout: clearAuthContext } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuthContext(data.session.access_token, data.user);
      queryClient.clear(); // Clear all stale caches
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
    },
  });

  const signupMutation = useMutation({
    mutationFn: authService.signup,
    onSuccess: (data) => {
      setAuthContext(data.session.access_token, data.user);
      queryClient.clear();
      toast.success(`Account created! Welcome, ${data.user.name}!`);
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(msg);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onMutate: async () => {
      // Optimistically clear context and navigate to login right away for snappy feel
      clearAuthContext();
      queryClient.clear();
      navigate(ROUTES.LOGIN);
    },
    onSuccess: () => {
      toast.success('Logged out successfully');
    },
    onError: (error) => {
      console.error('Logout API failure:', error);
      // Context is already cleared client-side anyway
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    signup: signupMutation.mutate,
    isSigningUp: signupMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};

export default useAuthActions;
