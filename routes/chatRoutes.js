const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const { requireAuth } = require('../middleware/authCookie');

async function isAdminUser(userId) {
  const u = await User.findById(userId).select('isAdmin');
  return !!u?.isAdmin;
}

// Start or get a conversation for the current user
router.post('/conversations/start', requireAuth, async (req, res) => {
  try {
    let convo = await Conversation.findOne({ customer: req.user.id });
    if (!convo) {
      const admin = await User.findOne({ isAdmin: true }).select('_id');
      convo = await Conversation.create({
        customer: req.user.id,
        admin: admin?._id || undefined,
      });
    }
    res.json(convo);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// List my conversations (admin gets all, customer gets their one)
router.get('/conversations/mine', requireAuth, async (req, res) => {
  try {
    const isAdmin = await isAdminUser(req.user.id);
    if (isAdmin) {
      const list = await Conversation.find({})
        .sort({ lastMessageAt: -1 })
        .populate('customer', 'name email')
        .select('customer admin lastMessageAt customerUnread adminUnread status')
        .lean();
      return res.json({ role: 'admin', conversations: list });
    }
    const convo = await Conversation.findOne({ customer: req.user.id })
      .select('customer admin lastMessageAt customerUnread adminUnread status')
      .lean();
    res.json({ role: 'customer', conversation: convo || null });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Get messages in a conversation
router.get('/messages', requireAuth, async (req, res) => {
  try {
    const { conversationId } = req.query;
    const convo = await Conversation.findById(conversationId);
    if (!convo) return res.status(404).json({ error: 'Conversation not found' });
    const isMember = [convo.customer?.toString(), convo.admin?.toString()].includes(req.user.id);
    if (!isMember) return res.status(403).json({ error: 'Forbidden' });

    const msgs = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 });
    res.json(msgs);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Send a message
router.post('/messages', requireAuth, async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required' });

    const convo = await Conversation.findById(conversationId);
    if (!convo) return res.status(404).json({ error: 'Conversation not found' });
    const isMember = [convo.customer?.toString(), convo.admin?.toString()].includes(req.user.id);
    if (!isMember) return res.status(403).json({ error: 'Forbidden' });

    const msg = await Message.create({ conversation: convo._id, sender: req.user.id, text: text.trim() });

    const senderIsCustomer = convo.customer?.toString() === req.user.id;
    if (senderIsCustomer) convo.adminUnread += 1; else convo.customerUnread += 1;
    convo.lastMessageAt = new Date();
    await convo.save();

    res.json(msg);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Mark as read (clear my unread counter)
router.patch('/messages/read', requireAuth, async (req, res) => {
  try {
    const { conversationId } = req.body;
    const convo = await Conversation.findById(conversationId);
    if (!convo) return res.status(404).json({ error: 'Conversation not found' });

    const callerIsCustomer = convo.customer?.toString() === req.user.id;
    if (callerIsCustomer) convo.customerUnread = 0; else convo.adminUnread = 0;
    await convo.save();

    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;