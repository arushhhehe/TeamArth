#!/bin/bash
echo "🔨 Building frontend for production..."

# Install dependencies
cd frontend
npm install

# Build for production
npm run build

echo "✅ Frontend build complete!"
echo "📁 Build files are in frontend/dist/"
