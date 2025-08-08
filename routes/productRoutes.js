const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Create / Update
router.post('/', async (req, res) => {
  try {
    const { name, designKey, category, material, price, img } = req.body;
    const doc = await Product.findOneAndUpdate(
      { name, material, category },                  // unique per material
      { name, designKey, category, material, price, img },
      { new: true, upsert: true }
    );
    res.json(doc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// List with optional filters
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

// Delete one
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;