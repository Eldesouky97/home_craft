const express = require("express");
const { body, param } = require("express-validator");
const { auth, seller, admin } = require("../middlewares/auth");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getUserOrders,
  getStoreOrders,
  getOrderStats,
} = require("../controllers/orderController");

const router = express.Router();

// ✅ Validation middleware
const createOrderValidation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("يجب أن تحتوي الطلبية على عنصر واحد على الأقل"),
  body("items.*.productId")
    .isInt({ min: 1 })
    .withMessage("معرف المنتج غير صحيح"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("الكمية يجب أن تكون رقم صحيح موجب"),
  body("items.*.price")
    .isFloat({ min: 0 })
    .withMessage("السعر يجب أن يكون رقم موجب"),
  body("shippingAddress")
    .optional()
    .isObject()
    .withMessage("عنوان الشحن يجب أن يكون كائن"),
  body("shippingAddress.street")
    .if(body("shippingAddress").exists())
    .notEmpty()
    .withMessage("شارع عنوان الشحن مطلوب"),
  body("shippingAddress.city")
    .if(body("shippingAddress").exists())
    .notEmpty()
    .withMessage("مدينة عنوان الشحن مطلوبة"),
  body("shippingAddress.zipCode")
    .if(body("shippingAddress").exists())
    .notEmpty()
    .withMessage("الرمز البريدي مطلوب"),
  body("paymentMethod")
    .isIn(["cash", "card", "bank_transfer"])
    .withMessage("طريقة الدفع غير صحيحة"),
];

const updateOrderValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("معرف الطلبية غير صحيح"),
  body("status")
    .isIn(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"])
    .withMessage("حالة الطلبية غير صحيحة"),
  body("trackingNumber")
    .optional()
    .isLength({ max: 100 })
    .withMessage("رقم التتبع يجب ألا يتجاوز 100 حرف"),
];

// ✅ Public routes (limited)
router.post("/", createOrderValidation, createOrder);

// ✅ Protected routes
router.get("/my-orders", auth, getUserOrders);
router.get("/store-orders", auth, seller, getStoreOrders);
router.get("/stats", auth, seller, getOrderStats);
router.get("/:id", auth, getOrderById);

// ✅ Admin/Seller routes
router.get("/", auth, admin, getOrders);
router.put("/:id/status", auth, seller, updateOrderValidation, updateOrderStatus);
router.delete("/:id", auth, admin, deleteOrder);

module.exports = router;