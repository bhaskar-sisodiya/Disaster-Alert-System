// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", function () {
  if (!this.isModified("password")) return;
  return bcrypt.hash(this.password, 10).then(hash => {
    this.password = hash;
  });
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);