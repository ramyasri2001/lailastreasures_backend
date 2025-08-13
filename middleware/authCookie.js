// middleware/authCookie.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const COOKIE_NAME = 'lt_auth';

function setAuthCookie(res, payload) {
  // payload should contain: { id, name, email, isAdmin }
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    path: '/',
  });
}

function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'Not logged in' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // {id,name,email,isAdmin}
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid session' });
  }
}

async function requireAdmin(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not logged in' });
    // double‑check in DB in case role changed
    const u = await User.findById(req.user.id).select('isAdmin');
    if (!u || !u.isAdmin) return res.status(403).json({ message: 'Admins only' });
    next();
  } catch (e) {
    return res.status(403).json({ message: 'Admins only' });
  }
}

module.exports = { setAuthCookie, clearAuthCookie, requireAuth, requireAdmin, COOKIE_NAME };
