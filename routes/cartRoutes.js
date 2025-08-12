// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');
const { requireAuth } = require('../middleware/authCookie');

// GET my cart
router.get('/', requireAuth, async (req, res) => {
  const items = await CartItem.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(items);
});

// ADD item
router.post('/', requireAuth, async (req, res) => {
  const body = req.body || {};
  const doc = await CartItem.create({
    userId: req.user.id,
    name: body.name,
    img: body.img,
    material: body.material,
    top: body.top || 0,
    bottom: body.bottom || 0,
    selectedTop: body.selectedTop || [],
    selectedBottom: body.selectedBottom || [],
    price: body.price || 0
  });
  res.status(201).json(doc);
});

// DELETE one
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  await CartItem.deleteOne({ _id: id, userId: req.user.id });
  res.json({ ok: true });
});

module.exports = router;
