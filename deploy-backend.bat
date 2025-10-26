@echo off
echo 🚀 Deploying Udyam Union Backend to Heroku...

REM Check if Heroku CLI is installed
heroku --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Heroku CLI is not installed. Please install it first:
    echo    https://devcenter.heroku.com/articles/heroku-cli
    pause
    exit /b 1
)

REM Check if user is logged in to Heroku
heroku auth:whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please login to Heroku first:
    heroku login
)

REM Navigate to backend directory
cd backend

REM Create Heroku app (if it doesn't exist)
echo 📱 Creating Heroku app...
heroku create udyam-union-backend 2>nul || echo App already exists

REM Set environment variables
echo ⚙️ Setting environment variables...
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://udyam-b8dbd.web.app
heroku config:set JWT_SECRET=your_super_secure_jwt_secret_here_change_this
heroku config:set ADMIN_PASSWORD=admin123
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/udyam_union

echo ⚠️  IMPORTANT: Update MONGODB_URI with your actual MongoDB Atlas connection string!
echo    Run: heroku config:set MONGODB_URI=your_actual_mongodb_uri

REM Initialize git if not already done
if not exist ".git" (
    echo 📦 Initializing git repository...
    git init
    git add .
    git commit -m "Initial commit"
)

REM Add Heroku remote
echo 🔗 Adding Heroku remote...
heroku git:remote -a udyam-union-backend

REM Deploy to Heroku
echo 🚀 Deploying to Heroku...
git add .
git commit -m "Deploy backend to Heroku" 2>nul || echo No changes to commit
git push heroku main

echo ✅ Backend deployed successfully!
echo 🌐 Your backend URL: https://udyam-union-backend.herokuapp.com
echo 🔧 Update your frontend environment with this URL

REM Test the deployment
echo 🧪 Testing deployment...
curl -s https://udyam-union-backend.herokuapp.com/api/health || echo Backend might still be starting up...

echo 📋 Next steps:
echo 1. Update your MongoDB URI: heroku config:set MONGODB_URI=your_mongodb_uri
echo 2. Update frontend environment file with the backend URL
echo 3. Redeploy your frontend

pause
