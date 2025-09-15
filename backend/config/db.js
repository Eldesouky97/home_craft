const mysql = require("mysql2/promise");

// إنشاء connection pool مباشرة
const createPool = () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "home_craft",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    timezone: '+00:00',
    acquireTimeout: 60000, // 60 ثانية
    reconnect: true, // إعادة الاتصال تلقائياً
  });

  return pool;
};

// إنشاء الـ pool مباشرة
const pool = createPool();

// دالة لاختبار الاتصال
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ MySQL Connected: ${process.env.DB_HOST || 'localhost'}`);
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Error connecting to MySQL:", error.message);
    return false;
  }
};

// دالة مساعدة للاستعلامات مع معالجة الأخطاء
const query = async (sql, params = []) => {
  try {
    const [rows, fields] = await pool.execute(sql, params);
    return { rows, fields, error: null };
  } catch (error) {
    console.error("❌ Database query error:", error.message);
    return { rows: [], fields: [], error };
  }
};

// دالة لبدء الاتصال وتجربته
const connectDB = async () => {
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error("❌ Failed to connect to database");
    process.exit(1);
  }
  return pool;
};

// معالجة إغلاق التطبيق بشكل صحيح
process.on('SIGINT', async () => {
  console.log('\n🔻 Closing database connection...');
  try {
    await pool.end();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error closing database connection:', error.message);
    process.exit(1);
  }
});

module.exports = {
  pool,
  connectDB,
  query,
  testConnection
};