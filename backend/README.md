# Udyam Union Backend API

## Overview

This is the backend API for the Udyam Union seller onboarding platform. It provides authentication, seller management, document verification, and admin functionality.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **File Upload**: Multer
- **Security**: bcryptjs, helmet, rate limiting

## API Endpoints

### Authentication

#### Send OTP
```
POST /api/auth/send-otp
Content-Type: application/json

{
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otp": "123456" // Only in development
}
```

#### Verify OTP
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "phone": "+919876543210",
    "name": "User Name",
    "verificationStatus": "pending",
    "isNewUser": true
  }
}
```

### Seller Management

#### Complete Registration
```
POST /api/seller/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "region": "North India",
  "city": "Delhi",
  "village": "Village Name",
  "categories": ["Agriculture", "Handicrafts"],
  "language": "English",
  "scale": "Micro",
  "capacity": "Small scale production",
  "hasDocuments": true,
  "documentType": "PAN"
}
```

#### Get Profile
```
GET /api/seller/profile
Authorization: Bearer <token>
```

#### Update Profile
```
PUT /api/seller/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

#### Upload Documents
```
POST /api/seller/upload-documents
Authorization: Bearer <token>
Content-Type: multipart/form-data

documents: [file1, file2, file3]
documentType: "PAN"
```

#### Upload Alternate Documents
```
POST /api/seller/alternate-documents
Authorization: Bearer <token>
Content-Type: multipart/form-data

alternateDocuments: [file1, file2]
types: ["Shop License", "Community Letter"]
descriptions: ["Shop license description", "Community letter description"]
```

#### Get Verification Status
```
GET /api/seller/verification-status
Authorization: Bearer <token>
```

#### Report Issue
```
POST /api/seller/report-issue
Authorization: Bearer <token>
Content-Type: application/json

{
  "issue": "Issue title",
  "description": "Detailed description of the issue"
}
```

### Product Management

#### Add Product
```
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "category": "Agriculture",
  "tags": ["organic", "fresh"],
  "price": 1000,
  "maxUnits": 50,
  "leadTime": "2-3 days"
}
```

#### Get Seller Products
```
GET /api/products/my-products
Authorization: Bearer <token>
```

#### Get All Products
```
GET /api/products?category=Agriculture&status=active&page=1&limit=20
```

#### Update Product
```
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 1200
}
```

#### Delete Product
```
DELETE /api/products/:id
Authorization: Bearer <token>
```

### Admin Panel

#### Admin Login
```
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### Get All Sellers
```
GET /api/admin/sellers?status=verified&category=Agriculture&search=john
Authorization: Bearer <admin_token>
```

#### Get Seller Details
```
GET /api/admin/sellers/:id
Authorization: Bearer <admin_token>
```

#### Verify Seller
```
PUT /api/admin/verify/:sellerId
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "action": "approve", // or "reject" or "provisional"
  "notes": "Admin notes",
  "rejectionReason": "Reason for rejection" // if action is "reject"
}
```

#### Update Membership
```
PUT /api/admin/membership/:sellerId
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "active", // or "suspended" or "expired"
  "reason": "Reason for status change"
}
```

#### Get Dashboard Stats
```
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

## Database Models

### Seller
```javascript
{
  phone: String (required, unique),
  name: String,
  email: String,
  region: String,
  city: String,
  village: String,
  categories: [String],
  language: String,
  scale: String,
  capacity: String,
  hasDocuments: Boolean,
  documentType: String,
  documentPath: [String],
  alternateDocuments: [Object],
  verificationStatus: String, // verified, provisional, pending
  unionMembership: {
    id: String,
    issueDate: Date,
    expiryDate: Date,
    status: String
  },
  referralCode: String,
  supportTickets: [Object],
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  sellerId: ObjectId,
  name: String,
  description: String,
  category: String,
  tags: [String],
  price: Number,
  maxUnits: Number,
  availableUnits: Number,
  leadTime: String,
  status: String, // active, inactive, out-of-stock, discontinued
  images: [String],
  specifications: Map,
  marketplaceMatch: {
    isMatched: Boolean,
    matchedPlatform: String,
    matchedAt: Date,
    commissionRate: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Verification
```javascript
{
  sellerId: ObjectId,
  documentType: String,
  documents: [String],
  alternateDocuments: [Object],
  status: String, // pending, approved, rejected, under-review
  adminNotes: String,
  reviewedBy: ObjectId,
  reviewedAt: Date,
  rejectionReason: String,
  history: [Object],
  provisionalDetails: {
    isProvisional: Boolean,
    expiryDate: Date,
    renewalCount: Number,
    maxRenewals: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Admin
```javascript
{
  username: String (required, unique),
  passwordHash: String,
  role: String, // super-admin, admin, moderator
  permissions: [String],
  isActive: Boolean,
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date,
  profile: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String
  },
  activityLog: [Object],
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/udyam_union

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Encryption Key (for sensitive data)
ENCRYPTION_KEY=your_32_character_encryption_key_here
```

## File Upload

The API supports file uploads for documents and product images:

- **Supported formats**: PDF, JPG, PNG
- **Maximum file size**: 5MB per file
- **Maximum files per request**: 5
- **Storage**: Local filesystem (configurable)

## Security Features

- **Rate limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Security headers
- **CORS**: Configured for frontend URL
- **JWT tokens**: Secure authentication
- **Password hashing**: bcryptjs with salt rounds
- **File validation**: Type and size checking
- **Input validation**: express-validator

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"] // Optional
}
```

## Development

### Start Development Server
```bash
cd backend
npm run dev
```

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secret
4. Configure file storage (S3, etc.)
5. Set up reverse proxy (nginx)
6. Enable HTTPS
7. Configure monitoring and logging

## API Rate Limits

- **General**: 100 requests per 15 minutes
- **OTP requests**: 3 requests per 15 minutes
- **File uploads**: 5 files per request
- **Admin actions**: No specific limits (monitored)

## Support

For technical support or questions:
- Email: support@udyamunion.com
- Documentation: See README.md in project root
