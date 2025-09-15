const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db"); // لازم يكون عندك ملف db.js عامل اتصال MySQL

const User = {
  // إنشاء مستخدم جديد
  create: async (userData) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const [result] = await pool.query(
      `INSERT INTO users 
        (name, email, phone, password, role, avatar, isActive, lastLogin, preferences) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.name,
        userData.email,
        userData.phone,
        hashedPassword,
        userData.role || "SELLER",
        userData.avatar || "default-avatar.jpg",
        userData.isActive !== undefined ? userData.isActive : true,
        new Date(),
        JSON.stringify(userData.preferences || {
          language: "ar",
          currency: "SAR",
          notifications: { email: true, push: true },
        }),
      ]
    );

    return { id: result.insertId, ...userData, password: undefined };
  },

  // البحث عن مستخدم بالايميل
  findByEmail: async (email) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  },

  // البحث عن مستخدم بالـ ID
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  },

  // التحقق من كلمة المرور
  matchPassword: async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  },

  // إنشاء JWT Token
  getSignedJwtToken: (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
  },
};

module.exports = User;
