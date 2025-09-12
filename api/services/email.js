import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // automatically sets host/port
  auth: {
    user: process.env.GMAIL_USER, // your Gmail address
    pass: process.env.GMAIL_PASS, // your Gmail App Password (16 chars)
  },
  tls: {
    rejectUnauthorized: false, // 👈 bypass cert errors
  },
});

export const sendResetPasswordEmail = async (to, name, resetURL) => {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER, // sender email (must match GMAIL_USER)
      to,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${name},</p>
        <p>You requested a password reset. Click the link below:</p>
        <a href="${resetURL}" target="_blank">${resetURL}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.error("SMTP Error:", err);
    throw new Error("Failed to send reset email");
  }
};
