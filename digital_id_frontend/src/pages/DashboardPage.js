import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api';

// PUBLIC_INTERFACE
export default function DashboardPage() {
  // Summary counts for cards
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, []);

  async function fetchStats() {
    try {
      const resp = await apiRequest('/dashboard/summary');
      setStats(resp || {});
    } catch {
      setStats(null);
    }
  }

  return (
    <div>
      <h2 style={{ color: 'var(--button-bg)', marginBottom: 30 }}>Admin Dashboard</h2>
      <div style={{
        display: 'flex',
        gap: 32,
        flexWrap: 'wrap',
        marginBottom: 30
      }}>
        <SummaryCard
          label="Holders"
          count={stats?.holder_count ?? '-'}
          active={true}
          icon="🧑"
        />
        <SummaryCard
          label="Unique Numbers"
          count={stats?.unique_number_count ?? '-'}
          active={true}
          icon="🔢"
        />
        <SummaryCard
          label="Total Linkages"
          count={stats?.linkage_count ?? '-'}
          active={true}
          icon="🔗"
        />
        {typeof stats?.admin_count !== 'undefined' &&
          <SummaryCard
            label="Admins"
            count={stats?.admin_count}
            active={true}
            icon="👤"
          />
        }
      </div>
      <p style={{color: 'var(--text-secondary)', fontSize: 17}}>
        Welcome to the Digital ID Management Dashboard.<br />
        Manage holders, assign unique numbers, and track all linkage actions here.
      </p>
    </div>
  );
}

// Simple summary card
function SummaryCard({ label, count, active, icon }) {
  return (
    <div style={{
      background: 'var(--bg-primary)',
      borderRadius: 10,
      minWidth: 170,
      minHeight: 95,
      padding: '17px 25px',
      boxShadow: '0 2px 10px 0 rgba(0,0,0,0.03)',
      border: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ fontSize: 34, marginBottom: 7 }}>{icon}</div>
      <div style={{ fontWeight: 600, fontSize: 28 }}>{count}</div>
      <div style={{ color: 'var(--button-bg)', fontSize: 15, marginTop: 1 }}>{label}</div>
    </div>
  );
}
