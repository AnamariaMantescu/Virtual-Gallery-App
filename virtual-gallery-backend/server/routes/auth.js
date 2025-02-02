const express = require('express');
const router = express.Router();
const { admin, db } = require('../config/firebase');
const { authMiddleware } = require('../middleware/auth');


const { registerUserValidationRules } = require('../validators/authValidators');
const validateRequest = require('../middleware/validate');


router.post(
  '/register',
  registerUserValidationRules,
  validateRequest,
  async (req, res, next) => {
    try {
      const { email, name } = req.body;

      const existingUser = await admin.auth().getUserByEmail(email).catch(() => null);
      if (existingUser) {
        return next({ statusCode: 400, message: 'Email-ul este deja înregistrat.' });
      }

      const userRecord = await admin.auth().createUser({
        email,
        displayName: name,
        emailVerified: false,
        disabled: false
      });

      await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'user' });

      await db.collection('users').doc(userRecord.uid).set({
        name: name || '',
        email,
        role: 'user',
        createdAt: new Date().toISOString()
      });

      return res.status(201).json({
        message: 'Utilizator înregistrat cu succes',
        uid: userRecord.uid
      });
    } catch (error) {
      console.error('Eroare înregistrare:', error);
      next({ statusCode: 400, message: error.message });
    }
  }
);

router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const userRecord = await admin.auth().getUser(req.user.uid);
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      role: req.user.role,
      name: userData.name || ''
    });
  } catch (error) {
    console.error('Eroare obținere user:', error);
    next({ statusCode: 401, message: 'Token invalid' });
  }
});

module.exports = router;
