// components/EmergencyNumbers.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./../styles/emergency.css";

export default function EmergencyNumbers() {
  const { category } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API_URL}/emergency/${decodeURIComponent(category)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || "Failed to fetch emergency numbers");
        }

        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNumbers();
  }, [category]);

  return (
    <div className="emergency-page">
      {/* 🔙 Back button */}
      <button className="page-back-btn" onClick={() => navigate("/emergency")}>
        ← Back
      </button>

      {/* 🔹 Title */}
      <div className="page-header">
        <h1 className="page-title">{decodeURIComponent(category)}</h1>
      </div>

      {/* 🔄 Loading */}
      {loading && <p className="info-text">Loading emergency numbers...</p>}

      {/* ❌ Error */}
      {!loading && error && <p className="error-text">{error}</p>}

      {/* 📭 Empty State */}
      {!loading && !error && data?.numbers?.length === 0 && (
        <div className="empty-state">
          <p>No emergency numbers available for this category yet.</p>
        </div>
      )}

      {/* 📞 Numbers List */}
      {!loading && !error && data?.numbers?.length > 0 && (
        <div className="numbers-list">
          {data.numbers.map((item, index) => (
            <div key={index} className="number-card">
              <h3>{item.name}</h3>
              <p className="number">{item.number}</p>
              {item.description && <p>{item.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
