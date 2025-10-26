# Udyam Union Seller Onboarding Platform

A comprehensive MERN stack application for seller onboarding, verification, and union membership management.

## 🚀 Features

- **Multi-step Seller Onboarding**: Complete wizard with OTP verification, profile setup, and document upload
- **Document Verification**: Support for standard documents (PAN, Aadhaar) and alternate documents for no-document sellers
- **Seller Dashboard**: Profile management, product listing, benefits overview, and support
- **Admin Panel**: Seller verification, union membership management, and administrative controls
- **Multilingual Support**: English and Hindi language support
- **Mobile-First Design**: Responsive design with accessibility features
- **Accessibility**: High contrast mode, large fonts, keyboard navigation, screen reader support

## 🛠 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router, i18next
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT tokens with mock OTP system
- **File Upload**: Multer for document handling
- **Security**: Basic encryption for sensitive data

## ⚡ Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/arushhhehe/TeamArth.git
   cd TeamArth
   npm run install:all
   ```

2. **Environment Setup:**
   ```bash
   # Backend environment
   cp backend/.env.example backend/.env
   # Edit backend/.env with your MongoDB URI and JWT secret
   
   # Frontend environment
   cp frontend/.env.example frontend/.env
   ```

3. **Start Development Servers:**
   ```bash
   npm run dev
   ```

4. **Access the Application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
TeamArth/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Route components
│   │   ├── utils/           # Helper functions
│   │   ├── locales/         # Translation files
│   │   └── assets/          # Static assets
├── backend/                 # Express.js API
│   ├── api/                 # API routes and controllers
│   ├── models/              # MongoDB schemas
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   └── uploads/             # File upload storage
├── docs/                    # Documentation
└── setup.js                 # Automated setup script
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP and authenticate

### Seller Management
- `POST /api/seller/register` - Complete seller registration
- `GET /api/seller/profile` - Get seller profile
- `PUT /api/seller/profile` - Update seller profile
- `POST /api/seller/upload-documents` - Upload identity documents
- `GET /api/seller/verification-status` - Get verification status

### Product Management
- `POST /api/products` - Add new product
- `GET /api/products/seller/:id` - Get seller's products
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Admin Panel
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/sellers` - List all sellers
- `PUT /api/admin/verify/:sellerId` - Approve/reject verification

## 🧪 Demo Accounts

### Test Sellers
1. **Micro-seller (No Documents)**: Phone: +919876543210
2. **Medium Seller (Full Documents)**: Phone: +919876543211
3. **Small Seller (Partial Documents)**: Phone: +919876543212

### Admin Access
- Username: `admin`
- Password: `admin123`

## 🚀 Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Database Setup
The application will automatically create the necessary collections on first run. No manual database setup required.

## 📦 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
See `.env.example` files in both frontend and backend directories for required environment variables.

## 📚 Documentation

- [User Guide](docs/USER_GUIDE.md) - Comprehensive guide for sellers
- [API Documentation](backend/README.md) - Complete API reference
- [Setup Guide](setup.js) - Automated setup script

## 🎯 Key Features Implemented

### ✅ Seller Onboarding
- 6-step wizard with progress tracking
- OTP-based phone verification
- Profile setup with business information
- Document upload with validation
- Alternate document support for no-document sellers
- Union membership acceptance

### ✅ Seller Dashboard
- Profile management
- Product listing and management
- Benefits overview
- Support ticket system
- Referral program
- Verification status tracking

### ✅ Admin Panel
- Seller verification workflow
- Document review system
- Membership management
- Analytics dashboard
- Search and filtering

### ✅ Accessibility Features
- High contrast mode
- Large font option
- Keyboard navigation
- Screen reader support
- Multilingual support (English/Hindi)

### ✅ Security Features
- JWT authentication
- Rate limiting
- File validation
- Input sanitization
- Secure file uploads

## 🛡 Security

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **File Validation**: Type and size checking
- **Input Validation**: Comprehensive validation for all inputs
- **Authentication**: JWT tokens with secure storage
- **CORS**: Configured for frontend URL
- **Helmet**: Security headers

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interface
- Mobile-optimized forms
- Progressive Web App features

## 🌐 Multilingual Support

- English and Hindi language support
- Persistent language preferences
- RTL support for Hindi
- Localized content and UI

## 🎨 UI/UX Features

- Clean, professional design
- Consistent color scheme
- Loading states and animations
- Error handling and feedback
- Empty states with helpful messages

## 📊 Analytics & Monitoring

- User activity tracking
- Performance monitoring
- Error logging
- Usage statistics

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/udyam_union
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
FRONTEND_URL=http://localhost:5173
ENCRYPTION_KEY=your_32_character_encryption_key_here
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Udyam Union
VITE_APP_VERSION=1.0.0
```

## 🚀 Getting Started

1. **Run the setup script:**
   ```bash
   node setup.js
   ```

2. **Configure environment variables:**
   - Edit `backend/.env` with your MongoDB URI
   - Set secure JWT secret
   - Configure admin credentials

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📞 Support

For technical support or questions:
- Email: support@udyamunion.com
- Phone: +91-XXXX-XXXXXX
- Documentation: See docs/ folder

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📈 Roadmap

- [ ] Real SMS integration
- [ ] Payment gateway integration
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] API rate limiting improvements
- [ ] Enhanced security features

---

**Built with ❤️ for Indian sellers**
