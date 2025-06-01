const express = require('express');
const {
  getMenuItemsByCategory,
  getCategories,
  getMenuItemById,
} = require('../controllers/menuItemController');

const router = express.Router();

router.get('/category/:category', getMenuItemsByCategory);
router.get('/categories', getCategories);
router.get('/:id', getMenuItemById);

module.exports = router;
