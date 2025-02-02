const express = require('express');
const router = express.Router();

const {
  getAllArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  approveArtwork
} = require('../controllers/artworksController');

const {
  authMiddleware,
  optionalAuthMiddleware,
  requireAdmin
} = require('../middleware/auth');

const {
  createArtworkValidationRules,
  updateArtworkValidationRules
} = require('../validators/artworkValidators');
const validateRequest = require('../middleware/validate');

router.get('/', optionalAuthMiddleware, getAllArtworks);

router.get('/:id', optionalAuthMiddleware, getArtworkById);

router.post(
  '/',
  authMiddleware,
  createArtworkValidationRules,
  validateRequest,
  createArtwork
);

router.put(
  '/:id',
  authMiddleware,
  requireAdmin,
  updateArtworkValidationRules,
  validateRequest,
  updateArtwork
);

router.patch(
  '/:id/approve',
  authMiddleware,
  requireAdmin,
  approveArtwork
);

router.delete('/:id', authMiddleware, requireAdmin, deleteArtwork);

module.exports = router;
