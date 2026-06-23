import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ROUTES from '../constants/routes';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export const ProtectedRoute: React.FC = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect guest user to Login page
  return token ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};

export default ProtectedRoute;
