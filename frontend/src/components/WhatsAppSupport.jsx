import { MessageCircle } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const WhatsAppSupport = () => {
  const { isHindi } = useLanguage()

  const handleWhatsAppClick = () => {
    const phoneNumber = '+919876543210' // Replace with actual support number
    const message = isHindi 
      ? 'नमस्ते! मुझे उद्यम यूनियन के बारे में जानकारी चाहिए।'
      : 'Hello! I need information about Udyam Union.'
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
      aria-label={isHindi ? 'WhatsApp सहायता' : 'WhatsApp Support'}
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">
        {isHindi ? 'WhatsApp सहायता' : 'WhatsApp Support'}
      </span>
    </button>
  )
}

export default WhatsAppSupport
