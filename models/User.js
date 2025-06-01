const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  phone: {
    type: String,
    match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [100, 'Address cannot be more than 100 characters']
  },
}, {
  timestamps: false,
});

module.exports = mongoose.model('User', userSchema);
