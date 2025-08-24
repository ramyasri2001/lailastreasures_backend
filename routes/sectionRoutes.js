const express = require('express');
const router = express.Router();
const Section = require('../models/Section');
const { requireAdmin } = require('../middleware/authCookie');

// PUBLIC: list visible sections (optionally by location)
router.get('/', async (req, res) => {
  try {
    const { location, all } = req.query;
    const q = all === '1' ? {} : { isVisible: true };
    if (location) q.location = location;
    const sections = await Section.find(q).sort({ sortOrder: 1, title: 1 });
    res.json(sections);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUBLIC: get by slug (even hidden—if you prefer restrict, add isVisible filter)
router.get('/:slug', async (req, res) => {
  try {
    const s = await Section.findOne({ slug: req.params.slug });
    if (!s) return res.status(404).json({ error: 'Not found' });
    res.json(s);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: create or update (upsert by slug)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { slug, title, subtitle, heroImage, location, productFilter, defaultMaterial, isVisible } = req.body;
    if (!slug || !title) return res.status(400).json({ error: 'slug and title required' });

    const doc = await Section.findOneAndUpdate(
      { slug },
      { slug, title, subtitle, heroImage, location, productFilter, defaultMaterial, isVisible },
      { new: true, upsert: true }
    );
    res.json(doc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: delete
router.delete('/:slug', requireAdmin, async (req, res) => {
  try {
    await Section.findOneAndDelete({ slug: req.params.slug });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ADMIN: reorder (set sortOrder by array of slugs)
router.put('/reorder', requireAdmin, async (req, res) => {
  try {
    const { slugs } = req.body; // ['gold-grillz','silver-grillz',...]
    if (!Array.isArray(slugs)) return res.status(400).json({ error: 'slugs[] required' });

    const bulk = slugs.map((slug, i) => ({
      updateOne: { filter: { slug }, update: { sortOrder: i } }
    }));
    if (bulk.length) await Section.bulkWrite(bulk);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;