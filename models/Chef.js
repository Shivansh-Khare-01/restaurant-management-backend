const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide chef name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  order_taken: {
    type: Number,
    default: 0,
    min: [0, 'Order taken cannot be negative']
  }
}, {
  timestamps: false,
});

// Method to increment order count
chefSchema.methods.takeOrder = function() {
  this.order_taken += 1;
  return this.save();
};

// Method to decrement order count
chefSchema.methods.removeOrder = function() {
  this.order_taken -= 1;
  return this.save();
};

module.exports = mongoose.model('Chef', chefSchema);
