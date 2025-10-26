const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['Agriculture', 'Handicrafts', 'Services', 'Manufacturing', 'Textiles', 'Food Processing', 'Technology', 'Other']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD']
  },
  maxUnits: {
    type: Number,
    required: true,
    min: 1
  },
  availableUnits: {
    type: Number,
    default: function() {
      return this.maxUnits;
    }
  },
  leadTime: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out-of-stock', 'discontinued'],
    default: 'active'
  },
  images: [{
    type: String, // File paths
    required: false
  }],
  specifications: {
    type: Map,
    of: String
  },
  // Marketplace matching
  marketplaceMatch: {
    isMatched: {
      type: Boolean,
      default: false
    },
    matchedPlatform: String,
    matchedAt: Date,
    commissionRate: Number
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
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for better query performance
productSchema.index({ sellerId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ 'marketplaceMatch.isMatched': 1 });

// Virtual for availability status
productSchema.virtual('isAvailable').get(function() {
  return this.status === 'active' && this.availableUnits > 0;
});

module.exports = mongoose.model('Product', productSchema);
