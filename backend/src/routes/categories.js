const express = require('express');
const router = express.Router();
const { listCategories } = require('../controllers/categoriesController');
router.get('/', listCategories);
module.exports = router;