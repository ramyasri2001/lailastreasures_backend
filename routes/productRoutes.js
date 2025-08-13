const express = require('express');
const Product = require('../models/products');
const { requireAdmin } = require('../middleware/authCookie');
const router = express.Router();

// CREATE/UPDATE (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, designKey, category, material, price, img } = req.body;
    const doc = await Product.findOneAndUpdate(
      { name, material, category },
      { name, designKey, category, material, price, img },
      { new: true, upsert: true }
    );
    res.json(doc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// LIST (public)
router.get('/', async (req, res) => {
  try {
    const { category, name, material, designKey } = req.query;
    const q = {};
    if (category) q.category = category;
    if (name) q.name = name;
    if (material) q.material = material;
    if (designKey) q.designKey = designKey;
    const items = await Product.find(q).sort({ name: 1, material: 1 });
    res.json(items);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;