// controllers/userController.js
import User from "../models/User.js";
import { normalizeLocationKey, toTitleCase } from "../utils/locationUtils.js";

/**
 * GET /api/users/profile
 * Get logged-in user's profile
 */
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

/**
 * PUT /api/users/profile
 * Update user profile (safe fields + avatar)
 */
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ USERNAME UPDATE
    if (req.body.username && req.body.username !== user.username) {
      const usernameExists = await User.findOne({ username: req.body.username });

      if (usernameExists && usernameExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Username already taken" });
      }

      user.username = req.body.username;
    }

    // ✅ SAFE FIELDS
    user.phone = req.body.phone ?? user.phone;
    user.gender = req.body.gender ?? user.gender;

    // ✅ LOCATION
    if (req.body.location !== undefined) {
      user.location = req.body.location ? toTitleCase(req.body.location) : "";
      user.locationKey = req.body.location ? normalizeLocationKey(req.body.location) : "";
    }

    // ✅ AVATAR
    const allowedAvatars = ["avatar1", "avatar2", "avatar3", "avatar4", "avatar5"];
    if (req.body.avatar && allowedAvatars.includes(req.body.avatar)) {
      user.avatar = req.body.avatar;
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        location: updatedUser.location,
        locationKey: updatedUser.locationKey, // optional but useful
        avatar: updatedUser.avatar,
        isAdmin: updatedUser.isAdmin, // ✅ READ ONLY
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Profile update failed" });
  }
};
