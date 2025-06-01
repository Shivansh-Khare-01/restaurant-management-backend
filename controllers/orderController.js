const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const OrderItem = require('../models/OrderItem');
const User = require('../models/User');
const Chef = require('../models/Chef');
const Table = require('../models/Table');
const { ORDER_TYPE, ORDER_STATUS } = require('../utils/constants');
const { getAvailableChefId } = require('../utils/getAvailableChefs');

exports.createOrder = async (req, res, next) => {
  try {
    const {
      menu_items,
      type,
      cooking_instructions,
      subtotal,
      tax,
      delivery_charges,
      delivery_time,
      total,
      name,
      phone,
      address,
      created_at,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and phone are required'
      });
    }

    if (!menu_items || menu_items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Menu items are required'
      });
    }


    const orderItems = await Promise.all(
      menu_items.map(async (item) => {
        return await OrderItem.create({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity
        });
      })
    );

    if (ORDER_TYPE.TAKE_AWAY === type && !address) {
      return res.status(400).json({
        status: 'error',
        message: 'Address is required for take away orders'
      });
    }

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        name,
        phone,
        address
      });
    }

    const chefId = await getAvailableChefId();
    const orderNumber = await Order.countDocuments() + 1;
    let table;
    if (ORDER_TYPE.DINE_IN === type) {
      table = await Table.findOne({ isAvailable: true }).sort({ name: 1 });
      if (!table) {
        return res.status(400).json({
          status: 'error',
          message: 'No table available'
        });
      }
    }

    const order = await Order.create({
      order_items_id: orderItems.map((item) => item._id),
      order_number: orderNumber,
      type,
      status: ORDER_STATUS.PROCESSING,
      cooking_instructions,
      subtotal,
      tax,
      delivery_charges,
      delivery_time,
      total,
      user_id: user._id,
      chef_id: chefId,
      table_number: table ? table.name : null,
      created_at: created_at ? new Date(created_at) : new Date(),
    });

    const chef = await Chef.findById(chefId);
    await chef.takeOrder();
    if (table) {
      await Table.findByIdAndUpdate(table._id, { isAvailable: false });
    }

    res.status(201).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}, { _v: 0, __v: 0 });
    const orderItems = await OrderItem.find({}, { _v: 0, __v: 0 });
    const menuItems = await MenuItem.find({}, { _v: 0, __v: 0 });

    const ordersWithDetails = await Promise.all(orders.map(async(order) => {
      const orderItemIds = order['order_items_id'];
      const orderItemsDetails = orderItems.filter((item) => orderItemIds.includes(item._id));
      const menuItemIds = orderItemsDetails.map((item) => item.menu_item_id.toString());
      const menuItemsDetails = menuItems.filter((item) => menuItemIds.includes(item._id.toString()));

      const totalPrepareTime = orderItemsDetails.reduce((acc, item) => {
        const menuItem = menuItemsDetails.find((menuItem) => menuItem._id.toString() === item.menu_item_id.toString());
        return acc + menuItem.preparation_time * item.quantity;
      }, 0);

      let remainingTime = Math.ceil((totalPrepareTime - (Date.now() - order.created_at) / 60000));
      remainingTime = remainingTime < 0 ? 0 : remainingTime;
      let orderStatus = order.status;
      

      if (order.status === ORDER_STATUS.PROCESSING && remainingTime === 0) {
        if (ORDER_TYPE.DINE_IN === order.type) {
          orderStatus = ORDER_STATUS.SERVED;
        } else {
          orderStatus = ORDER_STATUS.NOT_PICKED_UP;
        }
        await Order.findByIdAndUpdate(order._id, { status: orderStatus });
        const chef = await Chef.findById(order.chef_id);
        await chef.removeOrder();
        if (order.table_number) {
          await Table.updateOne(
            { name: order.table_number },
            { isAvailable: true }
          );
        }
      }

      return {
        id: order._id,
        order_number: order.order_number,
        type: order.type,
        status: orderStatus,
        table_number: order.table_number,
        menu_items: orderItemsDetails.map((item) => {
          const menuItem = menuItemsDetails.find((menuItem) => menuItem._id.toString() === item.menu_item_id.toString());
          return {
            id: item._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: item.quantity
          };
        }),
        remaining_time: remainingTime,
        created_at: order.created_at
      };
    }));

    res.status(200).json({
      status: 'success',
      total_count: ordersWithDetails.length,
      data: {
        orders: ordersWithDetails
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }
    order.status = status;

    await order.save();

    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};



