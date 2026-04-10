import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../modules/auth/AuthContext.jsx';

export function ProtectedRoute({ allowRoles }) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowRoles && !allowRoles.includes(user.role)) {
    return <Navigate to="/appointments" replace />;
  }

  return <Outlet />;
}

ProtectedRoute.propTypes = {
  allowRoles: PropTypes.arrayOf(PropTypes.string)
};

ProtectedRoute.defaultProps = {
  allowRoles: null
};
