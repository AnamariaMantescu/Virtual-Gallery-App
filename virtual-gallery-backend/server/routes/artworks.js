const express = require('express');
const router = express.Router();
const {
  getAllArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork
} = require('../controllers/artworksController');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

const {
  createArtworkValidationRules,
  updateArtworkValidationRules
} = require('../validators/artworkValidators');
const validateRequest = require('../middleware/validate');

router.get('/', getAllArtworks);
router.get('/:id', getArtworkById);

router.post(
  '/',
  authMiddleware,
  requireAdmin,
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

router.delete('/:id', authMiddleware, requireAdmin, deleteArtwork);

module.exports = router;
