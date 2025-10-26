// In-memory OTP storage (for demo purposes)
// In production, use Redis or database for OTP storage
const otpStore = new Map();

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Store OTP for a phone number
 * @param {string} phone - Phone number
 * @param {string} otp - OTP to store
 * @param {number} expiryMinutes - Expiry time in minutes (default: 5)
 */
const storeOTP = (phone, otp, expiryMinutes = 5) => {
  const expiryTime = Date.now() + (expiryMinutes * 60 * 1000);
  otpStore.set(phone, {
    otp,
    expiryTime,
    attempts: 0,
    maxAttempts: 3
  });
};

/**
 * Verify OTP for a phone number
 * @param {string} phone - Phone number
 * @param {string} inputOTP - OTP to verify
 * @returns {object} Verification result
 */
const verifyOTP = (phone, inputOTP) => {
  const otpData = otpStore.get(phone);
  
  if (!otpData) {
    return {
      success: false,
      message: 'OTP not found or expired'
    };
  }

  // Check if OTP has expired
  if (Date.now() > otpData.expiryTime) {
    otpStore.delete(phone);
    return {
      success: false,
      message: 'OTP has expired'
    };
  }

  // Check attempt limit
  if (otpData.attempts >= otpData.maxAttempts) {
    otpStore.delete(phone);
    return {
      success: false,
      message: 'Too many incorrect attempts. Please request a new OTP.'
    };
  }

  // Verify OTP
  if (otpData.otp === inputOTP) {
    otpStore.delete(phone);
    return {
      success: true,
      message: 'OTP verified successfully'
    };
  } else {
    // Increment attempt count
    otpData.attempts++;
    otpStore.set(phone, otpData);
    
    const remainingAttempts = otpData.maxAttempts - otpData.attempts;
    return {
      success: false,
      message: `Invalid OTP. ${remainingAttempts} attempts remaining.`
    };
  }
};

/**
 * Send OTP (mock implementation)
 * In production, integrate with SMS service like Twilio, AWS SNS, etc.
 * @param {string} phone - Phone number
 * @param {string} otp - OTP to send
 * @returns {Promise<object>} Send result
 */
const sendOTP = async (phone, otp) => {
  try {
    // Mock SMS sending - in production, replace with actual SMS service
    console.log(`📱 SMS to ${phone}: Your Udyam Union OTP is: ${otp}`);
    console.log(`⏰ OTP expires in 5 minutes`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'OTP sent successfully',
      otp: otp // Return OTP for demo purposes (remove in production)
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      message: 'Failed to send OTP'
    };
  }
};

/**
 * Generate and send OTP
 * @param {string} phone - Phone number
 * @returns {Promise<object>} Result
 */
const generateAndSendOTP = async (phone) => {
  try {
    // Check if OTP already exists and is still valid
    const existingOTP = otpStore.get(phone);
    if (existingOTP && Date.now() < existingOTP.expiryTime) {
      return {
        success: false,
        message: 'OTP already sent. Please wait before requesting a new one.'
      };
    }

    // Generate new OTP
    const otp = generateOTP();
    
    // Store OTP
    storeOTP(phone, otp);
    
    // Send OTP
    const sendResult = await sendOTP(phone, otp);
    
    if (sendResult.success) {
      return {
        success: true,
        message: 'OTP sent successfully',
        otp: otp // For demo purposes
      };
    } else {
      return sendResult;
    }
  } catch (error) {
    console.error('Error generating and sending OTP:', error);
    return {
      success: false,
      message: 'Failed to generate OTP'
    };
  }
};

/**
 * Clean expired OTPs from memory
 */
const cleanExpiredOTPs = () => {
  const now = Date.now();
  for (const [phone, otpData] of otpStore.entries()) {
    if (now > otpData.expiryTime) {
      otpStore.delete(phone);
    }
  }
};

// Clean expired OTPs every 10 minutes
setInterval(cleanExpiredOTPs, 10 * 60 * 1000);

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
  sendOTP,
  generateAndSendOTP,
  cleanExpiredOTPs
};
