import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Shield, 
  GraduationCap, 
  CreditCard, 
  Headphones,
  CheckCircle,
  Users,
  Star,
  FileText,
  AlertTriangle
} from 'lucide-react'

const MembershipStep = ({ formData, updateFormData, isHindi }) => {
  const { t } = useTranslation()
  const [agreedToTerms, setAgreedToTerms] = useState(false)

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

  const terms = [
    {
      title: isHindi ? 'सदस्यता शर्तें' : 'Membership Terms',
      content: isHindi 
        ? 'उद्यम यूनियन की सदस्यता स्वैच्छिक है और सभी सदस्यों को यूनियन के नियमों और विनियमों का पालन करना होगा।'
        : 'Udyam Union membership is voluntary and all members must comply with union rules and regulations.'
    },
    {
      title: isHindi ? 'डेटा गोपनीयता' : 'Data Privacy',
      content: isHindi 
        ? 'आपकी व्यक्तिगत जानकारी सुरक्षित रखी जाएगी और केवल यूनियन गतिविधियों के लिए उपयोग की जाएगी।'
        : 'Your personal information will be kept secure and used only for union activities.'
    },
    {
      title: isHindi ? 'लाभ और सुविधाएं' : 'Benefits and Facilities',
      content: isHindi 
        ? 'सदस्यों को बीमा, प्रशिक्षण, क्रेडिट और अन्य यूनियन लाभों तक पहुंच मिलेगी।'
        : 'Members will have access to insurance, training, credit and other union benefits.'
    },
    {
      title: isHindi ? 'सदस्यता नवीनीकरण' : 'Membership Renewal',
      content: isHindi 
        ? 'सदस्यता वार्षिक रूप से नवीनीकृत की जा सकती है और सभी शुल्क समय पर भुगतान किए जाने चाहिए।'
        : 'Membership can be renewed annually and all fees must be paid on time.'
    }
  ]

  const handleAgreementChange = (e) => {
    const agreed = e.target.checked
    setAgreedToTerms(agreed)
    updateFormData({ agreedToTerms: agreed })
  }

  const getMembershipType = () => {
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

  const membershipInfo = getMembershipType()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('onboarding.membership.title')}
        </h2>
        <p className="text-gray-600">
          {t('onboarding.membership.subtitle')}
        </p>
      </div>

      <div className="space-y-6">
        {/* Membership Type */}
        <div className={`${membershipInfo.bgColor} border border-current rounded-lg p-4`}>
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${membershipInfo.bgColor} rounded-lg flex items-center justify-center`}>
              <FileText className={`h-6 w-6 ${membershipInfo.color}`} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${membershipInfo.color}`}>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('onboarding.membership.benefits')}
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

        {/* Terms and Conditions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('onboarding.membership.terms')}
          </h3>
          <div className="space-y-4">
            {terms.map((term, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  {term.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {term.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notice */}
        {!formData.hasDocuments && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-900 mb-1">
                  {isHindi ? 'महत्वपूर्ण सूचना' : 'Important Notice'}
                </h4>
                <p className="text-sm text-yellow-700">
                  {isHindi 
                    ? 'आपकी अस्थायी सदस्यता 90 दिनों के लिए वैध होगी। पूर्ण सदस्यता के लिए, कृपया अपने दस्तावेज जमा करें।'
                    : 'Your provisional membership will be valid for 90 days. For full membership, please submit your documents.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Agreement Checkbox */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={handleAgreementChange}
              className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div>
              <div className="text-sm font-medium text-primary-900">
                {t('onboarding.membership.agreeLabel')}
              </div>
              <p className="text-xs text-primary-700 mt-1">
                {isHindi 
                  ? 'मैं उद्यम यूनियन की सदस्यता शर्तों और नियमों से सहमत हूं।'
                  : 'I agree to the Udyam Union membership terms and conditions.'
                }
              </p>
            </div>
          </label>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {isHindi ? 'सदस्यता सारांश' : 'Membership Summary'}
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>{isHindi ? 'नाम:' : 'Name:'}</span>
              <span className="font-medium">{formData.name || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span>{isHindi ? 'फोन:' : 'Phone:'}</span>
              <span className="font-medium">{formData.phone || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span>{isHindi ? 'शहर:' : 'City:'}</span>
              <span className="font-medium">{formData.city || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span>{isHindi ? 'सदस्यता प्रकार:' : 'Membership Type:'}</span>
              <span className="font-medium">{membershipInfo.type}</span>
            </div>
            <div className="flex justify-between">
              <span>{isHindi ? 'दस्तावेज सत्यापन:' : 'Document Verification:'}</span>
              <span className="font-medium">
                {formData.hasDocuments 
                  ? (isHindi ? 'हां' : 'Yes') 
                  : (isHindi ? 'वैकल्पिक' : 'Alternative')
                }
              </span>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-600">
              {isHindi 
                ? 'सभी जानकारी सही है और सदस्यता के लिए तैयार है'
                : 'All information is correct and ready for membership'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MembershipStep
