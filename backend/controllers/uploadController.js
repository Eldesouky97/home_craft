const path = require("path");
const fs = require("fs");

// رفع صورة واحدة
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "لم يتم اختيار أي ملف للرفع"
      });
    }

    // إنشاء URL للملف
    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: "تم رفع الملف بنجاح",
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        path: req.file.path
      }
    });

  } catch (error) {
    console.error("❌ uploadImage error:", error);
    
    // حذف الملف إذا حدث خطأ
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء رفع الملف"
    });
  }
};

// رفع عدة صور
exports.uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "لم يتم اختيار أي ملفات للرفع"
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
      path: file.path
    }));

    res.status(200).json({
      success: true,
      message: "تم رفع الملفات بنجاح",
      data: uploadedFiles
    });

  } catch (error) {
    console.error("❌ uploadMultipleImages error:", error);
    
    // حذف جميع الملفات إذا حدث خطأ
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء رفع الملفات"
    });
  }
};

// حذف ملف
exports.deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        error: "اسم الملف مطلوب"
      });
    }

    // البحث عن الملف في جميع المجلدات
    const searchDirectories = ['images', 'videos', 'documents'];
    let filePath = null;

    for (const dir of searchDirectories) {
      const potentialPath = path.join(__dirname, '../uploads', dir, filename);
      if (fs.existsSync(potentialPath)) {
        filePath = potentialPath;
        break;
      }
    }

    if (!filePath) {
      return res.status(404).json({
        success: false,
        error: "الملف غير موجود"
      });
    }

    // حذف الملف
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: "تم حذف الملف بنجاح"
    });

  } catch (error) {
    console.error("❌ deleteImage error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء حذف الملف"
    });
  }
};

// الحصول على ملف
exports.getFile = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        error: "اسم الملف مطلوب"
      });
    }

    // البحث عن الملف في جميع المجلدات
    const searchDirectories = ['images', 'videos', 'documents'];
    let filePath = null;

    for (const dir of searchDirectories) {
      const potentialPath = path.join(__dirname, '../uploads', dir, filename);
      if (fs.existsSync(potentialPath)) {
        filePath = potentialPath;
        break;
      }
    }

    if (!filePath) {
      return res.status(404).json({
        success: false,
        error: "الملف غير موجود"
      });
    }

    // إرسال الملف
    res.sendFile(filePath);

  } catch (error) {
    console.error("❌ getFile error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء جلب الملف"
    });
  }
};

// دالة مساعدة لحذف الملفات القديمة
exports.cleanupOldFiles = async (days = 30) => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);

    const deleteOldFiles = (dirPath) => {
      if (!fs.existsSync(dirPath)) return;

      const files = fs.readdirSync(dirPath);
      
      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile() && stat.mtimeMs < cutoffTime) {
          fs.unlinkSync(filePath);
          console.log(`تم حذف الملف القديم: ${file}`);
        } else if (stat.isDirectory()) {
          deleteOldFiles(filePath);
        }
      });
    };

    deleteOldFiles(uploadsDir);
    
  } catch (error) {
    console.error("❌ cleanupOldFiles error:", error);
  }
};