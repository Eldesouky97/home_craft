-- Home Craft Database Schema
-- MySQL Database

-- Create database
CREATE DATABASE IF NOT EXISTS home_craft CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE home_craft;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    avatar VARCHAR(255) NULL,
    role ENUM('BUYER', 'SELLER', 'ADMIN') DEFAULT 'BUYER',
    provider ENUM('local', 'google') DEFAULT 'local',
    isActive BOOLEAN DEFAULT TRUE,
    emailVerified BOOLEAN DEFAULT FALSE,
    lastLogin DATETIME NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME NULL
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    logo VARCHAR(255) NULL,
    cover VARCHAR(255) NULL,
    category VARCHAR(50) DEFAULT 'general',
    address TEXT NULL,
    phone VARCHAR(20) NULL,
    email VARCHAR(255) NULL,
    website VARCHAR(255) NULL,
    status ENUM('pending', 'active', 'suspended', 'closed') DEFAULT 'pending',
    settings JSON DEFAULT '{"currency": "EGP", "language": "ar", "theme": "default", "socialMedia": {}}',
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_slug (slug),
    INDEX idx_userId (userId),
    INDEX idx_status (status)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    storeId INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10,2) NOT NULL,
    comparePrice DECIMAL(10,2) NULL,
    cost DECIMAL(10,2) NULL,
    sku VARCHAR(50) NULL UNIQUE,
    barcode VARCHAR(50) NULL,
    trackQuantity BOOLEAN DEFAULT TRUE,
    quantity INT DEFAULT 0,
    allowOutOfStock BOOLEAN DEFAULT FALSE,
    images JSON DEFAULT '[]',
    category VARCHAR(50) NULL,
    tags JSON DEFAULT '[]',
    variants JSON DEFAULT '[]',
    weight DECIMAL(8,2) NULL,
    dimensions JSON DEFAULT '{"length": null, "width": null, "height": null}',
    status ENUM('draft', 'active', 'archived') DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    seoTitle VARCHAR(200) NULL,
    seoDescription TEXT NULL,
    metaFields JSON DEFAULT '{}',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME NULL,
    FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE CASCADE,
    INDEX idx_storeId (storeId),
    INDEX idx_status (status),
    INDEX idx_featured (featured),
    INDEX idx_category (category),
    INDEX idx_slug (slug)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    storeId INT NOT NULL,
    orderNumber VARCHAR(50) NOT NULL UNIQUE,
    customerId INT NULL,
    customerEmail VARCHAR(255) NOT NULL,
    customerName VARCHAR(100) NOT NULL,
    customerPhone VARCHAR(20) NULL,
    shippingAddress JSON NOT NULL,
    billingAddress JSON NOT NULL,
    items JSON NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0.00,
    shipping DECIMAL(10,2) DEFAULT 0.00,
    discount DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EGP',
    paymentMethod VARCHAR(50) NOT NULL,
    paymentStatus ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    notes TEXT NULL,
    trackingNumber VARCHAR(100) NULL,
    trackingUrl VARCHAR(255) NULL,
    estimatedDelivery DATE NULL,
    deliveredAt DATETIME NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME NULL,
    FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (customerId) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_storeId (storeId),
    INDEX idx_customerId (customerId),
    INDEX idx_status (status),
    INDEX idx_paymentStatus (paymentStatus),
    INDEX idx_orderNumber (orderNumber)
);

-- Order items table (for better order management)
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NULL,
    productName VARCHAR(200) NOT NULL,
    productSku VARCHAR(50) NULL,
    productImage VARCHAR(255) NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    variants JSON NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_orderId (orderId),
    INDEX idx_productId (productId)
);

-- Store reviews table
CREATE TABLE IF NOT EXISTS store_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    storeId INT NOT NULL,
    userId INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NULL,
    reply TEXT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_storeId (storeId),
    INDEX idx_userId (userId),
    INDEX idx_rating (rating),
    INDEX idx_status (status)
);

-- Product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productId INT NOT NULL,
    userId INT NOT NULL,
    orderId INT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NULL,
    reply TEXT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_productId (productId),
    INDEX idx_userId (userId),
    INDEX idx_rating (rating),
    INDEX idx_status (status)
);

-- Store analytics table
CREATE TABLE IF NOT EXISTS store_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    storeId INT NOT NULL,
    date DATE NOT NULL,
    visitors INT DEFAULT 0,
    pageViews INT DEFAULT 0,
    uniqueVisitors INT DEFAULT 0,
    bounceRate DECIMAL(5,2) DEFAULT 0.00,
    avgSessionDuration DECIMAL(10,2) DEFAULT 0.00,
    conversions INT DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0.00,
    topProducts JSON NULL,
    trafficSources JSON NULL,
    deviceStats JSON NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE CASCADE,
    UNIQUE KEY unique_store_date (storeId, date),
    INDEX idx_storeId (storeId),
    INDEX idx_date (date)
);

-- Store notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    storeId INT NULL,
    type ENUM('info', 'success', 'warning', 'error') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON NULL,
    isRead BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (storeId) REFERENCES stores(id) ON DELETE CASCADE,
    INDEX idx_userId (userId),
    INDEX idx_storeId (storeId),
    INDEX idx_isRead (isRead),
    INDEX idx_type (type)
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role, isActive, emailVerified) VALUES 
('Admin User', 'admin@homecraft.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZeUfkZMBs9kYZP6', 'ADMIN', TRUE, TRUE);

-- إضافة مستخدمين وهميين (بائع وتاجر فقط)
INSERT INTO users (name, email, password, phone, avatar, role, provider, isActive, emailVerified, lastLogin) VALUES
('علي التاجر', 'seller@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZeUfkZMBs9kYZP6', '01011111111', 'seller_avatar.jpg', 'SELLER', 'local', TRUE, TRUE, '2024-01-15 10:30:00'),
('محمد المشتري', 'buyer@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZeUfkZMBs9kYZP6', '01022222222', 'buyer_avatar.jpg', 'BUYER', 'local', TRUE, TRUE, '2024-01-14 15:45:00');

-- إضافة متجر للتاجر
INSERT INTO stores (userId, name, slug, description, logo, cover, category, address, phone, email, website, status, settings) VALUES
(1, 'متجر علي للتحف الخشبية', 'ali-woodcraft', 'متجر متخصص في التحف والأثاث الخشبي المصنوع يدوياً بأجود أنواع الخشب', 'logo1.jpg', 'cover1.jpg', 'handicrafts', 'القاهرة، مصر', '01011111111', 'seller@example.com', 'https://ali-woodcraft.com', 'active', '{"currency": "EGP", "language": "ar", "theme": "wood", "socialMedia": {"facebook": "https://facebook.com/ali-woodcraft", "instagram": "https://instagram.com/ali-woodcraft"}}');

-- إضافة منتجات للمتجر
INSERT INTO products (storeId, name, slug, description, price, comparePrice, cost, sku, barcode, quantity, images, category, tags, variants, weight, status, featured) VALUES
(1, 'طاولة قهوة خشبية منحوتة', 'wooden-coffee-table', 'طاولة قهوة مصنوعة من خشب الزان الطبيعي منحوتة يدوياً بتصميم عصري', 1200.00, 1500.00, 800.00, 'WT-001', '1234567890123', 5, '["table1.jpg", "table2.jpg", "table3.jpg"]', 'furniture', '["خشب", "يدوي", "طاولة", "قهوة"]', '[{"name": "الحجم", "values": ["صغير", "كبير"], "price": [1200, 1800]}]', 15.5, 'active', TRUE),
(1, 'إطار صورة خشبي منحوت', 'wooden-photo-frame', 'إطار صورة مصنوع من خشب الماهوجني بتصميم كلاسيكي أنيق', 250.00, 300.00, 150.00, 'WF-001', '1234567890124', 20, '["frame1.jpg", "frame2.jpg"]', 'decor', '["خشب", "يدوي", "إطار", "صورة"]', '[]', 0.8, 'active', FALSE),
(1, 'مقعد خشبي ديكوري', 'wooden-decorative-stool', 'مقعد خشبي مزخرف بتصميم تراثي مناسب للديكور الداخلي', 450.00, 550.00, 280.00, 'WS-001', '1234567890127', 8, '["stool1.jpg", "stool2.jpg"]', 'furniture', '["خشب", "مقعد", "ديكور", "تراثي"]', '[]', 4.2, 'active', FALSE);

-- إضافة طلبات من المشتري
INSERT INTO orders (storeId, orderNumber, customerId, customerEmail, customerName, customerPhone, shippingAddress, billingAddress, items, subtotal, tax, shipping, discount, total, paymentMethod, paymentStatus, status, trackingNumber, estimatedDelivery) VALUES
(1, 'ORD-1001', 2, 'buyer@example.com', 'محمد المشتري', '01022222222', '{"street": "شارع النصر", "city": "القاهرة", "state": "القاهرة", "zipCode": "11511", "country": "مصر"}', '{"street": "شارع النصر", "city": "القاهرة", "state": "القاهرة", "zipCode": "11511", "country": "مصر"}', '[{"productId": 1, "name": "طاولة قهوة خشبية منحوتة", "price": 1200, "quantity": 1, "total": 1200}]', 1200.00, 60.00, 100.00, 0.00, 1360.00, 'credit_card', 'paid', 'delivered', 'TRK123456789', '2024-01-18'),
(1, 'ORD-1002', 2, 'buyer@example.com', 'محمد المشتري', '01022222222', '{"street": "شارع النصر", "city": "القاهرة", "state": "القاهرة", "zipCode": "11511", "country": "مصر"}', '{"street": "شارع النصر", "city": "القاهرة", "state": "القاهرة", "zipCode": "11511", "country": "مصر"}', '[{"productId": 2, "name": "إطار صورة خشبي منحوت", "price": 250, "quantity": 2, "total": 500}]', 500.00, 25.00, 50.00, 0.00, 575.00, 'paypal', 'paid', 'shipped', 'TRK987654321', '2024-01-19');

-- إضافة عناصر الطلبات
INSERT INTO order_items (orderId, productId, productName, productSku, productImage, quantity, price, total, variants) VALUES
(1, 1, 'طاولة قهوة خشبية منحوتة', 'WT-001', 'table1.jpg', 1, 1200.00, 1200.00, '{"الحجم": "كبير"}'),
(2, 2, 'إطار صورة خشби منحوت', 'WF-001', 'frame1.jpg', 2, 250.00, 500.00, '[]');

-- إضافة تقييمات للمتجر
INSERT INTO store_reviews (storeId, userId, rating, comment, reply, status) VALUES
(1, 2, 5, 'متجر رائع ومنتجات عالية الجودة، والتوصيل كان سريعاً', 'شكراً لثقتك، يسعدنا خدمتك دائماً', 'approved'),
(1, 2, 4, 'جودة المنتجات ممتازة ولكن الأسعار مرتفعة قليلاً', NULL, 'approved');

-- إضافة تقييمات للمنتجات
INSERT INTO product_reviews (productId, userId, orderId, rating, comment, reply, status) VALUES
(1, 2, 1, 5, 'الطاولة رائعة وجمالية التصميم تفوق التوقعات، الخشب متين والصنعة ممتازة', 'شكراً لتقييمك، نسعد برضاك عن منتجاتنا', 'approved'),
(2, 2, 2, 4, 'الإطار أنيق جداً ويضيف لمسة جمالية للصورة، ولكن الحجم كان أصغر قليلاً مما توقعت', 'شكراً لملاحظتك، سنحرص على توضيح المقاسات بدقة أكبر', 'approved');

-- إضافة بيانات تحليل للمتجر
INSERT INTO store_analytics (storeId, date, visitors, pageViews, uniqueVisitors, bounceRate, avgSessionDuration, conversions, revenue, topProducts, trafficSources, deviceStats) VALUES
(1, '2024-01-15', 150, 420, 120, 35.50, 180.25, 2, 1935.00, '[{"productId": 1, "views": 85, "sales": 1}, {"productId": 2, "views": 65, "sales": 2}]', '{"direct": 40, "social": 65, "search": 45}', '{"mobile": 90, "desktop": 45, "tablet": 15}'),
(1, '2024-01-14', 120, 350, 95, 38.20, 165.75, 0, 0.00, '[{"productId": 1, "views": 70, "sales": 0}, {"productId": 2, "views": 50, "sales": 0}]', '{"direct": 35, "social": 50, "search": 35}', '{"mobile": 75, "desktop": 35, "tablet": 10}');

-- إضافة إشعارات
INSERT INTO notifications (userId, storeId, type, title, message, data, isRead) VALUES
(1, 1, 'success', 'طلب جديد', 'تم استلام طلب جديد رقم ORD-1001', '{"orderId": 1, "orderNumber": "ORD-1001"}', FALSE),
(1, 1, 'success', 'طلب جديد', 'تم استلام طلب جديد رقم ORD-1002', '{"orderId": 2, "orderNumber": "ORD-1002"}', FALSE),
(1, 1, 'info', 'تقييم جديد', 'حصلت على تقييم جديد لمنتجك طاولة قهوة خشبية منحوتة', '{"productId": 1, "reviewId": 1}', TRUE),
(2, NULL, 'success', 'تم توصيل طلبك', 'تم توصيل طلبك رقم ORD-1001 بنجاح', '{"orderId": 1, "orderNumber": "ORD-1001"}', TRUE),
(2, NULL, 'info', 'تم شحن طلبك', 'تم شحن طلبك رقم ORD-1002 وتتبع الشحنة TRK987654321', '{"orderId": 2, "orderNumber": "ORD-1002", "trackingNumber": "TRK987654321"}', FALSE);