const { admin } = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token lipsește' });
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
        res.status(401).json({ error: 'Token invalid' });
    }
};

const requireAdmin = async (req, res, next) => {
    try {
        await authMiddleware(req, res, async () => {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Acces interzis - Necesită rol de admin' });
            }
            next();
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { authMiddleware, requireAdmin };