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

  // ✅ choose mode
  const [coordMode, setCoordMode] = useState("auto"); // "auto" | "manual"

  // ✅ keep coords as strings (simpler for input + formdata)
  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const [fetchingLoc, setFetchingLoc] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- AUTO FETCH DEVICE LOCATION ---------------- */
  const fetchDeviceLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setFetchingLoc(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        });
        setFetchingLoc(false);
      },
      (err) => {
        console.error(err);
        setError("Location permission denied or unavailable.");
        setFetchingLoc(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  /* ---------------- IMAGE HANDLERS ---------------- */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // cleanup old preview
    if (preview) URL.revokeObjectURL(preview);

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
  };

  /* ---------------- VALIDATE COORDS ---------------- */
  const validateCoords = () => {
    if (!coords.lat || !coords.lng) return false;

    const latNum = Number(coords.lat);
    const lngNum = Number(coords.lng);

    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) return false;
    if (latNum < -90 || latNum > 90) return false;
    if (lngNum < -180 || lngNum > 180) return false;

    return true;
  };

  /* ---------------- CREATE ALERT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!image) {
      setError("Please upload an image");
      return;
    }

    if (!validateCoords()) {
      setError(
        coordMode === "auto"
          ? "Please fetch your device location first."
          : "Please enter valid latitude and longitude."
      );
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

      // ✅ send coords
      formData.append("lat", coords.lat);
      formData.append("lng", coords.lng);

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

      // ✅ ensure DB created
      if (!data?._id) {
        toast.info(data.message || "No alert created");
        return;
      }

      toast.success(`✅ Alert created: ${data.type} (${data.severity})`);

      // Reset form
      setLocation("");
      removeImage();
      setCoords({ lat: "", lng: "" });
      setCoordMode("auto");

      onCreated && onCreated();
    } catch (err) {
      console.error("Create alert error:", err);
      setError(err.message);
      toast.error(err.message);
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

        {/* ✅ COORD MODE */}
        <div className="coord-mode">
          <label>
            <input
              type="radio"
              name="coordMode"
              value="auto"
              checked={coordMode === "auto"}
              onChange={() => {
                setCoordMode("auto");
                setCoords({ lat: "", lng: "" });
              }}
            />
            Use Device Location
          </label>

          <label>
            <input
              type="radio"
              name="coordMode"
              value="manual"
              checked={coordMode === "manual"}
              onChange={() => {
                setCoordMode("manual");
                setCoords({ lat: "", lng: "" });
              }}
            />
            Enter Coordinates Manually
          </label>
        </div>

        {/* ✅ AUTO MODE */}
        {coordMode === "auto" && (
          <>
            <button
              type="button"
              className="fetch-location-btn"
              onClick={fetchDeviceLocation}
              disabled={fetchingLoc}
            >
              {fetchingLoc ? "Fetching location..." : "📍 Fetch My Location"}
            </button>

            {coords.lat && coords.lng && (
              <div className="coords-display">
                <p>
                  <b>Latitude:</b> {coords.lat}
                </p>
                <p>
                  <b>Longitude:</b> {coords.lng}
                </p>
              </div>
            )}
          </>
        )}

        {/* ✅ MANUAL MODE */}
        {coordMode === "manual" && (
          <div className="manual-coords">
            <input
              type="number"
              step="any"
              placeholder="Latitude (e.g. 28.6139)"
              value={coords.lat}
              onChange={(e) => setCoords({ ...coords, lat: e.target.value })}
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude (e.g. 77.2090)"
              value={coords.lng}
              onChange={(e) => setCoords({ ...coords, lng: e.target.value })}
            />
          </div>
        )}

        {/* IMAGE */}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          // capture="environment"
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
              Remove Preview
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
