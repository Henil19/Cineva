const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authenticateUser(req, res, next) {
  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) return res.status(401).json({ error: 'Authentication is required.' });

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET is not configured.');
    return res.status(500).json({ error: 'Authentication is not configured.' });
  }

  try {
    const payload = jwt.verify(match[1], secret, { issuer: 'cineva-api' });
    if (typeof payload.sub !== 'string') return res.status(401).json({ error: 'Invalid or expired token.' });
    const user = await User.findById(payload.sub).select('_id name email');
    if (!user) return res.status(401).json({ error: 'Invalid or expired token.' });
    req.user = user;
    return next();
  } catch (error) {
    if (error.name !== 'JsonWebTokenError' && error.name !== 'TokenExpiredError' && error.name !== 'CastError') {
      console.error('Authentication lookup failed:', error);
      return res.status(500).json({ error: 'Authentication could not be verified.' });
    }
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

module.exports = authenticateUser;
