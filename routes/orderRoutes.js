const express = require('express');
const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.put('/:id/status', updateOrderStatus);

module.exports = router;
