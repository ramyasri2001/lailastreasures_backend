const express = require('express');
const router = express.Router();
const User = require('../models/User');

// TEMPORARY: make a user admin by email
router.post('/dev/make-admin', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'email required' });

    const u = await User.findOneAndUpdate(
      { email },
      { isAdmin: true },
      { new: true }
    );
    if (!u) return res.status(404).json({ message: 'User not found' });

    res.json({ ok: true, email: u.email, isAdmin: u.isAdmin });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;