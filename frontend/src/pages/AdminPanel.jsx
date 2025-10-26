import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Users, 
  BarChart3, 
  Shield, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  X, 
  Clock,
  AlertTriangle,
  User,
  Phone,
  MapPin,
  Tag,
  Calendar,
  MessageSquare
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'

const AdminPanel = () => {
  const { t } = useTranslation()
  const { admin } = useAuth()
  const { isHindi } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedSeller, setSelectedSeller] = useState(null)
  const [showSellerDetail, setShowSellerDetail] = useState(false)

  useEffect(() => {
    fetchSellers()
  }, [])

  // Sync activeTab with current route
  useEffect(() => {
    const path = location.pathname
    if (path === '/admin') {
      setActiveTab('dashboard')
    } else if (path === '/admin/sellers') {
      setActiveTab('sellers')
    } else if (path === '/admin/analytics') {
      setActiveTab('dashboard') // Analytics is part of dashboard
    }
  }, [location.pathname])

  // Handle tab navigation
  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
    // Navigate to the corresponding route
    switch (tabId) {
      case 'dashboard':
        navigate('/admin')
        break
      case 'sellers':
        navigate('/admin/sellers')
        break
      default:
        navigate('/admin')
    }
  }

  const fetchSellers = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/sellers')
      if (response.data.success) {
        setSellers(response.data.sellers)
      }
    } catch (error) {
      console.error('Error fetching sellers:', error)
      toast.error(isHindi ? 'विक्रेताओं को लोड करने में त्रुटि' : 'Error loading sellers')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifySeller = async (sellerId, action) => {
    try {
      const response = await api.put(`/admin/verify/${sellerId}`, {
        action,
        notes: `${action} by admin`
      })
      
      if (response.data.success) {
        toast.success(isHindi ? 'सत्यापन अपडेट हो गया' : 'Verification updated')
        fetchSellers()
        setShowSellerDetail(false)
      }
    } catch (error) {
      toast.error(isHindi ? 'सत्यापन अपडेट असफल' : 'Failed to update verification')
    }
  }

  const getStatusBadge = (status) => {
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

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seller.phone?.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || seller.verificationStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {sellers.length}
              </p>
              <p className="text-sm text-gray-600">
                {t('admin.dashboard.totalSellers')}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {sellers.filter(s => s.verificationStatus === 'verified').length}
              </p>
              <p className="text-sm text-gray-600">
                {t('admin.dashboard.verifiedSellers')}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {sellers.filter(s => s.verificationStatus === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">
                {t('admin.dashboard.pendingSellers')}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {sellers.filter(s => s.verificationStatus === 'provisional').length}
              </p>
              <p className="text-sm text-gray-600">
                {t('admin.dashboard.provisionalSellers')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {isHindi ? 'हाल की गतिविधि' : 'Recent Activity'}
        </h3>
        <div className="space-y-4">
          {sellers.slice(0, 5).map((seller) => (
            <div key={seller._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {seller.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {seller.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(seller.verificationStatus)}
                <button
                  onClick={() => {
                    setSelectedSeller(seller)
                    setShowSellerDetail(true)
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSellers = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('admin.sellers.search')}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">{t('admin.sellers.status.all')}</option>
              <option value="verified">{t('admin.sellers.status.verified')}</option>
              <option value="provisional">{t('admin.sellers.status.provisional')}</option>
              <option value="pending">{t('admin.sellers.status.pending')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sellers List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.phone')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {isHindi ? 'क्षेत्र' : 'Region'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSellers.map((seller) => (
                <tr key={seller._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {seller.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {seller.email || '-'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {seller.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {seller.region}, {seller.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(seller.verificationStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedSeller(seller)
                        setShowSellerDetail(true)
                      }}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      {t('admin.sellers.actions.view')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderSellerDetail = () => {
    if (!selectedSeller) return null

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('admin.sellers.actions.view')}
          </h2>
          <button
            onClick={() => setShowSellerDetail(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Seller Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isHindi ? 'विक्रेता जानकारी' : 'Seller Information'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.name')}
                </label>
                <p className="text-gray-900">{selectedSeller.name || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.phone')}
                </label>
                <p className="text-gray-900">{selectedSeller.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.email')}
                </label>
                <p className="text-gray-900">{selectedSeller.email || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isHindi ? 'क्षेत्र' : 'Region'}
                </label>
                <p className="text-gray-900">{selectedSeller.region}, {selectedSeller.city}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isHindi ? 'श्रेणियां' : 'Categories'}
                </label>
                <p className="text-gray-900">{selectedSeller.categories?.join(', ') || '-'}</p>
              </div>
            </div>
          </div>

          {/* Verification Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('admin.verification.title')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.verification.status')}
                </label>
                {getStatusBadge(selectedSeller.verificationStatus)}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleVerifySeller(selectedSeller._id, 'approve')}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>{t('admin.verification.approve')}</span>
                </button>
                
                <button
                  onClick={() => handleVerifySeller(selectedSeller._id, 'reject')}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>{t('admin.verification.reject')}</span>
                </button>
                
                <button
                  onClick={() => handleVerifySeller(selectedSeller._id, 'provisional')}
                  className="w-full btn-outline flex items-center justify-center space-x-2"
                >
                  <Clock className="h-4 w-4" />
                  <span>{t('admin.verification.provisional')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', label: isHindi ? 'डैशबोर्ड' : 'Dashboard', icon: BarChart3 },
    { id: 'sellers', label: isHindi ? 'विक्रेता' : 'Sellers', icon: Users }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('admin.dashboard.title')}
          </h1>
          <p className="text-gray-600">
            {isHindi ? 'विक्रेताओं का प्रबंधन और सत्यापन' : 'Manage and verify sellers'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {isHindi ? 'एडमिन' : 'Admin'}
          </p>
          <p className="text-sm font-medium text-gray-900">
            {admin?.username || 'Administrator'}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      {!showSellerDetail && (
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
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
      )}

      {/* Tab Content */}
      <div>
        {showSellerDetail ? renderSellerDetail() : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'sellers' && renderSellers()}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
