import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <main className="container"><div className="state-panel" aria-live="polite"><p>Checking your account…</p></div></main>;
  if (!user) return <Navigate to="/login" replace state={{ from: location, message: 'Sign in to view your bookings.' }} />;
  return children;
}

export default ProtectedRoute;
