const multer = require('multer');
const path = require('path');
const { 
  validateFile, 
  generateSecureFilename, 
  ensureUploadDirectory,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES 
} = require('../utils/fileValidation');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    ensureUploadDirectory(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const secureFilename = generateSecureFilename(file.originalname, file.mimetype);
    cb(null, secureFilename);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const validation = validateFile({
    mimetype: file.mimetype,
    size: 0, // Size will be checked by multer
    originalname: file.originalname
  });

  if (validation.isValid) {
    cb(null, true);
  } else {
    cb(new Error(validation.errors.join(', ')), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5 // Maximum 5 files per request
  }
});

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 files allowed.'
      });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field'
      });
    }
  }
  
  if (error.message) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

// Single file upload middleware
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      
      // Additional validation after multer
      if (req.file) {
        const validation = validateFile(req.file);
        if (!validation.isValid) {
          return res.status(400).json({
            success: false,
            message: validation.errors.join(', ')
          });
        }
      }
      
      next();
    });
  };
};

// Multiple files upload middleware
const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      
      // Additional validation after multer
      if (req.files && req.files.length > 0) {
        const validation = validateFiles(req.files);
        if (!validation.isValid) {
          return res.status(400).json({
            success: false,
            message: validation.errors.join(', ')
          });
        }
      }
      
      next();
    });
  };
};

// Document upload middleware (specific for identity documents)
const uploadDocuments = uploadMultiple('documents', 3);

// Profile image upload middleware
const uploadProfileImage = uploadSingle('profileImage');

// Product images upload middleware
const uploadProductImages = uploadMultiple('images', 5);

// Alternate documents upload middleware
const uploadAlternateDocuments = uploadMultiple('alternateDocuments', 3);

// Cleanup uploaded files on error
const cleanupOnError = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // If response indicates error, cleanup uploaded files
    if (res.statusCode >= 400 && req.files) {
      const filePaths = req.files.map(file => file.path);
      require('../utils/fileValidation').cleanupFiles(filePaths);
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Middleware to add file URLs to response
const addFileUrls = (req, res, next) => {
  if (req.files && req.files.length > 0) {
    req.fileUrls = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      url: `/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }));
  }
  
  if (req.file) {
    req.fileUrl = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path,
      url: `/uploads/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype
    };
  }
  
  next();
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadDocuments,
  uploadProfileImage,
  uploadProductImages,
  uploadAlternateDocuments,
  handleUploadError,
  cleanupOnError,
  addFileUrls
};
