const express = require('express');
const {
  getAnalyticsMetrics,
  getAnalyticsOrderSummary,
  getAnalyticsRevenue,
} = require('../controllers/analyticsController');

const router = express.Router();

router.get('/metrics', getAnalyticsMetrics);
router.get('/order-summary', getAnalyticsOrderSummary);
router.get('/revenue', getAnalyticsRevenue);

module.exports = router;
