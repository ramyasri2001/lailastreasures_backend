const express = require('express');
const CartItem = require('../models/CartItem');
const requireUser = require('../middleware/requireUser');
const router = express.Router();

// Get my cart
router.get('/', requireUser, async (req, res) => {
  const items = await CartItem.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(items);
});

// Add to cart
router.post('/', requireUser, async (req, res) => {
  const { name, img, material, top, bottom, selectedTop, selectedBottom, price } = req.body;
  const item = await CartItem.create({
    userId: req.user.id,
    name, img, material, top, bottom,
    selectedTop: selectedTop || [],
    selectedBottom: selectedBottom || [],
    price: Number(price) || 0
  });
  res.status(201).json(item);
});

// Remove a single item
router.delete('/:id', requireUser, async (req, res) => {
  const { id } = req.params;
  await CartItem.deleteOne({ _id: id, userId: req.user.id });
  res.json({ ok: true });
});

// Clear entire cart
router.delete('/', requireUser, async (req, res) => {
  await CartItem.deleteMany({ userId: req.user.id });
  res.json({ ok: true });
});

module.exports = router;