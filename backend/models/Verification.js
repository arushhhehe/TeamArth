const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  documentType: {
    type: String,
    enum: ['PAN', 'Aadhaar', 'Voter ID', 'Driving License', 'Ration Card', 'None'],
    required: true
  },
  documents: [{
    type: String, // File paths
    required: false
  }],
  alternateDocuments: [{
    type: {
      type: String,
      enum: ['Shop License', 'Community Letter', 'Work Photo', 'Other']
    },
    path: String,
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under-review'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  reviewedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: 500
  },
  // Verification history
  history: [{
    action: {
      type: String,
      enum: ['submitted', 'under-review', 'approved', 'rejected', 'resubmitted']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    notes: String
  }],
  // Provisional membership details
  provisionalDetails: {
    isProvisional: {
      type: Boolean,
      default: false
    },
    expiryDate: Date,
    renewalCount: {
      type: Number,
      default: 0
    },
    maxRenewals: {
      type: Number,
      default: 2
    }
  },
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

// Pre-save middleware
verificationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to add history entry
verificationSchema.methods.addHistoryEntry = function(action, adminId, notes) {
  this.history.push({
    action,
    adminId,
    notes,
    timestamp: new Date()
  });
  return this.save();
};

// Method to check if provisional membership can be renewed
verificationSchema.methods.canRenewProvisional = function() {
  if (!this.provisionalDetails.isProvisional) return false;
  return this.provisionalDetails.renewalCount < this.provisionalDetails.maxRenewals;
};

// Method to check if provisional membership is expired
verificationSchema.methods.isProvisionalExpired = function() {
  if (!this.provisionalDetails.isProvisional) return false;
  return new Date() > this.provisionalDetails.expiryDate;
};

// Index for better query performance
verificationSchema.index({ sellerId: 1 });
verificationSchema.index({ status: 1 });
verificationSchema.index({ reviewedBy: 1 });
verificationSchema.index({ 'provisionalDetails.isProvisional': 1 });
verificationSchema.index({ 'provisionalDetails.expiryDate': 1 });

module.exports = mongoose.model('Verification', verificationSchema);
