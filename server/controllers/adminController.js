// controllers/adminController.js

import User from "../models/User.js";

const ALLOWED_ROLES = ["admin", "dma", "operator", "user"];

/**
 * PUT /api/admin/users/:id/role
 * Admin updates a user's role
 */
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // 1) Validate role
    if (!role || !ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
        allowedRoles: ALLOWED_ROLES,
      });
    }

    // 2) Find user
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 3) Prevent admin from demoting themselves (recommended)
    if (req.user._id.toString() === user._id.toString() && role !== "admin") {
      return res.status(400).json({
        message: "You cannot remove your own admin role",
      });
    }

    // 4) Update role
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
