import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { User, Mail, MapPin, Building, Tag, Globe, Scale, Factory } from 'lucide-react'
import { validateName, validateEmail } from '../../utils/validators'

const ProfileStep = ({ formData, updateFormData, isHindi }) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState({})

  const regions = [
    'North India', 'South India', 'East India', 'West India', 'Central India', 'Northeast India'
  ]

  const categories = [
    { value: 'Agriculture', label: isHindi ? 'कृषि' : 'Agriculture' },
    { value: 'Handicrafts', label: isHindi ? 'हस्तशिल्प' : 'Handicrafts' },
    { value: 'Services', label: isHindi ? 'सेवाएं' : 'Services' },
    { value: 'Manufacturing', label: isHindi ? 'विनिर्माण' : 'Manufacturing' },
    { value: 'Textiles', label: isHindi ? 'टेक्सटाइल' : 'Textiles' },
    { value: 'Food Processing', label: isHindi ? 'खाद्य प्रसंस्करण' : 'Food Processing' },
    { value: 'Technology', label: isHindi ? 'प्रौद्योगिकी' : 'Technology' },
    { value: 'Other', label: isHindi ? 'अन्य' : 'Other' }
  ]

  const scales = [
    { value: 'Micro', label: isHindi ? 'सूक्ष्म (₹1 लाख तक)' : 'Micro (Up to ₹1 Lakh)' },
    { value: 'Small', label: isHindi ? 'छोटा (₹1-10 लाख)' : 'Small (₹1-10 Lakh)' },
    { value: 'Medium', label: isHindi ? 'मध्यम (₹10 लाख से अधिक)' : 'Medium (Above ₹10 Lakh)' }
  ]

  const languages = [
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'हिंदी' },
    { value: 'Both', label: isHindi ? 'दोनों' : 'Both' }
  ]

  const handleFieldChange = (field, value) => {
    updateFormData({ [field]: value })
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleCategoryToggle = (category) => {
    const currentCategories = formData.categories || []
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category]
    
    updateFormData({ categories: newCategories })
  }

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        return validateName(value) ? null : 'Name must be between 2 and 100 characters'
      case 'email':
        return value ? (validateEmail(value) ? null : 'Please enter a valid email') : null
      default:
        return null
    }
  }

  const handleBlur = (field) => {
    const value = formData[field]
    const error = validateField(field, value)
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('onboarding.profile.title')}
        </h2>
        <p className="text-gray-600">
          {t('onboarding.profile.subtitle')}
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-primary-600" />
            {isHindi ? 'व्यक्तिगत जानकारी' : 'Personal Information'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                {t('onboarding.profile.nameLabel')} *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder={t('onboarding.profile.namePlaceholder')}
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('onboarding.profile.emailLabel')}
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder={t('onboarding.profile.emailPlaceholder')}
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary-600" />
            {isHindi ? 'स्थान जानकारी' : 'Location Information'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                {t('onboarding.profile.regionLabel')} *
              </label>
              <select
                id="region"
                value={formData.region}
                onChange={(e) => handleFieldChange('region', e.target.value)}
                className="input-field"
              >
                <option value="">{t('onboarding.profile.regionPlaceholder')}</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                {t('onboarding.profile.cityLabel')} *
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                placeholder={t('onboarding.profile.cityPlaceholder')}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="village" className="block text-sm font-medium text-gray-700 mb-2">
                {t('onboarding.profile.villageLabel')}
              </label>
              <input
                type="text"
                id="village"
                value={formData.village}
                onChange={(e) => handleFieldChange('village', e.target.value)}
                placeholder={t('onboarding.profile.villagePlaceholder')}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="h-5 w-5 mr-2 text-primary-600" />
            {isHindi ? 'व्यावसायिक जानकारी' : 'Business Information'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('onboarding.profile.categoriesLabel')} *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {categories.map(category => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleCategoryToggle(category.value)}
                    className={`p-3 text-sm rounded-lg border transition-colors duration-200 ${
                      formData.categories?.includes(category.value)
                        ? 'bg-primary-100 border-primary-500 text-primary-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('onboarding.profile.languageLabel')}
                </label>
                <select
                  id="language"
                  value={formData.language}
                  onChange={(e) => handleFieldChange('language', e.target.value)}
                  className="input-field"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="scale" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('onboarding.profile.scaleLabel')} *
                </label>
                <select
                  id="scale"
                  value={formData.scale}
                  onChange={(e) => handleFieldChange('scale', e.target.value)}
                  className="input-field"
                >
                  <option value="">{isHindi ? 'व्यावसायिक पैमाना चुनें' : 'Select business scale'}</option>
                  {scales.map(scale => (
                    <option key={scale.value} value={scale.value}>{scale.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                {t('onboarding.profile.capacityLabel')}
              </label>
              <textarea
                id="capacity"
                value={formData.capacity}
                onChange={(e) => handleFieldChange('capacity', e.target.value)}
                placeholder={t('onboarding.profile.capacityPlaceholder')}
                rows={3}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-primary-900 mb-2">
            {isHindi ? 'चयनित जानकारी' : 'Selected Information'}
          </h4>
          <div className="text-sm text-primary-700 space-y-1">
            <p><strong>{isHindi ? 'नाम:' : 'Name:'}</strong> {formData.name || '-'}</p>
            <p><strong>{isHindi ? 'क्षेत्र:' : 'Region:'}</strong> {formData.region || '-'}</p>
            <p><strong>{isHindi ? 'शहर:' : 'City:'}</strong> {formData.city || '-'}</p>
            <p><strong>{isHindi ? 'श्रेणियां:' : 'Categories:'}</strong> {formData.categories?.length || 0} {isHindi ? 'चयनित' : 'selected'}</p>
            <p><strong>{isHindi ? 'पैमाना:' : 'Scale:'}</strong> {formData.scale || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileStep
