// Phone number validation
export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone)
}

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// OTP validation
export const validateOTP = (otp) => {
  const otpRegex = /^\d{6}$/
  return otpRegex.test(otp)
}

// Name validation
export const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100
}

// Required field validation
export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0
}

// File validation
export const validateFile = (file, maxSize = 5 * 1024 * 1024) => {
  if (!file) return false
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
  const isValidType = allowedTypes.includes(file.type)
  const isValidSize = file.size <= maxSize
  
  return isValidType && isValidSize
}

// Multiple files validation
export const validateFiles = (files, maxCount = 5, maxSize = 5 * 1024 * 1024) => {
  const errors = []
  
  if (!files || files.length === 0) {
    errors.push('No files selected')
    return { isValid: false, errors }
  }
  
  if (files.length > maxCount) {
    errors.push(`Maximum ${maxCount} files allowed`)
  }
  
  const invalidFiles = Array.from(files).filter(file => !validateFile(file, maxSize))
  if (invalidFiles.length > 0) {
    errors.push('Some files are invalid (wrong format or too large)')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Price validation
export const validatePrice = (price) => {
  const numPrice = parseFloat(price)
  return !isNaN(numPrice) && numPrice >= 0
}

// Form validation helpers
export const getFieldError = (field, value, rules = {}) => {
  const { required, minLength, maxLength, pattern, custom } = rules
  
  if (required && !validateRequired(value)) {
    return 'This field is required'
  }
  
  if (minLength && value && value.length < minLength) {
    return `Minimum length is ${minLength} characters`
  }
  
  if (maxLength && value && value.length > maxLength) {
    return `Maximum length is ${maxLength} characters`
  }
  
  if (pattern && value && !pattern.test(value)) {
    return 'Invalid format'
  }
  
  if (custom && !custom(value)) {
    return 'Invalid value'
  }
  
  return null
}

// Validation rules for common fields
export const validationRules = {
  phone: {
    required: true,
    custom: validatePhone
  },
  email: {
    custom: validateEmail
  },
  otp: {
    required: true,
    custom: validateOTP
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    custom: validateName
  },
  price: {
    required: true,
    custom: validatePrice
  }
}

// Form validation helper
export const validateForm = (data, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field]
    const value = data[field]
    const error = getFieldError(field, value, fieldRules)
    
    if (error) {
      errors[field] = error
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
