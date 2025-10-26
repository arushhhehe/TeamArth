# Udyam Union Platform - Deployment Guide

## 🚀 Firebase Hosting Deployment

This guide will help you deploy the Udyam Union platform to Firebase Hosting.

### Prerequisites

1. **Node.js** (v16 or higher)
2. **Firebase CLI** installed globally
3. **Git** for version control
4. **MongoDB Atlas** account for production database
5. **Backend hosting** (Heroku, Railway, or Vercel)

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will open your browser for authentication.

### Step 3: Initialize Firebase Project

```bash
# In the root directory
firebase init hosting
```

**Configuration options:**
- **Select Firebase project**: Create new project or select existing
- **Public directory**: `frontend/dist`
- **Single-page app**: Yes
- **Overwrite index.html**: No
- **Set up automatic builds**: No (for now)

### Step 4: Configure Backend Deployment

#### Option A: Heroku (Recommended)

1. **Install Heroku CLI**
2. **Create Heroku app:**
   ```bash
   heroku create udyam-union-backend
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_production_jwt_secret
   heroku config:set NODE_ENV=production
   heroku config:set PORT=5000
   heroku config:set FRONTEND_URL=https://your-firebase-app.web.app
   ```

4. **Deploy backend:**
   ```bash
   cd backend
   git init
   heroku git:remote -a udyam-union-backend
   git add .
   git commit -m "Initial backend deployment"
   git push heroku main
   ```

#### Option B: Railway

1. **Connect GitHub repository**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically**

#### Option C: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy backend:**
   ```bash
   cd backend
   vercel --prod
   ```

### Step 5: Update Frontend Environment

Update `frontend/.env` with your production backend URL:

```env
VITE_API_URL=https://your-backend-url.herokuapp.com/api
VITE_APP_NAME=Udyam Union
VITE_APP_VERSION=1.0.0
```

### Step 6: Build and Deploy Frontend

```bash
# Build the frontend
npm run build

# Deploy to Firebase
npm run deploy:frontend
```

### Step 7: Configure Custom Domain (Optional)

1. **In Firebase Console:**
   - Go to Hosting
   - Click "Add custom domain"
   - Follow the DNS configuration steps

2. **Update environment variables:**
   ```bash
   # Update backend with new frontend URL
   heroku config:set FRONTEND_URL=https://your-custom-domain.com
   ```

### Step 8: Set Up MongoDB Atlas

1. **Create MongoDB Atlas account**
2. **Create cluster**
3. **Get connection string**
4. **Update backend environment:**
   ```bash
   heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/udyam_union
   ```

### Step 9: Configure CORS

Update `backend/server.js` for production:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-firebase-app.web.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}
```

### Step 10: Test Deployment

1. **Visit your Firebase URL**
2. **Test onboarding flow**
3. **Test admin panel**
4. **Verify file uploads**
5. **Check mobile responsiveness**

## 🔧 Production Configuration

### Environment Variables

**Backend (.env):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/udyam_union
JWT_SECRET=your_super_secure_jwt_secret_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
FRONTEND_URL=https://your-firebase-app.web.app
ENCRYPTION_KEY=your_32_character_encryption_key_here
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-backend-url.herokuapp.com/api
VITE_APP_NAME=Udyam Union
VITE_APP_VERSION=1.0.0
```

### Security Considerations

1. **Use strong JWT secrets**
2. **Enable HTTPS only**
3. **Set up rate limiting**
4. **Configure CORS properly**
5. **Use environment variables for secrets**
6. **Enable MongoDB Atlas IP whitelist**

### Performance Optimization

1. **Enable Firebase CDN**
2. **Configure caching headers**
3. **Optimize images**
4. **Enable gzip compression**
5. **Use MongoDB indexes**

## 📱 Mobile App Deployment (Future)

For future mobile app deployment:

1. **React Native setup**
2. **Expo configuration**
3. **App store deployment**
4. **Push notifications**

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    - name: Install dependencies
      run: npm run install:all
    - name: Build
      run: npm run build
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: live
        projectId: your-firebase-project-id
```

## 🐛 Troubleshooting

### Common Issues

1. **Build fails:**
   - Check Node.js version
   - Clear node_modules and reinstall
   - Check for TypeScript errors

2. **Backend not connecting:**
   - Verify MongoDB Atlas connection
   - Check environment variables
   - Test API endpoints

3. **CORS errors:**
   - Update CORS configuration
   - Check frontend URL in backend

4. **File upload issues:**
   - Check file size limits
   - Verify upload directory permissions
   - Test with different file types

### Debug Commands

```bash
# Check Firebase project
firebase projects:list

# Test local build
npm run build
firebase serve

# Check backend logs
heroku logs --tail

# Test API endpoints
curl https://your-backend-url.herokuapp.com/api/health
```

## 📊 Monitoring

### Firebase Analytics

1. **Enable Analytics in Firebase Console**
2. **Add tracking code to frontend**
3. **Monitor user behavior**

### Backend Monitoring

1. **Heroku metrics**
2. **MongoDB Atlas monitoring**
3. **Error tracking (Sentry)**

## 🎯 Next Steps

1. **Set up monitoring and alerts**
2. **Configure backup strategies**
3. **Implement CI/CD pipeline**
4. **Add performance monitoring**
5. **Set up staging environment**

## 📞 Support

For deployment issues:
- Check Firebase documentation
- Review Heroku/Railway logs
- Test locally first
- Verify environment variables

---

**Your Udyam Union platform is now live! 🚀**
