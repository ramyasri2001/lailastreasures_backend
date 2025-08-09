// routes/messageRoutes.js
const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Create
router.post('/', async (req, res) => {
  try {
    const { name, email, message, designs } = req.body;
    const doc = await Message.create({ name, email, message, designs: designs || [] });
    res.status(201).json(doc);
  } catch (e) {
    console.error('POST /api/messages failed:', e);
    res.status(500).json({ error: e.message });
  }
});

// List newest first
router.get('/', async (_req, res) => {
  try {
    const items = await Message.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;