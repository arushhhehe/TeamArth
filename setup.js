#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Setting up Udyam Union Platform...\n')

// Create .env files from examples
function setupEnvFiles() {
  console.log('📝 Creating environment files...')
  
  // Backend .env
  if (!fs.existsSync('backend/.env')) {
    fs.copyFileSync('backend/env.example', 'backend/.env')
    console.log('✅ Created backend/.env')
  }
  
  // Frontend .env
  if (!fs.existsSync('frontend/.env')) {
    fs.copyFileSync('frontend/env.example', 'frontend/.env')
    console.log('✅ Created frontend/.env')
  }
}

// Install dependencies
function installDependencies() {
  console.log('\n📦 Installing dependencies...')
  
  try {
    console.log('Installing root dependencies...')
    execSync('npm install', { stdio: 'inherit' })
    
    console.log('Installing backend dependencies...')
    execSync('cd backend && npm install', { stdio: 'inherit' })
    
    console.log('Installing frontend dependencies...')
    execSync('cd frontend && npm install', { stdio: 'inherit' })
    
    console.log('✅ All dependencies installed')
  } catch (error) {
    console.error('❌ Error installing dependencies:', error.message)
    process.exit(1)
  }
}

// Create uploads directory
function createUploadsDir() {
  console.log('\n📁 Creating uploads directory...')
  
  const uploadsDir = path.join('backend', 'uploads')
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
    console.log('✅ Created uploads directory')
  }
}

// Display setup instructions
function displayInstructions() {
  console.log('\n🎉 Setup complete! Next steps:\n')
  
  console.log('1. 📝 Configure environment variables:')
  console.log('   - Edit backend/.env with your MongoDB URI and JWT secret')
  console.log('   - Edit frontend/.env if needed\n')
  
  console.log('2. 🗄️  Start MongoDB:')
  console.log('   - Make sure MongoDB is running on your system')
  console.log('   - Default connection: mongodb://localhost:27017/udyam_union\n')
  
  console.log('3. 🚀 Start the development servers:')
  console.log('   npm run dev\n')
  
  console.log('4. 🌐 Access the application:')
  console.log('   - Frontend: http://localhost:5173')
  console.log('   - Backend API: http://localhost:5000\n')
  
  console.log('5. 👤 Demo accounts:')
  console.log('   - Admin: username=admin, password=admin123')
  console.log('   - Test phone numbers: +919876543210, +919876543211\n')
  
  console.log('📚 Documentation:')
  console.log('   - README.md for detailed setup instructions')
  console.log('   - API documentation in backend/README.md\n')
  
  console.log('🎯 Features implemented:')
  console.log('   ✅ Multi-step seller onboarding')
  console.log('   ✅ OTP-based authentication')
  console.log('   ✅ Document upload and verification')
  console.log('   ✅ Seller dashboard with profile management')
  console.log('   ✅ Product management')
  console.log('   ✅ Admin panel for verification')
  console.log('   ✅ Multilingual support (English/Hindi)')
  console.log('   ✅ Accessibility features')
  console.log('   ✅ Responsive design\n')
}

// Main setup function
function main() {
  try {
    setupEnvFiles()
    installDependencies()
    createUploadsDir()
    displayInstructions()
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  }
}

main()
