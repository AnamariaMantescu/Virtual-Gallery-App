const { body } = require('express-validator');

exports.createCollectionValidationRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Titlul colecției este obligatoriu.')
    .isLength({ min: 3 }).withMessage('Titlul trebuie să aibă minim 3 caractere.'),
  body('description')
    .optional()
    .isLength({ max: 1000 }).withMessage('Descrierea poate avea maxim 1000 de caractere.'),
  body('curator')
    .optional()
    .isLength({ min: 3 }).withMessage('Numele curatorului, dacă există, trebuie să aibă minim 3 caractere.'),
  body('theme')
    .optional()
    .isLength({ max: 200 }).withMessage('Theme poate avea maxim 200 de caractere.'),
  body('isPublic')
    .optional()
    .isBoolean().withMessage('isPublic trebuie să fie boolean.'),
  body('artworks')
    .optional()
    .isArray().withMessage('Artworks trebuie să fie un array.'),
];

exports.updateCollectionValidationRules = [
  body('title')
    .optional()
    .isLength({ min: 3 }).withMessage('Titlul trebuie să aibă minim 3 caractere.'),
  body('description')
    .optional()
    .isLength({ max: 1000 }).withMessage('Descrierea poate avea maxim 1000 de caractere.'),
  body('curator')
    .optional()
    .isLength({ min: 3 }).withMessage('Numele curatorului, dacă există, trebuie să aibă minim 3 caractere.'),
  body('theme')
    .optional()
    .isLength({ max: 200 }).withMessage('Theme poate avea maxim 200 de caractere.'),
  body('isPublic')
    .optional()
    .isBoolean().withMessage('isPublic trebuie să fie boolean.'),
  body('artworks')
    .optional()
    .isArray().withMessage('Artworks trebuie să fie un array.'),
];
