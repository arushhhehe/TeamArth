import { useTranslation } from 'react-i18next'
import { 
  CheckCircle, 
  Users, 
  Shield, 
  GraduationCap, 
  CreditCard, 
  Headphones,
  ArrowRight,
  Copy,
  Share2,
  Phone
} from 'lucide-react'
import { generateReferralLink, copyToClipboard, shareViaWhatsApp } from '../../utils/helpers'

const SuccessStep = ({ formData, isHindi }) => {
  const { t } = useTranslation()

  const benefits = [
    {
      icon: Shield,
      title: isHindi ? 'बीमा कवरेज' : 'Insurance Coverage',
      description: isHindi 
        ? 'आपके व्यवसाय और परिवार के लिए व्यापक बीमा सुरक्षा'
        : 'Comprehensive insurance protection for your business and family',
      status: isHindi ? 'जल्द आ रहा है' : 'Coming Soon'
    },
    {
      icon: GraduationCap,
      title: isHindi ? 'प्रशिक्षण कार्यक्रम' : 'Training Programs',
      description: isHindi 
        ? 'कौशल विकास और व्यवसाय प्रशिक्षण कार्यक्रम'
        : 'Skill development and business training programs',
      status: isHindi ? 'जल्द आ रहा है' : 'Coming Soon'
    },
    {
      icon: CreditCard,
      title: isHindi ? 'क्रेडिट एक्सेस' : 'Credit Access',
      description: isHindi 
        ? 'व्यवसाय ऋण और क्रेडिट सुविधाओं तक आसान पहुंच'
        : 'Easy access to business loans and credit facilities',
      status: isHindi ? 'जल्द आ रहा है' : 'Coming Soon'
    },
    {
      icon: Headphones,
      title: isHindi ? '24/7 सहायता' : '24/7 Support',
      description: isHindi 
        ? 'आपकी सभी व्यावसायिक आवश्यकताओं के लिए चौबीसों घंटे सहायता'
        : 'Round-the-clock support for all your business needs',
      status: isHindi ? 'सक्रिय' : 'Active'
    }
  ]

  const nextSteps = [
    {
      step: 1,
      title: isHindi ? 'प्रोफाइल पूरा करें' : 'Complete Your Profile',
      description: isHindi 
        ? 'अपनी व्यावसायिक जानकारी और उत्पादों को जोड़ें'
        : 'Add your business information and products',
      icon: Users
    },
    {
      step: 2,
      title: isHindi ? 'सत्यापन की प्रतीक्षा करें' : 'Wait for Verification',
      description: isHindi 
        ? 'हमारी टीम आपके दस्तावेजों की समीक्षा करेगी'
        : 'Our team will review your documents',
      icon: Shield
    },
    {
      step: 3,
      title: isHindi ? 'मार्केटप्लेस एक्सेस प्राप्त करें' : 'Get Marketplace Access',
      description: isHindi 
        ? 'सत्यापन के बाद सर्वोत्तम मार्केटप्लेस तक पहुंचें'
        : 'Access the best marketplaces after verification',
      icon: Share2
    }
  ]

  const handleCopyReferralCode = async () => {
    const referralCode = 'UU2024001' // This would come from the backend
    const success = await copyToClipboard(referralCode)
    if (success) {
      // Show success message
      console.log('Referral code copied!')
    }
  }

  const handleShareWhatsApp = () => {
    const referralLink = generateReferralLink('UU2024001')
    const message = isHindi 
      ? `उद्यम यूनियन में शामिल हों - भारत का प्रमुख विक्रेता ऑनबोर्डिंग प्लेटफॉर्म। मेरे रेफरल कोड के साथ जुड़ें: ${referralLink}`
      : `Join Udyam Union - India's premier seller onboarding platform. Join with my referral code: ${referralLink}`
    
    shareViaWhatsApp(message, referralLink)
  }

  const getMembershipInfo = () => {
    if (formData.hasDocuments) {
      return {
        type: isHindi ? 'पूर्ण सदस्यता' : 'Full Membership',
        description: isHindi 
          ? 'दस्तावेज सत्यापन के बाद पूर्ण सदस्यता'
          : 'Full membership after document verification',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      }
    } else {
      return {
        type: isHindi ? 'अस्थायी सदस्यता' : 'Provisional Membership',
        description: isHindi 
          ? '90 दिनों के लिए अस्थायी सदस्यता'
          : 'Provisional membership for 90 days',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      }
    }
  }

  const membershipInfo = getMembershipInfo()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t('onboarding.success.title')}
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          {t('onboarding.success.subtitle')}
        </p>
        
        {/* Union ID */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2">
            <Users className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium text-primary-900">
              {t('onboarding.success.unionId', { id: 'UU2024001' })}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Membership Status */}
        <div className={`${membershipInfo.bgColor} border border-current rounded-lg p-6`}>
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 ${membershipInfo.bgColor} rounded-lg flex items-center justify-center`}>
              <Shield className={`h-8 w-8 ${membershipInfo.color}`} />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${membershipInfo.color}`}>
                {membershipInfo.type}
              </h3>
              <p className="text-sm text-gray-700">
                {membershipInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Overview */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {t('onboarding.success.nextSteps')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {benefit.title}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          benefit.status === 'Active' || benefit.status === 'सक्रिय'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {benefit.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Next Steps */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {isHindi ? 'अगले चरण' : 'Next Steps'}
          </h3>
          <div className="space-y-4">
            {nextSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary-600">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {step.description}
                    </p>
                  </div>
                  <Icon className="h-5 w-5 text-gray-400" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Referral Section */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isHindi ? 'अन्य विक्रेताओं को आमंत्रित करें' : 'Invite Other Sellers'}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {isHindi 
              ? 'अपने रेफरल कोड के साथ अन्य विक्रेताओं को उद्यम यूनियन में शामिल होने के लिए आमंत्रित करें'
              : 'Invite other sellers to join Udyam Union with your referral code'
            }
          </p>
          
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              value="UU2024001"
              readOnly
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
            />
            <button
              onClick={handleCopyReferralCode}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-1"
            >
              <Copy className="h-4 w-4" />
              <span>{isHindi ? 'कॉपी' : 'Copy'}</span>
            </button>
          </div>
          
          <button
            onClick={handleShareWhatsApp}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <Phone className="h-4 w-4" />
            <span>{isHindi ? 'व्हाट्सऐप पर साझा करें' : 'Share on WhatsApp'}</span>
          </button>
        </div>

        {/* Support Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            {isHindi ? 'सहायता की आवश्यकता है?' : 'Need Help?'}
          </h4>
          <p className="text-sm text-blue-700 mb-3">
            {isHindi 
              ? 'हमारी सहायता टीम आपकी सहायता के लिए यहां है। किसी भी प्रश्न के लिए संपर्क करें।'
              : 'Our support team is here to help. Contact us for any questions.'
            }
          </p>
          <div className="flex items-center space-x-4 text-sm text-blue-700">
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>+91-XXXX-XXXXXX</span>
            </div>
            <div className="flex items-center space-x-1">
              <Headphones className="h-4 w-4" />
              <span>{isHindi ? '24/7 सहायता' : '24/7 Support'}</span>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
          >
            {t('onboarding.success.goToDashboard')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessStep
