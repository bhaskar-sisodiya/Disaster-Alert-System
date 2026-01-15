// services/weatherService.js

export const getWeatherByLocation = async (location) => {
  if (!location) {
    return { ok: false, status: 400, message: "Location is required" };
  }

  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 500, message: "Weather API key missing" };
  }

  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(
    location
  )}&aqi=no`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    return {
      ok: false,
      status: 404,
      message: data?.error?.message || "Weather not found",
    };
  }

  return {
    ok: true,
    data: {
      location: data.location.name,
      region: data.location.region,
      country: data.location.country,
      climate: data.current.condition.text,
      temperatureC: data.current.temp_c,
      windKph: data.current.wind_kph,
      humidity: data.current.humidity,
    },
  };
};
