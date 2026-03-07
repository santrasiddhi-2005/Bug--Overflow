import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@bugoverflow.local";

const canSendEmail =
  Boolean(process.env.SMTP_HOST) &&
  Boolean(process.env.SMTP_PORT) &&
  Boolean(process.env.SMTP_USER) &&
  Boolean(process.env.SMTP_PASS);

const transporter = canSendEmail
  ? nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    family: 4,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
  : null;

export const sendOtpEmail = async ({ to, subject, otp, purpose }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.5; color:#111;">
      <h2>BugOverflow verification</h2>
      <p>Your OTP for ${purpose} is:</p>
      <p style="font-size: 24px; letter-spacing: 4px; font-weight: 700;">${otp}</p>
      <p>This OTP expires in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;

  if (!transporter) {
    console.log(`[OTP:${purpose}] ${to} -> ${otp}`);
    return { sent: false, fallback: true };
  }

  if (transporter) {
    transporter.verify((error, success) => {
      if (error) {
        console.log("SMTP ERROR:", error);
      } else {
        console.log("SMTP server ready");
      }
    });
  }

  try {
    await transporter.sendMail({
      from: fromEmail,
      to,
      subject,
      text: `Your OTP for ${purpose} is ${otp}. It expires in 10 minutes.`,
      html,
    });

    return { sent: true, fallback: false };
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw error;
  }

  return { sent: true, fallback: false };
};
