const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { auth, seller, admin } = require("../middlewares/auth");
const {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  getFile
} = require("../controllers/uploadController");

const router = express.Router();

// إنشاء مجلد uploads إذا لم يكن موجوداً
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// إعداد multer للتخزين
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = uploadsDir;
    
    // تحديد مجلد فرعي بناء على نوع الملف
    if (file.mimetype.startsWith('image/')) {
      uploadPath = path.join(uploadsDir, 'images');
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath = path.join(uploadsDir, 'videos');
    } else {
      uploadPath = path.join(uploadsDir, 'documents');
    }
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // إنشاء اسم فريد للملف
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// تصفية الملفات المسموح بها
const fileFilter = (req, file, cb) => {
  // أنواع الملفات المسموح بها
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedVideoTypes = /mp4|webm|ogg/;
  const allowedDocumentTypes = /pdf|doc|docx|txt/;
  
  const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype.startsWith('image/') || 
                   file.mimetype.startsWith('video/') || 
                   file.mimetype.startsWith('application/');

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('نوع الملف غير مدعوم'), false);
  }
};

// إعداد multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB كحد أقصى
  },
  fileFilter: fileFilter
});

// ✅ Routes
router.post("/image", auth, seller, upload.single('image'), uploadImage);
router.post("/images", auth, seller, upload.array('images', 5), uploadMultipleImages);
router.delete("/:filename", auth, seller, deleteImage);
router.get("/:filename", getFile);

module.exports = router;