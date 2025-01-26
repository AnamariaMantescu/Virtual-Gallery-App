const express = require('express');
const router = express.Router();
const {
  getAllExhibitions,
  getExhibitionById,
  createExhibition,
  updateExhibition,
  deleteExhibition
} = require('../controllers/exhibitionsController');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

const {
  createExhibitionValidationRules,
  updateExhibitionValidationRules
} = require('../validators/exhibitionValidators');
const validateRequest = require('../middleware/validate');

router.get('/', getAllExhibitions);
router.get('/:id', getExhibitionById);

router.post(
  '/',
  authMiddleware,
  requireAdmin,
  createExhibitionValidationRules, 
  validateRequest,
  createExhibition
);

router.put(
  '/:id',
  authMiddleware,
  requireAdmin,
  updateExhibitionValidationRules, 
  validateRequest,
  updateExhibition
);

router.delete('/:id', authMiddleware, requireAdmin, deleteExhibition);

module.exports = router;
