import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  FileText, 
  Package, 
  Ruler, 
  Hash, 
  Calendar, 
  Upload, 
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Check,
  X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';
import { RFQData, RFQFormStep } from '../types/rfq';
import { rfqService } from '../services/rfqService';

interface RFQFormProps {
  onSubmit: (rfqData: RFQData) => void;
  onCancel: () => void;
  initialData?: Partial<RFQData>;
}

const RFQForm: React.FC<RFQFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<RFQData>>({
    currency: 'IDR',
    language: language,
    ...initialData
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const productCategories = [
    'UPC Labels',
    'Stickers',
    'Business Cards',
    'Brochures',
    'Calendars',
    'Books',
    'Polybags',
    'Barcode Labels',
    'Hangtags',
    'Size Labels',
    'Care Labels',
    'Custom Ribbons',
    'Other'
  ];

  const formSteps: RFQFormStep[] = [
    {
      step: 1,
      title: language === 'id' ? 'Informasi Kontak' : 'Contact Information',
      field: 'userName',
      type: 'text',
      required: true,
      validation: (value) => !value ? (language === 'id' ? 'Nama wajib diisi' : 'Name is required') : null
    },
    {
      step: 2,
      title: language === 'id' ? 'Email Anda' : 'Your Email',
      field: 'userEmail',
      type: 'email',
      required: true,
      validation: (value) => {
        if (!value) return language === 'id' ? 'Email wajib diisi' : 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return language === 'id' ? 'Format email tidak valid' : 'Invalid email format';
        }
        return null;
      }
    },
    {
      step: 3,
      title: language === 'id' ? 'Nama Proyek' : 'Project Name',
      field: 'projectName',
      type: 'text',
      required: true,
      validation: (value) => !value ? (language === 'id' ? 'Nama proyek wajib diisi' : 'Project name is required') : null
    },
    {
      step: 4,
      title: language === 'id' ? 'Kategori Produk' : 'Product Category',
      field: 'productCategory',
      type: 'select',
      required: false,
      options: productCategories
    },
    {
      step: 5,
      title: language === 'id' ? 'Spesifikasi Ukuran' : 'Size Specifications',
      field: 'sizeSpecifications',
      type: 'text',
      required: true,
      validation: (value) => !value ? (language === 'id' ? 'Spesifikasi ukuran wajib diisi' : 'Size specifications are required') : null
    },
    {
      step: 6,
      title: language === 'id' ? 'Jumlah/Kuantitas' : 'Quantity',
      field: 'quantity',
      type: 'number',
      required: true,
      validation: (value) => {
        if (!value) return language === 'id' ? 'Kuantitas wajib diisi' : 'Quantity is required';
        if (value <= 0) return language === 'id' ? 'Kuantitas harus lebih dari 0' : 'Quantity must be greater than 0';
        return null;
      }
    },
    {
      step: 7,
      title: language === 'id' ? 'Tanggal Deadline' : 'Deadline Date',
      field: 'deadline',
      type: 'date',
      required: false
    },
    {
      step: 8,
      title: language === 'id' ? 'Upload File Desain' : 'Upload Design Files',
      field: 'designFileUrls',
      type: 'file',
      required: false
    },
    {
      step: 9,
      title: language === 'id' ? 'Catatan Tambahan' : 'Additional Notes',
      field: 'additionalNotes',
      type: 'textarea',
      required: false
    }
  ];

  const currentStepData = formSteps[currentStep];

  const handleInputChange = (field: keyof RFQData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    const validFiles = newFiles.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/webp',
        'application/pdf',
        'application/illustrator', // .ai files
        'application/postscript', // .eps files
        'image/vnd.adobe.photoshop' // .psd files
      ];
      
      return file.size <= maxSize && (
        allowedTypes.includes(file.type) || 
        file.name.toLowerCase().endsWith('.ai') ||
        file.name.toLowerCase().endsWith('.eps') ||
        file.name.toLowerCase().endsWith('.psd')
      );
    });
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateCurrentStep = (): boolean => {
    const step = currentStepData;
    const value = formData[step.field];
    
    if (step.required && !value) {
      setErrors({ [step.field]: step.validation?.(value) || 'This field is required' });
      return false;
    }
    
    if (value && step.validation) {
      const error = step.validation(value);
      if (error) {
        setErrors({ [step.field]: error });
        return false;
      }
    }
    
    setErrors({});
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < formSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    
    try {
      // Upload design files if any
      let designFileUrls: string[] = [];
      if (uploadedFiles.length > 0) {
        designFileUrls = await rfqService.uploadDesignFiles(uploadedFiles);
      }
      
      const finalData: RFQData = {
        userName: formData.userName!,
        userEmail: formData.userEmail!,
        projectName: formData.projectName!,
        productCategory: formData.productCategory,
        sizeSpecifications: formData.sizeSpecifications!,
        quantity: formData.quantity!,
        deadline: formData.deadline,
        designFileUrls,
        additionalNotes: formData.additionalNotes,
        estimatedCostMin: formData.estimatedCostMin,
        estimatedCostMax: formData.estimatedCostMax,
        currency: formData.currency || 'IDR',
        language: formData.language || language
      };
      
      onSubmit(finalData);
    } catch (error: any) {
      console.error('Error submitting RFQ:', error);
      setErrors({ submit: error.message || 'Failed to submit RFQ' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    const step = currentStepData;
    const value = formData[step.field];
    const error = errors[step.field];

    switch (step.type) {
      case 'text':
      case 'email':
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              {step.field === 'userName' && <User className="h-6 w-6 text-green-500 mr-2" />}
              {step.field === 'userEmail' && <Mail className="h-6 w-6 text-green-500 mr-2" />}
              {step.field === 'projectName' && <FileText className="h-6 w-6 text-green-500 mr-2" />}
              {step.field === 'sizeSpecifications' && <Ruler className="h-6 w-6 text-green-500 mr-2" />}
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{step.title}</h3>
            </div>
            <input
              type={step.type}
              value={value || ''}
              onChange={(e) => handleInputChange(step.field, e.target.value)}
              className={`w-full p-4 border rounded-lg text-lg ${
                error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-800 dark:text-white`}
              placeholder={
                step.field === 'userName' ? (language === 'id' ? 'Masukkan nama lengkap Anda' : 'Enter your full name') :
                step.field === 'userEmail' ? (language === 'id' ? 'Masukkan alamat email Anda' : 'Enter your email address') :
                step.field === 'projectName' ? (language === 'id' ? 'Nama proyek atau produk' : 'Project or product name') :
                step.field === 'sizeSpecifications' ? (language === 'id' ? 'Contoh: 10cm x 15cm, A4, Custom' : 'Example: 10cm x 15cm, A4, Custom') :
                ''
              }
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Hash className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{step.title}</h3>
            </div>
            <input
              type="number"
              value={value || ''}
              onChange={(e) => handleInputChange(step.field, parseInt(e.target.value))}
              className={`w-full p-4 border rounded-lg text-lg ${
                error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-800 dark:text-white`}
              placeholder={language === 'id' ? 'Masukkan jumlah yang dibutuhkan' : 'Enter required quantity'}
              min="1"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{step.title}</h3>
            </div>
            <input
              type="date"
              value={value || ''}
              onChange={(e) => handleInputChange(step.field, e.target.value)}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg text-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              min={new Date().toISOString().split('T')[0]}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {language === 'id' ? 'Opsional - Kapan Anda membutuhkan proyek ini selesai?' : 'Optional - When do you need this project completed?'}
            </p>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Package className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{step.title}</h3>
            </div>
            <select
              value={value || ''}
              onChange={(e) => handleInputChange(step.field, e.target.value)}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg text-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="">{language === 'id' ? 'Pilih kategori produk' : 'Select product category'}</option>
              {step.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );

      case 'file':
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <Upload className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{step.title}</h3>
            </div>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp,.pdf,.ai,.eps,.psd"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  {language === 'id' ? 'Klik untuk upload file desain' : 'Click to upload design files'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'id' ? 'JPG, PNG, PDF, AI, EPS, PSD (Max 10MB per file)' : 'JPG, PNG, PDF, AI, EPS, PSD (Max 10MB per file)'}
                </p>
              </label>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800 dark:text-white">
                  {language === 'id' ? 'File yang diupload:' : 'Uploaded files:'}
                </h4>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{step.title}</h3>
            </div>
            <textarea
              value={value || ''}
              onChange={(e) => handleInputChange(step.field, e.target.value)}
              rows={4}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg text-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none"
              placeholder={language === 'id' ? 'Tambahkan informasi khusus atau permintaan lainnya...' : 'Add any special requirements or additional information...'}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {language === 'id' ? 'Request for Quote (RFQ)' : 'Request for Quote (RFQ)'}
            </h2>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>{language === 'id' ? 'Langkah' : 'Step'} {currentStep + 1} {language === 'id' ? 'dari' : 'of'} {formSteps.length}</span>
              <span>{Math.round(((currentStep + 1) / formSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / formSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
          
          {errors.submit && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-300">{errors.submit}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === 'id' ? 'Sebelumnya' : 'Previous'}
          </button>
          
          {currentStep < formSteps.length - 1 ? (
            <button
              onClick={nextStep}
              className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              {language === 'id' ? 'Selanjutnya' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {language === 'id' ? 'Mengirim...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {language === 'id' ? 'Kirim RFQ' : 'Submit RFQ'}
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RFQForm;
