const { pool } = require('../config/db');

const StatsModel = {
  // الحصول على إحصائيات لوحة تحكم المتاجر
  getStoredashboardStats: async (userId) => {
    try {
      const [stats] = await pool.execute(`
        SELECT 
          COUNT(*) as totalStores,
          SUM(productsCount) as totalProducts,
          SUM(ordersCount) as totalOrders,
          SUM(revenue) as totalRevenue
        FROM (
          SELECT 
            s.id,
            (SELECT COUNT(*) FROM products p WHERE p.storeId = s.id AND p.deletedAt IS NULL) as productsCount,
            (SELECT COUNT(*) FROM orders o WHERE o.storeId = s.id AND o.deletedAt IS NULL) as ordersCount,
            (SELECT COALESCE(SUM(total), 0) FROM orders o WHERE o.storeId = s.id AND o.deletedAt IS NULL) as revenue
          FROM stores s
          WHERE s.userId = ? AND s.deletedAt IS NULL AND s.status = 'active'
        ) as store_data
      `, [userId]);

      return stats[0] || {};
    } catch (error) {
      throw new Error(`فشل في جلب إحصائيات لوحة التحكم: ${error.message}`);
    }
  },

  // الحصول على إحصائيات عامة
  getGeneralStats: async () => {
    try {
      const [stats] = await pool.execute(`
        SELECT 
          (SELECT COUNT(*) FROM users WHERE deletedAt IS NULL AND isActive = true) as totalUsers,
          (SELECT COUNT(*) FROM stores WHERE deletedAt IS NULL AND status = 'active') as totalStores,
          (SELECT COUNT(*) FROM products WHERE deletedAt IS NULL AND status = 'active') as totalProducts,
          (SELECT COUNT(*) FROM orders WHERE deletedAt IS NULL) as totalOrders,
          (SELECT COALESCE(SUM(total), 0) FROM orders WHERE deletedAt IS NULL AND paymentStatus = 'paid') as totalRevenue
      `);

      return stats[0] || {};
    } catch (error) {
      throw new Error(`فشل في جلب الإحصائيات العامة: ${error.message}`);
    }
  }
};

module.exports = StatsModel;