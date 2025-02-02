const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/usersController');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

const {
  updateUserValidationRules
} = require('../validators/userValidators');
const validateRequest = require('../middleware/validate');

router.get('/', authMiddleware, requireAdmin, getAllUsers);

router.get('/:id', authMiddleware, getUserById);

router.put(
  '/:id',
  authMiddleware,
  updateUserValidationRules,
  validateRequest,
  updateUser
);

router.delete('/:id', authMiddleware, requireAdmin, deleteUser);

module.exports = router;
