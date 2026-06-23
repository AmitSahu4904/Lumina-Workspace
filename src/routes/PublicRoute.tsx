import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ROUTES from '../constants/routes';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export const PublicRoute: React.FC = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect authenticated user to Dashboard page
  return token ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Outlet />;
};

export default PublicRoute;
