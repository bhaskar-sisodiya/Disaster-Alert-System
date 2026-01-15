// components/EmergencyCategories.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./../styles/emergency.css";

export default function EmergencyCategories() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const role = JSON.parse(localStorage.getItem("profile") || "null")?.role;
  const canAddEmergency = role === "admin" || role === "dma";

  const categories = [
    "Universal",
    "Police",
    "Medical",
    "Fire",
    "Women & Children",
    "Cyber & Financial Fraud",
    "Utilities",
    "Animal & Environment",
    "International",
  ];

  // 🔹 FORM STATE
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!category || !name || !number) {
      setError("Category, name and number are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/emergency`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          numbers: [
            {
              name,
              number,
              description,
              isNational: true,
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add emergency number");
      }

      setSuccess("Emergency number added successfully");
      setName("");
      setNumber("");
      setDescription("");
      setCategory("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="emergency-page">
      {/* 🔙 BACK BUTTON */}
      <button className="page-back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      {/* 🔹 HEADER */}
      <div className="page-header">
        <h1 className="page-title">Emergency Categories</h1>
      </div>

      {/* 🔹 ADD NUMBER FORM */}
      {canAddEmergency && (
        <form className="alert-form" onSubmit={handleSubmit}>
          <h3>Add Emergency Number</h3>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Service name (e.g. Police Control Room)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Emergency number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />

          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit">Add Number</button>
        </form>
      )}

      {/* 🔹 GRID */}
      <div className="emergency-grid" style={{ marginTop: "3rem" }}>
        {categories.map((cat) => (
          <div
            key={cat}
            className="emergency-card"
            onClick={() => navigate(`/emergency/${encodeURIComponent(cat)}`)}
          >
            <h3>{cat}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
