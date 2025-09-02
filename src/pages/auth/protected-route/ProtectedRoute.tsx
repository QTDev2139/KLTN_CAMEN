import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth-context/AuthContext';

export default function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Đang tải…</div>;
  return user ? children : <Navigate to="/login" replace />;
}
