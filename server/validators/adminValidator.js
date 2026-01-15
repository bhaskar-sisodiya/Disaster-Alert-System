export const validateRoleUpdate = (role) => {
  const allowed = ["admin", "dma", "operator", "user"];

  if (!role || !allowed.includes(role)) {
    return {
      ok: false,
      status: 400,
      message: `Invalid role. Allowed roles: ${allowed.join(", ")}`,
    };
  }

  return { ok: true, value: role };
};

export const validateMongoId = (id) => {
  if (!id || id.length !== 24) {
    return { ok: false, status: 400, message: "Invalid user ID" };
  }
  return { ok: true };
};
