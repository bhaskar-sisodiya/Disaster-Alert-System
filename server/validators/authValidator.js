// validators/authValidator.js
export const validateRegisterInput = ({ username, email, password }) => {
  if (!username || !email || !password) {
    return { ok: false, status: 400, message: "All fields are required" };
  }
  return { ok: true };
};

export const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    return { ok: false, status: 400, message: "Email and password are required" };
  }
  return { ok: true };
};
