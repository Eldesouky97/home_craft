const pool = require("../config/db");

class Order {
  static async create(orderData) {
    const {
      orderNumber,
      customerId,
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress,
      billingAddress,
      items,
      subtotal,
      tax = 0,
      shipping = 0,
      discount = 0,
      total,
      currency = "EGP",
      paymentMethod,
      paymentStatus = "pending",
      status = "pending",
      notes,
      trackingNumber,
      trackingUrl,
      estimatedDelivery,
      deliveredAt,
      storeId,
    } = orderData;

    const [result] = await pool.query(
      `INSERT INTO orders 
      (orderNumber, customerId, customerEmail, customerName, customerPhone, 
       shippingAddress, billingAddress, items, subtotal, tax, shipping, discount, 
       total, currency, paymentMethod, paymentStatus, status, notes, 
       trackingNumber, trackingUrl, estimatedDelivery, deliveredAt, storeId) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        customerId,
        customerEmail,
        customerName,
        customerPhone,
        JSON.stringify(shippingAddress),
        JSON.stringify(billingAddress),
        JSON.stringify(items),
        subtotal,
        tax,
        shipping,
        discount,
        total,
        currency,
        paymentMethod,
        paymentStatus,
        status,
        notes,
        trackingNumber,
        trackingUrl,
        estimatedDelivery,
        deliveredAt,
        storeId,
      ]
    );

    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);
    return rows[0];
  }

  static async findByCustomer(customerId) {
    const [rows] = await pool.query("SELECT * FROM orders WHERE customerId = ?", [
      customerId,
    ]);
    return rows;
  }

  static async findByStore(storeId) {
    const [rows] = await pool.query("SELECT * FROM orders WHERE storeId = ?", [
      storeId,
    ]);
    return rows;
  }

  static async updateStatus(id, status) {
    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    return this.findById(id);
  }

  static async updatePaymentStatus(id, paymentStatus) {
    await pool.query("UPDATE orders SET paymentStatus = ? WHERE id = ?", [
      paymentStatus,
      id,
    ]);
    return this.findById(id);
  }

  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM orders ORDER BY createdAt DESC");
    return rows;
  }
}

module.exports = Order;
