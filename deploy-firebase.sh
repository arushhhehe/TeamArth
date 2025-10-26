#!/bin/bash
echo "🚀 Deploying to Firebase Hosting..."

# Build frontend
npm run build

# Deploy to Firebase
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "🌐 Your app is live at: https://your-firebase-app.web.app"
