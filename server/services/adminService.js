import User from "../models/User.js";

export const fetchAllUsers = async () => {
  return User.find().select("-password").sort({ createdAt: -1 });
};

export const updateUserRoleById = async ({ userId, role }) => {
  const user = await User.findById(userId);
  if (!user) return null;

  user.role = role;
  await user.save();

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    location: user.location,
    phone: user.phone,
    gender: user.gender,
  };
};
