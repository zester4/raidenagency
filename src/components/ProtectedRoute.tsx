
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Return a loading state while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen bg-raiden-black">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-b-2 border-electric-blue animate-spin mb-4"></div>
          <p className="text-electric-blue">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to authentication page if not logged in
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
