const { pool } = require('../config/db');

const StoreModel = {
  // إنشاء متجر جديد
  create: async (storeData) => {
    try {
      const [result] = await pool.execute(
        `INSERT INTO stores (userId, name, slug, description, category, logo, cover, address, phone, email, website, status, settings) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          storeData.userId,
          storeData.name,
          storeData.slug,
          storeData.description,
          storeData.category || 'general',
          storeData.logo || null,
          storeData.cover || null,
          storeData.address || null,
          storeData.phone || null,
          storeData.email || null,
          storeData.website || null,
          storeData.status || 'pending',
          storeData.settings ? JSON.stringify(storeData.settings) : '{}'
        ]
      );
      
      return { id: result.insertId, ...storeData };
    } catch (error) {
      throw new Error(`فشل في إنشاء المتجر: ${error.message}`);
    }
  },

  // الحصول على جميع متاجر المستخدم
  findByUserId: async (userId) => {
    try {
      const [rows] = await pool.execute(
        `SELECT s.*, 
         (SELECT COUNT(*) FROM products p WHERE p.storeId = s.id AND p.deletedAt IS NULL) as productsCount,
         (SELECT COUNT(*) FROM orders o WHERE o.storeId = s.id AND o.deletedAt IS NULL) as ordersCount
         FROM stores s 
         WHERE s.userId = ? AND s.deletedAt IS NULL 
         ORDER BY s.createdAt DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(`فشل في جلب متاجر المستخدم: ${error.message}`);
    }
  },

  // الحصول على المتاجر المميزة
  findFeatured: async (limit = 6) => {
    try {
      const [rows] = await pool.execute(
        `SELECT s.*, u.name as ownerName,
         (SELECT COUNT(*) FROM products p WHERE p.storeId = s.id AND p.deletedAt IS NULL) as productsCount,
         (SELECT COUNT(*) FROM orders o WHERE o.storeId = s.id AND o.deletedAt IS NULL) as ordersCount,
         (SELECT COALESCE(AVG(r.rating), 0) FROM store_reviews r WHERE r.storeId = s.id AND r.status = 'approved') as rating
         FROM stores s 
         LEFT JOIN users u ON s.userId = u.id
         WHERE s.featured = true AND s.status = 'active' AND s.deletedAt IS NULL 
         ORDER BY s.createdAt DESC 
         LIMIT ?`,
        [limit]
      );
      return rows;
    } catch (error) {
      throw new Error(`فشل في جلب المتاجر المميزة: ${error.message}`);
    }
  },

  // البحث عن متجر بالرقم
  findById: async (id) => {
    try {
      const [rows] = await pool.execute(
        `SELECT s.*, u.name as ownerName,
         (SELECT COUNT(*) FROM products p WHERE p.storeId = s.id AND p.deletedAt IS NULL) as productsCount,
         (SELECT COUNT(*) FROM orders o WHERE o.storeId = s.id AND o.deletedAt IS NULL) as ordersCount,
         (SELECT COALESCE(AVG(r.rating), 0) FROM store_reviews r WHERE r.storeId = s.id AND r.status = 'approved') as rating
         FROM stores s 
         LEFT JOIN users u ON s.userId = u.id
         WHERE s.id = ? AND s.deletedAt IS NULL`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`فشل في البحث عن المتجر: ${error.message}`);
    }
  },

  // تحديث بيانات المتجر
  update: async (id, storeData) => {
    try {
      const fields = [];
      const values = [];
      
      Object.keys(storeData).forEach(key => {
        if (storeData[key] !== undefined) {
          if (key === 'settings') {
            fields.push(`${key} = ?`);
            values.push(JSON.stringify(storeData[key]));
          } else {
            fields.push(`${key} = ?`);
            values.push(storeData[key]);
          }
        }
      });
      
      values.push(id);
      
      const [result] = await pool.execute(
        `UPDATE stores SET ${fields.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND deletedAt IS NULL`,
        values
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`فشل في تحديث المتجر: ${error.message}`);
    }
  },

  // حذف متجر (soft delete)
  delete: async (id) => {
    try {
      const [result] = await pool.execute(
        'UPDATE stores SET deletedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`فشل في حذف المتجر: ${error.message}`);
    }
  }
};

module.exports = StoreModel;