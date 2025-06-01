const Chef = require('../models/Chef');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const MenuItem = require('../models/MenuItem');
const { ORDER_STATUS } = require('./constants');


const getAvailableChefId = async () => {
  try {
    // Fetch all chefs
    const chefs = await Chef.find();

    if (chefs.length === 0) throw new Error("No chefs available");

    // Find min order_taken value
    const minOrders = Math.min(...chefs.map(chef => chef.order_taken));

    // Filter chefs with minOrders
    const eligibleChefs = chefs.filter(chef => chef.order_taken === minOrders);

    if (eligibleChefs.length === 1) return eligibleChefs[0]._id;

    // Map to an array of { chef, totalPrepareTime }
    const chefPrepareTimes = await Promise.all(
      eligibleChefs.map(async (chef) => {
        // Fetch active orders assigned to this chef (you can define active status like 'preparing' etc)
        const activeOrders = await Order.find({ chef_id: chef._id, status: ORDER_STATUS.PROCESSING });

        // For each order, get order items and sum their prepare_time
        let totalPrepareTime = 0;

        for (const order of activeOrders) {
          const orderItems = await OrderItem.find({ _id: { $in: order.order_items_id } });

          for (const item of orderItems) {
            const menuItem = await MenuItem.findById(item.menu_item_id);
            totalPrepareTime += menuItem.preparation_time * item.quantity;
          }
        }

        return {
          chef,
          totalPrepareTime
        };
      })
    );

    // Find chef with least prepare time
    const chefWithLeastLoad = chefPrepareTimes.reduce((prev, current) => {
      return (prev.totalPrepareTime < current.totalPrepareTime) ? prev : current;
    });

    return chefWithLeastLoad.chef._id;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { getAvailableChefId };
