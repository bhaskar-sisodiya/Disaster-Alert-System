// services/authService.js
import User from "../models/User.js";

export const registerNewUser = async ({ username, email, password }) => {
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return { ok: false, status: 400, message: "Email already registered" };
  }

  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return { ok: false, status: 400, message: "Username already taken" };
  }

  const user = await User.create({ username, email, password, role: "user" });
  return { ok: true, user };
};

export const loginExistingUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return { ok: false, status: 401, message: "Invalid credentials" };
  }

  return { ok: true, user };
};
