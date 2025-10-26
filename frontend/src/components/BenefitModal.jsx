import { useState } from 'react'
import { X, Play, Volume2, User, MapPin, Star } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const BenefitModal = ({ isOpen, onClose, benefit }) => {
  const { isHindi } = useLanguage()
  const [showVideo, setShowVideo] = useState(false)

  if (!isOpen || !benefit) return null

  const sellerStories = {
    'Insurance Coverage': {
      seller: {
        name: 'Priya Sharma',
        location: 'Jaipur, Rajasthan',
        business: 'Textile Seller',
        rating: 5
      },
      story: isHindi 
        ? 'बीमा कवरेज ने मेरे व्यवसाय को सुरक्षित बनाया। अब मैं बिना चिंता के काम कर सकती हूं।'
        : 'Insurance coverage made my business secure. Now I can work without worry.',
      videoUrl: '#', // Replace with actual video URL
      audioUrl: '#', // Replace with actual audio URL
      features: isHindi 
        ? ['दुकान का बीमा', 'स्वास्थ्य बीमा', 'दुर्घटना बीमा', 'सामान का बीमा']
        : ['Shop Insurance', 'Health Insurance', 'Accident Insurance', 'Goods Insurance']
    },
    'Training Programs': {
      seller: {
        name: 'Rajesh Kumar',
        location: 'Mumbai, Maharashtra',
        business: 'Food Vendor',
        rating: 5
      },
      story: isHindi 
        ? 'प्रशिक्षण कार्यक्रमों से मुझे डिजिटल मार्केटिंग सीखने में मदद मिली।'
        : 'Training programs helped me learn digital marketing.',
      videoUrl: '#',
      audioUrl: '#',
      features: isHindi 
        ? ['डिजिटल मार्केटिंग', 'वित्तीय प्रबंधन', 'ग्राहक सेवा', 'तकनीकी प्रशिक्षण']
        : ['Digital Marketing', 'Financial Management', 'Customer Service', 'Technical Training']
    },
    'Credit Access': {
      seller: {
        name: 'Sunita Devi',
        location: 'Varanasi, Uttar Pradesh',
        business: 'Handicraft Seller',
        rating: 5
      },
      story: isHindi 
        ? 'क्रेडिट सुविधा से मैंने अपने व्यवसाय का विस्तार किया।'
        : 'Credit facility helped me expand my business.',
      videoUrl: '#',
      audioUrl: '#',
      features: isHindi 
        ? ['व्यापार ऋण', 'कार्यशील पूंजी', 'उपकरण वित्तपोषण', 'क्रेडिट लाइन']
        : ['Business Loans', 'Working Capital', 'Equipment Financing', 'Credit Lines']
    },
    'Support Services': {
      seller: {
        name: 'Amit Singh',
        location: 'Delhi, NCR',
        business: 'Electronics Seller',
        rating: 5
      },
      story: isHindi 
        ? '24/7 सहायता ने मेरी हर समस्या का समाधान किया।'
        : '24/7 support solved all my problems.',
      videoUrl: '#',
      audioUrl: '#',
      features: isHindi 
        ? ['24/7 हेल्पलाइन', 'तकनीकी सहायता', 'व्यापार सलाह', 'मेंटरशिप']
        : ['24/7 Helpline', 'Technical Support', 'Business Consulting', 'Mentorship']
    }
  }

  const story = sellerStories[benefit.title] || sellerStories['Insurance Coverage']

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <benefit.icon className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 font-display">
                    {benefit.title}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {benefit.description}
                  </p>
                </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Seller Story */}
          <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-gray-900">{story.seller.name}</h3>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{story.seller.location}</span>
                </div>
                <div className="flex items-center mt-1">
                  {[...Array(story.seller.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <blockquote className="text-gray-700 italic text-lg leading-relaxed">
              "{story.story}"
            </blockquote>
          </div>

          {/* Media Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setShowVideo(!showVideo)}
              className="flex items-center justify-center space-x-3 p-4 bg-blue-100 hover:bg-blue-200 rounded-xl transition-colors duration-200"
            >
              <Play className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-blue-700">
                {isHindi ? 'वीडियो देखें' : 'Watch Video'}
              </span>
            </button>
            <button
              onClick={() => {/* Handle audio play */}}
              className="flex items-center justify-center space-x-3 p-4 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors duration-200"
            >
              <Volume2 className="h-6 w-6 text-stone-600" />
              <span className="font-semibold text-stone-700">
                {isHindi ? 'ऑडियो सुनें' : 'Listen Audio'}
              </span>
            </button>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
              {isHindi ? 'मुख्य सुविधाएं' : 'Key Features'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {story.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white border border-stone-200 rounded-xl">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BenefitModal
