// App Constants
export const APP_NAME = 'Home Craft';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'منصة إنشاء المتاجر الإلكترونية الاحترافية';

// API Constants
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = 10000;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  WISHLIST: 'wishlist',
  PREFERENCES: 'preferences',
};

// Route Constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  STORES: '/stores',
  STORE: '/store/:slug',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ORDERS: '/orders',
  CART: '/cart',
  CHECKOUT: '/checkout',
};

// User Roles
export const USER_ROLES = {
  SELLER: 'SELLER',
  BUYER: 'BUYER',
  ADMIN: 'ADMIN',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'CREDIT_CARD',
  PAYPAL: 'PAYPAL',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CASH_ON_DELIVERY: 'CASH_ON_DELIVERY',
};

// Product Status
export const PRODUCT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  DRAFT: 'DRAFT',
};

// Store Status
export const STORE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
};

// Validation Patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9]\d{1,14}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت.',
  SERVER_ERROR: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
  UNAUTHORIZED: 'غير مصرح لك بالوصول. يرجى تسجيل الدخول.',
  FORBIDDEN: 'ممنوع الوصول. ليس لديك الصلاحية الكافية.',
  NOT_FOUND: 'الصفحة المطلوبة غير موجودة.',
  VALIDATION_ERROR: 'خطأ في التحقق من البيانات. يرجى التحقق من المدخلات.',
  DUPLICATE_ENTRY: 'البيانات المدخلة موجودة بالفعل.',
  FILE_TOO_LARGE: 'حجم الملف كبير جداً. الحد الأقصى هو 5MB.',
  INVALID_FILE_TYPE: 'نوع الملف غير مدعوم. يرجى تحميل ملف بصيغة صحيحة.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'تم تسجيل الدخول بنجاح.',
  REGISTER_SUCCESS: 'تم إنشاء الحساب بنجاح.',
  LOGOUT_SUCCESS: 'تم تسجيل الخروج بنجاح.',
  PRODUCT_CREATED: 'تم إنشاء المنتج بنجاح.',
  PRODUCT_UPDATED: 'تم تحديث المنتج بنجاح.',
  PRODUCT_DELETED: 'تم حذف المنتج بنجاح.',
  STORE_CREATED: 'تم إنشاء المتجر بنجاح.',
  STORE_UPDATED: 'تم تحديث المتجر بنجاح.',
  STORE_DELETED: 'تم حذف المتجر بنجاح.',
  ORDER_CREATED: 'تم إنشاء الطلب بنجاح.',
  ORDER_UPDATED: 'تم تحديث الطلب بنجاح.',
  PROFILE_UPDATED: 'تم تحديث الملف الشخصي بنجاح.',
};

// Loading Messages
export const LOADING_MESSAGES = {
  AUTHENTICATING: 'جاري التحقق...',
  LOADING: 'جاري التحميل...',
  SAVING: 'جاري الحفظ...',
  DELETING: 'جاري الحذف...',
  UPLOADING: 'جاري الرفع...',
};

// Image Upload Constants
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_IMAGES_PER_PRODUCT: 5,
};

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  DEFAULT_PAGE_SIZE_OPTIONS: [12, 24, 48, 96],
  MAX_PAGE_SIZE: 100,
};

// Theme Colors
export const COLORS = {
  PRIMARY: '#6B46C1',
  SECONDARY: '#9333EA',
  ACCENT: '#A855F7',
  LIGHT_PURPLE: '#E9D5FF',
  DARK_PURPLE: '#4C1D95',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
};

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Breakpoints
export const BREAKPOINTS = {
  XS: 0,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

// Date Formats
export const DATE_FORMATS = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_DATETIME: 'DD/MM/YYYY HH:mm',
};

// Currency
export const CURRENCY = {
  CODE: 'SAR',
  SYMBOL: 'ريال',
  LOCALE: 'ar-SA',
};

// Social Media Platforms
export const SOCIAL_PLATFORMS = {
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  INSTAGRAM: 'instagram',
  LINKEDIN: 'linkedin',
  YOUTUBE: 'youtube',
};

// Support Email
export const SUPPORT_EMAIL = 'support@homecraft.com';

// Default Values
export const DEFAULTS = {
  PAGE_SIZE: 12,
  SORT_BY: 'createdAt',
  SORT_ORDER: 'desc',
  SEARCH_DEBOUNCE: 300,
  IMAGE_PLACEHOLDER: '/placeholder-image.jpg',
  AVATAR_PLACEHOLDER: '/placeholder-avatar.jpg',
};