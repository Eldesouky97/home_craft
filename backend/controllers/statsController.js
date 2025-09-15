const StatsModel = require('../models/StatsModel');

const statsController = {
  // الحصول على إحصائيات لوحة التحكم
  getStoredashboardStats: async (req, res) => {
    try {
      const stats = await StatsModel.getStoredashboardStats(req.userId);

      res.json({
        success: true,
        data: { stats }
      });

    } catch (error) {
      console.error('Get Storedashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب إحصائيات لوحة التحكم'
      });
    }
  },

  // الحصول على إحصائيات عامة
  getGeneralStats: async (req, res) => {
    try {
      const stats = await StatsModel.getGeneralStats();

      res.json({
        success: true,
        data: { stats }
      });

    } catch (error) {
      console.error('Get general stats error:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب الإحصائيات العامة'
      });
    }
  }
};

module.exports = statsController;