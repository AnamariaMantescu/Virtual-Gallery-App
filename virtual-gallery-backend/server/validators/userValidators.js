const { body } = require('express-validator');

exports.updateUserValidationRules = [
  body('name')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Numele trebuie să conțină minim 2 caractere.'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Email invalid.'),

  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Rolul poate fi doar "admin" sau "user".')
];
