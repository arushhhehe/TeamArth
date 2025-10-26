// Mock API service for demo purposes
// This simulates backend responses without requiring a real backend

const MOCK_DELAY = 1000 // 1 second delay to simulate network request

// Mock data storage
let mockUsers = []
let mockProducts = []
let mockSellers = []

// Generate mock OTP
const generateMockOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API functions
export const mockApi = {
  // Auth endpoints
  async sendOTP(phone) {
    await delay(MOCK_DELAY)
    const otp = generateMockOTP()
    console.log(`Mock OTP for ${phone}: ${otp}`)
    
    return {
      success: true,
      message: 'OTP sent successfully',
      otp: otp // Return OTP for demo purposes
    }
  },

  async verifyOTP(phone, otp) {
    await delay(MOCK_DELAY)
    
    // Find existing user or create new one
    let user = mockUsers.find(u => u.phone === phone)
    const isNewUser = !user
    
    if (!user) {
      user = {
        id: Date.now().toString(),
        phone,
        name: '',
        email: '',
        region: '',
        city: '',
        village: '',
        categories: [],
        language: 'English',
        scale: '',
        capacity: '',
        hasDocuments: false,
        documentType: '',
        documentPath: [],
        alternateDocuments: [],
        verificationStatus: 'pending',
        unionMembership: {
          id: `UU${Date.now().toString().slice(-6)}`,
          issueDate: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        },
        referralCode: `REF${Date.now().toString().slice(-6)}`,
        supportTickets: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      mockUsers.push(user)
    }
    
    const token = `mock_token_${Date.now()}`
    
    return {
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        ...user,
        isNewUser
      }
    }
  },

  async getProfile() {
    await delay(MOCK_DELAY)
    const user = mockUsers[0] // Get first user for demo
    return {
      success: true,
      user
    }
  },

  async updateProfile(userData) {
    await delay(MOCK_DELAY)
    const user = mockUsers[0]
    if (user) {
      Object.assign(user, userData)
      user.updatedAt = new Date().toISOString()
    }
    return {
      success: true,
      message: 'Profile updated successfully',
      user
    }
  },

  async uploadDocuments(formData) {
    await delay(MOCK_DELAY)
    return {
      success: true,
      message: 'Documents uploaded successfully',
      documents: ['document1.pdf', 'document2.jpg']
    }
  },

  async uploadAlternateDocuments(formData) {
    await delay(MOCK_DELAY)
    return {
      success: true,
      message: 'Alternate documents uploaded successfully',
      documents: ['shop_license.pdf', 'community_letter.pdf']
    }
  },

  async getVerificationStatus() {
    await delay(MOCK_DELAY)
    const user = mockUsers[0]
    return {
      success: true,
      status: user?.verificationStatus || 'pending',
      unionMembership: user?.unionMembership
    }
  },

  async reportIssue(issueData) {
    await delay(MOCK_DELAY)
    return {
      success: true,
      message: 'Issue reported successfully',
      ticketId: `TICKET_${Date.now()}`
    }
  },

  // Product endpoints
  async getProducts() {
    await delay(MOCK_DELAY)
    return {
      success: true,
      products: mockProducts
    }
  },

  async addProduct(productData) {
    await delay(MOCK_DELAY)
    const product = {
      id: Date.now().toString(),
      ...productData,
      seller: mockUsers[0]?.id,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockProducts.push(product)
    
    return {
      success: true,
      message: 'Product added successfully',
      product
    }
  },

  async updateProduct(id, productData) {
    await delay(MOCK_DELAY)
    const product = mockProducts.find(p => p.id === id)
    if (product) {
      Object.assign(product, productData)
      product.updatedAt = new Date().toISOString()
    }
    return {
      success: true,
      message: 'Product updated successfully',
      product
    }
  },

  async deleteProduct(id) {
    await delay(MOCK_DELAY)
    const index = mockProducts.findIndex(p => p.id === id)
    if (index > -1) {
      mockProducts.splice(index, 1)
    }
    return {
      success: true,
      message: 'Product deleted successfully'
    }
  },

  // Admin endpoints
  async adminLogin(username, password) {
    await delay(MOCK_DELAY)
    
    if (username === 'admin' && password === 'admin123') {
      const token = `admin_token_${Date.now()}`
      return {
        success: true,
        message: 'Admin login successful',
        token,
        admin: {
          id: 'admin_1',
          username: 'admin',
          role: 'super-admin',
          permissions: ['all'],
          isActive: true,
          lastLogin: new Date().toISOString()
        }
      }
    } else {
      return {
        success: false,
        message: 'Invalid credentials'
      }
    }
  },

  async getSellers() {
    await delay(MOCK_DELAY)
    return {
      success: true,
      sellers: mockUsers
    }
  },

  async getSeller(id) {
    await delay(MOCK_DELAY)
    const seller = mockUsers.find(u => u.id === id)
    return {
      success: true,
      seller
    }
  },

  async verifySeller(sellerId, action, notes) {
    await delay(MOCK_DELAY)
    const seller = mockUsers.find(u => u.id === sellerId)
    if (seller) {
      seller.verificationStatus = action
      seller.updatedAt = new Date().toISOString()
    }
    return {
      success: true,
      message: `Seller ${action} successfully`
    }
  },

  async updateMembership(sellerId, status, reason) {
    await delay(MOCK_DELAY)
    const seller = mockUsers.find(u => u.id === sellerId)
    if (seller) {
      seller.unionMembership.status = status
      seller.updatedAt = new Date().toISOString()
    }
    return {
      success: true,
      message: 'Membership updated successfully'
    }
  },

  async getDashboard() {
    await delay(MOCK_DELAY)
    return {
      success: true,
      stats: {
        totalSellers: mockUsers.length,
        verifiedSellers: mockUsers.filter(u => u.verificationStatus === 'verified').length,
        pendingSellers: mockUsers.filter(u => u.verificationStatus === 'pending').length,
        provisionalSellers: mockUsers.filter(u => u.verificationStatus === 'provisional').length
      }
    }
  }
}

export default mockApi
