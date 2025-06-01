const mongoose = require('mongoose');
const { ORDER_STATUS, ORDER_TYPE } = require('../utils/constants');

const orderSchema = new mongoose.Schema({
  order_number: {
    type: String,
    unique: true,
    required: [true, 'Please provide order number']
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide customer']
  },
  order_items_id: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'OrderItem',
    required: [true, 'Please provide order items']
  },
  status: {
    type: String,
    enum: [
      ORDER_STATUS.PROCESSING,
      ORDER_STATUS.SERVED,
      ORDER_STATUS.NOT_PICKED_UP,
      ORDER_STATUS.PICKED_UP
    ],
    default: ORDER_STATUS.PROCESSING
  },
  chef_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chef',
    required: false
  },
  type: {
    type: String,
    enum: [
      ORDER_TYPE.DINE_IN,
      ORDER_TYPE.TAKE_AWAY
    ],
    required: [true, 'Please provide order type']
  },
  table_number: {
    type: String,
    required: false
  },
  subtotal: {
    type: Number,
    required: [true, 'Please provide subtotal']
  },
  tax: {
    type: Number,
    required: [true, 'Please provide tax']
  },
  total: {
    type: Number,
    required: [true, 'Please provide total']
  },
  cooking_instructions: {
    type: String,
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
}, {
  timestamps: false,
});

module.exports = mongoose.model('Order', orderSchema);




