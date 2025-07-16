import React from 'react';
import { useAuth } from './authContext';

// PUBLIC_INTERFACE
export default function ProtectedRoute({ children, role }) {
  const { token, role: currentRole } = useAuth();

  if (!token) {
    window.location.href = '/login';
    return null;
  }
  if (role && role !== currentRole) {
    return <div style={{ padding: 32 }}>Unauthorized</div>;
  }
  return children;
}
