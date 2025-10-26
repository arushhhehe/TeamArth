/**
 * Test script for local storage functionality
 * This can be run in the browser console to test storage operations
 */

import { 
  userProfileStorage, 
  productsStorage, 
  supportStorage, 
  referralsStorage,
  notificationsStorage,
  onboardingStorage 
} from './storage'

export const testStorage = () => {
  console.log('🧪 Testing Udyam Union Local Storage...')
  
  try {
    // Test user profile storage
    console.log('📝 Testing User Profile Storage...')
    const testProfile = {
      name: 'Test User',
      phone: '9876543210',
      email: 'test@example.com',
      region: 'North',
      city: 'Delhi',
      categories: ['Electronics', 'Clothing'],
      scale: 'Small'
    }
    
    userProfileStorage.saveProfile(testProfile)
    const savedProfile = userProfileStorage.getProfile()
    console.log('✅ User Profile:', savedProfile)
    
    // Test products storage
    console.log('📦 Testing Products Storage...')
    const testProduct = {
      name: 'Test Product',
      description: 'A test product for demonstration',
      price: '1000',
      category: 'Electronics',
      status: 'active'
    }
    
    const addedProduct = productsStorage.addProduct(testProduct)
    const allProducts = productsStorage.getProducts()
    console.log('✅ Products:', allProducts)
    
    // Test support tickets
    console.log('🎫 Testing Support Storage...')
    const testTicket = {
      subject: 'Test Issue',
      description: 'This is a test support ticket',
      priority: 'medium'
    }
    
    const addedTicket = supportStorage.addTicket(testTicket)
    const allTickets = supportStorage.getTickets()
    console.log('✅ Support Tickets:', allTickets)
    
    // Test referrals
    console.log('🔗 Testing Referrals Storage...')
    referralsStorage.updateReferralCode('TEST123')
    const referrals = referralsStorage.getReferrals()
    console.log('✅ Referrals:', referrals)
    
    // Test notifications
    console.log('🔔 Testing Notifications Storage...')
    const testNotification = {
      title: 'Test Notification',
      message: 'This is a test notification',
      type: 'info'
    }
    
    const addedNotification = notificationsStorage.addNotification(testNotification)
    const allNotifications = notificationsStorage.getNotifications()
    console.log('✅ Notifications:', allNotifications)
    
    // Test onboarding data
    console.log('🚀 Testing Onboarding Storage...')
    const testOnboardingData = {
      currentStep: 3,
      completedSteps: [1, 2],
      formData: {
        phone: '9876543210',
        name: 'Test User',
        region: 'North'
      }
    }
    
    onboardingStorage.saveOnboardingData(testOnboardingData)
    const savedOnboardingData = onboardingStorage.getOnboardingData()
    console.log('✅ Onboarding Data:', savedOnboardingData)
    
    console.log('🎉 All storage tests completed successfully!')
    return true
    
  } catch (error) {
    console.error('❌ Storage test failed:', error)
    return false
  }
}

export const clearTestData = () => {
  console.log('🧹 Clearing test data...')
  
  userProfileStorage.clearProfile()
  productsStorage.clearProducts()
  supportStorage.clearTickets()
  referralsStorage.clearReferrals()
  notificationsStorage.clearNotifications()
  onboardingStorage.clearOnboardingData()
  
  console.log('✅ Test data cleared!')
}

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  window.testStorage = testStorage
  window.clearTestData = clearTestData
  console.log('💡 Storage test functions available:')
  console.log('   - testStorage() - Run all storage tests')
  console.log('   - clearTestData() - Clear all test data')
}
