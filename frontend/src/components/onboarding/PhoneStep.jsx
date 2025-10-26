import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Phone, Shield, Clock, CheckCircle } from 'lucide-react'
import { validatePhone, validateOTP } from '../../utils/validators'

const PhoneStep = ({ formData, updateFormData, loading, onNext, isHindi }) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState({})
  const [otpSent, setOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [mockOTP, setMockOTP] = useState('')

  const handlePhoneChange = (e) => {
    const phone = e.target.value
    updateFormData({ phone })
    
    // Clear phone error when user starts typing
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: null }))
    }
  }

  const handleOTPChange = (e) => {
    const otp = e.target.value
    updateFormData({ otp })
    
    // Clear OTP error when user starts typing
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: null }))
    }
  }

  const handleSendOTP = () => {
    const phoneError = validatePhone(formData.phone) ? null : 'Please enter a valid phone number'
    
    if (phoneError) {
      setErrors({ phone: phoneError })
      return
    }

    // Generate mock OTP
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString()
    setMockOTP(generatedOTP)
    updateFormData({ otp: generatedOTP }) // Auto-fill the OTP field
    
    setOtpSent(true)
    setCountdown(60) // 60 seconds countdown
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    onNext()
  }

  const handleVerifyOTP = () => {
    const otpError = validateOTP(formData.otp) ? null : 'Please enter a valid 6-digit OTP'
    
    if (otpError) {
      setErrors({ otp: otpError })
      return
    }

    onNext()
  }

  const handleResendOTP = () => {
    setOtpSent(false)
    setCountdown(0)
    updateFormData({ otp: '' })
    setErrors({})
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('onboarding.phone.title')}
        </h2>
        <p className="text-gray-600">
          {t('onboarding.phone.subtitle')}
        </p>
      </div>

      {!otpSent ? (
        // Phone Input Step
        <div className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              {t('onboarding.phone.phoneLabel')}
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder={t('onboarding.phone.phonePlaceholder')}
                className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                disabled={loading}
              />
              <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  {isHindi ? 'सुरक्षित और निजी' : 'Secure & Private'}
                </h4>
                <p className="text-sm text-blue-700">
                  {isHindi 
                    ? 'आपका फोन नंबर सुरक्षित रखा जाता है और केवल सत्यापन के लिए उपयोग किया जाता है।'
                    : 'Your phone number is kept secure and used only for verification.'
                  }
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSendOTP}
            disabled={!formData.phone || loading}
            className="w-full btn-primary py-3"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="spinner mr-2" />
                {isHindi ? 'भेजा जा रहा है...' : 'Sending...'}
              </div>
            ) : (
              t('onboarding.phone.sendOTP')
            )}
          </button>
        </div>
      ) : (
        // OTP Verification Step
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('onboarding.phone.otpSent', { phone: formData.phone })}
            </h3>
            <p className="text-gray-600">
              {isHindi 
                ? 'कृपया अपने फोन पर प्राप्त 6-अंकीय OTP दर्ज करें'
                : 'Please enter the 6-digit OTP received on your phone'
              }
            </p>
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              {t('onboarding.phone.otpLabel')}
            </label>
            <input
              type="text"
              id="otp"
              value={formData.otp}
              onChange={handleOTPChange}
              placeholder={t('onboarding.phone.otpPlaceholder')}
              maxLength="6"
              className={`input-field text-center text-2xl tracking-widest ${errors.otp ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
            )}
          </div>

          {/* Mock OTP Display */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-center">
              <h4 className="text-sm font-medium text-green-900 mb-2">
                {isHindi ? 'मॉक OTP (परीक्षण के लिए)' : 'Mock OTP (For Testing)'}
              </h4>
              <div className="bg-white border-2 border-green-300 rounded-lg p-3 mb-2">
                <p className="text-2xl font-bold text-green-800 font-mono tracking-widest">
                  {mockOTP}
                </p>
              </div>
              <p className="text-xs text-green-700">
                {isHindi 
                  ? 'यह OTP स्वचालित रूप से भरा गया है। सत्यापित करने के लिए नीचे दिए गए बटन पर क्लिक करें।'
                  : 'This OTP has been auto-filled. Click the verify button below to proceed.'
                }
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-900 mb-1">
                  {isHindi ? 'OTP समय सीमा' : 'OTP Time Limit'}
                </h4>
                <p className="text-sm text-yellow-700">
                  {isHindi 
                    ? 'OTP 5 मिनट के लिए वैध है। समय सीमा समाप्त होने पर नया OTP मांगें।'
                    : 'OTP is valid for 5 minutes. Request a new OTP if it expires.'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleVerifyOTP}
              disabled={!formData.otp || formData.otp.length !== 6 || loading}
              className="w-full btn-primary py-3"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-2" />
                  {isHindi ? 'सत्यापित हो रहा है...' : 'Verifying...'}
                </div>
              ) : (
                t('onboarding.phone.verify')
              )}
            </button>

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-500">
                  {isHindi ? 'नया OTP मांगने के लिए' : 'Request new OTP in'} {countdown}s
                </p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('onboarding.phone.resend')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Demo OTP for development - Always show in production for demo */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-center">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            {isHindi ? 'डेमो मोड: OTP जानकारी' : 'Demo Mode: OTP Information'}
          </h4>
          <p className="text-xs text-blue-700 mb-2">
            {isHindi 
              ? 'यह एक डेमो प्लेटफॉर्म है। OTP स्वचालित रूप से उत्पन्न होता है और स्क्रीन पर दिखाया जाता है।'
              : 'This is a demo platform. OTP is automatically generated and displayed on screen.'
            }
          </p>
          <div className="bg-white border border-blue-300 rounded p-2">
            <p className="text-xs text-blue-600 font-mono">
              {isHindi ? 'किसी भी 6-अंकीय संख्या का उपयोग करें' : 'Use any 6-digit number for testing'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhoneStep
