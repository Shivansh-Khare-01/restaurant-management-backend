const express = require('express');
const { getChefs } = require('../controllers/chefController');

const router = express.Router();

// get all chefs
router.get('/', getChefs);

module.exports = router;

