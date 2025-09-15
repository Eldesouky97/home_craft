const express = require("express");
const { body, param } = require("express-validator");
const { auth, admin, seller } = require("../middlewares/auth");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryProducts
} = require("../controllers/categoryController");

const router = express.Router();

// ✅ Validation middleware
const createCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("اسم التصنيف مطلوب")
    .isLength({ min: 2, max: 50 })
    .withMessage("اسم التصنيف يجب أن يكون بين 2 و 50 حرفاً"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("الوصف يجب ألا يتجاوز 500 حرف"),
  body("parentId")
    .optional()
    .isInt({ min: 0 })
    .withMessage("معرف التصنيف الأب غير صحيح")
];

const updateCategoryValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("معرف التصنيف غير صحيح"),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("اسم التصنيف مطلوب")
    .isLength({ min: 2, max: 50 })
    .withMessage("اسم التصنيف يجب أن يكون بين 2 و 50 حرفاً"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("الوصف يجب ألا يتجاوز 500 حرف"),
  body("parentId")
    .optional()
    .isInt({ min: 0 })
    .withMessage("معرف التصنيف الأب غير صحيح")
];

// ✅ Public routes
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.get("/:id/products", getCategoryProducts);

// ✅ Protected routes (Admin only)
router.post("/", auth, admin, createCategoryValidation, createCategory);
router.put("/:id", auth, admin, updateCategoryValidation, updateCategory);
router.delete("/:id", auth, admin, deleteCategory);

module.exports = router;