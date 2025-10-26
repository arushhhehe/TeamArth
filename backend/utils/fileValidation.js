const path = require('path');
const fs = require('fs');

/**
 * Allowed file types for document uploads
 */
const ALLOWED_FILE_TYPES = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'application/pdf': '.pdf'
};

/**
 * Maximum file size in bytes (5MB)
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validate file type
 * @param {string} mimetype - MIME type of the file
 * @returns {boolean} Is valid file type
 */
const isValidFileType = (mimetype) => {
  return Object.keys(ALLOWED_FILE_TYPES).includes(mimetype);
};

/**
 * Validate file size
 * @param {number} size - File size in bytes
 * @returns {boolean} Is valid file size
 */
const isValidFileSize = (size) => {
  return size <= MAX_FILE_SIZE;
};

/**
 * Generate secure filename
 * @param {string} originalname - Original filename
 * @param {string} mimetype - MIME type
 * @returns {string} Secure filename
 */
const generateSecureFilename = (originalname, mimetype) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = ALLOWED_FILE_TYPES[mimetype] || path.extname(originalname);
  return `${timestamp}_${randomString}${extension}`;
};

/**
 * Validate uploaded file
 * @param {object} file - Multer file object
 * @returns {object} Validation result
 */
const validateFile = (file) => {
  const errors = [];

  // Check if file exists
  if (!file) {
    return {
      isValid: false,
      errors: ['No file provided']
    };
  }

  // Validate file type
  if (!isValidFileType(file.mimetype)) {
    errors.push(`Invalid file type. Allowed types: ${Object.keys(ALLOWED_FILE_TYPES).join(', ')}`);
  }

  // Validate file size
  if (!isValidFileSize(file.size)) {
    errors.push(`File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }

  // Check for malicious file extensions
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js', '.jar'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (dangerousExtensions.includes(fileExtension)) {
    errors.push('File type not allowed for security reasons');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate multiple files
 * @param {array} files - Array of file objects
 * @returns {object} Validation result
 */
const validateFiles = (files) => {
  const errors = [];
  const validFiles = [];

  if (!files || files.length === 0) {
    return {
      isValid: false,
      errors: ['No files provided'],
      validFiles: []
    };
  }

  // Check maximum number of files (limit to 5)
  if (files.length > 5) {
    errors.push('Maximum 5 files allowed per upload');
  }

  files.forEach((file, index) => {
    const validation = validateFile(file);
    if (!validation.isValid) {
      errors.push(`File ${index + 1}: ${validation.errors.join(', ')}`);
    } else {
      validFiles.push(file);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    validFiles
  };
};

/**
 * Create upload directory if it doesn't exist
 * @param {string} uploadPath - Path to create
 */
const ensureUploadDirectory = (uploadPath) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
};

/**
 * Clean up uploaded files
 * @param {array} filePaths - Array of file paths to delete
 */
const cleanupFiles = (filePaths) => {
  filePaths.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  });
};

/**
 * Get file info for display
 * @param {string} filePath - Path to file
 * @returns {object} File information
 */
const getFileInfo = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return {
      name: path.basename(filePath),
      size: stats.size,
      sizeFormatted: formatFileSize(stats.size),
      created: stats.birthtime,
      modified: stats.mtime
    };
  } catch (error) {
    console.error('Error getting file info:', error);
    return null;
  }
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if file is an image
 * @param {string} mimetype - MIME type
 * @returns {boolean} Is image
 */
const isImage = (mimetype) => {
  return mimetype.startsWith('image/');
};

/**
 * Check if file is a PDF
 * @param {string} mimetype - MIME type
 * @returns {boolean} Is PDF
 */
const isPDF = (mimetype) => {
  return mimetype === 'application/pdf';
};

module.exports = {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  isValidFileType,
  isValidFileSize,
  generateSecureFilename,
  validateFile,
  validateFiles,
  ensureUploadDirectory,
  cleanupFiles,
  getFileInfo,
  formatFileSize,
  isImage,
  isPDF
};
