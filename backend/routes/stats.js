const express = require('express');
const { getStoredashboardStats, getGeneralStats } = require('../controllers/statsController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// إحصائيات لوحة التحكم (تحتاج مصادقة)
router.get('/Storedashboard', authMiddleware, getStoredashboardStats);

// إحصائيات عامة (لا تحتاج مصادقة)
router.get('/general', getGeneralStats);

module.exports = router;