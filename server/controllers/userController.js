// controllers/userController.js

import {
  getUserProfileById,
  updateUserProfileById,
} from "../services/userService.js";

import { validateAvatar } from "../validators/userValidator.js";

/**
 * GET /api/users/profile
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await getUserProfileById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

/**
 * PUT /api/users/profile
 */
export const updateUserProfile = async (req, res) => {
  try {
    const avatarCheck = validateAvatar(req.body.avatar);
    if (!avatarCheck.ok) {
      return res.status(avatarCheck.status).json({ message: avatarCheck.message });
    }

    // If avatar is valid, replace with the validated one
    if (avatarCheck.value) req.body.avatar = avatarCheck.value;

    const result = await updateUserProfileById(req.user._id, req.body);

    if (!result) return res.status(404).json({ message: "User not found" });

    if (result.error) {
      return res.status(result.error.status).json({ message: result.error.message });
    }

    res.json({
      message: "Profile updated successfully",
      user: result.user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Profile update failed" });
  }
};
