// controllers/authController.js

import { generateToken } from "../utils/generateToken.js";
import { registerNewUser, loginExistingUser } from "../services/authService.js";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../validators/authValidator.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const valid = validateRegisterInput({ username, email, password });
    if (!valid.ok)
      return res.status(valid.status).json({ message: valid.message });

    const result = await registerNewUser({ username, email, password });
    if (!result.ok)
      return res.status(result.status).json({ message: result.message });

    const user = result.user;

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const valid = validateLoginInput({ email, password });
    if (!valid.ok)
      return res.status(valid.status).json({ message: valid.message });

    const result = await loginExistingUser({ email, password });
    if (!result.ok)
      return res.status(result.status).json({ message: result.message });

    const user = result.user;

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
