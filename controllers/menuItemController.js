const MenuItem = require('../models/MenuItem');

const getMenuItemsByCategory = async (req, res, next) => {
  try {
    const category = req.params.category;
    const menuItems = await MenuItem.find({ category }, { _v: 0, __v: 0 });

    res.status(200).json({
      status: 'success',
      data: {
        menuItems
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await MenuItem.distinct('category');

    res.status(200).json({
      status: 'success',
      data: {
        categories
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

const getMenuItemById = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id, { _v: 0, __v: 0 });

    if (!menuItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        menuItem
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getMenuItemsByCategory,
  getCategories,
  getMenuItemById,
};
