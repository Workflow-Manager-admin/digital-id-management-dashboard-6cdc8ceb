import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

// PUBLIC_INTERFACE
export default function AdminManagementPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteErr, setInviteErr] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [reinvitId, setReinvitId] = useState(null); // For feedback on reinvite

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function fetchAdmins() {
    setLoading(true);
    try {
      const resp = await apiRequest("/admins");
      setAdmins(resp || []);
    } catch {
      setAdmins([]);
    }
    setLoading(false);
  }

  async function doInvite(e) {
    e.preventDefault();
    setInviteErr("");
    try {
      await apiRequest("/admins/invite", { method: "POST", body: JSON.stringify({ email: inviteEmail }) });
      setInviteEmail("");
      setInviteOpen(false);
      fetchAdmins();
    } catch (e) {
      setInviteErr(e.message || "Failed to invite");
    }
  }

  async function doReinvite(id) {
    setReinvitId(id);
    try {
      await apiRequest(`/admins/${id}/reinvite`, { method: "POST" });
      fetchAdmins();
    } catch {}
    setReinvitId(null);
  }

  async function removeAdmin(id) {
    try {
      await apiRequest(`/admins/${id}`, { method: "DELETE" });
      setRemovingId(null);
      fetchAdmins();
    } catch {
      setRemovingId(null);
    }
  }

  return (
    <div>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24}}>
        <h2 style={{ color: "var(--button-bg)" }}>Admin Management</h2>
        <button onClick={() => setInviteOpen(true)}
          style={{ background: "var(--button-bg)", color: "var(--button-text)", border: 0, borderRadius: 6, padding: "8px 22px", fontSize: 16, cursor: "pointer" }}>
          + Invite Admin
        </button>
      </div>

      {loading ? (
        <div>Loading admins...</div>
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
                <th style={th}>Name</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(a => (
                <tr key={a.id}>
                  <td style={td}>{a.email}</td>
                  <td style={td}>{a.name || <span style={{color: "#888"}}>Pending</span>}</td>
                  <td style={td}>
                    {a.status === "active" && <span style={{color: "#0a4"}}>Active</span>}
                    {a.status === "invited" && <span style={{color: "#999"}}>Invited</span>}
                  </td>
                  <td style={td}>
                    {a.status === "invited" && (
                      <button style={btnIcon} onClick={() => doReinvite(a.id)} title="Resend invite">
                        {reinvitId === a.id ? "Sending..." : "↻ Reinvite"}
                      </button>
                    )}
                    <button style={btnIcon} onClick={() => setRemovingId(a.id)} title="Remove">🗑️</button>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && <tr><td colSpan={4} style={td}>No admins found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for invite */}
      {inviteOpen && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={{color: "var(--button-bg)", marginBottom: 12}}>Invite New Admin</h3>
            <form onSubmit={doInvite} style={{display: "flex", flexDirection: "column", gap: 15}}>
              <input
                type="email"
                placeholder="Admin Email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                required
                style={inputStyle}
              />
              <button type="submit" style={{
                background: "var(--button-bg)", color: "var(--button-text)",
                border: 0, borderRadius: 6, padding: "12px 0", fontWeight: 600, fontSize: 15, cursor: "pointer"
              }}>Send Invitation</button>
              {inviteErr && <div style={{color: "#c00", marginTop: 5}}>{inviteErr}</div>}
              <button type="button" onClick={() => setInviteOpen(false)} style={{marginTop: 2, color: "var(--button-bg)", background: "none", border: 0, cursor: "pointer"}}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Confirm remove */}
      {removingId &&
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={{color: "var(--button-bg)", marginBottom: 15}}>Remove Admin?</h3>
            <div style={{marginBottom: 25}}>Are you sure you want to remove this admin?</div>
            <button
              onClick={() => removeAdmin(removingId)}
              style={{...dangerBtn, marginRight: 12}}
            >Remove</button>
            <button
              onClick={() => setRemovingId(null)}
              style={cancelBtn}
            >Cancel</button>
          </div>
        </div>
      }
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
const dangerBtn = {
  background: "#c00",
  color: "#fff",
  border: 0,
  borderRadius: 6,
  padding: "9px 23px",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer"
};
const cancelBtn = {
  background: "none",
  color: "var(--button-bg)",
  border: "1px solid var(--button-bg)",
  borderRadius: 6,
  padding: "9px 23px",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer"
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
