// services/emergencyNumberService.js
import EmergencyNumber from "../models/EmergencyNumber.js";

export const upsertEmergencyNumber = async ({ category, numberEntry }) => {
  return EmergencyNumber.findOneAndUpdate(
    { category },
    {
      $push: {
        numbers: {
          name: numberEntry.name,
          number: numberEntry.number,
          description: numberEntry.description || "",
          isNational:
            numberEntry.isNational !== undefined ? numberEntry.isNational : true,
        },
      },
    },
    {
      new: true,
      upsert: true,
    }
  );
};

export const fetchAllEmergencyNumbers = async () => {
  return EmergencyNumber.find().sort({ createdAt: -1 });
};

export const fetchEmergencyByCategory = async (category) => {
  return EmergencyNumber.findOne({ category });
};
