import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole, UserType } from '@/contexts/AuthContext';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  allowedUserTypes?: UserType[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

/**
 * RoleBasedRoute - Ensures user has the required role/type before rendering children
 * Can check specific roles (admin, supplier, etc.) or user types (buyer, supplier, admin)
 */
export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  allowedUserTypes,
  redirectTo = '/unauthorized',
  fallback,
}) => {
  const { user, role, userType, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user has allowed role
  const hasAllowedRole = allowedRoles
    ? role && allowedRoles.includes(role)
    : true;

  // Check if user has allowed user type
  const hasAllowedUserType = allowedUserTypes
    ? userType && allowedUserTypes.includes(userType)
    : true;

  // User must satisfy both conditions (if specified)
  const isAuthorized = hasAllowedRole && hasAllowedUserType;

  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
