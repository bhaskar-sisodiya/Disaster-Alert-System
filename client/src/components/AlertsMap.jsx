import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./../styles/alertsmap.css";
import "../utils/leafletFix";

export default function AlertsMap() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [alerts, setAlerts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [boundary, setBoundary] = useState(null);
  const [error, setError] = useState("");

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/alerts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch alerts");

      const arr = Array.isArray(data) ? data : [];

      // keep only those with coords
      const withCoords = arr.filter(
        (a) => typeof a.lat === "number" && typeof a.lng === "number"
      );

      setAlerts(withCoords);
      setSelected(withCoords[0] || null);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // boundary load
  useEffect(() => {
    fetch("/india_boundary.geojson")
      .then((r) => r.json())
      .then((d) => setBoundary(d))
      .catch(() => {});
  }, []);

  const center = useMemo(() => {
    if (selected?.lat && selected?.lng) return [selected.lat, selected.lng];
    return [22.9734, 78.6569]; // India center
  }, [selected]);

  return (
    <div className="alerts-page">
      <button className="page-back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <div className="page-header">
        <h1 className="page-title">Alerts Map (Last 24 Hours)</h1>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="map-layout">
        {/* LEFT MAP */}
        <div className="map-box">
          <MapContainer center={center} zoom={5} className="leaflet-map">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Survey of India boundary overlay */}
            {boundary && (
              <GeoJSON
                data={boundary}
                style={() => ({
                  color: "#2563eb",
                  weight: 2,
                  fillOpacity: 0,
                })}
              />
            )}

            {alerts.map((a) => (
              <Marker
                key={a._id}
                position={[a.lat, a.lng]}
                eventHandlers={{
                  click: () => setSelected(a),
                }}
              >
                <Popup>
                  <b>{a.type}</b>
                  <br />
                  {a.location}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* RIGHT DETAILS */}
        <div className="details-box">
          {!selected ? (
            <div className="empty-state">
              <p>No alerts found for map view.</p>
            </div>
          ) : (
            <div className="alert-details-card">
              {selected.imageUrl && (
                <img
                  src={selected.imageUrl}
                  alt="alert"
                  className="details-image"
                />
              )}

              <h2 className="details-title">{selected.type}</h2>

              <p>
                <b>Location:</b> {selected.location}
              </p>
              <p>
                <b>Severity:</b> {selected.severity}
              </p>
              <p>
                <b>Reason:</b> {selected.reason}
              </p>
              <p>
                <b>Time:</b>{" "}
                {new Date(selected.createdAt || selected.timestamp).toLocaleString()}
              </p>
              <p>
                <b>Lat:</b> {selected.lat.toFixed(5)} | <b>Lng:</b>{" "}
                {selected.lng.toFixed(5)}
              </p>

              <button className="btn-primary" onClick={() => navigate("/alerts/view")}>
                View Active Alerts →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
