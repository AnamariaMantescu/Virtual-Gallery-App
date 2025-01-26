const express = require('express');
const router = express.Router();
const {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection
} = require('../controllers/collectionsController');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

const {
  createCollectionValidationRules,
  updateCollectionValidationRules
} = require('../validators/collectionValidators');
const validateRequest = require('../middleware/validate');


router.get('/', getAllCollections);
router.get('/:id', getCollectionById);

router.post(
  '/',
  authMiddleware,
  requireAdmin,
  createCollectionValidationRules, 
  validateRequest,
  createCollection
);

router.put(
  '/:id',
  authMiddleware,
  requireAdmin,
  updateCollectionValidationRules, 
  validateRequest,
  updateCollection
);

router.delete('/:id', authMiddleware, requireAdmin, deleteCollection);

module.exports = router;
