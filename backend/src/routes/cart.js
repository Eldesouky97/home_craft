const express = require('express');
const router = express.Router();
const { getCart, addItem, removeItem } = require('../controllers/cartController');
router.get('/', getCart);
router.post('/', addItem);
router.delete('/:id', removeItem);
module.exports = router;