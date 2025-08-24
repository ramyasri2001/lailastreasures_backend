const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  // unique machine key for URLs
  slug: { type: String, required: true, unique: true },

  // display info
  title: { type: String, required: true },
  subtitle: String,
  heroImage: String, // optional image filename (assets/images/..)

  // where it appears on the site (you can expand)
  location: { 
    type: String, 
    enum: ['grillz', 'homepage', 'nav', 'footer'], 
    default: 'grillz' 
  },

  // how products should be fetched when this section is opened
  productFilter: {
    category: String,   // e.g. 'gold-grillz.html'
    designKey: String,  // optional
    material: String    // optional
  },

  // default material to preselect when going to product page from this section
  defaultMaterial: String, // e.g. '10K Gold' or 'Silver'

  // ordering + visibility
  sortOrder: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Section', sectionSchema);