const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireVerification } = require('../../middleware/auth');
const { uploadProductImages, addFileUrls } = require('../../middleware/upload');
const Product = require('../../models/Product');
const Seller = require('../../models/Seller');

const router = express.Router();

/**
 * @route   POST /api/products
 * @desc    Add new product/service
 * @access  Private
 */
router.post('/',
  authenticateToken,
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage('Product name must be between 2 and 200 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('category')
      .isIn(['Agriculture', 'Handicrafts', 'Services', 'Manufacturing', 'Textiles', 'Food Processing', 'Technology', 'Other'])
      .withMessage('Invalid category'),
    body('price')
      .isNumeric()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('maxUnits')
      .isInt({ min: 1 })
      .withMessage('Maximum units must be at least 1'),
    body('leadTime')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Lead time is required'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('specifications')
      .optional()
      .isObject()
      .withMessage('Specifications must be an object')
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
        description,
        category,
        tags = [],
        price,
        maxUnits,
        leadTime,
        specifications = {}
      } = req.body;

      // Create new product
      const product = new Product({
        sellerId: req.userId,
        name,
        description,
        category,
        tags,
        price,
        maxUnits,
        availableUnits: maxUnits,
        leadTime,
        specifications,
        status: 'active'
      });

      await product.save();

      res.status(201).json({
        success: true,
        message: 'Product added successfully',
        product: {
          id: product._id,
          name: product.name,
          description: product.description,
          category: product.category,
          tags: product.tags,
          price: product.price,
          maxUnits: product.maxUnits,
          availableUnits: product.availableUnits,
          leadTime: product.leadTime,
          status: product.status,
          createdAt: product.createdAt
        }
      });
    } catch (error) {
      console.error('Add product error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add product'
      });
    }
  }
);

/**
 * @route   GET /api/products/seller/:sellerId
 * @desc    Get seller's products
 * @access  Public (for verified sellers)
 */
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { status = 'active', category, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { sellerId };
    if (status !== 'all') {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get products'
    });
  }
});

/**
 * @route   GET /api/products/my-products
 * @desc    Get current seller's products
 * @access  Private
 */
router.get('/my-products', authenticateToken, async (req, res) => {
  try {
    const { status = 'all', category, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { sellerId: req.userId };
    if (status !== 'all') {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get products'
    });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'name phone region city verificationStatus unionMembership')
      .select('-__v');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get product'
    });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private
 */
router.put('/:id',
  authenticateToken,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 200 }),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 }),
    body('category')
      .optional()
      .isIn(['Agriculture', 'Handicrafts', 'Services', 'Manufacturing', 'Textiles', 'Food Processing', 'Technology', 'Other']),
    body('price')
      .optional()
      .isNumeric()
      .isFloat({ min: 0 }),
    body('maxUnits')
      .optional()
      .isInt({ min: 1 }),
    body('leadTime')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 }),
    body('status')
      .optional()
      .isIn(['active', 'inactive', 'out-of-stock', 'discontinued'])
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

      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check if user owns this product
      if (product.sellerId.toString() !== req.userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this product'
        });
      }

      // Update allowed fields
      const allowedFields = ['name', 'description', 'category', 'tags', 'price', 'maxUnits', 'availableUnits', 'leadTime', 'status', 'specifications'];
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          product[field] = req.body[field];
        }
      });

      product.updatedAt = new Date();
      await product.save();

      res.json({
        success: true,
        message: 'Product updated successfully',
        product: {
          id: product._id,
          name: product.name,
          description: product.description,
          category: product.category,
          tags: product.tags,
          price: product.price,
          maxUnits: product.maxUnits,
          availableUnits: product.availableUnits,
          leadTime: product.leadTime,
          status: product.status,
          updatedAt: product.updatedAt
        }
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update product'
      });
    }
  }
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns this product
    if (product.sellerId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});

/**
 * @route   POST /api/products/:id/images
 * @desc    Upload product images
 * @access  Private
 */
router.post('/:id/images',
  authenticateToken,
  uploadProductImages,
  addFileUrls,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check if user owns this product
      if (product.sellerId.toString() !== req.userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this product'
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No images uploaded'
        });
      }

      // Add image paths to product
      const imagePaths = req.files.map(file => file.path);
      product.images = [...(product.images || []), ...imagePaths];
      await product.save();

      res.json({
        success: true,
        message: 'Images uploaded successfully',
        images: req.fileUrls
      });
    } catch (error) {
      console.error('Upload product images error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload images'
      });
    }
  }
);

/**
 * @route   GET /api/products
 * @desc    Get all products with filters
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      status = 'active', 
      minPrice, 
      maxPrice, 
      search, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    if (status !== 'all') {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Only show products from verified sellers
    const verifiedSellers = await Seller.find({ verificationStatus: 'verified' }).select('_id');
    const sellerIds = verifiedSellers.map(seller => seller._id);
    query.sellerId = { $in: sellerIds };

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .populate('sellerId', 'name region city verificationStatus unionMembership')
      .select('-__v')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      },
      filters: {
        category,
        status,
        minPrice,
        maxPrice,
        search,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get products'
    });
  }
});

module.exports = router;
