// src/components/admin/AdminPanel.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin/adminPanel.css";

const ROLES = ["admin", "dma", "operator", "user"];

export default function AdminPanel() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMsg("");

      const res = await fetch(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;

    return users.filter((u) => {
      const name = (u.username || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const role = (u.role || "").toLowerCase();
      return name.includes(q) || email.includes(q) || role.includes(q);
    });
  }, [users, query]);

  const updateRole = async (userId, role) => {
    try {
      setUpdatingId(userId);
      setError("");
      setSuccessMsg("");

      const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update role");

      setSuccessMsg(
        `✅ Updated role: ${data.user.username} → ${data.user.role}`
      );

      // ✅ update local state
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: data.user.role } : u))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-page">
      {/* Back */}
      <div className="admin-back">
        <button className="page-back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
      </div>

      <div className="page-header">
        <h1 className="page-title">Admin Panel</h1>
        <p className="page-subtitle">Manage users and roles securely.</p>
      </div>

      {/* Search */}
      <div className="admin-toolbar">
        <input
          className="admin-search"
          placeholder="Search by username / email / role..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className="admin-refresh-btn" onClick={fetchUsers}>
          Refresh
        </button>
      </div>

      {/* Status messages */}
      {loading && <p className="info-text">Loading users...</p>}
      {error && <p className="error-text">{error}</p>}
      {successMsg && <p className="success-text">{successMsg}</p>}

      {/* Users table */}
      {!loading && !error && (
        <div className="admin-table">
          <div className="admin-table-header">
            <span>Username</span>
            <span>Email</span>
            <span>Current Role</span>
            <span>Change Role</span>
            <span>Action</span>
          </div>

          {filteredUsers.length === 0 ? (
            <p className="info-text" style={{ padding: "1rem" }}>
              No users found.
            </p>
          ) : (
            filteredUsers.map((u) => (
              <div key={u._id} className="admin-table-row">
                <span className="admin-username">{u.username}</span>
                <span className="admin-email">{u.email}</span>

                <span>
                  <span className={`role-pill role-${u.role}`}>{u.role}</span>
                </span>

                <span>
                  <select
                    className="role-select"
                    defaultValue={u.role}
                    onChange={(e) => {
                      const newRole = e.target.value;
                      // immediate update
                      updateRole(u._id, newRole);
                    }}
                    disabled={updatingId === u._id}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </span>

                <span>
                  {updatingId === u._id ? (
                    <span className="mini-loading">Updating...</span>
                  ) : (
                    <span className="ok-text">✓</span>
                  )}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
