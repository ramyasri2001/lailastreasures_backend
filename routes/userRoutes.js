const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// ✅ Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Error registering user." });
  }
});

// ✅ Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.status(200).json({ message: "Login successful", name: user.name });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
});

// ✅ Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();
    console.log("✅ Token generated and saved:");
console.log("Email:", email);
console.log("Token:", token);
console.log("Token expiry:", new Date(user.resetTokenExpiry).toLocaleString());
    await sendEmail(email, token); // ✅ pass token only
    console.log(`Reset link sent to ${email}: https://lailastreasures.netlify.app/reset-password.html?email=${encodeURIComponent(email)}&token=${token}`);
    res.status(200).json({ message: "Password reset email sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Error sending reset email." });
  }
});

// ✅ Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;
  console.log("Reset password attempt:", { email, token });

  const debugUser = await User.findOne({ email });
  if (debugUser) {
    console.log("Stored token:", debugUser.resetToken);
    console.log("Stored expiry:", debugUser.resetTokenExpiry);
    console.log("Current time:", Date.now());
  }

  try {
    const user = await User.findOne({
      email,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      console.log("User not found or token expired");
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful!" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Error resetting password." });
  }
});

module.exports = router;