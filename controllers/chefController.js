// getChefs
const Chef = require('../models/Chef');

exports.getChefs = async (req, res, next) => {
  try {
    const chefs = await Chef.find({}, { _id: 1, name: 1, order_taken: 1 });
    res.status(200).json({
      status: 'success',
      data: {
        chefs
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
