const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  name:     { type: String, required: true },
  material: { type: String, required: true },
  img:      { type: String, default: '' },
  top:      { type: Number, default: 0 },
  bottom:   { type: Number, default: 0 },
  selectedTop:    { type: [Number], default: [] },
  selectedBottom: { type: [Number], default: [] },
  price:    { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('CartItem', CartItemSchema);