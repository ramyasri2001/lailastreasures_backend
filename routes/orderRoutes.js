// routes/orderRoutes.js
const express = require('express');
const router = express.Router();

const DesignOrder = require('../models/DesignOrder');
const Product = require('../models/products');
const { requireAuth } = require('../middleware/authCookie'); // ⬅️ add this

/**
 * GET /api/order?category=gold-grillz.html
 * Returns { category, order: [designKey, ...] }
 * If no order doc exists yet, seed by name ASC.
 *
 * If you want GET to be public, remove `requireAuth` on this route.
 */
router.get('/', requireAuth, async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) return res.status(400).json({ error: 'category is required' });

    let doc = await DesignOrder.findOne({ category });
    if (!doc) {
      // Seed with unique designKeys from products in this category
      const products = await Product.find({ category }).sort({ name: 1, material: 1 });
      const seen = new Set();
      const order = [];
      for (const p of products) {
        if (p.designKey && !seen.has(p.designKey)) {
          seen.add(p.designKey);
          order.push(p.designKey);
        }
      }
      doc = await DesignOrder.create({ category, order });
    }
    res.json(doc);
  } catch (e) {
    console.error('GET /api/order error:', e);
    res.status(500).json({ error: e.message });
  }
});

/**
 * PUT /api/order
 * Body: { category: string, order: string[] }  // array of designKeys
 * Admin-only.
 */
router.put('/', requireAuth, async (req, res) => {
  try {
    const { category, order } = req.body;
    if (!category || !Array.isArray(order)) {
      return res.status(400).json({ error: 'category and order[] required' });
    }

    const doc = await DesignOrder.findOneAndUpdate(
      { category },
      { category, order },
      { upsert: true, new: true }
    );
    res.json(doc);
  } catch (e) {
    console.error('PUT /api/order error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;