// utils/locationUtils.js
export const normalizeLocationKey = (value = "") =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

export const toTitleCase = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
