// routes/sectionRoutes.js
const express = require('express');
const Section = require('../models/Section');
const { requireAuth, requireAdmin } = require('../middleware/authCookie');

const router = express.Router();

/** List sections (public read) */
router.get('/', async (_req, res) => {
  try {
    const rows = await Section.find({}).sort({ position: 1, name: 1 });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** Get single section by slug (optional helper) */
router.get('/:slug', async (req, res) => {
  try {
    const row = await Section.findOne({ slug: req.params.slug });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** Create/Update section (admin only) */
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { slug, name, image, position } = req.body;
    if (!slug || !name) return res.status(400).json({ error: 'slug and name are required' });

    const doc = await Section.findOneAndUpdate(
      { slug },
      { slug, name, image: image || '', position: Number(position) || 0 },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(doc);
  } catch (e) {
    // duplicate slug gives a 11000 Mongo error
    if (e.code === 11000) return res.status(409).json({ error: 'Slug already exists' });
    res.status(500).json({ error: e.message });
  }
});

/** Delete section (admin only) */
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await Section.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;