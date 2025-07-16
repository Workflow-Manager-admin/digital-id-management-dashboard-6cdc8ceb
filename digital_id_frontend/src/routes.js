import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './authContext';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout';

// Pages (to be created)
import LoginPage from './pages/LoginPage';
import InvitationRegisterPage from './pages/InvitationRegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminManagementPage from './pages/AdminManagementPage';
import InvitationHistoryPage from './pages/InvitationHistoryPage';
import HoldersPage from './pages/HoldersPage';
import UniqueNumbersPage from './pages/UniqueNumbersPage';
import LinkageHistoryPage from './pages/LinkageHistoryPage';

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/:inviteToken" element={<InvitationRegisterPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/holders" element={<HoldersPage />} />
                  <Route path="/unique-numbers" element={<UniqueNumbersPage />} />
                  <Route path="/linkage-history" element={<LinkageHistoryPage />} />
                  {/* Superadmin-only */}
                  <Route
                    path="/admins"
                    element={
                      <ProtectedRoute role="superadmin">
                        <AdminManagementPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/invitations"
                    element={
                      <ProtectedRoute role="superadmin">
                        <InvitationHistoryPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* fallback */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
