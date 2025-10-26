const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { authenticateAdmin, requirePermission } = require('../../middleware/auth');
const Admin = require('../../models/Admin');
const Seller = require('../../models/Seller');
const Verification = require('../../models/Verification');
const Product = require('../../models/Product');

const router = express.Router();

/**
 * @route   POST /api/admin/login
 * @desc    Admin login
 * @access  Public
 */
router.post('/login',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('Username is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { username, password } = req.body;

      // Find admin
      const admin = await Admin.findOne({ username });
      if (!admin || !admin.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if account is locked
      if (admin.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked due to too many failed attempts'
        });
      }

      // Verify password
      const isPasswordValid = await admin.comparePassword(password);
      if (!isPasswordValid) {
        // Increment login attempts
        await admin.incLoginAttempts();
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Reset login attempts on successful login
      await admin.resetLoginAttempts();

      // Update last login
      admin.lastLogin = new Date();
      await admin.save();

      // Generate JWT token
      const token = jwt.sign(
        { 
          adminId: admin._id,
          username: admin.username,
          role: admin.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      // Log activity
      admin.logActivity('login', 'system', req);

      res.json({
        success: true,
        message: 'Login successful',
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          role: admin.role,
          permissions: admin.permissions,
          lastLogin: admin.lastLogin
        }
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  }
);

/**
 * @route   GET /api/admin/sellers
 * @desc    Get all sellers with filters
 * @access  Private (Admin)
 */
router.get('/sellers',
  authenticateAdmin,
  requirePermission('verify-sellers'),
  async (req, res) => {
    try {
      const { 
        status, 
        category, 
        region, 
        search, 
        page = 1, 
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Build query
      const query = {};
      if (status && status !== 'all') {
        query.verificationStatus = status;
      }
      if (category) {
        query.categories = { $in: [category] };
      }
      if (region) {
        query.region = { $regex: region, $options: 'i' };
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Sort
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const sellers = await Seller.find(query)
        .select('-__v -supportTickets')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Seller.countDocuments(query);

      // Get verification details for each seller
      const sellersWithVerification = await Promise.all(
        sellers.map(async (seller) => {
          const verification = await Verification.findOne({ sellerId: seller._id });
          return {
            ...seller.toObject(),
            verification: verification ? {
              status: verification.status,
              adminNotes: verification.adminNotes,
              reviewedAt: verification.reviewedAt,
              provisionalDetails: verification.provisionalDetails
            } : null
          };
        })
      );

      res.json({
        success: true,
        sellers: sellersWithVerification,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        },
        filters: {
          status,
          category,
          region,
          search,
          sortBy,
          sortOrder
        }
      });
    } catch (error) {
      console.error('Get sellers error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get sellers'
      });
    }
  }
);

/**
 * @route   GET /api/admin/sellers/:id
 * @desc    Get seller details
 * @access  Private (Admin)
 */
router.get('/sellers/:id',
  authenticateAdmin,
  requirePermission('verify-sellers'),
  async (req, res) => {
    try {
      const seller = await Seller.findById(req.params.id);
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: 'Seller not found'
        });
      }

      const verification = await Verification.findOne({ sellerId: seller._id });
      const products = await Product.find({ sellerId: seller._id }).select('name category status createdAt');

      res.json({
        success: true,
        seller: {
          ...seller.toObject(),
          verification,
          products
        }
      });
    } catch (error) {
      console.error('Get seller details error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get seller details'
      });
    }
  }
);

/**
 * @route   PUT /api/admin/verify/:sellerId
 * @desc    Approve/reject seller verification
 * @access  Private (Admin)
 */
router.put('/verify/:sellerId',
  authenticateAdmin,
  requirePermission('verify-sellers'),
  [
    body('action')
      .isIn(['approve', 'reject', 'provisional'])
      .withMessage('Action must be approve, reject, or provisional'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Notes must be less than 1000 characters'),
    body('rejectionReason')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Rejection reason must be less than 500 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { sellerId } = req.params;
      const { action, notes, rejectionReason } = req.body;

      const seller = await Seller.findById(sellerId);
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: 'Seller not found'
        });
      }

      // Find or create verification record
      let verification = await Verification.findOne({ sellerId });
      if (!verification) {
        verification = new Verification({
          sellerId,
          documentType: seller.documentType || 'None'
        });
      }

      // Update verification based on action
      switch (action) {
        case 'approve':
          seller.verificationStatus = 'verified';
          seller.unionMembership.status = 'active';
          if (!seller.unionMembership.issueDate) {
            seller.unionMembership.issueDate = new Date();
          }
          verification.status = 'approved';
          break;

        case 'reject':
          seller.verificationStatus = 'pending';
          verification.status = 'rejected';
          verification.rejectionReason = rejectionReason;
          break;

        case 'provisional':
          seller.verificationStatus = 'provisional';
          seller.unionMembership.status = 'active';
          if (!seller.unionMembership.issueDate) {
            seller.unionMembership.issueDate = new Date();
          }
          // Set expiry date (90 days)
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 90);
          seller.unionMembership.expiryDate = expiryDate;
          verification.status = 'under-review';
          verification.provisionalDetails = {
            isProvisional: true,
            expiryDate: expiryDate
          };
          break;
      }

      // Update verification record
      verification.adminNotes = notes;
      verification.reviewedBy = req.adminId;
      verification.reviewedAt = new Date();

      // Add history entry
      await verification.addHistoryEntry(action, req.adminId, notes);

      await Promise.all([seller.save(), verification.save()]);

      // Log admin activity
      const admin = await Admin.findById(req.adminId);
      admin.logActivity(`verify-${action}`, sellerId, req);

      res.json({
        success: true,
        message: `Seller verification ${action}d successfully`,
        seller: {
          id: seller._id,
          verificationStatus: seller.verificationStatus,
          unionMembership: seller.unionMembership
        }
      });
    } catch (error) {
      console.error('Verify seller error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update verification'
      });
    }
  }
);

/**
 * @route   PUT /api/admin/membership/:sellerId
 * @desc    Toggle union membership
 * @access  Private (Admin)
 */
router.put('/membership/:sellerId',
  authenticateAdmin,
  requirePermission('manage-membership'),
  [
    body('status')
      .isIn(['active', 'suspended', 'expired'])
      .withMessage('Status must be active, suspended, or expired'),
    body('reason')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Reason must be less than 500 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { sellerId } = req.params;
      const { status, reason } = req.body;

      const seller = await Seller.findById(sellerId);
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: 'Seller not found'
        });
      }

      seller.unionMembership.status = status;
      if (reason) {
        seller.unionMembership.reason = reason;
      }

      await seller.save();

      // Log admin activity
      const admin = await Admin.findById(req.adminId);
      admin.logActivity(`membership-${status}`, sellerId, req);

      res.json({
        success: true,
        message: `Union membership ${status}d successfully`,
        unionMembership: seller.unionMembership
      });
    } catch (error) {
      console.error('Update membership error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update membership'
      });
    }
  }
);

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard statistics
 * @access  Private (Admin)
 */
router.get('/dashboard',
  authenticateAdmin,
  async (req, res) => {
    try {
      // Get statistics
      const [
        totalSellers,
        verifiedSellers,
        provisionalSellers,
        pendingSellers,
        totalProducts,
        activeProducts
      ] = await Promise.all([
        Seller.countDocuments(),
        Seller.countDocuments({ verificationStatus: 'verified' }),
        Seller.countDocuments({ verificationStatus: 'provisional' }),
        Seller.countDocuments({ verificationStatus: 'pending' }),
        Product.countDocuments(),
        Product.countDocuments({ status: 'active' })
      ]);

      // Get recent activity
      const recentSellers = await Seller.find()
        .select('name phone verificationStatus createdAt')
        .sort({ createdAt: -1 })
        .limit(5);

      const recentProducts = await Product.find()
        .populate('sellerId', 'name')
        .select('name category status createdAt')
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        success: true,
        statistics: {
          totalSellers,
          verifiedSellers,
          provisionalSellers,
          pendingSellers,
          totalProducts,
          activeProducts
        },
        recentActivity: {
          sellers: recentSellers,
          products: recentProducts
        }
      });
    } catch (error) {
      console.error('Get dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get dashboard data'
      });
    }
  }
);

/**
 * @route   GET /api/admin/analytics
 * @desc    Get analytics data
 * @access  Private (Admin)
 */
router.get('/analytics',
  authenticateAdmin,
  requirePermission('view-analytics'),
  async (req, res) => {
    try {
      const { period = '30d' } = req.query;

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      switch (period) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      // Get registration trends
      const registrationTrends = await Seller.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
      ]);

      // Get category distribution
      const categoryDistribution = await Seller.aggregate([
        { $unwind: '$categories' },
        {
          $group: {
            _id: '$categories',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      // Get regional distribution
      const regionalDistribution = await Seller.aggregate([
        {
          $group: {
            _id: '$region',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      res.json({
        success: true,
        analytics: {
          period,
          registrationTrends,
          categoryDistribution,
          regionalDistribution
        }
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get analytics'
      });
    }
  }
);

module.exports = router;
