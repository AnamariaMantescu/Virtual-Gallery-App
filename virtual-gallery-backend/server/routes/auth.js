const express = require('express');
const router = express.Router();
const { admin } = require('../config/firebase');
const { authMiddleware } = require('../middleware/auth');

// new user
router.post('/register', async (req, res) => {
    try {
        const { email } = req.body;
        const token = req.headers.authorization?.split('Bearer ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Token lipsește' });
        }
        
        const decodedToken = await admin.auth().verifyIdToken(token);
        await admin.auth().setCustomUserClaims(decodedToken.uid, { role: 'user' });
        
        res.status(201).json({ 
            message: 'Utilizator înregistrat cu succes',
            uid: decodedToken.uid 
        });
    } catch (error) {
        console.error('Eroare înregistrare:', error);
        res.status(400).json({ error: error.message });
    }
});

// verify token and user
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const userRecord = await admin.auth().getUser(req.user.uid);
        
        res.json({
            uid: userRecord.uid,
            email: userRecord.email,
            role: req.user.role
        });
    } catch (error) {
        res.status(401).json({ error: 'Token invalid' });
    }
});

module.exports = router;