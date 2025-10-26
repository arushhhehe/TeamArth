const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../../middleware/auth');
const { uploadDocuments, uploadAlternateDocuments, addFileUrls } = require('../../middleware/upload');
const Seller = require('../../models/Seller');
const Verification = require('../../models/Verification');

const router = express.Router();

/**
 * @route   POST /api/seller/register
 * @desc    Complete seller registration/onboarding
 * @access  Private
 */
router.post('/register',
  authenticateToken,
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('region')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Region is required'),
    body('city')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('City is required'),
    body('village')
      .optional()
      .trim()
      .isLength({ max: 50 }),
    body('categories')
      .isArray({ min: 1 })
      .withMessage('At least one category is required'),
    body('language')
      .isIn(['English', 'Hindi', 'Both'])
      .withMessage('Invalid language selection'),
    body('scale')
      .isIn(['Micro', 'Small', 'Medium'])
      .withMessage('Invalid scale selection'),
    body('capacity')
      .optional()
      .trim()
      .isLength({ max: 200 })
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

      const {
        name,
        email,
        region,
        city,
        village,
        categories,
        language,
        scale,
        capacity,
        hasDocuments,
        documentType,
        alternateDocuments
      } = req.body;

      // Update seller profile
      const seller = await Seller.findById(req.userId);
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: 'Seller not found'
        });
      }

      // Update seller data
      seller.name = name;
      seller.email = email;
      seller.region = region;
      seller.city = city;
      seller.village = village;
      seller.categories = categories;
      seller.language = language;
      seller.scale = scale;
      seller.capacity = capacity;
      seller.hasDocuments = hasDocuments;
      seller.documentType = documentType;

      // Handle document status
      if (hasDocuments) {
        seller.verificationStatus = 'pending';
      } else {
        seller.verificationStatus = 'provisional';
        // Set provisional membership expiry (90 days)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 90);
        seller.unionMembership.expiryDate = expiryDate;
      }

      await seller.save();

      // Create verification record
      const verification = new Verification({
        sellerId: seller._id,
        documentType: documentType,
        status: hasDocuments ? 'pending' : 'under-review',
        alternateDocuments: alternateDocuments || []
      });

      if (hasDocuments) {
        verification.status = 'pending';
      } else {
        verification.status = 'under-review';
        verification.provisionalDetails = {
          isProvisional: true,
          expiryDate: seller.unionMembership.expiryDate
        };
      }

      await verification.save();

      res.json({
        success: true,
        message: 'Registration completed successfully',
        seller: {
          id: seller._id,
          name: seller.name,
          verificationStatus: seller.verificationStatus,
          unionMembership: seller.unionMembership
        }
      });
    } catch (error) {
      console.error('Seller registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to complete registration'
      });
    }
  }
);

/**
 * @route   GET /api/seller/profile
 * @desc    Get seller profile
 * @access  Private
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const seller = await Seller.findById(req.userId).select('-__v');
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    res.json({
      success: true,
      seller: {
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
        hasDocuments: seller.hasDocuments,
        documentType: seller.documentType,
        documentPath: seller.documentPath,
        alternateDocuments: seller.alternateDocuments,
        verificationStatus: seller.verificationStatus,
        unionMembership: seller.unionMembership,
        referralCode: seller.referralCode,
        supportTickets: seller.supportTickets,
        createdAt: seller.createdAt,
        updatedAt: seller.updatedAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
});

/**
 * @route   PUT /api/seller/profile
 * @desc    Update seller profile
 * @access  Private
 */
router.put('/profile',
  authenticateToken,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('region')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }),
    body('city')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }),
    body('village')
      .optional()
      .trim()
      .isLength({ max: 50 }),
    body('categories')
      .optional()
      .isArray({ min: 1 }),
    body('language')
      .optional()
      .isIn(['English', 'Hindi', 'Both']),
    body('scale')
      .optional()
      .isIn(['Micro', 'Small', 'Medium']),
    body('capacity')
      .optional()
      .trim()
      .isLength({ max: 200 })
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

      const seller = await Seller.findById(req.userId);
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: 'Seller not found'
        });
      }

      // Update allowed fields
      const allowedFields = ['name', 'email', 'region', 'city', 'village', 'categories', 'language', 'scale', 'capacity'];
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          seller[field] = req.body[field];
        }
      });

      seller.updatedAt = new Date();
      await seller.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        seller: {
          id: seller._id,
          name: seller.name,
          email: seller.email,
          region: seller.region,
          city: seller.city,
          village: seller.village,
          categories: seller.categories,
          language: seller.language,
          scale: seller.scale,
          capacity: seller.capacity,
          updatedAt: seller.updatedAt
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  }
);

/**
 * @route   POST /api/seller/upload-documents
 * @desc    Upload identity documents
 * @access  Private
 */
router.post('/upload-documents',
  authenticateToken,
  uploadDocuments,
  addFileUrls,
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No documents uploaded'
        });
      }

      const seller = await Seller.findById(req.userId);
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: 'Seller not found'
        });
      }

      // Update seller document paths
      const documentPaths = req.files.map(file => file.path);
      seller.documentPath = [...(seller.documentPath || []), ...documentPaths];
      seller.hasDocuments = true;
      seller.verificationStatus = 'pending';

      await seller.save();

      // Update verification record
      let verification = await Verification.findOne({ sellerId: seller._id });
      if (!verification) {
        verification = new Verification({
          sellerId: seller._id,
          documentType: req.body.documentType || 'PAN'
        });
      }

      verification.documents = [...(verification.documents || []), ...documentPaths];
      verification.status = 'pending';
      await verification.save();

      res.json({
        success: true,
        message: 'Documents uploaded successfully',
        documents: req.fileUrls,
        verificationStatus: seller.verificationStatus
      });
    } catch (error) {
      console.error('Upload documents error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload documents'
      });
    }
  }
);

/**
 * @route   POST /api/seller/alternate-documents
 * @desc    Upload alternate documents for no-document sellers
 * @access  Private
 */
router.post('/alternate-documents',
  authenticateToken,
  uploadAlternateDocuments,
  addFileUrls,
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No documents uploaded'
        });
      }

      const seller = await Seller.findById(req.userId);
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: 'Seller not found'
        });
      }

      // Process alternate documents
      const alternateDocs = req.files.map((file, index) => ({
        type: req.body.types ? req.body.types[index] : 'Other',
        path: file.path,
        description: req.body.descriptions ? req.body.descriptions[index] : ''
      }));

      seller.alternateDocuments = [...(seller.alternateDocuments || []), ...alternateDocs];
      seller.verificationStatus = 'provisional';

      // Set provisional membership expiry
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 90);
      seller.unionMembership.expiryDate = expiryDate;

      await seller.save();

      // Update verification record
      let verification = await Verification.findOne({ sellerId: seller._id });
      if (!verification) {
        verification = new Verification({
          sellerId: seller._id,
          documentType: 'None'
        });
      }

      verification.alternateDocuments = [...(verification.alternateDocuments || []), ...alternateDocs];
      verification.status = 'under-review';
      verification.provisionalDetails = {
        isProvisional: true,
        expiryDate: expiryDate
      };

      await verification.save();

      res.json({
        success: true,
        message: 'Alternate documents uploaded successfully',
        documents: req.fileUrls,
        verificationStatus: seller.verificationStatus,
        unionMembership: seller.unionMembership
      });
    } catch (error) {
      console.error('Upload alternate documents error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload alternate documents'
      });
    }
  }
);

/**
 * @route   GET /api/seller/verification-status
 * @desc    Get current verification status
 * @access  Private
 */
router.get('/verification-status', authenticateToken, async (req, res) => {
  try {
    const seller = await Seller.findById(req.userId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    const verification = await Verification.findOne({ sellerId: seller._id });

    const response = {
      success: true,
      verificationStatus: seller.verificationStatus,
      unionMembership: seller.unionMembership,
      hasDocuments: seller.hasDocuments,
      documentType: seller.documentType
    };

    if (verification) {
      response.verification = {
        status: verification.status,
        adminNotes: verification.adminNotes,
        reviewedAt: verification.reviewedAt,
        provisionalDetails: verification.provisionalDetails
      };

      // Check if provisional membership is expired
      if (verification.provisionalDetails && verification.provisionalDetails.isProvisional) {
        const isExpired = new Date() > verification.provisionalDetails.expiryDate;
        response.isProvisionalExpired = isExpired;
        response.canRenew = verification.canRenewProvisional();
      }
    }

    res.json(response);
  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get verification status'
    });
  }
});

/**
 * @route   POST /api/seller/report-issue
 * @desc    Report support issue
 * @access  Private
 */
router.post('/report-issue',
  authenticateToken,
  [
    body('issue')
      .trim()
      .isLength({ min: 10, max: 200 })
      .withMessage('Issue title must be between 10 and 200 characters'),
    body('description')
      .trim()
      .isLength({ min: 20, max: 1000 })
      .withMessage('Description must be between 20 and 1000 characters')
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

      const { issue, description } = req.body;

      const seller = await Seller.findById(req.userId);
      if (!seller) {
        return res.status(404).json({
          success: false,
          message: 'Seller not found'
        });
      }

      // Add support ticket
      const ticket = {
        issue,
        description,
        status: 'open',
        createdAt: new Date()
      };

      seller.supportTickets.push(ticket);
      await seller.save();

      res.json({
        success: true,
        message: 'Issue reported successfully',
        ticket: {
          id: ticket._id,
          issue: ticket.issue,
          status: ticket.status,
          createdAt: ticket.createdAt
        }
      });
    } catch (error) {
      console.error('Report issue error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to report issue'
      });
    }
  }
);

/**
 * @route   GET /api/seller/support-tickets
 * @desc    Get seller's support tickets
 * @access  Private
 */
router.get('/support-tickets', authenticateToken, async (req, res) => {
  try {
    const seller = await Seller.findById(req.userId).select('supportTickets');
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    res.json({
      success: true,
      tickets: seller.supportTickets
    });
  } catch (error) {
    console.error('Get support tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get support tickets'
    });
  }
});

module.exports = router;
