import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/latestalert.css";

export default function LatestAlertNotification() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [latest, setLatest] = useState(null);
  const [visible, setVisible] = useState(false);

  const hideTimerRef = useRef(null);
  const pollRef = useRef(null);

  // ✅ Format time like "2 mins ago"
  const timeAgo = (isoDate) => {
    if (!isoDate) return "";
    const diff = Date.now() - new Date(isoDate).getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs} hr ago`;
  };

  const showForOneMinute = () => {
    setVisible(true);

    // clear old timer
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    // hide after 1 minute
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
    }, 60 * 1000);
  };

  const fetchLatestAlert = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/alerts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return;

      // Alerts are sorted latest first in backend, so first is latest
      const latestRealAlert = Array.isArray(data)
        ? data.find((a) => a.type !== "Not a Disaster")
        : null;

      if (!latestRealAlert) return;

      if (!latest || latest._id !== latestRealAlert._id) {
        setLatest(latestRealAlert);
        showForOneMinute();
      }
    } catch (err) {
      console.error("Latest alert fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLatestAlert();

    // ✅ poll every 10 seconds (works without socket)
    pollRef.current = setInterval(fetchLatestAlert, 10000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [latest]);

  if (!latest || !visible) return null;

  return (
    <div
      className="latest-alert"
      onClick={() => navigate("/alerts/view")}
      role="button"
      tabIndex={0}
    >
      <div className="latest-alert-left">
        <div className="latest-alert-badge">🚨</div>
        <div className="latest-alert-text">
          <p className="latest-alert-title">
            <b>{latest.type}</b> in <b>{latest.location}</b>
          </p>
          <p className="latest-alert-time">
            {timeAgo(latest.createdAt || latest.timestamp)}
          </p>
        </div>
      </div>

      <div className="latest-alert-right">
        <span className="latest-alert-link">See full details →</span>
      </div>
    </div>
  );
}
