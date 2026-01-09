// models/EmergencyNumber.js

import mongoose from "mongoose";

const emergencyNumberSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        "Universal",
        "Police",
        "Medical",
        "Fire",
        "Women & Children",
        "Cyber & Financial Fraud",
        "Utilities",
        "Animal & Environment",
        "International"
      ]
    },
    numbers: [
      {
        name: { type: String, required: true },
        number: { type: String, required: true },
        description: { type: String },
        isNational: { type: Boolean, default: true }
      }
    ]
  },
  { timestamps: true } // adds createdAt/updatedAt automatically
);

const EmergencyNumber = mongoose.model("EmergencyNumber", emergencyNumberSchema);

export default EmergencyNumber;