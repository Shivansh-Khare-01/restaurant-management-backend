const Order = require('../models/Order');
const User = require('../models/User');
const Chef = require('../models/Chef');
const { ORDER_STATUS, ORDER_TYPE, TIMESPAN } = require('../utils/constants');
const { getOrders } = require('./orderController');

exports.getAnalyticsMetrics = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalChefs = await Chef.countDocuments();
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        total_chefs: totalChefs,
        total_revenue: totalRevenue[0] && totalRevenue[0].total ? totalRevenue[0].total : 0,
        total_orders: totalOrders,
        total_users: totalUsers,
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getAnalyticsOrderSummary = async (req, res, next) => {
  try {
    const timespan = req.query.timespan || TIMESPAN.DAILY;
    const startDate = new Date();
    const endDate = new Date();
    if (TIMESPAN.DAILY === timespan) {
      startDate.setDate(startDate.getDate() - 1);
    } else if (TIMESPAN.WEEKLY === timespan) {
      startDate.setDate(startDate.getDate() - 7);
    } else if (TIMESPAN.MONTHLY === timespan) {
      startDate.setDate(startDate.getDate() - 30);
    } else if (TIMESPAN.YEARLY === timespan) {
      startDate.setDate(startDate.getDate() - 365);
    }

    const orderDone = await Order.countDocuments({
      status: {
        $in: [ORDER_STATUS.SERVED, ORDER_STATUS.PICKED_UP],
      },
      created_at: {
        $gte: startDate,
        $lte: endDate
      }
    });

    const dineInOrder = await Order.countDocuments({
      type: ORDER_TYPE.DINE_IN,
      created_at: {
        $gte: startDate,
        $lte: endDate
      }
    });
    const takeAwayOrder = await Order.countDocuments({
      type: ORDER_TYPE.TAKE_AWAY,
      created_at: {
        $gte: startDate,
        $lte: endDate
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        order_done: orderDone,
        dine_in_order: dineInOrder,
        take_away_order: takeAwayOrder,
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getAnalyticsRevenue = async (req, res, next) => {
  try {
    const timespan = req.query.timespan || TIMESPAN.DAILY;
    const results = [];
    const endDate = new Date();
    // Set to end of current day
    endDate.setHours(23, 59, 59, 999);
  
    for (let i = 6; i >= 0; i--) {
      let startDate = new Date(endDate);
      let periodEndDate = new Date(endDate);
      let label = '';
      
      if (TIMESPAN.DAILY === timespan) {
        // For daily: go back i days for start, i-1 days for end
        startDate.setDate(endDate.getDate() - i);
        startDate.setHours(0, 0, 0, 0); // Start of day
        
        periodEndDate.setDate(endDate.getDate() - i);
        periodEndDate.setHours(23, 59, 59, 999); // End of day
        
        label = startDate.toLocaleString('default', { weekday: 'short' });
      } else if (TIMESPAN.WEEKLY === timespan) {
        // Similar adjustments for other timespans
        startDate.setDate(endDate.getDate() - (i + 1) * 7);
        periodEndDate.setDate(endDate.getDate() - i * 7);
        label = `Week ${7-i}`;
      } else if (TIMESPAN.MONTHLY === timespan) {
        startDate.setMonth(endDate.getMonth() - i);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        
        periodEndDate = new Date(startDate);
        periodEndDate.setMonth(periodEndDate.getMonth() + 1);
        periodEndDate.setDate(0);
        periodEndDate.setHours(23, 59, 59, 999);
        
        label = startDate.toLocaleString('default', { month: 'short' });
      } else if (TIMESPAN.YEARLY === timespan) {
        startDate.setFullYear(endDate.getFullYear() - i);
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        
        periodEndDate = new Date(startDate);
        periodEndDate.setFullYear(periodEndDate.getFullYear() + 1);
        periodEndDate.setMonth(0, 0);
        periodEndDate.setHours(23, 59, 59, 999);
        
        label = startDate.getFullYear().toString();
      }
      
      const periodRevenue = await Order.aggregate([
        {
          $match: {
            created_at: {
              $gte: startDate,
              $lte: periodEndDate
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' }
          }
        }
      ]);
      
      results.push({
        label,
        revenue: periodRevenue && periodRevenue.length > 0 ? periodRevenue[0].total : 0
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        revenues: results
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};



