// controllers/emergencyNumberController.js

import {
  fetchAllEmergencyNumbers,
  fetchEmergencyByCategory,
  upsertEmergencyNumber,
} from "../services/emergencyNumberService.js";

import { validateEmergencyNumberInput } from "../validators/emergencyNumberValidator.js";

/**
 * POST /api/emergency
 * Add emergency number to a category (UPSERT)
 */
export const createEmergencyNumber = async (req, res) => {
  try {
    const { category, numbers } = req.body;

    const valid = validateEmergencyNumberInput({ category, numbers });
    if (!valid.ok) {
      return res.status(valid.status).json({ message: valid.message });
    }

    const emergency = await upsertEmergencyNumber({
      category,
      numberEntry: valid.numberEntry,
    });

    res.status(201).json({
      message: "Emergency number added successfully",
      data: emergency,
    });
  } catch (error) {
    console.error("Error creating emergency number:", error);
    res.status(500).json({
      message: "Error creating emergency number",
      error: error.message,
    });
  }
};

/**
 * GET /api/emergency
 * Fetch all emergency numbers
 */
export const getAllEmergencyNumbers = async (req, res) => {
  try {
    const emergencyNumbers = await fetchAllEmergencyNumbers();
    res.status(200).json(emergencyNumbers);
  } catch (error) {
    console.error("Error fetching emergency numbers:", error);
    res.status(500).json({
      message: "Error fetching emergency numbers",
      error: error.message,
    });
  }
};

/**
 * GET /api/emergency/:category
 * Fetch emergency numbers by category
 */
export const getEmergencyByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const data = await fetchEmergencyByCategory(category);

    if (!data) {
      return res.status(200).json({
        category,
        numbers: [],
        message: "No emergency numbers added yet for this category",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching emergency numbers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
