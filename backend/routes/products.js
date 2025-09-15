const express = require('express')
const { body } = require('express-validator')
const { auth, storeOwner } = require('../middlewares/auth')
const multer = require('multer')
const path = require('path')
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getStoreProducts
} = require('../controllers/productController')

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/products'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'))
    }
  }
})

// Validation middleware
const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required').isLength({ min: 2, max: 200 }),
  body('description').optional().isLength({ max: 2000 }).withMessage('Description is too long'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('comparePrice').optional().isFloat({ min: 0 }).withMessage('Compare price must be a positive number'),
  body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('sku').optional().isLength({ max: 50 }).withMessage('SKU is too long'),
  body('barcode').optional().isLength({ max: 50 }).withMessage('Barcode is too long'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a positive integer'),
  body('category').optional().isLength({ max: 50 }).withMessage('Category is too long'),
  body('weight').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
  body('storeId').isInt().withMessage('Store ID is required')
]

const updateProductValidation = [
  body('name').optional().trim().notEmpty().withMessage('Product name is required').isLength({ min: 2, max: 200 }),
  body('description').optional().isLength({ max: 2000 }).withMessage('Description is too long'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('comparePrice').optional().isFloat({ min: 0 }).withMessage('Compare price must be a positive number'),
  body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('sku').optional().isLength({ max: 50 }).withMessage('SKU is too long'),
  body('barcode').optional().isLength({ max: 50 }).withMessage('Barcode is too long'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a positive integer'),
  body('category').optional().isLength({ max: 50 }).withMessage('Category is too long'),
  body('weight').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
  body('storeId').optional().isInt().withMessage('Store ID must be an integer')
]

// Public routes
router.get('/', getProducts)
router.get('/:id', getProductById)
router.get('/store/:storeId', getStoreProducts)

// Protected routes
router.post('/', 
  auth, 
  upload.array('images', 5), 
  createProductValidation, 
  createProduct
)

router.put('/:id', 
  auth, 
  upload.array('images', 5), 
  updateProductValidation, 
  updateProduct
)

router.delete('/:id', auth, deleteProduct)

module.exports = router