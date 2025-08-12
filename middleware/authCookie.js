// middleware/authCookie.js
const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'lt_auth';

function setAuthCookie(res, payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'None',  // required for cross‑site (Netlify -> Render)
    secure: true,      // required on HTTPS (Render is HTTPS)
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
    req.user = { id: payload.id, name: payload.name, email: payload.email };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid session' });
  }
}

module.exports = { setAuthCookie, clearAuthCookie, requireAuth, COOKIE_NAME };