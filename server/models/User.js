// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default: "avatar1", // fallback avatar
    },

    phone: { type: String, default: "" },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
      default: "Prefer not to say",
    },
    location: { type: String, default: "" },
    locationKey: { type: String, default: "" },
    role: {
      type: String,
      enum: ["admin", "dma", "operator", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

/* ✅ CORRECT pre-save hook */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

/* Compare password */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
