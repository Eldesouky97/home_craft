const { query } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// إنشاء توكن JWT
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// تسجيل مستخدم جديد
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'BUYER' } = req.body;

    // التحقق إذا كان البريد الإلكتروني موجود مسبقاً
    const { rows: existingUsers } = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'البريد الإلكتروني موجود مسبقاً'
      });
    }

    // تشفير كلمة المرور
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // إنشاء المستخدم
    const { rows } = await query(
      `INSERT INTO users (name, email, password, role, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [name, email, hashedPassword, role]
    );

    const userId = rows.insertId;

    // إنشاء التوكن
    const token = generateToken(userId);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      data: {
        token,
        user: {
          id: userId,
          name,
          email,
          role
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء إنشاء الحساب'
    });
  }
};

// تسجيل الدخول
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // البحث عن المستخدم
    const { rows: users } = await query(
      'SELECT id, name, email, password, role FROM users WHERE email = ? AND isActive = 1',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    const user = users[0];

    // التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // إنشاء التوكن
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء تسجيل الدخول'
    });
  }
};

// تسجيل الخروج
exports.logout = async (req, res) => {
  try {
    // هنا يمكنك إضافة التوكن إلى القائمة السوداء إذا كنت تستخدمها
    res.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء تسجيل الخروج'
    });
  }
};

// الحصول على بيانات المستخدم الحالي
exports.getMe = async (req, res) => {
  try {
    const { rows: users } = await query(
      'SELECT id, name, email, role, avatar, createdAt FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء جلب بيانات المستخدم'
    });
  }
};

// تحديث الملف الشخصي
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const userId = req.user.id;

    await query(
      'UPDATE users SET name = ?, avatar = ?, updatedAt = NOW() WHERE id = ?',
      [name, avatar, userId]
    );

    const { rows: users } = await query(
      'SELECT id, name, email, role, avatar, createdAt FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'تم تحديث الملف الشخصي بنجاح',
      data: users[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء تحديث الملف الشخصي'
    });
  }
};

// تغيير كلمة المرور
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // الحصول على كلمة المرور الحالية
    const { rows: users } = await query(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'المستخدم غير موجود'
      });
    }

    // التحقق من كلمة المرور الحالية
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, users[0].password);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'كلمة المرور الحالية غير صحيحة'
      });
    }

    // تشفير كلمة المرور الجديدة
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // تحديث كلمة المرور
    await query(
      'UPDATE users SET password = ?, updatedAt = NOW() WHERE id = ?',
      [hashedNewPassword, userId]
    );

    res.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء تغيير كلمة المرور'
    });
  }
};