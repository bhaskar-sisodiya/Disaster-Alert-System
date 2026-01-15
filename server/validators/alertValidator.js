// validators/alertValidator.js
export const validateSingleFileUpload = (req) => {
  if (req.files && req.files.length > 1) {
    return {
      ok: false,
      status: 400,
      message: "Only one image can be uploaded at a time",
    };
  }

  const imageBuffer = req.file?.buffer;
  const mimeType = req.file?.mimetype;

  if (!imageBuffer) {
    return { ok: false, status: 400, message: "Image file is required" };
  }

  const supportedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!supportedTypes.includes(mimeType)) {
    return {
      ok: false,
      status: 400,
      message: `Unsupported format: ${mimeType}. Please upload JPEG, PNG, or WebP.`,
    };
  }

  return { ok: true, imageBuffer, mimeType };
};

export const validateLatLng = (lat, lng) => {
  if (lat === undefined || lng === undefined) {
    return {
      ok: false,
      status: 400,
      message: "Latitude and longitude are required for mapping",
    };
  }

  const latNum = Number(lat);
  const lngNum = Number(lng);

  if (
    Number.isNaN(latNum) ||
    Number.isNaN(lngNum) ||
    latNum < -90 ||
    latNum > 90 ||
    lngNum < -180 ||
    lngNum > 180
  ) {
    return { ok: false, status: 400, message: "Invalid latitude/longitude" };
  }

  return { ok: true, latNum, lngNum };
};

export const validateMongoId = (id) => {
  if (!id || id.length !== 24) {
    return { ok: false, status: 400, message: "Invalid alert ID" };
  }
  return { ok: true };
};

export const validateAlertStatus = (status) => {
  const allowed = ["no_action", "in_process", "resolved"];
  if (!status || !allowed.includes(status)) {
    return {
      ok: false,
      status: 400,
      message: `Invalid status. Allowed: ${allowed.join(", ")}`,
    };
  }
  return { ok: true, value: status };
};

export const validateDmaUserId = (id) => {
  if (!id || id.length !== 24) {
    return { ok: false, status: 400, message: "Invalid DMA user ID" };
  }
  return { ok: true, value: id };
};
