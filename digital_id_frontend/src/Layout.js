import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';

// Modern, light-themed sidebar with nav, topbar with user actions
export default function Layout({ children }) {
  const location = useLocation();
  const nav = useNavigate();
  const { role, logout } = useAuth();

  // Menu for both superadmin/admin, role deduped below
  const menu = [
    { label: 'Dashboard', path: '/' },
    { label: 'Digital IDs', path: '/holders' },
    { label: 'Unique Numbers', path: '/unique-numbers' },
    ...(role === 'superadmin'
      ? [
          { label: 'Admin Management', path: '/admins' },
          { label: 'Invitation History', path: '/invitations' },
        ]
      : []),
    { label: 'Linkage History', path: '/linkage-history' },
  ];

  return (
    <div className="layout-root" style={{ display: 'flex', height: '100vh', background: 'var(--bg-secondary)' }}>
      <aside
        style={{
          minWidth: 220,
          background: 'var(--bg-primary)',
          borderRight: '1px solid var(--border-color)',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 22,
            color: 'var(--button-bg)',
            padding: '30px 0 16px 0',
            textAlign: 'center',
            letterSpacing: '0.03em'
          }}
        >
          Digital ID Admin
        </div>
        <nav style={{ flex: 1 }}>
          {menu.map((item) => (
            <div
              key={item.path}
              onClick={() => nav(item.path)}
              style={{
                cursor: 'pointer',
                padding: '16px 24px',
                background: location.pathname === item.path ? 'var(--border-color)' : undefined,
                color: location.pathname === item.path ? 'var(--button-bg)' : 'var(--text-primary)',
                fontWeight: location.pathname === item.path ? 600 : 400,
                borderLeft: location.pathname === item.path ? '3px solid var(--button-bg)' : '3px solid transparent',
                transition: 'background 0.2s'
              }}
            >
              {item.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: 24, borderTop: '1px solid var(--border-color)' }}>
          <button
            style={{
              background: 'var(--button-bg)',
              color: 'var(--button-text)',
              border: 0,
              borderRadius: 6,
              padding: '8px 18px',
              width: '100%',
              cursor: 'pointer'
            }}
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </aside>
      <main style={{
        flex: 1,
        position: 'relative',
        padding: '38px 38px 0 38px',
        background: 'var(--bg-secondary)',
        minHeight: '100vh',
        transition: 'background 0.3s'
      }}>
        {/* Optionally add TopBar with account info here */}
        {children}
      </main>
    </div>
  );
}
