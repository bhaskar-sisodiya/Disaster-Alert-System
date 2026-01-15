// controllers/weatherController.js
import { getWeatherByLocation } from "../services/weatherService.js";

export const getWeather = async (req, res) => {
  try {
    const location = req.query.location;

    const result = await getWeatherByLocation(location);

    if (!result.ok) {
      return res.status(result.status).json({ message: result.message });
    }

    res.json(result.data);
  } catch (err) {
    console.error("Weather error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
