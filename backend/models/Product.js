const pool = require("../config/db");

// Product Model باستخدام MySQL2
class Product {
  static async create(productData) {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query(
        `INSERT INTO products 
        (name, slug, description, shortDescription, price, comparePrice, sku, barcode,
         trackQuantity, quantity, lowStockThreshold, category_id, store_id, status, isFeatured,
         hasDiscount, discount_type, discount_value, discount_startDate, discount_endDate,
         weight_value, weight_unit, dim_length, dim_width, dim_height, dim_unit,
         averageRating, reviewsCount, salesCount, viewCount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productData.name,
          productData.slug,
          productData.description,
          productData.shortDescription || null,
          productData.price,
          productData.comparePrice || null,
          productData.sku || null,
          productData.barcode || null,
          productData.trackQuantity ?? 1,
          productData.quantity ?? 0,
          productData.lowStockThreshold ?? 0,
          productData.category_id,
          productData.store_id,
          productData.status || "ACTIVE",
          productData.isFeatured ?? 0,
          productData.hasDiscount ?? 0,
          productData.discount?.type || null,
          productData.discount?.value || null,
          productData.discount?.startDate || null,
          productData.discount?.endDate || null,
          productData.weight?.value || null,
          productData.weight?.unit || "g",
          productData.dimensions?.length || null,
          productData.dimensions?.width || null,
          productData.dimensions?.height || null,
          productData.dimensions?.unit || "cm",
          0, // averageRating
          0, // reviewsCount
          0, // salesCount
          0  // viewCount
        ]
      );

      return { id: result.insertId, ...productData };
    } finally {
      conn.release();
    }
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    return rows[0];
  }

  static async findAll(limit = 50, offset = 0) {
    const [rows] = await pool.query("SELECT * FROM products LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]);
    return rows;
  }

  static async update(id, productData) {
    await pool.query("UPDATE products SET ? WHERE id = ?", [productData, id]);
    return this.findById(id);
  }

  static async delete(id) {
    await pool.query("DELETE FROM products WHERE id = ?", [id]);
    return true;
  }
}

module.exports = Product;
