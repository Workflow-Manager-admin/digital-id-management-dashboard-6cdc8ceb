import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

// PUBLIC_INTERFACE
export default function UniqueNumbersPage() {
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignModal, setAssignModal] = useState(null); // {number object}
  const [holders, setHolders] = useState([]);
  const [selectedHolder, setSelectedHolder] = useState("");
  const [assignError, setAssignError] = useState("");

  useEffect(() => {
    fetchNumbers();
  }, []);

  async function fetchNumbers() {
    setLoading(true);
    try {
      const resp = await apiRequest("/unique-numbers");
      setNumbers(resp || []);
    } catch {
      setNumbers([]);
    }
    setLoading(false);
  }

  async function openAssignModal(num) {
    setAssignModal(num);
    setAssignError("");
    try {
      const holderList = await apiRequest("/holders");
      setHolders(holderList || []);
    } catch {
      setHolders([]);
    }
  }

  async function assign(num) {
    if (!selectedHolder) return;
    setAssignError("");
    try {
      await apiRequest(`/unique-numbers/${num.id}/assign`, {
        method: "POST",
        body: JSON.stringify({ holder_id: selectedHolder })
      });
      setAssignModal(null);
      fetchNumbers();
    } catch (e) {
      setAssignError(e.message || "Error assigning");
    }
  }

  async function unassign(num) {
    try {
      await apiRequest(`/unique-numbers/${num.id}/unassign`, { method: "POST" });
      fetchNumbers();
    } catch {}
  }

  return (
    <div>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24}}>
        <h2 style={{ color: "var(--button-bg)" }}>Unique Numbers</h2>
      </div>
      {loading ? (
        <div>Loading unique numbers...</div>
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
                <th style={th}>Number</th>
                <th style={th}>Assigned Holder</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {numbers.map(n => (
                <tr key={n.id}>
                  <td style={td}>{n.number}</td>
                  <td style={td}>{n.holder_name || <span style={{color: "#888"}}>Unassigned</span>}</td>
                  <td style={td}>
                    {n.holder_id ? (
                      <button style={btnIcon} onClick={() => unassign(n)} title="Unassign">🗙 Unassign</button>
                    ) : (
                      <button style={btnIcon} onClick={() => openAssignModal(n)} title="Assign">🔗 Assign</button>
                    )}
                  </td>
                </tr>
              ))}
              {numbers.length === 0 && <tr><td colSpan={3} style={td}>No unique numbers found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {assignModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={{color: "var(--button-bg)", marginBottom: 9}}>Assign Unique Number</h3>
            <div style={{marginBottom: 12}}>{assignModal.number}</div>
            <select
              value={selectedHolder}
              onChange={e => setSelectedHolder(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select Holder</option>
              {holders.map(h => (
                <option key={h.id} value={h.id}>{h.name} ({h.email})</option>
              ))}
            </select>
            <button onClick={() => assign(assignModal)} style={{
              background: "var(--button-bg)", color: "var(--button-text)", border: 0,
              borderRadius: 6, padding: "10px 0", fontWeight: 600, fontSize: 15, cursor: "pointer", marginTop: 14
            }}>Assign</button>
            {assignError && <div style={{marginTop: 7, color: "#c00"}}>{assignError}</div>}
            <button onClick={() => setAssignModal(null)} style={{marginTop: 19, color: "var(--button-bg)", background: "none", border: 0, cursor: "pointer"}}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

const th = { textAlign: "left", fontWeight: 600, padding: "12px 8px", fontSize: 16, color: "var(--button-bg)" };
const td = { padding: "10px 8px", fontSize: 15 };
const btnIcon = {
  fontSize: 15,
  marginRight: 8,
  background: "none",
  border: 0,
  cursor: "pointer",
  color: "var(--button-bg)",
  padding: 0
};
const modalOverlay = {
  position: "fixed",
  left: 0, top: 0, width: "100vw", height: "100vh",
  background: "rgba(25,38,75,0.15)",
  zIndex: 1111,
  display: "flex", alignItems: "center", justifyContent: "center"
};
const modalBox = {
  background: "var(--bg-primary)",
  borderRadius: 12,
  boxShadow: "0 2px 14px 0 rgba(0,0,0,0.09)",
  padding: 38,
  minWidth: 330
};
const inputStyle = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid var(--border-color)",
  fontSize: 16
};
