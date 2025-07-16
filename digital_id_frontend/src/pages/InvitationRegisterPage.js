import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';

// PUBLIC_INTERFACE
export default function InvitationRegisterPage() {
  const { inviteToken } = useParams();
  const { acceptInvitation, loading } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', password: '' });
  const [error, setError] = useState('');
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const res = await acceptInvitation(inviteToken, form.name, form.password);
    if (res.success) {
      nav('/');
    } else {
      setError(res.error);
    }
  }
  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }
  return (
    <div style={{ maxWidth: 410, margin: '120px auto', background: 'var(--bg-secondary)', padding: 38, borderRadius: 9, boxShadow: '0 2px 14px 0 rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: 'var(--button-bg)' }}>Accept Invitation</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: 12, borderRadius: 6, border: '1px solid var(--border-color)' }}
        />
        <input
          name="password"
          type="password"
          placeholder="Set Password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
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
          Register/Join
        </button>
        {error && <div style={{ color: '#c00', marginTop: 6 }}>{error}</div>}
      </form>
    </div>
  );
}
