import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, clearSession } from './api';

// Context for auth and user info
const AuthContext = createContext();

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // can hold admin/superadmin data

  useEffect(() => {
    if (token && !user) {
      // Optionally fetch current user/profile if needed
      // fetchCurrentUser();
    }
    // eslint-disable-next-line
  }, [token]);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Adapt to backend auth endpoint contract
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      setRole(data.role); // 'admin' | 'superadmin'
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      // setUser(data.profile); // if profile returned
      return { success: true, role: data.role };
    } catch (e) {
      clearSession();
      setToken(null);
      setRole(null);
      setUser(null);
      return { success: false, error: e.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    clearSession();
    setToken(null);
    setRole(null);
    setUser(null);
  };

  // PUBLIC_INTERFACE
  const acceptInvitation = async (invite_token, name, password) => {
    setLoading(true);
    try {
      // Expected backend: returns token + role
      const data = await apiRequest('/auth/invitation/accept', {
        method: 'POST',
        body: JSON.stringify({ invite_token, name, password }),
      });
      setToken(data.token);
      setRole(data.role);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      return { success: true, role: data.role };
    } catch (e) {
      return { success: false, error: e.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const value = {
    token,
    role,
    user,
    loading,
    login,
    logout,
    acceptInvitation,
    isSuperAdmin: role === 'superadmin',
    isAdmin: role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
