// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    name:   { type: String, required: true },
    email:  { type: String, required: true },
    message:{ type: String, required: true },
    designs:{ type: Array,  default: [] }, // snapshot of saved designs (optional)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);