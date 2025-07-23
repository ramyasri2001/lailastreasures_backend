const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendResetEmail(to, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `https://lailastreasures.netlify.app/reset-password.html?token=${token}`;

  const mailOptions = {
    from: `"Laila's Treasures" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your password",
    html: `<p>Click the link below to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Reset email sent:", info.response);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}

module.exports = sendResetEmail;
