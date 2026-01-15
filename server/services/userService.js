// services/userService.js
import User from "../models/User.js";
import { normalizeLocationKey, toTitleCase } from "../utils/locationUtils.js";

export const getUserProfileById = async (userId) => {
  return User.findById(userId).select("-password");
};

export const updateUserProfileById = async (userId, body) => {
  const user = await User.findById(userId);
  if (!user) return null;

  // ✅ USERNAME UPDATE (unique check)
  if (body.username && body.username !== user.username) {
    const usernameExists = await User.findOne({ username: body.username });

    if (usernameExists && usernameExists._id.toString() !== user._id.toString()) {
      return { error: { status: 400, message: "Username already taken" } };
    }

    user.username = body.username;
  }

  // ✅ SAFE FIELDS
  user.phone = body.phone ?? user.phone;
  user.gender = body.gender ?? user.gender;

  // ✅ LOCATION
  if (body.location !== undefined) {
    user.location = body.location ? toTitleCase(body.location) : "";
    user.locationKey = body.location ? normalizeLocationKey(body.location) : "";
  }

  // ✅ AVATAR (validation handled by validator/controller)
  if (body.avatar) {
    user.avatar = body.avatar;
  }

  const updatedUser = await user.save();

  return {
    user: {
      username: updatedUser.username,
      email: updatedUser.email,
      phone: updatedUser.phone,
      gender: updatedUser.gender,
      location: updatedUser.location,
      locationKey: updatedUser.locationKey,
      avatar: updatedUser.avatar,
      isAdmin: updatedUser.isAdmin,
    },
  };
};
