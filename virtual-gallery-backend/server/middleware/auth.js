const { admin } = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization?.startsWith('Bearer ')) {
      return next({ statusCode: 401, message: 'Token lipsă' });
    }

    const token = req.headers.authorization.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'user'
    };

    next();
  } catch (error) {
    console.error('Eroare verificare token:', error);
    return next({ statusCode: 401, message: 'Token invalid' });
  }
};

const optionalAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: decodedToken.role || 'user'
      };
    } catch (error) {
      console.error('OptionalAuth: Error verifying token:', error.message);
    }
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  next();
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  requireAdmin
};
