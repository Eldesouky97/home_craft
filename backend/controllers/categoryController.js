const { query } = require("../config/db");

// إنشاء تصنيف جديد
exports.createCategory = async (req, res) => {
  try {
    const { name, description, parentId = null, image = null } = req.body;

    // التحقق إذا كان التصنيف موجود مسبقاً
    const { rows: existingCategories } = await query(
      "SELECT id FROM categories WHERE name = ?",
      [name]
    );

    if (existingCategories.length > 0) {
      return res.status(400).json({
        success: false,
        error: "التصنيف موجود مسبقاً"
      });
    }

    // إنشاء slug من الاسم
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const { rows } = await query(
      `INSERT INTO categories (name, slug, description, parent_id, image, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, slug, description, parentId, image]
    );

    res.status(201).json({
      success: true,
      message: "تم إنشاء التصنيف بنجاح",
      data: {
        id: rows.insertId,
        name,
        slug,
        description,
        parentId,
        image
      }
    });

  } catch (error) {
    console.error("❌ createCategory error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء إنشاء التصنيف"
    });
  }
};

// الحصول على جميع التصنيفات
exports.getCategories = async (req, res) => {
  try {
    const { includeProducts = false, parentOnly = false } = req.query;

    let queryStr = `
      SELECT c.*, 
        (SELECT COUNT(*) FROM products WHERE category_id = c.id AND is_active = 1) as products_count,
        parent.name as parent_name
      FROM categories c
      LEFT JOIN categories parent ON c.parent_id = parent.id
    `;

    if (parentOnly === 'true') {
      queryStr += " WHERE c.parent_id IS NULL";
    }

    queryStr += " ORDER BY c.name ASC";

    const { rows: categories } = await query(queryStr);

    // إذا طلب تضمين المنتجات
    if (includeProducts === 'true') {
      for (let category of categories) {
        const { rows: products } = await query(
          `SELECT id, name, price, image, slug 
           FROM products 
           WHERE category_id = ? AND is_active = 1 
           LIMIT 10`,
          [category.id]
        );
        category.products = products;
      }
    }

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (error) {
    console.error("❌ getCategories error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء جلب التصنيفات"
    });
  }
};

// الحصول على تصنيف بواسطة ID
exports.getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const { rows: categories } = await query(
      `SELECT c.*, 
        (SELECT COUNT(*) FROM products WHERE category_id = c.id AND is_active = 1) as products_count,
        parent.name as parent_name
       FROM categories c
       LEFT JOIN categories parent ON c.parent_id = parent.id
       WHERE c.id = ?`,
      [categoryId]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        error: "التصنيف غير موجود"
      });
    }

    // جلب التصنيفات الفرعية
    const { rows: subcategories } = await query(
      "SELECT * FROM categories WHERE parent_id = ? ORDER BY name ASC",
      [categoryId]
    );

    // جلب المنتجات (الحد الأقصى 20 منتج)
    const { rows: products } = await query(
      `SELECT p.*, s.name as store_name 
       FROM products p
       LEFT JOIN stores s ON p.store_id = s.id
       WHERE p.category_id = ? AND p.is_active = 1
       ORDER BY p.created_at DESC
       LIMIT 20`,
      [categoryId]
    );

    const category = {
      ...categories[0],
      subcategories,
      products
    };

    res.status(200).json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error("❌ getCategoryById error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء جلب بيانات التصنيف"
    });
  }
};

// تحديث التصنيف
exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description, parentId, image } = req.body;

    // التحقق من وجود التصنيف
    const { rows: categories } = await query(
      "SELECT * FROM categories WHERE id = ?",
      [categoryId]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        error: "التصنيف غير موجود"
      });
    }

    let slug = categories[0].slug;
    
    // إذا تم تغيير الاسم، إنشاء slug جديد
    if (name && name !== categories[0].name) {
      slug = name.toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // التحقق إذا كان الاسم الجديد موجود مسبقاً
      const { rows: existingCategories } = await query(
        "SELECT id FROM categories WHERE name = ? AND id != ?",
        [name, categoryId]
      );

      if (existingCategories.length > 0) {
        return res.status(400).json({
          success: false,
          error: "التصنيف موجود مسبقاً"
        });
      }
    }

    await query(
      `UPDATE categories 
       SET name = ?, slug = ?, description = ?, parent_id = ?, image = ?, updated_at = NOW() 
       WHERE id = ?`,
      [name || categories[0].name, slug, description || categories[0].description, 
       parentId !== undefined ? parentId : categories[0].parent_id, 
       image || categories[0].image, categoryId]
    );

    res.status(200).json({
      success: true,
      message: "تم تحديث التصنيف بنجاح"
    });

  } catch (error) {
    console.error("❌ updateCategory error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء تحديث التصنيف"
    });
  }
};

// حذف التصنيف
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // التحقق من وجود التصنيف
    const { rows: categories } = await query(
      "SELECT * FROM categories WHERE id = ?",
      [categoryId]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        error: "التصنيف غير موجود"
      });
    }

    // التحقق إذا كان التصنيف يحتوي على منتجات
    const { rows: products } = await query(
      "SELECT COUNT(*) as count FROM products WHERE category_id = ?",
      [categoryId]
    );

    if (products[0].count > 0) {
      return res.status(400).json({
        success: false,
        error: "لا يمكن حذف التصنيف لأنه يحتوي على منتجات"
      });
    }

    // التحقق إذا كان التصنيف يحتوي على تصنيفات فرعية
    const { rows: subcategories } = await query(
      "SELECT COUNT(*) as count FROM categories WHERE parent_id = ?",
      [categoryId]
    );

    if (subcategories[0].count > 0) {
      return res.status(400).json({
        success: false,
        error: "لا يمكن حذف التصنيف لأنه يحتوي على تصنيفات فرعية"
      });
    }

    await query("DELETE FROM categories WHERE id = ?", [categoryId]);

    res.status(200).json({
      success: true,
      message: "تم حذف التصنيف بنجاح"
    });

  } catch (error) {
    console.error("❌ deleteCategory error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء حذف التصنيف"
    });
  }
};

// الحصول على منتجات التصنيف
exports.getCategoryProducts = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    // التحقق من وجود التصنيف
    const { rows: categories } = await query(
      "SELECT * FROM categories WHERE id = ?",
      [categoryId]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        error: "التصنيف غير موجود"
      });
    }

    // الحصول على المنتجات
    const validSortColumns = ['name', 'price', 'created_at', 'rating'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { rows: products } = await query(
      `SELECT p.*, s.name as store_name, s.slug as store_slug
       FROM products p
       LEFT JOIN stores s ON p.store_id = s.id
       WHERE p.category_id = ? AND p.is_active = 1
       ORDER BY ${sortColumn} ${order}
       LIMIT ? OFFSET ?`,
      [categoryId, parseInt(limit), offset]
    );

    // الحصول على العدد الإجمالي
    const { rows: countResult } = await query(
      "SELECT COUNT(*) as total FROM products WHERE category_id = ? AND is_active = 1",
      [categoryId]
    );

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });

  } catch (error) {
    console.error("❌ getCategoryProducts error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء جلب منتجات التصنيف"
    });
  }
};