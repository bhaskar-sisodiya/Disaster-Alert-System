import { useEffect, useState } from "react";
import "./../styles/weatherBadge.css";

export default function WeatherBadge() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const profile = JSON.parse(localStorage.getItem("profile") || "null");
  const token = localStorage.getItem("token");

  // ✅ choose location
  // If user has location in profile, use it otherwise default to India
  const locationQuery = profile?.location?.trim() || "India";

  const fetchWeather = async () => {
    try {
      setError("");

      if (!token) return; // only for logged in users

      const res = await fetch(
        `${API_URL}/weather?location=${encodeURIComponent(locationQuery)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load weather");

      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }
  };

  useEffect(() => {
    fetchWeather();

    // ✅ refresh weather every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [locationQuery]);

  if (!token) return null; // don't show if not logged in

  return (
    <div className="weather-badge" title={error ? error : "Weather"}>
      {!weather ? (
        <span className="weather-loading">🌦️ Loading...</span>
      ) : (
        <>
          <span className="weather-temp">
            🌡️ {weather.temperatureC}°C
          </span>

          <span className="weather-climate">• {weather.climate}</span>

          <span className="weather-wind">
            • 💨 {weather.windKph} km/h
          </span>
        </>
      )}
    </div>
  );
}
