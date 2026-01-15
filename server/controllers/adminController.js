// controllers/adminController.js

import User from "../models/User.js";

const ALLOWED_ROLES = ["admin", "dma", "operator", "user"];

/**
 * GET /api/admin/users
 * Admin: fetch all users (without passwords)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * PUT /api/admin/users/:id/role
 * Admin updates a user's role
 */
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // ✅ validate role
    if (!role || !ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
        allowedRoles: ALLOWED_ROLES,
      });
    }

    // ✅ find user
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ prevent admin from demoting themselves
    if (req.user._id.toString() === user._id.toString() && role !== "admin") {
      return res.status(400).json({
        message: "You cannot remove your own admin role",
      });
    }

    // ✅ update role
    user.role = role;
    await user.save();

    return res.json({
      message: "User role updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update user role error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
