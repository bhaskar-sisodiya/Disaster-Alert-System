// utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your Gmail
      pass: process.env.EMAIL_PASS, // App password (not normal password)
    },
  });

  await transporter.sendMail({
    from: `"Disaster Alert System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
