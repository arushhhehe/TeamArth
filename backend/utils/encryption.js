const crypto = require('crypto');

/**
 * Encrypt sensitive data using AES-256-CBC
 * @param {string} data - Data to encrypt
 * @param {string} key - Encryption key (optional, uses env variable if not provided)
 * @returns {object} Encrypted data with IV
 */
const encryptData = (data, key = null) => {
  try {
    const encryptionKey = key || process.env.ENCRYPTION_KEY || 'default32characterencryptionkey123';
    const keyBuffer = Buffer.from(encryptionKey.slice(0, 32), 'utf8');
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher('aes-256-cbc', keyBuffer);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encrypted,
      iv: iv.toString('hex')
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt sensitive data using AES-256-CBC
 * @param {string} encryptedData - Encrypted data
 * @param {string} iv - Initialization vector
 * @param {string} key - Encryption key (optional, uses env variable if not provided)
 * @returns {string} Decrypted data
 */
const decryptData = (encryptedData, iv, key = null) => {
  try {
    const encryptionKey = key || process.env.ENCRYPTION_KEY || 'default32characterencryptionkey123';
    const keyBuffer = Buffer.from(encryptionKey.slice(0, 32), 'utf8');
    const ivBuffer = Buffer.from(iv, 'hex');
    
    const decipher = crypto.createDecipher('aes-256-cbc', keyBuffer);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Hash sensitive data using SHA-256
 * @param {string} data - Data to hash
 * @returns {string} Hashed data
 */
const hashData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Generate a secure random string
 * @param {number} length - Length of the string (default: 32)
 * @returns {string} Random string
 */
const generateSecureRandom = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Encrypt file content
 * @param {Buffer} fileBuffer - File buffer to encrypt
 * @param {string} key - Encryption key (optional)
 * @returns {object} Encrypted file with IV
 */
const encryptFile = (fileBuffer, key = null) => {
  try {
    const encryptionKey = key || process.env.ENCRYPTION_KEY || 'default32characterencryptionkey123';
    const keyBuffer = Buffer.from(encryptionKey.slice(0, 32), 'utf8');
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher('aes-256-cbc', keyBuffer);
    let encrypted = cipher.update(fileBuffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    return {
      encrypted,
      iv: iv.toString('hex')
    };
  } catch (error) {
    console.error('File encryption error:', error);
    throw new Error('Failed to encrypt file');
  }
};

/**
 * Decrypt file content
 * @param {Buffer} encryptedBuffer - Encrypted file buffer
 * @param {string} iv - Initialization vector
 * @param {string} key - Encryption key (optional)
 * @returns {Buffer} Decrypted file buffer
 */
const decryptFile = (encryptedBuffer, iv, key = null) => {
  try {
    const encryptionKey = key || process.env.ENCRYPTION_KEY || 'default32characterencryptionkey123';
    const keyBuffer = Buffer.from(encryptionKey.slice(0, 32), 'utf8');
    const ivBuffer = Buffer.from(iv, 'hex');
    
    const decipher = crypto.createDecipher('aes-256-cbc', keyBuffer);
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted;
  } catch (error) {
    console.error('File decryption error:', error);
    throw new Error('Failed to decrypt file');
  }
};

/**
 * Create a secure hash for password verification
 * @param {string} password - Password to hash
 * @returns {string} Hashed password
 */
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

/**
 * Verify password against hash
 * @param {string} password - Password to verify
 * @param {string} hash - Stored hash
 * @returns {boolean} Verification result
 */
const verifyPassword = (password, hash) => {
  try {
    const [salt, storedHash] = hash.split(':');
    const hashToVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return storedHash === hashToVerify;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
};

module.exports = {
  encryptData,
  decryptData,
  hashData,
  generateSecureRandom,
  encryptFile,
  decryptFile,
  hashPassword,
  verifyPassword
};
