// components/Profile.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/profile.css";
import { avatars } from "../constants/avatars";

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
    avatar: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load profile");

      setProfile(data);

      // ✅ update localStorage so Navbar role/username stays correct
      localStorage.setItem("profile", JSON.stringify(data));

      setForm({
        avatar: data.avatar || "avatar1",
        username: data.username || "",
        phone: data.phone || "",
        gender: data.gender || "Prefer not to say",
        location: data.location || "",
      });
    } catch (err) {
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Profile update failed");

      setMessage(data.message || "Profile updated successfully");
      setEditMode(false);

      // ✅ refresh profile (also updates localStorage)
      fetchProfile();
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage(err.message);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p className="error-text">Profile not found</p>;

  return (
    <div className="profile-page">
      {/* 🔙 BACK BUTTON */}
      <button className="page-back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <h1>
        {profile?.role ? `${profile.role.toUpperCase()} Profile` : "Profile"}
      </h1>

      <div className="profile-card">
        {/* VIEW MODE */}
        {!editMode && (
          <div className="profile-view">
            <img
              src={avatars[profile.avatar] || avatars.avatar1}
              alt="Avatar"
              className="profile-avatar"
            />
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
            <label>Choose Avatar</label>

            <div className="avatar-grid">
              {Object.keys(avatars).map((key) => (
                <img
                  key={key}
                  src={avatars[key]}
                  alt={key}
                  className={`avatar-option ${
                    form.avatar === key ? "selected" : ""
                  }`}
                  onClick={() => setForm({ ...form, avatar: key })}
                />
              ))}
            </div>

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
                    avatar: profile.avatar || "avatar1",
                    username: profile.username || "",
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
