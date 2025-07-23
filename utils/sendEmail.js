const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail(to, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `https://lailastreasures.netlify.app/reset-password.html?email=${encodeURIComponent(to)}&token=${token}`;

  const subject = "Reset Your Password - Laila's Treasures";
  const html = `
    <p>Hello,</p>
    <p>Click below to reset your password:</p>
    <a href="${resetLink}" target="_blank">${resetLink}</a>
    <p>This link will expire in 1 hour.</p>
    <p>— Laila's Treasures</p>
  `;

  const mailOptions = {
    from: `"Laila's Treasures" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Reset email sent:", info.response);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}

module.exports = sendEmail;