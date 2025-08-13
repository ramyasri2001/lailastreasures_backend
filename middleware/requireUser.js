const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'lt_auth';

module.exports = function requireUser(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'Not logged in' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, name: payload.name, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid session' });
  }
};