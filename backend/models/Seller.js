const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const sellerSchema = new mongoose.Schema({
  // Contact Information
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },

  // Location Information
  region: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  village: {
    type: String,
    trim: true
  },

  // Business Information
  categories: [{
    type: String,
    enum: ['Agriculture', 'Handicrafts', 'Services', 'Manufacturing', 'Textiles', 'Food Processing', 'Technology', 'Other']
  }],
  language: {
    type: String,
    enum: ['English', 'Hindi', 'Both'],
    default: 'English'
  },
  scale: {
    type: String,
    enum: ['Micro', 'Small', 'Medium'],
    required: true
  },
  capacity: {
    type: String,
    trim: true
  },

  // Document Information
  hasDocuments: {
    type: Boolean,
    default: false
  },
  documentType: {
    type: String,
    enum: ['PAN', 'Aadhaar', 'Voter ID', 'Driving License', 'Ration Card', 'None']
  },
  documentPath: [{
    type: String
  }],
  alternateDocuments: [{
    type: {
      type: String,
      enum: ['Shop License', 'Community Letter', 'Work Photo', 'Other']
    },
    path: String,
    description: String
  }],

  // Verification Status
  verificationStatus: {
    type: String,
    enum: ['verified', 'provisional', 'pending'],
    default: 'pending'
  },

  // Union Membership
  unionMembership: {
    id: {
      type: String,
      unique: true,
      sparse: true
    },
    issueDate: Date,
    expiryDate: Date,
    status: {
      type: String,
      enum: ['active', 'expired', 'suspended'],
      default: 'active'
    }
  },

  // Support
  supportTickets: [{
    issue: String,
    description: String,
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved'],
      default: 'open'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Referrals
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller'
  },
  referrals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller'
  }],

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate union ID and referral code
sellerSchema.pre('save', function(next) {
  if (this.isNew && !this.unionMembership.id) {
    // Generate union ID: UU + year + 6-digit random number
    const year = new Date().getFullYear().toString().slice(-2);
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    this.unionMembership.id = `UU${year}${randomNum}`;
  }

  if (this.isNew && !this.referralCode) {
    // Generate referral code: 6-character alphanumeric
    this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  this.updatedAt = new Date();
  next();
});

// Method to encrypt sensitive data
sellerSchema.methods.encryptSensitiveData = function(data) {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ENCRYPTION_KEY || 'default32characterencryptionkey123', 'utf8');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return encrypted;
};

// Method to decrypt sensitive data
sellerSchema.methods.decryptSensitiveData = function(encryptedData) {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ENCRYPTION_KEY || 'default32characterencryptionkey123', 'utf8');
  
  const decipher = crypto.createDecipher(algorithm, key);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

// Virtual for verification badge color
sellerSchema.virtual('verificationBadgeColor').get(function() {
  switch (this.verificationStatus) {
    case 'verified': return 'green';
    case 'provisional': return 'yellow';
    case 'pending': return 'gray';
    default: return 'gray';
  }
});

// Index for better query performance
sellerSchema.index({ phone: 1 });
sellerSchema.index({ verificationStatus: 1 });
sellerSchema.index({ 'unionMembership.id': 1 });
sellerSchema.index({ categories: 1 });
sellerSchema.index({ region: 1, city: 1 });

module.exports = mongoose.model('Seller', sellerSchema);
