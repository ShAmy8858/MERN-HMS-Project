import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import AppLayout from './components/AppLayout.jsx';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import { AdminRoute } from './routes/AdminRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/appointments" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute allowRoles={[ 'admin', 'manager', 'staff' ]} />}>
          <Route path="/appointments" element={<AppointmentsPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  );
}
