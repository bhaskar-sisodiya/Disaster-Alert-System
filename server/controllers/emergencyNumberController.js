import EmergencyNumber from "../models/EmergencyNumber.js";

/**
 * POST /api/emergency
 * Add emergency number to a category (UPSERT)
 */
export const createEmergencyNumber = async (req, res) => {
  try {
    const { category, numbers } = req.body;

    // 🔴 Basic validation
    if (!category || !numbers || !Array.isArray(numbers) || numbers.length === 0) {
      return res.status(400).json({
        message: "Category and at least one emergency number are required",
      });
    }

    const numberEntry = numbers[0];

    if (!numberEntry.name || !numberEntry.number) {
      return res.status(400).json({
        message: "Emergency number must include name and number",
      });
    }

    // ✅ UPSERT: update if exists, else create
    const emergency = await EmergencyNumber.findOneAndUpdate(
      { category }, // find by category
      {
        $push: {
          numbers: {
            name: numberEntry.name,
            number: numberEntry.number,
            description: numberEntry.description || "",
            isNational:
              numberEntry.isNational !== undefined
                ? numberEntry.isNational
                : true,
          },
        },
      },
      {
        new: true,       // return updated document
        upsert: true,    // create if not exists
      }
    );

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
    const emergencyNumbers = await EmergencyNumber.find().sort({
      createdAt: -1,
    });

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

    const data = await EmergencyNumber.findOne({ category });

    // ✅ Category exists but no numbers added yet
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
