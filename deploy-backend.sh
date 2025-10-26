#!/bin/bash

# Udyam Union Backend Deployment Script
echo "🚀 Deploying Udyam Union Backend to Heroku..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed. Please install it first:"
    echo "   https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if user is logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "🔐 Please login to Heroku first:"
    heroku login
fi

# Navigate to backend directory
cd backend

# Create Heroku app (if it doesn't exist)
echo "📱 Creating Heroku app..."
heroku create udyam-union-backend 2>/dev/null || echo "App already exists"

# Set environment variables
echo "⚙️ Setting environment variables..."
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://udyam-b8dbd.web.app
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set ADMIN_PASSWORD=admin123
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/udyam_union

echo "⚠️  IMPORTANT: Update MONGODB_URI with your actual MongoDB Atlas connection string!"
echo "   Run: heroku config:set MONGODB_URI=your_actual_mongodb_uri"

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit"
fi

# Add Heroku remote
echo "🔗 Adding Heroku remote..."
heroku git:remote -a udyam-union-backend

# Deploy to Heroku
echo "🚀 Deploying to Heroku..."
git add .
git commit -m "Deploy backend to Heroku" || echo "No changes to commit"
git push heroku main

echo "✅ Backend deployed successfully!"
echo "🌐 Your backend URL: https://udyam-union-backend.herokuapp.com"
echo "🔧 Update your frontend environment with this URL"

# Test the deployment
echo "🧪 Testing deployment..."
curl -s https://udyam-union-backend.herokuapp.com/api/health || echo "Backend might still be starting up..."

echo "📋 Next steps:"
echo "1. Update your MongoDB URI: heroku config:set MONGODB_URI=your_mongodb_uri"
echo "2. Update frontend environment file with the backend URL"
echo "3. Redeploy your frontend"
