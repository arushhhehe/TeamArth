import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Shield, 
  GraduationCap, 
  CreditCard, 
  Headphones, 
  ArrowRight,
  CheckCircle,
  Users,
  Star
} from 'lucide-react'
import LanguageToggle from '../components/LanguageToggle'
import WhatsAppSupport from '../components/WhatsAppSupport'
import BenefitModal from '../components/BenefitModal'

const LandingPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isHindi } = useLanguage()
  const [selectedBenefit, setSelectedBenefit] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const benefits = [
    {
      icon: Shield,
      title: t('landing.benefits.insurance.title'),
      description: t('landing.benefits.insurance.description'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: GraduationCap,
      title: t('landing.benefits.training.title'),
      description: t('landing.benefits.training.description'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: CreditCard,
      title: t('landing.benefits.credit.title'),
      description: t('landing.benefits.credit.description'),
      color: 'text-stone-600',
      bgColor: 'bg-stone-100'
    },
    {
      icon: Headphones,
      title: t('landing.benefits.support.title'),
      description: t('landing.benefits.support.description'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  const stats = [
    { number: '10,000+', label: isHindi ? 'सत्यापित विक्रेता' : 'Verified Sellers' },
    { number: '50+', label: isHindi ? 'शहर' : 'Cities' },
    { number: '₹1Cr+', label: isHindi ? 'कुल लेनदेन' : 'Total Transactions' },
    { number: '99%', label: isHindi ? 'संतुष्टि दर' : 'Satisfaction Rate' }
  ]

  const handleJoinNow = () => {
    navigate('/onboarding')
  }

  const handleLearnMore = () => {
    // Scroll to the benefits section
    const benefitsSection = document.getElementById('benefits-section')
    if (benefitsSection) {
      benefitsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleBenefitClick = (benefit) => {
    setSelectedBenefit(benefit)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-stone-50 to-blue-50">
      {/* Language Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageToggle />
      </div>

      {/* WhatsApp Support */}
      <WhatsAppSupport />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Indian Seller Collage Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/30 to-blue-100/30"></div>
          {/* Decorative Indian patterns */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 animate-bounce-gentle"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-bounce-gentle" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-stone-200 rounded-full opacity-20 animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-10 right-1/3 w-28 h-28 bg-orange-300 rounded-full opacity-15 animate-bounce-gentle" style={{animationDelay: '1.5s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className={`text-5xl md:text-7xl font-bold text-gray-900 mb-6 font-display ${isHindi ? 'font-hindi' : ''}`}>
              {t('landing.title')}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto font-medium">
              {t('landing.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button
                onClick={handleJoinNow}
                className="btn-primary text-xl px-10 py-5 inline-flex items-center justify-center font-semibold"
              >
                {isHindi ? 'यूनियन में शामिल हों' : 'Join the Union'}
                <ArrowRight className="ml-3 h-6 w-6" />
              </button>
              <button 
                onClick={handleLearnMore}
                className="btn-outline text-xl px-10 py-5 font-semibold"
              >
                {isHindi ? 'क्यों जुड़ें?' : 'Why Join?'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Visual Bar */}
      <section className="py-12 bg-gradient-to-r from-orange-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2 font-display">
                  {stat.number}
                </div>
                <div className="text-lg md:text-xl font-medium opacity-90">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits-section" className="py-20 bg-gradient-to-br from-stone-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-display">
              {t('landing.benefits.title')}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              {isHindi 
                ? 'उद्यम यूनियन के साथ अपने व्यवसाय को नई ऊंचाइयों पर ले जाएं'
                : 'Take your business to new heights with Udyam Union'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div 
                  key={index} 
                  className="card hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                  onClick={() => handleBenefitClick(benefit)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleBenefitClick(benefit)
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Learn more about ${benefit.title}`}
                >
                  <div className={`w-16 h-16 ${benefit.bgColor} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className={`h-8 w-8 ${benefit.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-700 text-lg mb-4">
                    {benefit.description}
                  </p>
                  <div className="text-orange-600 font-semibold text-lg flex items-center">
                    {isHindi ? 'विवरण देखें' : 'Learn More'} 
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Join Section - Seller Stories */}
      <section className="py-20 bg-gradient-to-br from-stone-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-display">
              {isHindi ? 'क्यों उद्यम यूनियन?' : 'Why Udyam Union?'}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              {isHindi 
                ? 'वास्तविक विक्रेताओं की कहानियां सुनें'
                : 'Hear from real sellers who transformed their businesses'
              }
            </p>
          </div>

          {/* Seller Stories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Story 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-600">प</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Priya Sharma</h4>
                  <p className="text-gray-600">Textile Seller, Jaipur</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                "{isHindi 
                  ? 'उद्यम यूनियन के बाद मेरे व्यवसाय में 300% वृद्धि हुई। अब मैं बड़े ग्राहकों तक पहुंच सकती हूं।'
                  : 'After joining Udyam Union, my business grew by 300%. Now I can reach bigger customers.'
                }"
              </blockquote>
            </div>

            {/* Story 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">र</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Rajesh Kumar</h4>
                  <p className="text-gray-600">Food Vendor, Mumbai</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                "{isHindi 
                  ? 'बीमा और क्रेडिट सुविधाएं मिलने से मेरा व्यवसाय सुरक्षित हो गया।'
                  : 'Insurance and credit facilities made my business secure.'
                }"
              </blockquote>
            </div>

            {/* Story 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-stone-600">स</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Sunita Devi</h4>
                  <p className="text-gray-600">Handicraft Seller, Varanasi</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                "{isHindi 
                  ? 'प्रशिक्षण कार्यक्रमों से मुझे डिजिटल मार्केटिंग सीखने में मदद मिली।'
                  : 'Training programs helped me learn digital marketing.'
                }"
              </blockquote>
            </div>
          </div>

          {/* Journey Timeline */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center font-display">
              {isHindi ? 'आपकी यात्रा' : 'Your Journey'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">1</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {isHindi ? 'साइन अप' : 'Sign Up'}
                </h4>
                <p className="text-gray-600">
                  {isHindi ? '5 मिनट में शामिल हों' : 'Join in 5 minutes'}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {isHindi ? 'सत्यापन' : 'Verification'}
                </h4>
                <p className="text-gray-600">
                  {isHindi ? 'दस्तावेज अपलोड करें' : 'Upload documents'}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-stone-600">3</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {isHindi ? 'लाभ प्राप्त करें' : 'Get Benefits'}
                </h4>
                <p className="text-gray-600">
                  {isHindi ? 'यूनियन सुविधाएं' : 'Union benefits'}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">4</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {isHindi ? 'बढ़ें' : 'Grow'}
                </h4>
                <p className="text-gray-600">
                  {isHindi ? 'व्यवसाय का विस्तार' : 'Expand business'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
            {isHindi ? 'आज ही शुरू करें!' : 'Get Started Today!'}
          </h2>
          <p className="text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-medium">
            {isHindi 
              ? 'अपने व्यवसाय को नई ऊंचाइयों पर ले जाने के लिए उद्यम यूनियन में शामिल हों'
              : 'Join Udyam Union to take your business to new heights'
            }
          </p>
          <button
            onClick={handleJoinNow}
            className="bg-white text-orange-600 hover:bg-gray-100 font-bold py-5 px-10 rounded-2xl text-xl inline-flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {isHindi ? 'यूनियन में शामिल हों' : 'Join the Union'}
            <ArrowRight className="ml-3 h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4 font-display">Udyam Union</h3>
            <p className="text-gray-300 mb-8 text-lg">
              {isHindi 
                ? 'भारत का प्रमुख विक्रेता ऑनबोर्डिंग प्लेटफॉर्म'
                : 'India\'s premier seller onboarding platform'
              }
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <span className="sr-only">WhatsApp</span>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">W</span>
                </div>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <span className="sr-only">Facebook</span>
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">f</span>
                </div>
              </a>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 Udyam Union. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Benefit Modal */}
      <BenefitModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        benefit={selectedBenefit}
      />
    </div>
  )
}

export default LandingPage
