const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { createRateLimit } = require('../../middleware/auth');
const { generateAndSendOTP, verifyOTP } = require('../../utils/otp');
const Seller = require('../../models/Seller');

const router = express.Router();

// Rate limiting for OTP requests
const otpRateLimit = createRateLimit(15 * 60 * 1000, 3); // 3 requests per 15 minutes

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to phone number
 * @access  Public
 */
router.post('/send-otp', 
  otpRateLimit,
  [
    body('phone')
      .isMobilePhone('any')
      .withMessage('Please provide a valid phone number')
      .normalizeMobile()
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { phone } = req.body;

      // Generate and send OTP
      const result = await generateAndSendOTP(phone);

      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          // In development, return OTP for testing
          ...(process.env.NODE_ENV === 'development' && { otp: result.otp })
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP'
      });
    }
  }
);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and authenticate user
 * @access  Public
 */
router.post('/verify-otp',
  [
    body('phone')
      .isMobilePhone('any')
      .withMessage('Please provide a valid phone number')
      .normalizeMobile(),
    body('otp')
      .isLength({ min: 6, max: 6 })
      .withMessage('OTP must be 6 digits')
      .isNumeric()
      .withMessage('OTP must contain only numbers')
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { phone, otp } = req.body;

      // Verify OTP
      const verification = verifyOTP(phone, otp);

      if (!verification.success) {
        return res.status(400).json({
          success: false,
          message: verification.message
        });
      }

      // Find or create seller
      let seller = await Seller.findOne({ phone });
      
      if (!seller) {
        // Create new seller with basic info
        seller = new Seller({
          phone,
          verificationStatus: 'pending'
        });
        await seller.save();
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: seller._id,
          phone: seller.phone,
          verificationStatus: seller.verificationStatus
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.json({
        success: true,
        message: 'OTP verified successfully',
        token,
        user: {
          id: seller._id,
          phone: seller.phone,
          name: seller.name,
          verificationStatus: seller.verificationStatus,
          unionMembership: seller.unionMembership,
          isNewUser: !seller.name // Check if this is a new user
        }
      });
    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify OTP'
      });
    }
  }
);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post('/refresh-token', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token required'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const seller = await Seller.findById(decoded.userId);

      if (!seller) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Generate new token
      const newToken = jwt.sign(
        { 
          userId: seller._id,
          phone: seller.phone,
          verificationStatus: seller.verificationStatus
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        token: newToken
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token'
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Private
 */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seller = await Seller.findById(decoded.userId).select('-__v');

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: seller._id,
        phone: seller.phone,
        name: seller.name,
        email: seller.email,
        region: seller.region,
        city: seller.city,
        village: seller.village,
        categories: seller.categories,
        language: seller.language,
        scale: seller.scale,
        capacity: seller.capacity,
        verificationStatus: seller.verificationStatus,
        unionMembership: seller.unionMembership,
        referralCode: seller.referralCode,
        createdAt: seller.createdAt
      }
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user info'
    });
  }
});

module.exports = router;
