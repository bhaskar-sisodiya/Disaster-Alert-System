// models/Alert.js
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
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
    status: {
      type: String,
      enum: ["no_action", "in_process", "resolved"],
      default: "no_action",
    },
    statusUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    statusUpdatedAt: {
      type: Date,
      default: null,
    },
    assignedDma: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Alert = mongoose.model("Alert", alertSchema);
export default Alert;
