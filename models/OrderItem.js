const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menu_item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: [true, 'Please provide menu item']
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    min: [1, 'Quantity cannot be less than 1']
  },
}, {
  timestamps: false,
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
