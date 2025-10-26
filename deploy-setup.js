#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Udyam Union Platform - Deployment Setup\n')

// Check if Firebase CLI is installed
function checkFirebaseCLI() {
  try {
    execSync('firebase --version', { stdio: 'pipe' })
    console.log('✅ Firebase CLI is installed')
    return true
  } catch (error) {
    console.log('❌ Firebase CLI not found. Installing...')
    try {
      execSync('npm install -g firebase-tools', { stdio: 'inherit' })
      console.log('✅ Firebase CLI installed successfully')
      return true
    } catch (installError) {
      console.error('❌ Failed to install Firebase CLI:', installError.message)
      return false
    }
  }
}

// Create production environment files
function createProductionEnv() {
  console.log('\n📝 Creating production environment files...')
  
  // Backend production env
  const backendProdEnv = `# Production Environment Variables
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/udyam_union
JWT_SECRET=your_super_secure_jwt_secret_here_32_chars_min
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password_here
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
FRONTEND_URL=https://your-firebase-app.web.app
ENCRYPTION_KEY=your_32_character_encryption_key_here
CORS_ORIGIN=https://your-firebase-app.web.app
`
  
  fs.writeFileSync('backend/.env.production', backendProdEnv)
  console.log('✅ Created backend/.env.production')
  
  // Frontend production env
  const frontendProdEnv = `# Production Environment Variables
VITE_API_URL=https://your-backend-url.herokuapp.com/api
VITE_APP_NAME=Udyam Union
VITE_APP_VERSION=1.0.0
VITE_FIREBASE_PROJECT_ID=udyam-union-platform
`
  
  fs.writeFileSync('frontend/.env.production', frontendProdEnv)
  console.log('✅ Created frontend/.env.production')
}

// Create deployment scripts
function createDeploymentScripts() {
  console.log('\n📜 Creating deployment scripts...')
  
  // Frontend build script
  const buildScript = `#!/bin/bash
echo "🔨 Building frontend for production..."

# Install dependencies
cd frontend
npm install

# Build for production
npm run build

echo "✅ Frontend build complete!"
echo "📁 Build files are in frontend/dist/"
`
  
  fs.writeFileSync('build-frontend.sh', buildScript)
  fs.chmodSync('build-frontend.sh', '755')
  console.log('✅ Created build-frontend.sh')
  
  // Firebase deploy script
  const deployScript = `#!/bin/bash
echo "🚀 Deploying to Firebase Hosting..."

# Build frontend
npm run build

# Deploy to Firebase
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "🌐 Your app is live at: https://your-firebase-app.web.app"
`
  
  fs.writeFileSync('deploy-firebase.sh', deployScript)
  fs.chmodSync('deploy-firebase.sh', '755')
  console.log('✅ Created deploy-firebase.sh')
}

// Create Heroku deployment files
function createHerokuFiles() {
  console.log('\n🔧 Creating Heroku deployment files...')
  
  // Heroku app.json
  const appJson = {
    "name": "udyam-union-backend",
    "description": "Udyam Union Backend API",
    "repository": "https://github.com/your-username/udyam-union-platform",
    "logo": "https://your-logo-url.com/logo.png",
    "keywords": ["node", "express", "mongodb", "api"],
    "success_url": "/",
    "env": {
      "NODE_ENV": {
        "description": "Environment",
        "value": "production"
      },
      "MONGODB_URI": {
        "description": "MongoDB Atlas connection string",
        "required": true
      },
      "JWT_SECRET": {
        "description": "JWT secret key (32+ characters)",
        "required": true
      },
      "ADMIN_USERNAME": {
        "description": "Admin username",
        "value": "admin"
      },
      "ADMIN_PASSWORD": {
        "description": "Admin password",
        "required": true
      }
    },
    "formation": {
      "web": {
        "quantity": 1,
        "size": "free"
      }
    },
    "addons": [],
    "buildpacks": [
      {
        "url": "heroku/nodejs"
      }
    ]
  }
  
  fs.writeFileSync('backend/app.json', JSON.stringify(appJson, null, 2))
  console.log('✅ Created backend/app.json')
  
  // Heroku deployment guide
  const herokuGuide = `# Heroku Deployment Guide

## Quick Deploy to Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/your-username/udyam-union-platform)

## Manual Deployment

1. **Install Heroku CLI:**
   \`\`\`bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   \`\`\`

2. **Login to Heroku:**
   \`\`\`bash
   heroku login
   \`\`\`

3. **Create Heroku app:**
   \`\`\`bash
   cd backend
   heroku create udyam-union-backend
   \`\`\`

4. **Set environment variables:**
   \`\`\`bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_super_secure_jwt_secret
   heroku config:set ADMIN_PASSWORD=your_secure_admin_password
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-firebase-app.web.app
   \`\`\`

5. **Deploy:**
   \`\`\`bash
   git init
   heroku git:remote -a udyam-union-backend
   git add .
   git commit -m "Initial deployment"
   git push heroku main
   \`\`\`

6. **Check logs:**
   \`\`\`bash
   heroku logs --tail
   \`\`\`

## Environment Variables Required

- \`MONGODB_URI\`: MongoDB Atlas connection string
- \`JWT_SECRET\`: Secure JWT secret (32+ characters)
- \`ADMIN_PASSWORD\`: Admin panel password
- \`FRONTEND_URL\`: Your Firebase hosting URL
- \`NODE_ENV\`: Set to "production"

## Database Setup

1. Create MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Set MONGODB_URI environment variable

## Custom Domain (Optional)

1. Add custom domain in Heroku dashboard
2. Update FRONTEND_URL environment variable
3. Configure DNS records
`
  
  fs.writeFileSync('backend/HEROKU_DEPLOYMENT.md', herokuGuide)
  console.log('✅ Created backend/HEROKU_DEPLOYMENT.md')
}

// Create deployment checklist
function createDeploymentChecklist() {
  console.log('\n📋 Creating deployment checklist...')
  
  const checklist = `# 🚀 Deployment Checklist

## Pre-Deployment Setup

### 1. Firebase Setup
- [ ] Install Firebase CLI: \`npm install -g firebase-tools\`
- [ ] Login to Firebase: \`firebase login\`
- [ ] Create Firebase project in console
- [ ] Update .firebaserc with your project ID
- [ ] Configure firebase.json

### 2. Backend Deployment (Choose One)

#### Option A: Heroku
- [ ] Install Heroku CLI
- [ ] Create Heroku app: \`heroku create udyam-union-backend\`
- [ ] Set environment variables
- [ ] Deploy: \`git push heroku main\`

#### Option B: Railway
- [ ] Connect GitHub repository
- [ ] Set environment variables in dashboard
- [ ] Deploy automatically

#### Option C: Vercel
- [ ] Install Vercel CLI: \`npm install -g vercel\`
- [ ] Deploy: \`vercel --prod\`

### 3. Database Setup
- [ ] Create MongoDB Atlas account
- [ ] Create cluster
- [ ] Get connection string
- [ ] Update backend environment variables

### 4. Environment Configuration
- [ ] Update frontend/.env with backend URL
- [ ] Update backend/.env with MongoDB URI
- [ ] Set secure JWT secret
- [ ] Configure admin credentials

## Deployment Steps

### 1. Build Frontend
\`\`\`bash
npm run build
\`\`\`

### 2. Deploy Backend
\`\`\`bash
cd backend
# Follow Heroku/Railway/Vercel deployment steps
\`\`\`

### 3. Deploy Frontend
\`\`\`bash
firebase deploy --only hosting
\`\`\`

### 4. Test Deployment
- [ ] Visit Firebase hosting URL
- [ ] Test onboarding flow
- [ ] Test admin panel
- [ ] Verify file uploads
- [ ] Check mobile responsiveness

## Post-Deployment

### 1. Domain Setup (Optional)
- [ ] Add custom domain in Firebase console
- [ ] Configure DNS records
- [ ] Update backend CORS settings

### 2. SSL Certificate
- [ ] Firebase provides automatic SSL
- [ ] Verify HTTPS is working

### 3. Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging
- [ ] Monitor performance

## Troubleshooting

### Common Issues
1. **CORS errors**: Update backend CORS settings
2. **Build fails**: Check Node.js version
3. **Database connection**: Verify MongoDB URI
4. **File uploads**: Check file size limits

### Debug Commands
\`\`\`bash
# Check Firebase project
firebase projects:list

# Test local build
npm run build
firebase serve

# Check backend logs
heroku logs --tail
\`\`\`

## URLs After Deployment

- **Frontend**: https://your-firebase-app.web.app
- **Backend API**: https://your-backend-url.herokuapp.com/api
- **Admin Panel**: https://your-firebase-app.web.app/admin

## Support

For deployment issues:
- Check Firebase documentation
- Review Heroku/Railway logs
- Test locally first
- Verify environment variables
`
  
  fs.writeFileSync('DEPLOYMENT_CHECKLIST.md', checklist)
  console.log('✅ Created DEPLOYMENT_CHECKLIST.md')
}

// Main setup function
function main() {
  console.log('🎯 Setting up Udyam Union Platform for deployment...\n')
  
  try {
    // Check Firebase CLI
    if (!checkFirebaseCLI()) {
      console.log('❌ Firebase CLI setup failed. Please install manually.')
      return
    }
    
    // Create production environment files
    createProductionEnv()
    
    // Create deployment scripts
    createDeploymentScripts()
    
    // Create Heroku files
    createHerokuFiles()
    
    // Create deployment checklist
    createDeploymentChecklist()
    
    console.log('\n🎉 Deployment setup complete!\n')
    
    console.log('📋 Next Steps:')
    console.log('1. 🔐 Login to Firebase: firebase login')
    console.log('2. 🏗️  Create Firebase project: firebase init hosting')
    console.log('3. 🗄️  Set up MongoDB Atlas')
    console.log('4. 🚀 Deploy backend (Heroku/Railway/Vercel)')
    console.log('5. 🌐 Deploy frontend: npm run deploy:frontend')
    console.log('\n📚 See DEPLOYMENT_CHECKLIST.md for detailed steps')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  }
}

main()
