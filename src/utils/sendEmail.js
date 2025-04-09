import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (email, resetLink) => {
  console.log(`[sendEmail] sending to ${email} with link ${resetLink}`);

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Password Reset Request',
    html: `<p>To reset your password, click <a href="${resetLink}">here</a>.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('[sendEmail] Message sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('[sendEmail] Error sending email:', err);
    throw err;
  }
};
