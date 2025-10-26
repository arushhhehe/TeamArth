import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Upload, 
  FileText, 
  Image, 
  X, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Building,
  Users,
  Camera
} from 'lucide-react'
import { validateFile, validateFiles } from '../../utils/validators'

const AlternateDocumentsStep = ({ formData, updateFormData, isHindi }) => {
  const { t } = useTranslation()
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  const alternateDocumentTypes = [
    { 
      value: 'Shop License', 
      label: isHindi ? 'दुकान लाइसेंस' : 'Shop License',
      description: isHindi ? 'व्यावसायिक लाइसेंस या परमिट' : 'Business license or permit',
      icon: Building
    },
    { 
      value: 'Community Letter', 
      label: isHindi ? 'समुदाय पत्र' : 'Community Letter',
      description: isHindi ? 'समुदाय या स्थानीय अधिकारी से पत्र' : 'Letter from community or local authority',
      icon: Users
    },
    { 
      value: 'Work Photo', 
      label: isHindi ? 'कार्य फोटो' : 'Work Photo',
      description: isHindi ? 'आपके कार्यस्थल की तस्वीरें' : 'Photos of your workplace',
      icon: Camera
    },
    { 
      value: 'Other', 
      label: isHindi ? 'अन्य' : 'Other',
      description: isHindi ? 'अन्य सत्यापन दस्तावेज' : 'Other verification documents',
      icon: FileText
    }
  ]

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }

  const handleFiles = (files) => {
    // Check if files are provided
    if (!files || files.length === 0) {
      setErrors({ alternateDocuments: 'Please select at least one file' })
      return
    }

    const validation = validateFiles(files, 5, 5 * 1024 * 1024) // 5 files, 5MB each
    
    if (!validation.isValid) {
      setErrors({ alternateDocuments: validation.errors.join(', ') })
      return
    }

    // Simulate file upload (in real app, upload to server)
    const uploadedFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      file: file,
      documentType: 'Other', // Default type, can be changed
      description: ''
    }))

    updateFormData({ 
      alternateDocuments: [...(formData.alternateDocuments || []), ...uploadedFiles]
    })
    
    if (errors.alternateDocuments) {
      setErrors(prev => ({ ...prev, alternateDocuments: null }))
    }
  }

  const removeFile = (fileId) => {
    const updatedFiles = formData.alternateDocuments?.filter(file => file.id !== fileId) || []
    updateFormData({ alternateDocuments: updatedFiles })
  }

  const updateFileType = (fileId, type) => {
    const updatedFiles = formData.alternateDocuments?.map(file => 
      file.id === fileId ? { ...file, documentType: type } : file
    ) || []
    updateFormData({ alternateDocuments: updatedFiles })
  }

  const updateFileDescription = (fileId, description) => {
    const updatedFiles = formData.alternateDocuments?.map(file => 
      file.id === fileId ? { ...file, description } : file
    ) || []
    updateFormData({ alternateDocuments: updatedFiles })
  }

  const openFileInput = () => {
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('onboarding.documents.alternateDocuments')}
        </h2>
        <p className="text-gray-600">
          {t('onboarding.documents.alternateDescription')}
        </p>
      </div>

      <div className="space-y-6">
        {/* Document Types Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">
            {isHindi ? 'स्वीकार्य वैकल्पिक दस्तावेज' : 'Accepted Alternate Documents'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alternateDocumentTypes.map(type => {
              const Icon = type.icon
              return (
                <div key={type.value} className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                  <Icon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{type.label}</div>
                    <div className="text-xs text-gray-600">{type.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* File Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isHindi ? 'वैकल्पिक दस्तावेज अपलोड करें' : 'Upload Alternate Documents'} *
          </label>
          <p className="text-sm text-gray-600 mb-4">
            {isHindi 
              ? 'कृपया अपने व्यवसाय की पहचान स्थापित करने के लिए वैकल्पिक दस्तावेज अपलोड करें'
              : 'Please upload alternate documents to establish your business identity'
            }
          </p>

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              dragActive
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileInput}
              className="hidden"
            />
            
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isHindi ? 'फाइलें अपलोड करें' : 'Upload Files'}
                </p>
                <p className="text-sm text-gray-600">
                  {isHindi 
                    ? 'फाइलों को यहां खींचें या क्लिक करके चुनें'
                    : 'Drag files here or click to select'
                  }
                </p>
              </div>
              <button
                type="button"
                onClick={openFileInput}
                className="btn-primary"
              >
                {isHindi ? 'फाइलें चुनें' : 'Choose Files'}
              </button>
              <p className="text-xs text-gray-500">
                {isHindi 
                  ? 'PDF, JPG, PNG (अधिकतम 5MB प्रति फाइल)'
                  : 'PDF, JPG, PNG (Max 5MB per file)'
                }
              </p>
            </div>
          </div>

          {errors.alternateDocuments && (
            <p className="mt-2 text-sm text-red-600">{errors.alternateDocuments}</p>
          )}
        </div>

        {/* Uploaded Files */}
        {formData.alternateDocuments && formData.alternateDocuments.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              {isHindi ? 'अपलोड की गई फाइलें' : 'Uploaded Files'}
            </h4>
            <div className="space-y-4">
              {formData.alternateDocuments.map((file) => (
                <div key={file.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {file.type.startsWith('image/') ? (
                        <Image className="h-5 w-5 text-blue-600" />
                      ) : (
                        <FileText className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => window.open(file.url, '_blank')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title={isHindi ? 'देखें' : 'View'}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                        title={isHindi ? 'हटाएं' : 'Remove'}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {isHindi ? 'दस्तावेज प्रकार' : 'Document Type'}
                      </label>
                      <select
                        value={file.documentType}
                        onChange={(e) => updateFileType(file.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {alternateDocumentTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {isHindi ? 'विवरण (वैकल्पिक)' : 'Description (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={file.description}
                        onChange={(e) => updateFileDescription(file.id, e.target.value)}
                        placeholder={isHindi ? 'दस्तावेज के बारे में जानकारी' : 'Information about the document'}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Provisional Membership Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                {isHindi ? 'अस्थायी सदस्यता' : 'Provisional Membership'}
              </h4>
              <p className="text-sm text-blue-700">
                {isHindi 
                  ? 'वैकल्पिक दस्तावेजों के साथ, आपको अस्थायी सदस्यता मिलेगी जो 90 दिनों के लिए वैध होगी। इस दौरान आप सभी यूनियन लाभों का उपयोग कर सकते हैं।'
                  : 'With alternate documents, you will receive provisional membership valid for 90 days. During this time, you can use all union benefits.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {isHindi ? 'अपलोड निर्देश' : 'Upload Instructions'}
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• {isHindi ? 'दस्तावेज स्पष्ट और पढ़ने योग्य होने चाहिए' : 'Documents should be clear and readable'}</li>
            <li>• {isHindi ? 'अच्छी रोशनी में फोटो लें' : 'Take photos in good lighting'}</li>
            <li>• {isHindi ? 'सभी कोनों दिखाई देने चाहिए' : 'All corners should be visible'}</li>
            <li>• {isHindi ? 'PDF या JPG/PNG फॉर्मेट में अपलोड करें' : 'Upload in PDF or JPG/PNG format'}</li>
            <li>• {isHindi ? 'प्रत्येक दस्तावेज के लिए सही प्रकार चुनें' : 'Select the correct type for each document'}</li>
          </ul>
        </div>

        {/* Summary */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <h4 className="text-sm font-medium text-green-900">
                {isHindi ? 'अस्थायी सदस्यता स्थिति' : 'Provisional Membership Status'}
              </h4>
              <p className="text-sm text-green-700">
                {isHindi 
                  ? 'आपकी अस्थायी सदस्यता 90 दिनों के लिए वैध होगी। इस दौरान आप सभी यूनियन लाभों का उपयोग कर सकते हैं।'
                  : 'Your provisional membership will be valid for 90 days. During this time, you can use all union benefits.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlternateDocumentsStep
