// validators/emergencyNumberValidator.js
export const validateEmergencyNumberInput = ({ category, numbers }) => {
  if (!category || !numbers || !Array.isArray(numbers) || numbers.length === 0) {
    return {
      ok: false,
      status: 400,
      message: "Category and at least one emergency number are required",
    };
  }

  const numberEntry = numbers[0];

  if (!numberEntry?.name || !numberEntry?.number) {
    return {
      ok: false,
      status: 400,
      message: "Emergency number must include name and number",
    };
  }

  return { ok: true, numberEntry };
};
