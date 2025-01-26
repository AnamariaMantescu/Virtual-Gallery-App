const { body } = require('express-validator');

exports.registerUserValidationRules = [
  body('email')
    .notEmpty().withMessage('Email-ul este obligatoriu.')
    .isEmail().withMessage('Format de email invalid.'),
  body('name')
    .notEmpty().withMessage('Numele este obligatoriu.')
    .isLength({ min: 2 }).withMessage('Numele trebuie să aibă minim 2 caractere.')
];
