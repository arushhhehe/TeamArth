# Heroku Deployment Guide

## Quick Deploy to Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/your-username/udyam-union-platform)

## Manual Deployment

1. **Install Heroku CLI:**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku:**
   ```bash
   heroku login
   ```

3. **Create Heroku app:**
   ```bash
   cd backend
   heroku create udyam-union-backend
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_super_secure_jwt_secret
   heroku config:set ADMIN_PASSWORD=your_secure_admin_password
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-firebase-app.web.app
   ```

5. **Deploy:**
   ```bash
   git init
   heroku git:remote -a udyam-union-backend
   git add .
   git commit -m "Initial deployment"
   git push heroku main
   ```

6. **Check logs:**
   ```bash
   heroku logs --tail
   ```

## Environment Variables Required

- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secure JWT secret (32+ characters)
- `ADMIN_PASSWORD`: Admin panel password
- `FRONTEND_URL`: Your Firebase hosting URL
- `NODE_ENV`: Set to "production"

## Database Setup

1. Create MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Set MONGODB_URI environment variable

## Custom Domain (Optional)

1. Add custom domain in Heroku dashboard
2. Update FRONTEND_URL environment variable
3. Configure DNS records
