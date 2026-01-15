// services/notificationService.js
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { buildAlertEmailTemplate } from "../utils/emailTemplates/alertEmailTemplate.js";

export const notifyUsersAboutAlert = async ({ alert, locationKey }) => {
  if (!alert || alert.type === "Not a Disaster") return;

  const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
  const viewAlertsLink = `${CLIENT_URL}/alerts/view`;

  const users = await User.find({
    email: { $exists: true, $ne: "" },
    locationKey,
  }).select("email");

  for (const user of users) {
    await sendEmail({
      to: user.email,
      subject: `🚨 ${alert.type} Alert in ${alert.location}`,
      html: buildAlertEmailTemplate({ alert, viewAlertsLink }),
    });
  }

  console.log("✅ Email notifications sent");
};
