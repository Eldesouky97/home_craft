const express = require('express');
const { body } = require('express-validator');
const { register, login, logout, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// التحقق من صحة بيانات التسجيل
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('الاسم مطلوب')
    .isLength({ min: 2, max: 50 })
    .withMessage('الاسم يجب أن يكون بين 2 و 50 حرفاً'),
  body('email')
    .isEmail()
    .withMessage('البريد الإلكتروني غير صحيح')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور يجب أن تكون على الأقل 6 أحرف')
];

// التحقق من صحة بيانات تسجيل الدخول
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('البريد الإلكتروني غير صحيح')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
];

// التحقق من صحة بيانات تغيير كلمة المرور
const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('كلمة المرور الحالية مطلوبة'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور الجديدة يجب أن تكون على الأقل 6 أحرف')
];

// المسارات العامة
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// المسارات المحمية (تتطلب مصادقة)
router.post('/logout', auth, logout);
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePasswordValidation, changePassword);

module.exports = router;