import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  User, 
  Package, 
  Gift, 
  HelpCircle, 
  Users, 
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Phone,
  MessageCircle,
  Share2,
  Copy,
  Save,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import mockApi from '../utils/mockApi'
import { generateReferralLink, copyToClipboard, shareViaWhatsApp } from '../utils/helpers'
import { 
  userProfileStorage, 
  productsStorage, 
  supportStorage, 
  referralsStorage,
  notificationsStorage 
} from '../utils/storage'
import DataViewer from '../components/DataViewer'

const Dashboard = () => {
  const { t } = useTranslation()
  const { user, updateUser } = useAuth()
  const { isHindi } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showSupportForm, setShowSupportForm] = useState(false)
  const [profileData, setProfileData] = useState({})
  const [supportFormData, setSupportFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium'
  })
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    status: 'active'
  })

  useEffect(() => {
    loadData()
  }, [])

  // Sync activeTab with current route
  useEffect(() => {
    const path = location.pathname
    const searchParams = new URLSearchParams(location.search)
    
    if (path === '/dashboard') {
      setActiveTab('overview')
    } else if (path === '/dashboard/profile') {
      setActiveTab('profile')
    } else if (path === '/dashboard/products') {
      setActiveTab('products')
      // Check if we should show the add product form
      if (searchParams.get('add') === 'true') {
        setTimeout(() => {
          setShowAddProduct(true)
        }, 100)
      }
    } else if (path === '/dashboard/benefits') {
      setActiveTab('overview') // Benefits are shown in overview tab
    } else if (path === '/dashboard/support') {
      setActiveTab('support')
    } else if (path === '/dashboard/referrals') {
      setActiveTab('referrals')
    }
  }, [location.pathname, location.search])

  // Handle tab navigation
  const handleTabClick = (tabId, showAddForm = false) => {
    setActiveTab(tabId)
    // Navigate to the corresponding route
    switch (tabId) {
      case 'overview':
        navigate('/dashboard')
        break
      case 'profile':
        navigate('/dashboard/profile')
        break
      case 'products':
        if (showAddForm) {
          navigate('/dashboard/products?add=true')
        } else {
          navigate('/dashboard/products')
        }
        break
      case 'support':
        navigate('/dashboard/support')
        break
      case 'referrals':
        navigate('/dashboard/referrals')
        break
      default:
        navigate('/dashboard')
    }
  }


  const loadData = () => {
    // Load products from local storage
    const localProducts = productsStorage.getProducts()
    setProducts(localProducts)

    // Load user profile from local storage
    const localProfile = userProfileStorage.getProfile()
    setProfileData(localProfile)
    
    // Update auth context with local data
    if (localProfile.name || localProfile.phone) {
      updateUser(localProfile)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/my-products')
      if (response.data.success) {
        setProducts(response.data.products)
        // Save to local storage
        productsStorage.clearProducts()
        response.data.products.forEach(product => {
          productsStorage.addProduct(product)
        })
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      // If backend is not available, use local storage
      if (error.code === 'ERR_NETWORK' || error.message.includes('ERR_FAILED')) {
        console.log('Backend not available, using local storage for products')
        const localProducts = productsStorage.getProducts()
        setProducts(localProducts)
      }
    }
  }

  const getVerificationBadge = () => {
    const status = user?.verificationStatus || 'pending'
    const badges = {
      verified: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: t('verification.verified') },
      provisional: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: t('verification.provisional') },
      pending: { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle, text: t('verification.pending') }
    }
    
    const badge = badges[status] || badges.pending
    const Icon = badge.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {badge.text}
      </span>
    )
  }

  const benefits = [
    {
      icon: Shield,
      title: t('dashboard.benefits.insurance.title'),
      description: t('dashboard.benefits.insurance.description'),
      status: t('dashboard.benefits.insurance.status'),
      active: false
    },
    {
      icon: Gift,
      title: t('dashboard.benefits.training.title'),
      description: t('dashboard.benefits.training.description'),
      status: t('dashboard.benefits.training.status'),
      active: false
    },
    {
      icon: Users,
      title: t('dashboard.benefits.credit.title'),
      description: t('dashboard.benefits.credit.description'),
      status: t('dashboard.benefits.credit.status'),
      active: false
    },
    {
      icon: HelpCircle,
      title: t('dashboard.benefits.support.title'),
      description: t('dashboard.benefits.support.description'),
      status: t('dashboard.benefits.support.status'),
      active: true
    }
  ]

  const handleCopyReferralCode = async () => {
    const referralCode = user?.referralCode || 'UU2024001'
    const success = await copyToClipboard(referralCode)
    if (success) {
      toast.success(isHindi ? 'रेफरल कोड कॉपी हो गया!' : 'Referral code copied!')
    }
  }

  const handleShareWhatsApp = () => {
    const referralLink = generateReferralLink(user?.referralCode || 'UU2024001')
    const message = isHindi 
      ? `उद्यम यूनियन में शामिल हों - भारत का प्रमुख विक्रेता ऑनबोर्डिंग प्लेटफॉर्म। मेरे रेफरल कोड के साथ जुड़ें: ${referralLink}`
      : `Join Udyam Union - India's premier seller onboarding platform. Join with my referral code: ${referralLink}`
    
    shareViaWhatsApp(message, referralLink)
  }

  const handleReportIssue = () => {
    setShowSupportForm(true)
    toast.success(isHindi ? 'समस्या रिपोर्ट फॉर्म खुल रहा है...' : 'Opening issue report form...')
  }

  const handleEditProfile = () => {
    setShowEditProfile(true)
    setProfileData(userProfileStorage.getProfile())
  }

  const handleSaveProfile = () => {
    userProfileStorage.saveProfile(profileData)
    updateUser(profileData)
    setShowEditProfile(false)
    toast.success(isHindi ? 'प्रोफाइल सफलतापूर्वक अपडेट हो गया!' : 'Profile updated successfully!')
  }

  const handleAddProduct = () => {
    // Validate required fields
    if (!productFormData.name || !productFormData.price) {
      toast.error(isHindi ? 'कृपया सभी आवश्यक फील्ड भरें' : 'Please fill all required fields')
      return
    }

    // Validate price is a valid number
    const price = parseFloat(productFormData.price)
    if (isNaN(price) || price <= 0) {
      toast.error(isHindi ? 'कृपया एक वैध कीमत दर्ज करें' : 'Please enter a valid price')
      return
    }

    // Prepare product data with proper types
    const productData = {
      ...productFormData,
      price: price, // Convert to number
      name: productFormData.name.trim(),
      description: productFormData.description.trim(),
      category: productFormData.category || 'Other'
    }

    const newProduct = productsStorage.addProduct(productData)
    
    if (newProduct) {
      const updatedProducts = productsStorage.getProducts()
      setProducts(updatedProducts)
      setProductFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        status: 'active'
      })
      setShowAddProduct(false)
      toast.success(isHindi ? 'उत्पाद सफलतापूर्वक जोड़ा गया!' : 'Product added successfully!')
    } else {
      toast.error(isHindi ? 'उत्पाद जोड़ने में त्रुटि' : 'Error adding product')
    }
  }

  const handleDeleteProduct = (productId) => {
    if (window.confirm(isHindi ? 'क्या आप इस उत्पाद को हटाना चाहते हैं?' : 'Are you sure you want to delete this product?')) {
      productsStorage.deleteProduct(productId)
      setProducts(productsStorage.getProducts())
      toast.success(isHindi ? 'उत्पाद हटा दिया गया' : 'Product deleted')
    }
  }

  const handleSubmitSupportTicket = () => {
    if (!supportFormData.subject || !supportFormData.description) {
      toast.error(isHindi ? 'कृपया सभी आवश्यक फील्ड भरें' : 'Please fill all required fields')
      return
    }

    const newTicket = supportStorage.addTicket(supportFormData)
    if (newTicket) {
      setSupportFormData({
        subject: '',
        description: '',
        priority: 'medium'
      })
      setShowSupportForm(false)
      toast.success(isHindi ? 'सहायता टिकट सफलतापूर्वक जमा किया गया!' : 'Support ticket submitted successfully!')
    } else {
      toast.error(isHindi ? 'टिकट जमा करने में त्रुटि' : 'Error submitting ticket')
    }
  }

  const handleShareSMS = () => {
    const referralLink = generateReferralLink(user?.referralCode || 'UU2024001')
    const message = isHindi 
      ? `उद्यम यूनियन में शामिल हों - भारत का प्रमुख विक्रेता ऑनबोर्डिंग प्लेटफॉर्म। मेरे रेफरल कोड के साथ जुड़ें: ${referralLink}`
      : `Join Udyam Union - India's premier seller onboarding platform. Join with my referral code: ${referralLink}`
    
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`
    window.open(smsUrl, '_blank')
    toast.success(isHindi ? 'SMS शेयर करने के लिए खोला गया' : 'SMS sharing opened')
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('dashboard.welcome', { name: user?.name || 'Seller' })}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('dashboard.unionId', { id: user?.unionMembership?.id || 'UU2024001' })}
            </p>
            {getVerificationBadge()}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {isHindi ? 'सदस्यता स्थिति' : 'Membership Status'}
            </div>
            <div className="text-lg font-semibold text-primary-600">
              {user?.unionMembership?.status === 'active' 
                ? (isHindi ? 'सक्रिय' : 'Active')
                : (isHindi ? 'लंबित' : 'Pending')
              }
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Overview */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('dashboard.benefits.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div key={index} className="card">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    benefit.active ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      benefit.active ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {benefit.description}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      benefit.active 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {benefit.status}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>


      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Products Summary */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('dashboard.products.title')}
            </h3>
            <button
              onClick={() => handleTabClick('products', true)}
              className="btn-primary text-sm px-4 py-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t('dashboard.products.addProduct')}
            </button>
          </div>
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {products.length === 0 
                ? t('dashboard.products.noProducts')
                : `${products.length} ${isHindi ? 'उत्पाद' : 'products'} ${isHindi ? 'जोड़े गए' : 'added'}`
              }
            </p>
            {products.length === 0 && (
              <button
                onClick={() => handleTabClick('products', true)}
                className="btn-outline text-sm"
              >
                {t('dashboard.products.addFirstProduct')}
              </button>
            )}
          </div>
        </div>

        {/* Marketplace Matching */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('dashboard.marketplace.title')}
          </h3>
          <div className="text-center py-8">
            <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {t('dashboard.marketplace.description')}
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  {t('dashboard.marketplace.status')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('dashboard.profile.title')}
        </h2>
        <button 
          onClick={handleEditProfile}
          className="btn-outline"
        >
          <Edit className="h-4 w-4 mr-2" />
          {t('dashboard.profile.editProfile')}
        </button>
      </div>

      {showEditProfile ? (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isHindi ? 'प्रोफाइल संपादित करें' : 'Edit Profile'}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information Form */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">
                {t('dashboard.profile.personalInfo')}
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.name')}
                </label>
                <input
                  type="text"
                  value={profileData.name || ''}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.phone')}
                </label>
                <input
                  type="tel"
                  value={profileData.phone || ''}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.email')}
                </label>
                <input
                  type="email"
                  value={profileData.email || ''}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Business Information Form */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">
                {t('dashboard.profile.businessInfo')}
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isHindi ? 'क्षेत्र' : 'Region'}
                </label>
                <select
                  value={profileData.region || ''}
                  onChange={(e) => setProfileData({...profileData, region: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">{isHindi ? 'क्षेत्र चुनें' : 'Select Region'}</option>
                  <option value="North">{isHindi ? 'उत्तर' : 'North'}</option>
                  <option value="South">{isHindi ? 'दक्षिण' : 'South'}</option>
                  <option value="East">{isHindi ? 'पूर्व' : 'East'}</option>
                  <option value="West">{isHindi ? 'पश्चिम' : 'West'}</option>
                  <option value="Central">{isHindi ? 'केंद्रीय' : 'Central'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.city')}
                </label>
                <input
                  type="text"
                  value={profileData.city || ''}
                  onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isHindi ? 'श्रेणियां' : 'Categories'}
                </label>
                <input
                  type="text"
                  value={profileData.categories?.join(', ') || ''}
                  onChange={(e) => setProfileData({...profileData, categories: e.target.value.split(',').map(c => c.trim()).filter(c => c)})}
                  placeholder={isHindi ? 'श्रेणियां अल्पविराम से अलग करें' : 'Separate categories with commas'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isHindi ? 'पैमाना' : 'Scale'}
                </label>
                <select
                  value={profileData.scale || ''}
                  onChange={(e) => setProfileData({...profileData, scale: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">{isHindi ? 'पैमाना चुनें' : 'Select Scale'}</option>
                  <option value="Micro">{isHindi ? 'सूक्ष्म' : 'Micro'}</option>
                  <option value="Small">{isHindi ? 'छोटा' : 'Small'}</option>
                  <option value="Medium">{isHindi ? 'मध्यम' : 'Medium'}</option>
                  <option value="Large">{isHindi ? 'बड़ा' : 'Large'}</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setShowEditProfile(false)}
              className="btn-outline"
            >
              <X className="h-4 w-4 mr-2" />
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              onClick={handleSaveProfile}
              className="btn-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              {isHindi ? 'सहेजें' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('dashboard.profile.personalInfo')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.name')}
                </label>
                <p className="text-gray-900">{user?.name || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.phone')}
                </label>
                <p className="text-gray-900">{user?.phone || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.email')}
                </label>
                <p className="text-gray-900">{user?.email || '-'}</p>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('dashboard.profile.businessInfo')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isHindi ? 'क्षेत्र' : 'Region'}
                </label>
                <p className="text-gray-900">{user?.region || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.city')}
                </label>
                <p className="text-gray-900">{user?.city || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isHindi ? 'श्रेणियां' : 'Categories'}
                </label>
                <p className="text-gray-900">
                  {user?.categories?.join(', ') || '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isHindi ? 'पैमाना' : 'Scale'}
                </label>
                <p className="text-gray-900">{user?.scale || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('dashboard.products.title')}
        </h2>
        <button
          onClick={() => setShowAddProduct(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('dashboard.products.addProduct')}
        </button>
      </div>

      {showAddProduct && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isHindi ? 'नया उत्पाद जोड़ें' : 'Add New Product'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isHindi ? 'उत्पाद का नाम' : 'Product Name'} *
              </label>
              <input
                type="text"
                value={productFormData.name}
                onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={isHindi ? 'उत्पाद का नाम दर्ज करें' : 'Enter product name'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isHindi ? 'कीमत (₹)' : 'Price (₹)'} *
              </label>
              <input
                type="number"
                value={productFormData.price}
                onChange={(e) => setProductFormData({...productFormData, price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={isHindi ? 'कीमत दर्ज करें' : 'Enter price'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isHindi ? 'श्रेणी' : 'Category'}
              </label>
              <select
                value={productFormData.category}
                onChange={(e) => setProductFormData({...productFormData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">{isHindi ? 'श्रेणी चुनें' : 'Select Category'}</option>
                <option value="Electronics">{isHindi ? 'इलेक्ट्रॉनिक्स' : 'Electronics'}</option>
                <option value="Clothing">{isHindi ? 'कपड़े' : 'Clothing'}</option>
                <option value="Food">{isHindi ? 'भोजन' : 'Food'}</option>
                <option value="Services">{isHindi ? 'सेवाएं' : 'Services'}</option>
                <option value="Other">{isHindi ? 'अन्य' : 'Other'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isHindi ? 'स्थिति' : 'Status'}
              </label>
              <select
                value={productFormData.status}
                onChange={(e) => setProductFormData({...productFormData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="active">{isHindi ? 'सक्रिय' : 'Active'}</option>
                <option value="inactive">{isHindi ? 'निष्क्रिय' : 'Inactive'}</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isHindi ? 'विवरण' : 'Description'}
              </label>
              <textarea
                value={productFormData.description}
                onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={isHindi ? 'उत्पाद का विवरण दर्ज करें' : 'Enter product description'}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setShowAddProduct(false)}
              className="btn-outline"
            >
              <X className="h-4 w-4 mr-2" />
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              onClick={handleAddProduct}
              className="btn-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              {isHindi ? 'उत्पाद जोड़ें' : 'Add Product'}
            </button>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('dashboard.products.noProducts')}
          </h3>
          <p className="text-gray-600 mb-6">
            {isHindi 
              ? 'अपने उत्पादों और सेवाओं को जोड़कर शुरुआत करें'
              : 'Get started by adding your products and services'
            }
          </p>
          <button
            onClick={() => setShowAddProduct(true)}
            className="btn-primary"
          >
            {t('dashboard.products.addFirstProduct')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary-600">
                  ₹{product.price}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  product.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderSupport = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {t('dashboard.support.title')}
      </h2>

      {showSupportForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isHindi ? 'समस्या रिपोर्ट करें' : 'Report Issue'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isHindi ? 'विषय' : 'Subject'} *
              </label>
              <input
                type="text"
                value={supportFormData.subject}
                onChange={(e) => setSupportFormData({...supportFormData, subject: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={isHindi ? 'समस्या का विषय दर्ज करें' : 'Enter issue subject'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isHindi ? 'प्राथमिकता' : 'Priority'}
              </label>
              <select
                value={supportFormData.priority}
                onChange={(e) => setSupportFormData({...supportFormData, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">{isHindi ? 'कम' : 'Low'}</option>
                <option value="medium">{isHindi ? 'मध्यम' : 'Medium'}</option>
                <option value="high">{isHindi ? 'उच्च' : 'High'}</option>
                <option value="urgent">{isHindi ? 'तत्काल' : 'Urgent'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isHindi ? 'विवरण' : 'Description'} *
              </label>
              <textarea
                value={supportFormData.description}
                onChange={(e) => setSupportFormData({...supportFormData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={isHindi ? 'समस्या का विस्तृत विवरण दर्ज करें' : 'Enter detailed description of the issue'}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setShowSupportForm(false)}
              className="btn-outline"
            >
              <X className="h-4 w-4 mr-2" />
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              onClick={handleSubmitSupportTicket}
              className="btn-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              {isHindi ? 'टिकट जमा करें' : 'Submit Ticket'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isHindi ? 'संपर्क जानकारी' : 'Contact Information'}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {t('dashboard.support.phone')}
                </p>
                <p className="text-xs text-gray-600">
                  {isHindi ? '24/7 सहायता' : '24/7 Support'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {t('dashboard.support.whatsapp')}
                </p>
                <p className="text-xs text-gray-600">
                  {isHindi ? 'तत्काल सहायता' : 'Instant Support'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Issue */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('dashboard.support.reportIssue')}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {isHindi 
              ? 'किसी भी समस्या या सुझाव के लिए हमसे संपर्क करें'
              : 'Contact us for any issues or suggestions'
            }
          </p>
          <button
            onClick={handleReportIssue}
            className="btn-primary w-full"
          >
            {t('dashboard.support.reportIssue')}
          </button>
        </div>
      </div>
    </div>
  )

  const renderReferrals = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {t('dashboard.referrals.title')}
      </h2>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t('dashboard.referrals.description')}
        </h3>
        
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-900">
                {t('dashboard.referrals.referralCode', { code: user?.referralCode || 'UU2024001' })}
              </p>
            </div>
            <button
              onClick={handleCopyReferralCode}
              className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
            >
              <Copy className="h-4 w-4" />
              <span className="text-sm">{isHindi ? 'कॉपी' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleShareWhatsApp}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{t('dashboard.referrals.shareWhatsapp')}</span>
          </button>
          <button 
            onClick={handleShareSMS}
            className="btn-outline flex items-center justify-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>{t('dashboard.referrals.shareSMS')}</span>
          </button>
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: isHindi ? 'अवलोकन' : 'Overview', icon: User },
    { id: 'profile', label: isHindi ? 'प्रोफाइल' : 'Profile', icon: User },
    { id: 'products', label: isHindi ? 'उत्पाद' : 'Products', icon: Package },
    { id: 'support', label: isHindi ? 'सहायता' : 'Support', icon: HelpCircle },
    { id: 'referrals', label: isHindi ? 'रेफरल' : 'Referrals', icon: Users }
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'support' && renderSupport()}
        {activeTab === 'referrals' && renderReferrals()}
      </div>

      {/* Data Viewer Component */}
      <DataViewer />
    </div>
  )
}

export default Dashboard
