import { useState, useEffect } from 'react'
import { 
  userProfileStorage, 
  productsStorage, 
  supportStorage, 
  referralsStorage,
  notificationsStorage,
  onboardingStorage 
} from '../utils/storage'
import { Eye, EyeOff, Download, Trash2 } from 'lucide-react'

const DataViewer = () => {
  const [showData, setShowData] = useState(false)
  const [data, setData] = useState({})

  const loadAllData = () => {
    setData({
      userProfile: userProfileStorage.getProfile(),
      products: productsStorage.getProducts(),
      supportTickets: supportStorage.getTickets(),
      referrals: referralsStorage.getReferrals(),
      notifications: notificationsStorage.getNotifications(),
      onboardingData: onboardingStorage.getOnboardingData()
    })
  }

  useEffect(() => {
    if (showData) {
      loadAllData()
    }
  }, [showData])

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `udyam-union-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all stored data? This action cannot be undone.')) {
      userProfileStorage.clearProfile()
      productsStorage.clearProducts()
      supportStorage.clearTickets()
      referralsStorage.clearReferrals()
      notificationsStorage.clearNotifications()
      onboardingStorage.clearOnboardingData()
      loadAllData()
      alert('All data cleared successfully!')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Local Storage Data
          </h3>
          <button
            onClick={() => setShowData(!showData)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            {showData ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {showData && (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <button
                onClick={exportData}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button
                onClick={clearAllData}
                className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto text-xs">
              <pre className="whitespace-pre-wrap text-gray-600">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>

            <div className="text-xs text-gray-500">
              <p><strong>User Profile:</strong> {data.userProfile?.name || 'Not set'}</p>
              <p><strong>Products:</strong> {data.products?.length || 0} items</p>
              <p><strong>Support Tickets:</strong> {data.supportTickets?.length || 0} tickets</p>
              <p><strong>Notifications:</strong> {data.notifications?.length || 0} items</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DataViewer
