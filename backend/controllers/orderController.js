const { query } = require("../config/db");

// إنشاء طلبية جديدة
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;
    const userId = req.user?.id; // إذا كان المستخدم مسجلاً
    const guestEmail = req.user ? null : (req.body.email || null);

    // حساب المجموع الكلي
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const { rows: products } = await query(
        "SELECT id, name, price, stock FROM products WHERE id = ? AND is_active = 1",
        [item.productId]
      );

      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          error: `المنتج بالمعرف ${item.productId} غير موجود`
        });
      }

      const product = products[0];

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `الكمية المطلوبة غير متوفرة للمنتج: ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // بدء transaction
    const connection = await query.getConnection();
    await connection.beginTransaction();

    try {
      // إنشاء الطلبية
      const { rows: orderResult } = await connection.query(
        `INSERT INTO orders (user_id, guest_email, total_amount, status, payment_method, 
         shipping_address, notes, created_at, updated_at) 
         VALUES (?, ?, ?, 'pending', ?, ?, ?, NOW(), NOW())`,
        [userId, guestEmail, totalAmount, paymentMethod, 
         JSON.stringify(shippingAddress), notes]
      );

      const orderId = orderResult.insertId;

      // إضافة العناصر للطلبية
      for (const item of orderItems) {
        await connection.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price, total, created_at) 
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [orderId, item.productId, item.quantity, item.price, item.total]
        );

        // تحديث المخزون
        await connection.query(
          "UPDATE products SET stock = stock - ? WHERE id = ?",
          [item.quantity, item.productId]
        );
      }

      await connection.commit();
      connection.release();

      // جلب بيانات الطلبية الكاملة
      const { rows: orders } = await query(
        `SELECT o.*, 
         JSON_ARRAYAGG(
           JSON_OBJECT(
             'productId', oi.product_id,
             'name', oi.name,
             'price', oi.price,
             'quantity', oi.quantity,
             'total', oi.total
           )
         ) as items
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         WHERE o.id = ?
         GROUP BY o.id`,
        [orderId]
      );

      res.status(201).json({
        success: true,
        message: "تم إنشاء الطلبية بنجاح",
        data: orders[0]
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error("❌ createOrder error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء إنشاء الطلبية"
    });
  }
};

// الحصول على جميع الطلبيات (للمدير فقط)
exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "";
    let queryParams = [];

    if (status) {
      whereClause = "WHERE o.status = ?";
      queryParams.push(status);
    }

    const { rows: orders } = await query(
      `SELECT o.*, u.name as user_name, u.email as user_email,
       COUNT(oi.id) as items_count
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       ${whereClause}
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    const { rows: countResult } = await query(
      `SELECT COUNT(*) as total FROM orders o ${whereClause}`,
      queryParams
    );

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });

  } catch (error) {
    console.error("❌ getOrders error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء جلب الطلبيات"
    });
  }
};

// الحصول على طلبية بواسطة ID
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    const { rows: orders } = await query(
      `SELECT o.*, u.name as user_name, u.email as user_email,
       JSON_ARRAYAGG(
         JSON_OBJECT(
           'productId', oi.product_id,
           'name', p.name,
           'price', oi.price,
           'quantity', oi.quantity,
           'total', oi.total,
           'image', p.image
         )
       ) as items
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.id = ?
       GROUP BY o.id`,
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: "الطلبية غير موجودة"
      });
    }

    // التحقق من صلاحية الوصول
    const order = orders[0];
    if (req.user.role !== 'ADMIN' && order.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "غير مصرح لك بالوصول إلى هذه الطلبية"
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error("❌ getOrderById error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء جلب بيانات الطلبية"
    });
  }
};

// تحديث حالة الطلبية
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, trackingNumber } = req.body;

    const { rows: orders } = await query(
      "SELECT * FROM orders WHERE id = ?",
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: "الطلبية غير موجودة"
      });
    }

    // التحقق من صلاحية التعديل (للبائع أو المدير)
    if (req.user.role !== 'ADMIN') {
      // التحقق إذا كان البائع يملك المنتجات في الطلبية
      const { rows: storeCheck } = await query(
        `SELECT COUNT(*) as count 
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         JOIN stores s ON p.store_id = s.id
         WHERE oi.order_id = ? AND s.owner_id != ?`,
        [orderId, req.user.id]
      );

      if (storeCheck[0].count > 0) {
        return res.status(403).json({
          success: false,
          error: "غير مصرح لك بتعديل هذه الطلبية"
        });
      }
    }

    await query(
      "UPDATE orders SET status = ?, tracking_number = ?, updated_at = NOW() WHERE id = ?",
      [status, trackingNumber, orderId]
    );

    // إرسال إشعار للمستخدم إذا كانت الحالة delivered أو cancelled
    if (status === 'delivered' || status === 'cancelled') {
      // هنا يمكنك إضافة إرسال إيميل أو إشعار
    }

    res.status(200).json({
      success: true,
      message: "تم تحديث حالة الطلبية بنجاح"
    });

  } catch (error) {
    console.error("❌ updateOrderStatus error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء تحديث حالة الطلبية"
    });
  }
};

// حذف طلبية (للمدير فقط)
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const { rows: orders } = await query(
      "SELECT * FROM orders WHERE id = ?",
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: "الطلبية غير موجودة"
      });
    }

    // استعادة المخزون أولاً
    const { rows: items } = await query(
      "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
      [orderId]
    );

    const connection = await query.getConnection();
    await connection.beginTransaction();

    try {
      for (const item of items) {
        await connection.query(
          "UPDATE products SET stock = stock + ? WHERE id = ?",
          [item.quantity, item.product_id]
        );
      }

      await connection.query("DELETE FROM order_items WHERE order_id = ?", [orderId]);
      await connection.query("DELETE FROM orders WHERE id = ?", [orderId]);

      await connection.commit();
      connection.release();

      res.status(200).json({
        success: true,
        message: "تم حذف الطلبية بنجاح"
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error("❌ deleteOrder error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء حذف الطلبية"
    });
  }
};

// الحصول على طلبيات المستخدم
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE o.user_id = ?";
    let queryParams = [userId];

    if (status) {
      whereClause += " AND o.status = ?";
      queryParams.push(status);
    }

    const { rows: orders } = await query(
      `SELECT o.*, COUNT(oi.id) as items_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       ${whereClause}
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    const { rows: countResult } = await query(
      `SELECT COUNT(*) as total FROM orders o ${whereClause}`,
      queryParams
    );

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });

  } catch (error) {
    console.error("❌ getUserOrders error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء جلب طلبياتك"
    });
  }
};

// الحصول على طلبيات المتجر
exports.getStoreOrders = async (req, res) => {
  try {
    const storeOwnerId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE s.owner_id = ?";
    let queryParams = [storeOwnerId];

    if (status) {
      whereClause += " AND o.status = ?";
      queryParams.push(status);
    }

    const { rows: orders } = await query(
      `SELECT o.*, u.name as customer_name, u.email as customer_email,
       COUNT(oi.id) as items_count, SUM(oi.total) as store_total
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       JOIN stores s ON p.store_id = s.id
       LEFT JOIN users u ON o.user_id = u.id
       ${whereClause}
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    const { rows: countResult } = await query(
      `SELECT COUNT(DISTINCT o.id) as total
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       JOIN stores s ON p.store_id = s.id
       ${whereClause}`,
      queryParams
    );

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });

  } catch (error) {
    console.error("❌ getStoreOrders error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء جلب طلبيات المتجر"
    });
  }
};

// الحصول على إحصائيات الطلبيات
exports.getOrderStats = async (req, res) => {
  try {
    const storeOwnerId = req.user.id;

    const { rows: stats } = await query(
      `SELECT 
         COUNT(DISTINCT o.id) as total_orders,
         SUM(oi.total) as total_revenue,
         AVG(oi.total) as average_order_value,
         COUNT(DISTINCT o.user_id) as total_customers,
         SUM(CASE WHEN o.status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
         SUM(CASE WHEN o.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_orders,
         SUM(CASE WHEN o.status = 'processing' THEN 1 ELSE 0 END) as processing_orders,
         SUM(CASE WHEN o.status = 'shipped' THEN 1 ELSE 0 END) as shipped_orders,
         SUM(CASE WHEN o.status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
         SUM(CASE WHEN o.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       JOIN stores s ON p.store_id = s.id
       WHERE s.owner_id = ?`,
      [storeOwnerId]
    );

    res.status(200).json({
      success: true,
      data: stats[0]
    });

  } catch (error) {
    console.error("❌ getOrderStats error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء جلب إحصائيات الطلبيات"
    });
  }
};