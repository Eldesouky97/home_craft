const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { testConnection } = require('./config/db');

// استيراد الـ routes
const authRoutes = require('./routes/auth');
// بعد استيراد الملفات الأخرى
const storeRoutes = require('./routes/stores');
const statsRoutes = require('./routes/stats');

// بعد إعداد middleware
app.use('/api/stores', storeRoutes);
app.use('/api/stats', statsRoutes);
const app = express();

// middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/stores', storeRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
    const dbStatus = await testConnection();
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: dbStatus ? 'Connected' : 'Disconnected',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({
        success: false,
        message: 'حدث خطأ في الخادم'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'ال endpoint المطلوب غير موجود'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    
    // test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
        console.log('❌ Please check your database connection and restart the server');
    }
});