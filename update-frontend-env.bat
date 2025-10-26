@echo off
echo 🔧 Updating Frontend Environment Configuration...

REM Update the production environment file
echo Updating frontend/env.production...
echo # Production Environment Variables for Frontend > frontend\env.production
echo # Replace with your actual backend URL after deployment >> frontend\env.production
echo VITE_API_URL=https://udyam-union-backend.herokuapp.com/api >> frontend\env.production
echo VITE_APP_NAME=Udyam Union >> frontend\env.production
echo VITE_APP_VERSION=1.0.0 >> frontend\env.production
echo VITE_FIREBASE_PROJECT_ID=udyam-union-platform >> frontend\env.production

echo ✅ Frontend environment updated!
echo 📋 Next steps:
echo 1. Deploy your backend using deploy-backend.bat
echo 2. Update the MONGODB_URI in Heroku
echo 3. Rebuild and redeploy your frontend

pause
