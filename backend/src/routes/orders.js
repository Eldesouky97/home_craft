const express = require('express');
const router = express.Router();
const { createOrder, listOrders } = require('../controllers/ordersController');
router.get('/', listOrders);
router.post('/', createOrder);
module.exports = router;