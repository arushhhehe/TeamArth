import { useTranslation } from 'react-i18next'
import { 
  Shield, 
  GraduationCap, 
  CreditCard, 
  Headphones,
  CheckCircle,
  Users,
  Star,
  ArrowRight
} from 'lucide-react'

const WelcomeStep = ({ formData, updateFormData, onNext, isHindi }) => {
  const { t } = useTranslation()

  const benefits = [
    {
      icon: Shield,
      title: t('landing.benefits.insurance.title'),
      description: t('landing.benefits.insurance.description'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: GraduationCap,
      title: t('landing.benefits.training.title'),
      description: t('landing.benefits.training.description'),
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: CreditCard,
      title: t('landing.benefits.credit.title'),
      description: t('landing.benefits.credit.description'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Headphones,
      title: t('landing.benefits.support.title'),
      description: t('landing.benefits.support.description'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  const features = [
    {
      icon: CheckCircle,
      text: isHindi ? 'आसान सत्यापन प्रक्रिया' : 'Easy verification process',
      color: 'text-green-600'
    },
    {
      icon: CheckCircle,
      text: isHindi ? '24/7 सहायता' : '24/7 support',
      color: 'text-green-600'
    },
    {
      icon: CheckCircle,
      text: isHindi ? 'मार्केटप्लेस एक्सेस' : 'Marketplace access',
      color: 'text-green-600'
    },
    {
      icon: CheckCircle,
      text: isHindi ? 'यूनियन लाभ' : 'Union benefits',
      color: 'text-green-600'
    }
  ]

  return (
    <div className="text-center">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="h-10 w-10 text-primary-600" />
        </div>
        <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${isHindi ? 'font-hindi' : ''}`}>
          {t('onboarding.welcome.title')}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('onboarding.welcome.subtitle')}
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {t('onboarding.welcome.benefits')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div key={index} className="text-left p-6 bg-gray-50 rounded-lg">
                <div className={`w-12 h-12 ${benefit.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${benefit.color}`} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h4>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Features List */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {isHindi ? 'क्यों उद्यम यूनियन?' : 'Why Udyam Union?'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200">
                <Icon className={`h-5 w-5 ${feature.color} flex-shrink-0`} />
                <span className="text-gray-700">{feature.text}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">10,000+</div>
            <div className="text-sm text-gray-600">
              {isHindi ? 'सत्यापित विक्रेता' : 'Verified Sellers'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">50+</div>
            <div className="text-sm text-gray-600">
              {isHindi ? 'शहर' : 'Cities'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">₹1Cr+</div>
            <div className="text-sm text-gray-600">
              {isHindi ? 'कुल लेनदेन' : 'Total Transactions'}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
          ))}
        </div>
        <blockquote className="text-gray-700 italic mb-4">
          "{isHindi 
            ? 'उद्यम यूनियन ने मेरे व्यवसाय को नई ऊंचाइयों पर पहुंचाया है। अब मैं बेहतर मार्केटप्लेस तक पहुंच सकता हूं।'
            : 'Udyam Union has taken my business to new heights. Now I can access better marketplaces.'
          }"
        </blockquote>
        <div className="text-sm text-gray-600">
          - {isHindi ? 'राजेश कुमार, कृषि विक्रेता' : 'Rajesh Kumar, Agriculture Seller'}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={onNext}
          className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
        >
          {t('onboarding.welcome.getStarted')}
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
        <p className="text-sm text-gray-500 mt-4">
          {isHindi 
            ? 'पंजीकरण में केवल 5 मिनट लगते हैं'
            : 'Registration takes only 5 minutes'
          }
        </p>
      </div>
    </div>
  )
}

export default WelcomeStep
