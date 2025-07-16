import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

// PUBLIC_INTERFACE
export default function HoldersPage() {
  // State for holders, UI, dialog/modal management
  const [holders, setHolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // {id, ...fields} for edit, null for create
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [modalError, setModalError] = useState("");
  const [deleteId, setDeleteId] = useState(null); // holderId pending delete
  const [assignHolder, setAssignHolder] = useState(null); // open modal for assignment
  const [assignNumbers, setAssignNumbers] = useState([]); // list of unique numbers for this holder

  useEffect(() => {
    fetchHolders();
  }, []);

  // Fetch holders from backend
  async function fetchHolders() {
    setLoading(true);
    try {
      const resp = await apiRequest("/holders");
      setHolders(resp || []);
    } catch (e) {
      setHolders([]);
    }
    setLoading(false);
  }

  // Populates form for edit or clear for create
  function openModal(holder) {
    setEditing(holder || null);
    setForm(holder ? { name: holder.name, email: holder.email } : { name: "", email: "" });
    setModalOpen(true);
    setModalError("");
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setForm({ name: "", email: "" });
    setModalError("");
  }

  function handleInput(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  // Submit create or edit
  async function handleSubmit(e) {
    e.preventDefault();
    setModalError("");
    try {
      if (editing) {
        await apiRequest(`/holders/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(form)
        });
      } else {
        await apiRequest("/holders", {
          method: "POST",
          body: JSON.stringify(form)
        });
      }
      closeModal();
      fetchHolders();
    } catch (e) {
      setModalError(e.message);
    }
  }

  // Soft confirm for delete modal
  async function doDelete() {
    try {
      await apiRequest(`/holders/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      fetchHolders();
    } catch (e) {
      // optionally surface error
      setDeleteId(null);
    }
  }

  // Open the assignment modal for a holder - fetch available & held numbers
  async function openAssign(holder) {
    setAssignHolder(holder);
    try {
      const nums = await apiRequest(`/holders/${holder.id}/unique-numbers`);
      setAssignNumbers(nums); // Assumed shape: [{id, number, linked: bool}]
    } catch {
      setAssignNumbers([]);
    }
  }

  async function assignNumber(n) {
    try {
      await apiRequest(`/holders/${assignHolder.id}/unique-numbers/${n.id}/assign`, { method: "POST" });
      openAssign(assignHolder); // reload assignment state
    } catch {}
  }

  async function unassignNumber(n) {
    try {
      await apiRequest(`/holders/${assignHolder.id}/unique-numbers/${n.id}/unassign`, { method: "POST" });
      openAssign(assignHolder);
    } catch {}
  }

  return (
    <div>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24}}>
        <h2 style={{ color: "var(--button-bg)" }}>Digital ID Holders</h2>
        <button onClick={() => openModal(null)}
          style={{ background: "var(--button-bg)", color: "var(--button-text)", border: 0, borderRadius: 6, padding: "8px 22px", fontSize: 16, cursor: "pointer" }}>
          + Create Holder
        </button>
      </div>

      {loading ? (
        <div>Loading holders...</div>
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
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {holders.map(h => (
                <tr key={h.id} style={{borderBottom: "1px solid var(--border-color)"}}>
                  <td style={td}>{h.name}</td>
                  <td style={td}>{h.email}</td>
                  <td style={td}>
                    <button style={btnIcon} onClick={() => openModal(h)} title="Edit">✏️</button>
                    <button style={btnIcon} onClick={() => setDeleteId(h.id)} title="Delete">🗑️</button>
                    <button style={btnIcon} onClick={() => openAssign(h)} title="Link/Unlink Unique Numbers">🔗</button>
                  </td>
                </tr>
              ))}
              {holders.length === 0 && <tr><td colSpan={3} style={td}>No holders found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for add/edit */}
      {modalOpen && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={{color: "var(--button-bg)", marginBottom: 12}}>{editing ? "Edit Holder" : "Create Holder"}</h3>
            <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: 16}}>
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleInput}
                required
                style={inputStyle}
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleInput}
                required
                style={inputStyle}
                disabled={!!editing}
              />
              <button type="submit" style={{
                background: "var(--button-bg)", color: "var(--button-text)",
                border: 0, borderRadius: 6, padding: "12px 0", fontWeight: 600, fontSize: 15, cursor: "pointer"
              }}>{editing ? "Update" : "Create"}</button>
              {modalError && <div style={{color: "#c00", marginTop: 5}}>{modalError}</div>}
              <button type="button" onClick={closeModal} style={{marginTop: 3, color: "var(--button-bg)", background: "none", border: 0, cursor: "pointer"}}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for delete confirm */}
      {deleteId && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={{color: "var(--button-bg)", marginBottom: 15}}>Delete Holder?</h3>
            <div style={{marginBottom: 25}}>Are you sure you want to delete this holder?</div>
            <button onClick={doDelete} style={{...dangerBtn, marginRight: 12}}>Delete</button>
            <button onClick={() => setDeleteId(null)} style={cancelBtn}>Cancel</button>
          </div>
        </div>
      )}

      {/* Modal for linking/unlinking numbers */}
      {assignHolder && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={{color: "var(--button-bg)", marginBottom: 10}}>Assign Unique Numbers</h3>
            <div style={{ marginBottom: 14, color: "var(--text-primary)" }}>
              <b>{assignHolder.name}</b> ({assignHolder.email})
            </div>
            {assignNumbers.length === 0 ? (
              <div>No unique numbers found for this holder.</div>
            ) : (
              <table style={{width: "100%"}}>
                <thead>
                  <tr>
                    <th style={{...th, textAlign: "left"}}>Unique Number</th>
                    <th style={{...th, textAlign: "center"}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignNumbers.map((n) => (
                    <tr key={n.id}>
                      <td style={{padding: "7px 6px", fontSize: 15}}>{n.number}</td>
                      <td style={{textAlign: "center"}}>
                        {n.linked ? (
                          <button style={btnIcon} title="Unlink" onClick={() => unassignNumber(n)}>🗙 Unassign</button>
                        ) : (
                          <button style={btnIcon} title="Assign" onClick={() => assignNumber(n)}>🔗 Assign</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button onClick={() => setAssignHolder(null)} style={{marginTop: 20, color: "var(--button-bg)", background: "none", border: 0, cursor: "pointer"}}>Close</button>
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
