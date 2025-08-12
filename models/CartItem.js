// models/CartItem.js
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  userId: { type: String, index: true, required: true },
  name: String,
  img: String,
  material: String,
  top: Number,
  bottom: Number,
  selectedTop: [Number],
  selectedBottom: [Number],
  price: Number,
}, { timestamps: true });

module.exports = mongoose.model('CartItem', CartItemSchema);
