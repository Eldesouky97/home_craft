const express = require('express');
const router = express.Router();
const { listStores } = require('../controllers/storesController');
router.get('/', listStores);
module.exports = router;