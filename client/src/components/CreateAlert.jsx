import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import "./../styles/alerts.css";

export default function CreateAlert({ onCreated }) {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- IMAGE HANDLERS ---------------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setImage(null);
    setPreview(null);
  };

  /* ---------------- CREATE ALERT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!image) {
      setError("Please upload an image");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("location", location);
      formData.append("image", image);

      const res = await fetch(`${API_URL}/alerts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create alert");
        return;
      }

      // ✅ must check that _id exists
      if (!data?._id) {
        toast.info(data.message || "No alert created");
        return;
      }

      toast.success(`✅ Alert created: ${data.type} (${data.severity})`);

      // Reset form
      setLocation("");
      removeImage();

      onCreated && onCreated();
    } catch (err) {
      console.error("Create alert error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="alerts-page">
      {/* 🔙 BACK BUTTON */}
      <button className="page-back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      {/* 🔹 HEADER */}
      <div className="page-header">
        <h1 className="page-title">Create Alert</h1>
      </div>

      <form className="alert-form" onSubmit={handleSubmit}>
        {error && <p className="error-text">{error}</p>}

        <input
          type="text"
          placeholder="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          // capture="environment" ,image/*
          onChange={handleImageChange}
        />

        {/* 🖼️ IMAGE PREVIEW */}
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
            <button
              type="button"
              className="remove-image-btn"
              onClick={removeImage}
            >
              Remove Image
            </button>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Create Alert"}
        </button>
      </form>

      <div className="below-form-link">
        <button
          type="button"
          className="view-alerts-link"
          onClick={() => navigate("/alerts/view")}
        >
          View Active Alerts →
        </button>
      </div>
    </div>
  );
}
