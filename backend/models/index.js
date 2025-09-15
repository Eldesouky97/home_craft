const User = require("./User");
const Store = require("./Store");
const Product = require("./Product");
const Order = require("./Order");

/**
 * العلاقات بين الجداول (بالمنطق)
 * 
 * - User ⇆ Store  (كل مستخدم يقدر يمتلك متاجر)
 * - Store ⇆ Product (كل متجر له منتجات)
 * - Store ⇆ Order (كل متجر له طلبات)
 * - User ⇆ Order (المستخدم كعميل بيعمل طلبات)
 *
 * العلاقات نفسها متطبقة بالـ FOREIGN KEYS في الـ SQL
 * والموديلات فيها دوال مساعدة للـ Queries
 */

// دوال مساعدة للعلاقات:

// User → Stores
User.getStores = async function (userId) {
  return await Store.findByUserId(userId);
};

// Store → Owner
Store.getOwner = async function (storeId) {
  const store = await Store.findById(storeId);
  if (!store) return null;
  return await User.findById(store.userId);
};

// Store → Products
Store.getProducts = async function (storeId) {
  return await Product.findByStoreId(storeId);
};

// Product → Store
Product.getStore = async function (productId) {
  const product = await Product.findById(productId);
  if (!product) return null;
  return await Store.findById(product.storeId);
};

// Store → Orders
Store.getOrders = async function (storeId) {
  return await Order.findByStore(storeId);
};

// Order → Store
Order.getStore = async function (orderId) {
  const order = await Order.findById(orderId);
  if (!order) return null;
  return await Store.findById(order.storeId);
};

// User → Orders (كعميل)
User.getOrders = async function (userId) {
  return await Order.findByCustomer(userId);
};

// Order → Customer
Order.getCustomer = async function (orderId) {
  const order = await Order.findById(orderId);
  if (!order) return null;
  return await User.findById(order.customerId);
};

module.exports = {
  User,
  Store,
  Product,
  Order,
};
