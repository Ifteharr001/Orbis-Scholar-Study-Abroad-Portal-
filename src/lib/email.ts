import nodemailer from "nodemailer";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const config: EmailConfig = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  };

  transporter = nodemailer.createTransport(config);
  return transporter;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM;

    // If SMTP credentials are not configured, log and return false (dev mode)
    if (!smtpUser || !smtpPass) {
      console.log("[EMAIL DEV MODE] Would send email:", {
        to: options.to,
        subject: options.subject,
      });
      return false;
    }

    const transporter = getTransporter();

    // Verify connection
    await transporter.verify();

    const fromAddress = smtpFrom || `"Orbis Scholar" <${smtpUser}>`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log("[EMAIL SENT]", info.messageId);
    return true;
  } catch (error) {
    console.error("[EMAIL ERROR]", error);
    return false;
  }
}

export function generateOTPEmail(otp: string, loginType: string): { subject: string; html: string; text: string } {
  const appName = "Orbis Scholar";
  const loginTypeLabel = loginType === "student" ? "Student" : loginType === "partner" ? "Partner" : "Counselor";

  const subject = `${appName} - Password Reset OTP for ${loginTypeLabel} Portal`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">${appName}</h1>
        <p style="color: #bfdbfe; margin: 10px 0 0; font-size: 16px;">${loginTypeLabel} Portal - Password Reset</p>
      </div>
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-top: none; padding: 30px; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px; margin-bottom: 20px;">You requested a password reset for your ${loginTypeLabel.toLowerCase()} account. Use the following OTP to proceed:</p>
        <div style="background: #f3f4f6; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: 800; color: #1e40af; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
          <strong>This OTP expires in 15 minutes.</strong> Do not share this code with anyone.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
        <p style="font-size: 12px; color: #9ca3af;">
          If you didn't request this, please ignore this email or contact support if you have concerns.
        </p>
      </div>
      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
      </div>
    </body>
    </html>
  `;

  const text = `
${appName} - Password Reset OTP for ${loginTypeLabel} Portal

Your OTP: ${otp}

This OTP expires in 15 minutes. Do not share this code with anyone.

If you didn't request this, please ignore this email.
  `.trim();

  return { subject, html, text };
}

export function generateInvitationEmail(inviteLink: string, role: string): { subject: string; html: string; text: string } {
  const appName = "Orbis Scholar";
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const subject = `${appName} - You're invited to join as ${roleLabel}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">${appName}</h1>
        <p style="color: #a7f3d0; margin: 10px 0 0; font-size: 16px;">Invitation to Join as ${roleLabel}</p>
      </div>
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-top: none; padding: 30px; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px; margin-bottom: 20px;">You've been invited to join <strong>Orbis Scholar</strong> as a <strong>${roleLabel}</strong>.</p>
        <p style="font-size: 16px; margin-bottom: 24px;">Click the button below to create your account and access the portal:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${inviteLink}" style="display: inline-block; background: #059669; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Create Account</a>
        </div>
        <p style="font-size: 14px; color: #6b7280;">
          Or copy this link to your browser:<br>
          <span style="word-break: break-all; color: #059669;">${inviteLink}</span>
        </p>
        <p style="font-size: 14px; color: #6b7280; margin-top: 24px;">
          <strong>This invitation expires in 7 days.</strong>
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
        <p style="font-size: 12px; color: #9ca3af;">
          If you didn't expect this invitation, please ignore this email.
        </p>
      </div>
      <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
        &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
      </div>
    </body>
    </html>
  `;

  const text = `
${appName} - You're invited to join as ${roleLabel}

You've been invited to join Orbis Scholar as a ${roleLabel}.

Create your account: ${inviteLink}

This invitation expires in 7 days.

If you didn't expect this invitation, please ignore this email.
  `.trim();

  return { subject, html, text };
}