import React from 'react';
import { ProtectedRoute } from './ProtectedRoute.jsx';

export function AdminRoute() {
  return <ProtectedRoute allowRoles={[ 'admin', 'manager' ]} />;
}
