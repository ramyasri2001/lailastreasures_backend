const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

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