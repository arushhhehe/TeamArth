/**
 * Local Storage Utility for Udyam Union
 * Handles all data persistence locally on the device
 */

// Storage keys
const STORAGE_KEYS = {
  USER_PROFILE: 'udyam_user_profile',
  PRODUCTS: 'udyam_products',
  ONBOARDING_DATA: 'udyam_onboarding_data',
  SETTINGS: 'udyam_settings',
  REFERRALS: 'udyam_referrals',
  SUPPORT_TICKETS: 'udyam_support_tickets',
  NOTIFICATIONS: 'udyam_notifications'
}

/**
 * Generic storage operations
 */
class StorageManager {
  // Get data from localStorage
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading from localStorage for key ${key}:`, error)
      return defaultValue
    }
  }

  // Set data to localStorage
  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage for key ${key}:`, error)
      return false
    }
  }

  // Remove data from localStorage
  static remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing from localStorage for key ${key}:`, error)
      return false
    }
  }

  // Clear all app data
  static clear() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }
}

/**
 * User Profile Storage
 */
export const userProfileStorage = {
  // Get user profile
  getProfile() {
    return StorageManager.get(STORAGE_KEYS.USER_PROFILE, {
      name: '',
      phone: '',
      email: '',
      region: '',
      city: '',
      village: '',
      categories: [],
      language: 'English',
      scale: '',
      capacity: '',
      unionId: '',
      membershipStatus: 'pending',
      verificationStatus: 'pending',
      referralCode: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  },

  // Save user profile
  saveProfile(profileData) {
    const currentProfile = this.getProfile()
    const updatedProfile = {
      ...currentProfile,
      ...profileData,
      updatedAt: new Date().toISOString()
    }
    return StorageManager.set(STORAGE_KEYS.USER_PROFILE, updatedProfile)
  },

  // Update specific profile fields
  updateProfile(fields) {
    const currentProfile = this.getProfile()
    const updatedProfile = {
      ...currentProfile,
      ...fields,
      updatedAt: new Date().toISOString()
    }
    return StorageManager.set(STORAGE_KEYS.USER_PROFILE, updatedProfile)
  },

  // Clear user profile
  clearProfile() {
    return StorageManager.remove(STORAGE_KEYS.USER_PROFILE)
  }
}

/**
 * Products Storage
 */
export const productsStorage = {
  // Get all products
  getProducts() {
    return StorageManager.get(STORAGE_KEYS.PRODUCTS, [])
  },

  // Get product by ID
  getProduct(id) {
    const products = this.getProducts()
    return products.find(product => product.id === id)
  },

  // Add new product
  addProduct(productData) {
    const products = this.getProducts()
    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    products.push(newProduct)
    return StorageManager.set(STORAGE_KEYS.PRODUCTS, products) ? newProduct : null
  },

  // Update product
  updateProduct(id, productData) {
    const products = this.getProducts()
    const index = products.findIndex(product => product.id === id)
    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...productData,
        updatedAt: new Date().toISOString()
      }
      return StorageManager.set(STORAGE_KEYS.PRODUCTS, products) ? products[index] : null
    }
    return null
  },

  // Delete product
  deleteProduct(id) {
    const products = this.getProducts()
    const filteredProducts = products.filter(product => product.id !== id)
    return StorageManager.set(STORAGE_KEYS.PRODUCTS, filteredProducts)
  },

  // Clear all products
  clearProducts() {
    return StorageManager.remove(STORAGE_KEYS.PRODUCTS)
  }
}

/**
 * Onboarding Data Storage
 */
export const onboardingStorage = {
  // Get onboarding data
  getOnboardingData() {
    return StorageManager.get(STORAGE_KEYS.ONBOARDING_DATA, {
      currentStep: 1,
      completedSteps: [],
      formData: {
        phone: '',
        otp: '',
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
        documents: [],
        alternateDocuments: [],
        agreedToTerms: false
      },
      startedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    })
  },

  // Save onboarding data
  saveOnboardingData(data) {
    const currentData = this.getOnboardingData()
    const updatedData = {
      ...currentData,
      ...data,
      lastUpdated: new Date().toISOString()
    }
    return StorageManager.set(STORAGE_KEYS.ONBOARDING_DATA, updatedData)
  },

  // Update form data
  updateFormData(formData) {
    const currentData = this.getOnboardingData()
    const updatedData = {
      ...currentData,
      formData: {
        ...currentData.formData,
        ...formData
      },
      lastUpdated: new Date().toISOString()
    }
    return StorageManager.set(STORAGE_KEYS.ONBOARDING_DATA, updatedData)
  },

  // Mark step as completed
  completeStep(stepNumber) {
    const currentData = this.getOnboardingData()
    const completedSteps = [...new Set([...currentData.completedSteps, stepNumber])]
    return this.saveOnboardingData({
      completedSteps,
      currentStep: stepNumber + 1
    })
  },

  // Clear onboarding data
  clearOnboardingData() {
    return StorageManager.remove(STORAGE_KEYS.ONBOARDING_DATA)
  }
}

/**
 * Settings Storage
 */
export const settingsStorage = {
  // Get settings
  getSettings() {
    return StorageManager.get(STORAGE_KEYS.SETTINGS, {
      language: 'en',
      theme: 'light',
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      privacy: {
        profileVisibility: 'public',
        showContactInfo: true
      },
      lastUpdated: new Date().toISOString()
    })
  },

  // Update settings
  updateSettings(settings) {
    const currentSettings = this.getSettings()
    const updatedSettings = {
      ...currentSettings,
      ...settings,
      lastUpdated: new Date().toISOString()
    }
    return StorageManager.set(STORAGE_KEYS.SETTINGS, updatedSettings)
  },

  // Clear settings
  clearSettings() {
    return StorageManager.remove(STORAGE_KEYS.SETTINGS)
  }
}

/**
 * Referrals Storage
 */
export const referralsStorage = {
  // Get referrals data
  getReferrals() {
    return StorageManager.get(STORAGE_KEYS.REFERRALS, {
      referralCode: '',
      referredUsers: [],
      totalReferrals: 0,
      rewards: [],
      lastUpdated: new Date().toISOString()
    })
  },

  // Add referral
  addReferral(referralData) {
    const referrals = this.getReferrals()
    const newReferral = {
      id: Date.now().toString(),
      ...referralData,
      createdAt: new Date().toISOString()
    }
    referrals.referredUsers.push(newReferral)
    referrals.totalReferrals = referrals.referredUsers.length
    referrals.lastUpdated = new Date().toISOString()
    return StorageManager.set(STORAGE_KEYS.REFERRALS, referrals) ? newReferral : null
  },

  // Update referral code
  updateReferralCode(code) {
    const referrals = this.getReferrals()
    referrals.referralCode = code
    referrals.lastUpdated = new Date().toISOString()
    return StorageManager.set(STORAGE_KEYS.REFERRALS, referrals)
  },

  // Clear referrals
  clearReferrals() {
    return StorageManager.remove(STORAGE_KEYS.REFERRALS)
  }
}

/**
 * Support Tickets Storage
 */
export const supportStorage = {
  // Get support tickets
  getTickets() {
    return StorageManager.get(STORAGE_KEYS.SUPPORT_TICKETS, [])
  },

  // Add support ticket
  addTicket(ticketData) {
    const tickets = this.getTickets()
    const newTicket = {
      id: Date.now().toString(),
      ...ticketData,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    tickets.push(newTicket)
    return StorageManager.set(STORAGE_KEYS.SUPPORT_TICKETS, tickets) ? newTicket : null
  },

  // Update ticket status
  updateTicketStatus(id, status) {
    const tickets = this.getTickets()
    const index = tickets.findIndex(ticket => ticket.id === id)
    if (index !== -1) {
      tickets[index].status = status
      tickets[index].updatedAt = new Date().toISOString()
      return StorageManager.set(STORAGE_KEYS.SUPPORT_TICKETS, tickets) ? tickets[index] : null
    }
    return null
  },

  // Clear tickets
  clearTickets() {
    return StorageManager.remove(STORAGE_KEYS.SUPPORT_TICKETS)
  }
}

/**
 * Notifications Storage
 */
export const notificationsStorage = {
  // Get notifications
  getNotifications() {
    return StorageManager.get(STORAGE_KEYS.NOTIFICATIONS, [])
  },

  // Add notification
  addNotification(notificationData) {
    const notifications = this.getNotifications()
    const newNotification = {
      id: Date.now().toString(),
      ...notificationData,
      read: false,
      createdAt: new Date().toISOString()
    }
    notifications.unshift(newNotification) // Add to beginning
    return StorageManager.set(STORAGE_KEYS.NOTIFICATIONS, notifications) ? newNotification : null
  },

  // Mark notification as read
  markAsRead(id) {
    const notifications = this.getNotifications()
    const index = notifications.findIndex(notification => notification.id === id)
    if (index !== -1) {
      notifications[index].read = true
      return StorageManager.set(STORAGE_KEYS.NOTIFICATIONS, notifications) ? notifications[index] : null
    }
    return null
  },

  // Clear notifications
  clearNotifications() {
    return StorageManager.remove(STORAGE_KEYS.NOTIFICATIONS)
  }
}

/**
 * Export all storage utilities
 */
export {
  StorageManager,
  STORAGE_KEYS
}

/**
 * Initialize default data if not exists
 */
export const initializeStorage = () => {
  // Initialize user profile with default data
  const profile = userProfileStorage.getProfile()
  if (!profile.unionId) {
    const unionId = `UU${Date.now().toString().slice(-6)}`
    userProfileStorage.updateProfile({
      unionId,
      referralCode: unionId,
      membershipStatus: 'pending',
      verificationStatus: 'pending'
    })
  }

  // Initialize settings
  const settings = settingsStorage.getSettings()
  if (!settings.language) {
    settingsStorage.updateSettings({
      language: 'en',
      theme: 'light'
    })
  }

  return true
}

export default {
  userProfileStorage,
  productsStorage,
  onboardingStorage,
  settingsStorage,
  referralsStorage,
  supportStorage,
  notificationsStorage,
  StorageManager,
  STORAGE_KEYS,
  initializeStorage
}
