// models/Section.js
const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  // e.g. "gold-grillz.html" (must be unique)
  slug: { type: String, required: true, unique: true, trim: true },

  // e.g. "Gold", "Silver", "Rose Gold"
  name: { type: String, required: true, trim: true },

  // cover image file or URL (optional)
  image: { type: String, default: '' },

  // order on the grillz landing page
  position: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Section', sectionSchema);