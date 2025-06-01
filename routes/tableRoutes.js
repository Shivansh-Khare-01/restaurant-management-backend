const express = require('express');
const {
  getTables,
  createTable,
  deleteTable
} = require('../controllers/tableController');

const router = express.Router();

router.route('/')
  .get(getTables)
  .post(createTable);

router.route('/:id').delete(deleteTable);

module.exports = router;
