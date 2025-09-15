const StoreModel = require('../models/StoreModel');

const storeController = {
  // إنشاء متجر جديد
  createStore: async (req, res) => {
    try {
      const { name, slug, description, category } = req.body;
      
      // التحقق من البيانات
      if (!name || !slug) {
        return res.status(400).json({
          success: false,
          message: 'اسم المتجر ورابط المتجر مطلوبان'
        });
      }

      // التحقق من أن الرابط غير مستخدم
      const existingStore = await StoreModel.findBySlug(slug);
      if (existingStore) {
        return res.status(400).json({
          success: false,
          message: 'رابط المتجر مسجل مسبقاً'
        });
      }

      // إنشاء المتجر
      const storeData = {
        userId: req.userId,
        name,
        slug,
        description,
        category: category || 'general',
        status: 'active'
      };

      const store = await StoreModel.create(storeData);

      res.status(201).json({
        success: true,
        message: 'تم إنشاء المتجر بنجاح',
        data: { store }
      });

    } catch (error) {
      console.error('Create store error:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء إنشاء المتجر'
      });
    }
  },

  // الحصول على متاجر المستخدم
  getUserStores: async (req, res) => {
    try {
      const stores = await StoreModel.findByUserId(req.userId);

      res.json({
        success: true,
        data: { stores }
      });

    } catch (error) {
      console.error('Get user stores error:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب متاجر المستخدم'
      });
    }
  },

  // الحصول على المتاجر المميزة
  getFeaturedStores: async (req, res) => {
    try {
      const { limit } = req.query;
      const stores = await StoreModel.findFeatured(parseInt(limit) || 6);

      res.json({
        success: true,
        data: { stores }
      });

    } catch (error) {
      console.error('Get featured stores error:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب المتاجر المميزة'
      });
    }
  },

  // الحصول على متجر by ID
  getStoreById: async (req, res) => {
    try {
      const { id } = req.params;
      const store = await StoreModel.findById(id);

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'المتجر غير موجود'
        });
      }

      res.json({
        success: true,
        data: { store }
      });

    } catch (error) {
      console.error('Get store error:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب المتجر'
      });
    }
  }
};

module.exports = storeController;