// Express server - entry point
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

dotenv.config();

const { testConnection } = require('./src/db');

const authRoutes = require('./src/routes/auth');
const productsRoutes = require('./src/routes/products');
const storesRoutes = require('./src/routes/stores');
const categoriesRoutes = require('./src/routes/categories');
const cartRoutes = require('./src/routes/cart');
const ordersRoutes = require('./src/routes/orders');

const app = express();

const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// static uploads
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);

// health
app.get('/health', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' }));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: true,
    message: process.env.NODE_ENV === 'production' ? 'Server error' : (err.message || 'Unknown error'),
  });
});

// start after DB test
(async () => {
  try {
    console.log('Testing DB connection...');
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Cannot connect to DB:', err.message || err);
    process.exit(1);
  }
})();