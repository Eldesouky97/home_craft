const express = require('express');
const { createStore, getUserStores, getFeaturedStores, getStoreById } = require('../controllers/storeController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// جميع المسارات تحتاج مصادقة
router.use(authMiddleware);

// إنشاء متجر جديد
router.post('/', createStore);

// الحصول على متاجر المستخدم
router.get('/my-stores', getUserStores);

// الحصول على المتاجر المميزة
router.get('/featured', getFeaturedStores);

// الحصول على متجر by ID
router.get('/:id', getStoreById);

module.exports = router;