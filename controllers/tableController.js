const Table = require('../models/Table');
const Order = require('../models/Order');

exports.getTables = async (req, res, next) => {
  try {
    const tables = await Table.find({}, { _v: 0, __v: 0 });

    res.status(200).json({
      status: 'success',
      data: {
        tables
      }
      });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.createTable = async (req, res, next) => {
  try {
    const { chairs } = req.body;

    const tableCount = await Table.countDocuments();
    const name = tableCount + 1;

    const table = await Table.create({
      name,
      chairs
    });

    res.status(201).json({
      status: 'success',
      data: {
        table
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        status: 'error',
        message: 'Table not found'
      });
    }

    const orderWithTable = await Order.findOne({ table_number: table.name });
    if (orderWithTable) {
      return res.status(400).json({
        status: 'error',
        message: 'Table is in use'
      });
    }

    const tabledeleted = await Table.findByIdAndDelete(req.params.id);

    await Table.updateMany(
      { name: { $gt: table.name } },
      { $inc: { name: -1 } }
    );

    res.status(200).json({
      status: 'success',
      message: 'Table deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
