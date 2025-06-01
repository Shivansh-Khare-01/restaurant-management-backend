const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide item name'],
    trim: true,
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide item description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide item price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide item category'],
    enum: [
      'pizza',
      'burger',
      'drinks',
      'veggies',
      'french-fries'
    ]
  },
  image: {
    type: String,
    default: 'default-food.jpg'
  },
  preparation_time: {
    type: Number,
    default: 15
  },
}, {
  timestamps: false,
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
