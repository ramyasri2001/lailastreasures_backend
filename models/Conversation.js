const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  admin:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // your admin user (optional)
  status:   { type: String, enum: ['open','closed'], default: 'open' },
  lastMessageAt: { type: Date, default: Date.now },
  customerUnread: { type: Number, default: 0 },
  adminUnread:    { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);