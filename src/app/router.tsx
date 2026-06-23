import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import PublicRoute from '../routes/PublicRoute';
import ProtectedRoute from '../routes/ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ROUTES from '../constants/routes';

// Lazy loading pages for optimized chunks
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('../features/auth/pages/SignupPage'));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const ProjectsPage = lazy(() => import('../features/projects/pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('../features/projects/pages/ProjectDetailPage'));
const ProfilePage = lazy(() => import('../features/profile/pages/ProfilePage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-zinc-950">
    <LoadingSpinner size="lg" />
  </div>
);

export const router = createBrowserRouter([
  // Guest / Public Routes
  {
    element: <PublicRoute />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.SIGNUP,
        element: (
          <Suspense fallback={<PageLoader />}>
            <SignupPage />
          </Suspense>
        ),
      },
    ],
  },
  // Authenticated / Protected Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: (
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.PROJECTS,
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProjectsPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.PROJECT_DETAIL,
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProjectDetailPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.PROFILE,
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProfilePage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  // Catch all - redirect to dashboard
  {
    path: '*',
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);

export default router;
