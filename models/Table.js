const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  name: {
    type: Number,
    required: [true, 'Please provide table name'],
    unique: true
  },
  chairs: {
    type: Number,
    required: [true, 'Please provide table capacity'],
    min: [1, 'Table capacity cannot be less than 1']
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: false,
});

module.exports = mongoose.model('Table', tableSchema);
