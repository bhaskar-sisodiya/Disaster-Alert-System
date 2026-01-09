import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/profile.css";

export default function Profile() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    username: "",
    phone: "",
    gender: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setProfile(data);
    setForm({
      username: data.username,
      phone: data.phone || "",
      gender: data.gender || "Prefer not to say",
      location: data.location || "",
    });
    setLoading(false);
  };

  const handleUpdate = async () => {
    setMessage("");

    const res = await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setMessage(data.message);
    setEditMode(false);
    fetchProfile();
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      {/* 🔙 BACK BUTTON */}
      <button className="page-back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <h1>{profile?.isAdmin ? "Admin Profile" : "User Profile"}</h1>

      <div className="profile-card">
        {/* VIEW MODE */}
        {!editMode && (
          <div className="profile-view">
            <p>
              <b>Username:</b> {profile.username}
            </p>
            <p>
              <b>Email:</b> {profile.email}
            </p>
            <p>
              <b>Phone:</b> {profile.phone || "—"}
            </p>
            <p>
              <b>Gender:</b> {profile.gender}
            </p>
            <p>
              <b>Location:</b> {profile.location || "—"}
            </p>

            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </div>
        )}

        {/* EDIT MODE */}
        {editMode && (
          <div className="profile-form">
            <label>Username</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <label>Email</label>
            <input value={profile.email} readOnly />

            <label>Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <label>Gender</label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option>Prefer not to say</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <label>Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />

            <div className="profile-actions">
              <button onClick={handleUpdate}>Save</button>
              <button
                className="btn-outline"
                onClick={() => {
                  setEditMode(false);
                  setForm({
                    username: profile.username,
                    phone: profile.phone || "",
                    gender: profile.gender || "Prefer not to say",
                    location: profile.location || "",
                  });
                }}
              >
                Cancel
              </button>
            </div>

            {message && <p className="success-text">{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
