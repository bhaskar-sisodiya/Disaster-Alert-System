// validators/userValidator.js
export const validateAvatar = (avatar) => {
  const allowedAvatars = ["avatar1", "avatar2", "avatar3", "avatar4", "avatar5"];

  if (!avatar) return { ok: true, value: null };

  if (!allowedAvatars.includes(avatar)) {
    return { ok: false, status: 400, message: "Invalid avatar selection" };
  }

  return { ok: true, value: avatar };
};
