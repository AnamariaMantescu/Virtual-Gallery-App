const { body } = require('express-validator');

exports.createExhibitionValidationRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Titlul expoziției este obligatoriu.')
    .isLength({ min: 3 }).withMessage('Titlul trebuie să aibă minim 3 caractere.'),
  body('description')
    .optional()
    .isLength({ max: 1000 }).withMessage('Descrierea poate avea maxim 1000 de caractere.'),
  body('startDate')
    .optional()
    .isISO8601().withMessage('startDate trebuie să fie o dată validă (format ISO8601).'),
  body('endDate')
    .optional()
    .isISO8601().withMessage('endDate trebuie să fie o dată validă (format ISO8601).'),
  body('artworks')
    .optional()
    .isArray().withMessage('Artworks trebuie să fie un array.'),
  body('coverImage')
    .optional()
    .isURL().withMessage('coverImage trebuie să fie un URL valid.'),
];


exports.updateExhibitionValidationRules = [
  body('title')
    .optional()
    .isLength({ min: 3 }).withMessage('Titlul trebuie să aibă minim 3 caractere.'),
  body('description')
    .optional()
    .isLength({ max: 1000 }).withMessage('Descrierea poate avea maxim 1000 de caractere.'),
  body('startDate')
    .optional()
    .isISO8601().withMessage('startDate trebuie să fie o dată validă (format ISO8601).'),
  body('endDate')
    .optional()
    .isISO8601().withMessage('endDate trebuie să fie o dată validă (format ISO8601).'),
  body('artworks')
    .optional()
    .isArray().withMessage('Artworks trebuie să fie un array.'),
  body('coverImage')
    .optional()
    .isURL().withMessage('coverImage trebuie să fie un URL valid.'),
];
