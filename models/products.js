const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },           // e.g. "Open Face"
  designKey: { type: String, required: true },      // slug for de-duping in gallery (e.g. "open-face")
  category: { type: String, required: true },       // "gold-grillz.html" | "silver-grillz.html" | "rosegold-grillz.html"
  material: { type: String, required: true },       // "10K Gold" | "8K Gold" | "Silver" | "Rose Gold" | "Plated Rose Gold" | "Florida Gold"
  price: { type: Number, required: true },          // per tooth
  img: { type: String, required: true }             // filename under /assets/images
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);