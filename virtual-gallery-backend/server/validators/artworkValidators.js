const { body } = require('express-validator');

exports.createArtworkValidationRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Titlul este obligatoriu.')
    .isLength({ min: 3 }).withMessage('Titlul trebuie să conțină cel puțin 3 caractere.'),
  body('artist')
    .trim()
    .notEmpty().withMessage('Artistul este obligatoriu.')
    .isLength({ min: 3 }).withMessage('Artistul trebuie să conțină cel puțin 3 caractere.'),
  body('year')
    .optional()
    .isInt({ min: 0, max: new Date().getFullYear() })
    .withMessage(`Anul trebuie să fie un număr între 0 și ${new Date().getFullYear()}.`),
  body('imageUrl')
    .optional()
    .isURL().withMessage('Link-ul (imageUrl) trebuie să fie un URL valid.'),
  body('status')
    .optional()
    .isIn(['available', 'sold', 'reserved'])
    .withMessage('Statusul poate fi doar "available", "sold" sau "reserved".'),
];

exports.updateArtworkValidationRules = [
  body('title')
    .optional()
    .isLength({ min: 3 }).withMessage('Titlul trebuie să conțină cel puțin 3 caractere.'),
  body('artist')
    .optional()
    .isLength({ min: 3 }).withMessage('Artistul trebuie să conțină cel puțin 3 caractere.'),
  body('year')
    .optional()
    .isInt({ min: 0, max: new Date().getFullYear() })
    .withMessage(`Anul trebuie să fie un număr între 0 și ${new Date().getFullYear()}.`),
  body('imageUrl')
    .optional()
    .isURL().withMessage('Link-ul (imageUrl) trebuie să fie un URL valid.'),
  body('status')
    .optional()
    .isIn(['available', 'sold', 'reserved'])
    .withMessage('Statusul poate fi doar "available", "sold" sau "reserved".'),
];
