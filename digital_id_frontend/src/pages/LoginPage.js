import React, { useState } from 'react';
import { useAuth } from '../authContext';
import { useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function LoginPage() {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const res = await login(form.email, form.password);
    if (res.success) {
      nav('/');
    } else {
      setError(res.error);
    }
  }

  return (
    <div style={{ maxWidth: 410, margin: '120px auto', background: 'var(--bg-secondary)', padding: 38, borderRadius: 9, boxShadow: '0 2px 14px 0 rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: 'var(--button-bg)' }}>Admin Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ padding: 12, borderRadius: 6, border: '1px solid var(--border-color)' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{ padding: 12, borderRadius: 6, border: '1px solid var(--border-color)' }}
        />
        <button
          type="submit"
          style={{
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
            border: 0,
            borderRadius: 6,
            padding: '12px 0',
            fontWeight: 600,
            fontSize: 17,
            cursor: 'pointer'
          }}
          disabled={loading}
        >
          Login
        </button>
        {error && <div style={{ color: '#c00', marginTop: 6 }}>{error}</div>}
      </form>
    </div>
  );
}
