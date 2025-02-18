const express = require('express');
const router = express.Router();

const { getAllStyles } = require('../controllers/stylesController');

router.get('/', getAllStyles);

module.exports = router;
