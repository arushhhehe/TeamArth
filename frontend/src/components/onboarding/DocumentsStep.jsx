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
  Download
} from 'lucide-react'
import { validateFile, validateFiles } from '../../utils/validators'

const DocumentsStep = ({ formData, updateFormData, isHindi }) => {
  const { t } = useTranslation()
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  const documentTypes = [
    { value: 'PAN', label: 'PAN Card', description: isHindi ? 'पैन कार्ड' : 'PAN Card' },
    { value: 'Aadhaar', label: 'Aadhaar Card', description: isHindi ? 'आधार कार्ड' : 'Aadhaar Card' },
    { value: 'Voter ID', label: 'Voter ID', description: isHindi ? 'मतदाता पहचान पत्र' : 'Voter ID' },
    { value: 'Driving License', label: 'Driving License', description: isHindi ? 'ड्राइविंग लाइसेंस' : 'Driving License' },
    { value: 'Ration Card', label: 'Ration Card', description: isHindi ? 'राशन कार्ड' : 'Ration Card' }
  ]

  const handleDocumentTypeChange = (type) => {
    updateFormData({ documentType: type })
    if (errors.documentType) {
      setErrors(prev => ({ ...prev, documentType: null }))
    }
  }

  const handleHasDocumentsChange = (hasDocuments) => {
    updateFormData({ 
      hasDocuments,
      documentType: hasDocuments ? formData.documentType : '',
      documents: hasDocuments ? formData.documents : []
    })
  }

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
      setErrors({ documents: 'Please select at least one file' })
      return
    }

    const validation = validateFiles(files, 3, 5 * 1024 * 1024) // 3 files, 5MB each
    
    if (!validation.isValid) {
      setErrors({ documents: validation.errors.join(', ') })
      return
    }

    // Simulate file upload (in real app, upload to server)
    const uploadedFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      file: file
    }))

    updateFormData({ 
      documents: [...(formData.documents || []), ...uploadedFiles]
    })
    
    // Clear any existing document errors
    if (errors.documents) {
      setErrors(prev => ({ ...prev, documents: null }))
    }
  }

  const removeFile = (fileId) => {
    const updatedFiles = formData.documents?.filter(file => file.id !== fileId) || []
    updateFormData({ documents: updatedFiles })
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
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('onboarding.documents.title')}
        </h2>
        <p className="text-gray-600">
          {t('onboarding.documents.subtitle')}
        </p>
      </div>

      <div className="space-y-6">
        {/* Document Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            {t('onboarding.documents.documentTypeLabel')} *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documentTypes.map(type => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleDocumentTypeChange(type.value)}
                className={`p-4 text-left rounded-lg border transition-colors duration-200 ${
                  formData.documentType === type.value
                    ? 'bg-primary-100 border-primary-500 text-primary-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{type.label}</div>
                <div className="text-sm text-gray-500">{type.description}</div>
              </button>
            ))}
          </div>
          {errors.documentType && (
            <p className="mt-2 text-sm text-red-600">{errors.documentType}</p>
          )}
        </div>

        {/* No Documents Option */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!formData.hasDocuments}
              onChange={(e) => handleHasDocumentsChange(!e.target.checked)}
              className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <div>
              <div className="text-sm font-medium text-yellow-900">
                {t('onboarding.documents.noDocumentsLabel')}
              </div>
              <div className="text-sm text-yellow-700 mt-1">
                {isHindi 
                  ? 'यदि आपके पास ये दस्तावेज नहीं हैं, तो हम वैकल्पिक सत्यापन प्रक्रिया प्रदान करते हैं।'
                  : 'If you don\'t have these documents, we provide an alternative verification process.'
                }
              </div>
            </div>
          </label>
        </div>

        {/* File Upload Section */}
        {formData.hasDocuments && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('onboarding.documents.uploadLabel')} *
            </label>
            <p className="text-sm text-gray-600 mb-4">
              {t('onboarding.documents.uploadDescription')}
            </p>

            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                dragActive
                  ? 'border-primary-500 bg-primary-50'
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

            {errors.documents && (
              <p className="mt-2 text-sm text-red-600">{errors.documents}</p>
            )}
          </div>
        )}

        {/* Uploaded Files */}
        {formData.documents && formData.documents.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              {isHindi ? 'अपलोड की गई फाइलें' : 'Uploaded Files'}
            </h4>
            <div className="space-y-2">
              {formData.documents.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                {isHindi ? 'महत्वपूर्ण निर्देश' : 'Important Instructions'}
              </h4>
              <ul className="text-sm text-blue-700 space-y-1 space-y-1">
                <li>• {isHindi ? 'दस्तावेज स्पष्ट और पढ़ने योग्य होने चाहिए' : 'Documents should be clear and readable'}</li>
                <li>• {isHindi ? 'सभी कोनों दिखाई देने चाहिए' : 'All corners should be visible'}</li>
                <li>• {isHindi ? 'अच्छी रोशनी में फोटो लें' : 'Take photos in good lighting'}</li>
                <li>• {isHindi ? 'PDF या JPG/PNG फॉर्मेट में अपलोड करें' : 'Upload in PDF or JPG/PNG format'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            {isHindi ? 'सत्यापन स्थिति' : 'Verification Status'}
          </h4>
          <div className="flex items-center space-x-2">
            {formData.hasDocuments ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-700">
                  {isHindi ? 'दस्तावेज सत्यापन के लिए तैयार' : 'Ready for document verification'}
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-yellow-700">
                  {isHindi ? 'वैकल्पिक सत्यापन प्रक्रिया' : 'Alternative verification process'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentsStep
