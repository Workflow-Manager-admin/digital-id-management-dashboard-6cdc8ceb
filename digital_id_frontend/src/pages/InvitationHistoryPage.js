import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

// PUBLIC_INTERFACE
export default function InvitationHistoryPage() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reinviting, setReinviting] = useState(null);

  useEffect(() => {
    fetchInvites();
  }, []);

  async function fetchInvites() {
    setLoading(true);
    try {
      const resp = await apiRequest("/admins/invitations");
      setInvites(resp || []);
    } catch {
      setInvites([]);
    }
    setLoading(false);
  }

  async function doReinvite(id) {
    setReinviting(id);
    try {
      await apiRequest(`/admins/${id}/reinvite`, { method: "POST" });
      fetchInvites();
    } catch {}
    setReinviting(null);
  }

  return (
    <div>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24}}>
        <h2 style={{ color: "var(--button-bg)" }}>Invitation History</h2>
      </div>
      {loading ? (
        <div>Loading invitations...</div>
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
                <th style={th}>Email</th>
                <th style={th}>Invited On</th>
                <th style={th}>Accepted On</th>
                <th style={th}>Status</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {invites.map(i => (
                <tr key={i.id}>
                  <td style={td}>{i.email}</td>
                  <td style={td}>{i.invited_at && (new Date(i.invited_at)).toLocaleString()}</td>
                  <td style={td}>{i.accepted_at ? (new Date(i.accepted_at)).toLocaleString() : "-"}</td>
                  <td style={td}>
                    {i.status === "accepted" ? <span style={{color: "#0a4"}}>Accepted</span> : <span style={{color: "#999"}}>Pending</span>}
                  </td>
                  <td style={td}>
                    {i.status !== "accepted" && (
                      <button style={btnIcon} onClick={() => doReinvite(i.id)} title="Resend invite">
                        {reinviting === i.id ? "Resending..." : "↻ Reinvite"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {invites.length === 0 && <tr><td colSpan={5} style={td}>No invitations found.</td></tr>}
            </tbody>
          </table>
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
