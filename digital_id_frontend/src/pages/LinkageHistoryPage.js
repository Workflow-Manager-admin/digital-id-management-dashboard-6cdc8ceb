import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

// PUBLIC_INTERFACE
export default function LinkageHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    setLoading(true);
    try {
      const resp = await apiRequest("/linkage-history");
      setHistory(resp || []);
    } catch {
      setHistory([]);
    }
    setLoading(false);
  }

  return (
    <div>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24}}>
        <h2 style={{ color: "var(--button-bg)" }}>Linkage History</h2>
      </div>
      {loading ? (
        <div>Loading linkage history...</div>
      ) : (
        <div style={{
          background: "var(--bg-primary)",
          borderRadius: 8,
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.04)",
          padding: 20,
          border: "1px solid var(--border-color)"
        }}>
          <table style={{width: "100%", borderCollapse: "collapse"}}>
            <thead>
              <tr style={{background: "var(--bg-secondary)"}}>
                <th style={th}>Date</th>
                <th style={th}>Holder</th>
                <th style={th}>Number</th>
                <th style={th}>Action</th>
                <th style={th}>Admin</th>
              </tr>
            </thead>
            <tbody>
              {history.map(h => (
                <tr key={h.id}>
                  <td style={td}>{h.changed_at && (new Date(h.changed_at)).toLocaleString()}</td>
                  <td style={td}>{h.holder_name}</td>
                  <td style={td}>{h.number}</td>
                  <td style={td}>{h.action}</td>
                  <td style={td}>{h.admin_email}</td>
                </tr>
              ))}
              {history.length === 0 && <tr><td colSpan={5} style={td}>No linkage events found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
const th = { textAlign: "left", fontWeight: 600, padding: "12px 8px", fontSize: 16, color: "var(--button-bg)" };
const td = { padding: "10px 8px", fontSize: 15 };
