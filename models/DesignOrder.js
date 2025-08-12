// models/DesignOrder.js
const mongoose = require('mongoose');

const DesignOrderSchema = new mongoose.Schema(
  {
    // e.g. "gold-grillz.html" | "silver-grillz.html" | "rosegold-grillz.html"
    category: { type: String, required: true, unique: true },
    // ordered list of design keys (NOT per material)
    order: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DesignOrder', DesignOrderSchema);