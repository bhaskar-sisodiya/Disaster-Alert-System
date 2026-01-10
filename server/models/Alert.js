import mongoose from "mongoose";

const alertSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      // enum: ["fire", "flood", "earthquake", "accident"]
    },
    imageUrl: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    severity: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
    },
    reason: { type: String },
    location: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Alert = mongoose.model("Alert", alertSchema);
export default Alert;
