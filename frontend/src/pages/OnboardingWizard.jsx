import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import toast from 'react-hot-toast'
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  Shield,
  GraduationCap,
  CreditCard,
  Headphones
} from 'lucide-react'
import { onboardingStorage, userProfileStorage } from '../utils/storage'
import LanguageToggle from '../components/LanguageToggle'

// Import step components
import WelcomeStep from '../components/onboarding/WelcomeStep'
import PhoneStep from '../components/onboarding/PhoneStep'
import ProfileStep from '../components/onboarding/ProfileStep'
import DocumentsStep from '../components/onboarding/DocumentsStep'
import AlternateDocumentsStep from '../components/onboarding/AlternateDocumentsStep'
import MembershipStep from '../components/onboarding/MembershipStep'
import SuccessStep from '../components/onboarding/SuccessStep'

const OnboardingWizard = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { sendOTP, login, isAuthenticated } = useAuth()
  const { isHindi } = useLanguage()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
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
  })
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const isAuthenticating = useRef(false)

  const totalSteps = 6

  // Load saved onboarding data on component mount
  useEffect(() => {
    const savedData = onboardingStorage.getOnboardingData()
    if (savedData.currentStep > 1) {
      setCurrentStep(savedData.currentStep)
      setFormData(savedData.formData)
    }
  }, [])

  // Check if user is already authenticated (only on initial load)
  useEffect(() => {
    if (isAuthenticated() && !isAuthenticating.current) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const getStepValidation = (stepId) => {
    switch (stepId) {
      case 1:
        return true // Welcome step always allows next
      case 2:
        return formData.phone && formData.otp
      case 3:
        return formData.name && formData.region && formData.city && formData.categories.length > 0 && formData.scale
      case 4:
        return formData.hasDocuments ? formData.documentType && formData.documents.length > 0 : true
      case 5:
        return formData.hasDocuments ? true : formData.alternateDocuments.length > 0
      case 6:
        return formData.agreedToTerms
      default:
        return false
    }
  }

  const steps = [
    {
      id: 1,
      title: t('onboarding.welcome.title'),
      component: WelcomeStep,
      canGoNext: getStepValidation(1)
    },
    {
      id: 2,
      title: t('onboarding.phone.title'),
      component: PhoneStep,
      canGoNext: getStepValidation(2)
    },
    {
      id: 3,
      title: t('onboarding.profile.title'),
      component: ProfileStep,
      canGoNext: getStepValidation(3)
    },
    {
      id: 4,
      title: t('onboarding.documents.title'),
      component: DocumentsStep,
      canGoNext: getStepValidation(4)
    },
    {
      id: 5,
      title: t('onboarding.documents.alternateDocuments'),
      component: AlternateDocumentsStep,
      canGoNext: getStepValidation(5),
      showCondition: !formData.hasDocuments
    },
    {
      id: 6,
      title: t('onboarding.membership.title'),
      component: MembershipStep,
      canGoNext: getStepValidation(6)
    }
  ]

  const currentStepConfig = steps.find(step => step.id === currentStep)
  const CurrentStepComponent = currentStepConfig?.component

  const updateFormData = (updates) => {
    const newFormData = { ...formData, ...updates }
    setFormData(newFormData)
    // Save to local storage
    onboardingStorage.updateFormData(newFormData)
  }

  const handleNext = async () => {
    if (currentStep === 2 && !otpSent) {
      // Send OTP
      setLoading(true)
      try {
        const result = await sendOTP(formData.phone)
        if (result.success) {
          setOtpSent(true)
          toast.success(t('onboarding.phone.otpSent', { phone: formData.phone }))
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('OTP send error:', error)
        const errorMessage = error.message || 'Failed to send OTP. Please try again.'
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
      return
    }

    if (currentStep === 2 && otpSent) {
      // Verify OTP
      setLoading(true)
      isAuthenticating.current = true
      try {
        const result = await login(formData.phone, formData.otp)
        if (result.success) {
          if (result.isNewUser) {
            // New user, continue to profile step
            setCurrentStep(3)
          } else {
            // Existing user, go to dashboard
            navigate('/dashboard')
          }
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('OTP verification error:', error)
        const errorMessage = error.message || 'Failed to verify OTP. Please check your OTP and try again.'
        toast.error(errorMessage)
      } finally {
        setLoading(false)
        isAuthenticating.current = false
      }
      return
    }

    if (currentStep === totalSteps) {
      // Complete registration
      await handleCompleteRegistration()
      return
    }

    const nextStep = currentStep + 1
    setCurrentStep(nextStep)
    // Save progress to local storage
    onboardingStorage.saveOnboardingData({
      currentStep: nextStep,
      completedSteps: [...(onboardingStorage.getOnboardingData().completedSteps || []), currentStep]
    })
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleCompleteRegistration = async () => {
    setLoading(true)
    isAuthenticating.current = true
    try {
      // Save user profile to local storage
      const userProfile = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        region: formData.region,
        city: formData.city,
        village: formData.village,
        categories: formData.categories,
        language: formData.language,
        scale: formData.scale,
        capacity: formData.capacity,
        unionId: `UU${Date.now().toString().slice(-6)}`,
        referralCode: `UU${Date.now().toString().slice(-6)}`,
        membershipStatus: 'pending',
        verificationStatus: 'pending',
        hasDocuments: formData.hasDocuments,
        documentType: formData.documentType,
        documents: formData.documents,
        alternateDocuments: formData.alternateDocuments,
        agreedToTerms: formData.agreedToTerms
      }
      
      userProfileStorage.saveProfile(userProfile)
      
      // Clear onboarding data
      onboardingStorage.clearOnboardingData()
      
      // Update auth context
      // Note: updateUser function is not available in this context
      // The user will be set when they complete the registration
      
      toast.success('Registration completed successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Registration completion error:', error)
      const errorMessage = error.message || 'Failed to complete registration. Please try again or contact support.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
      isAuthenticating.current = false
    }
  }

  const handleSkip = () => {
    if (currentStepConfig?.showCondition) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-stone-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-display">
                {t('onboarding.title')}
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                {t('onboarding.step', { current: currentStep, total: totalSteps })}
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-lg text-gray-700 mb-2 font-semibold">
                  {Math.round(progress)}% {isHindi ? 'पूरा' : 'Complete'}
                </div>
                <div className="w-40 bg-stone-200 rounded-full h-3 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-blue-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200">
          {/* Step Content */}
          <div className="p-6 md:p-8">
            {CurrentStepComponent && (
              <CurrentStepComponent
                formData={formData}
                updateFormData={updateFormData}
                loading={loading}
                onNext={handleNext}
                onBack={handleBack}
                onSkip={handleSkip}
                canGoNext={currentStepConfig?.canGoNext}
                isHindi={isHindi}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="px-6 md:px-8 py-6 bg-gradient-to-r from-stone-50 to-orange-50 border-t border-stone-200 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center px-6 py-3 text-base font-semibold text-gray-700 bg-white border-2 border-stone-300 rounded-xl hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                {t('common.back')}
              </button>

              <div className="flex items-center space-x-4">
                {currentStepConfig?.showCondition && (
                  <button
                    onClick={handleSkip}
                    className="text-base text-gray-600 hover:text-gray-800 font-medium px-4 py-2 rounded-lg hover:bg-white/50 transition-colors duration-200"
                  >
                    {isHindi ? 'छोड़ें' : 'Skip'}
                  </button>
                )}

                <button
                  onClick={handleNext}
                  disabled={!currentStepConfig?.canGoNext || loading}
                  className="flex items-center px-8 py-3 text-base font-bold text-white bg-gradient-to-r from-orange-600 to-blue-600 border border-transparent rounded-xl hover:from-orange-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <div className="spinner mr-3" />
                  ) : (
                    <ChevronRight className="h-5 w-5 mr-2" />
                  )}
                  {currentStep === totalSteps ? t('onboarding.membership.complete') : t('common.next')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits reminder */}
        {currentStep > 1 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-stone-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-display">
              {t('onboarding.welcome.benefits')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Shield, text: isHindi ? 'बीमा' : 'Insurance', color: 'text-orange-600', bg: 'bg-orange-100' },
                { icon: GraduationCap, text: isHindi ? 'प्रशिक्षण' : 'Training', color: 'text-blue-600', bg: 'bg-blue-100' },
                { icon: CreditCard, text: isHindi ? 'क्रेडिट' : 'Credit', color: 'text-stone-600', bg: 'bg-stone-100' },
                { icon: Headphones, text: isHindi ? 'सहायता' : 'Support', color: 'text-orange-600', bg: 'bg-orange-100' }
              ].map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-xl hover:shadow-md transition-all duration-200">
                    <div className={`w-10 h-10 ${benefit.bg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${benefit.color}`} />
                    </div>
                    <span className="text-lg font-semibold text-gray-700">{benefit.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OnboardingWizard
