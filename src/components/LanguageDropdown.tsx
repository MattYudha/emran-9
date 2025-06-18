import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

interface LanguageDropdownProps {
  onClose: () => void;
  isMobile?: boolean;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ onClose, isMobile = false }) => {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const languages = [
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' },
    { code: 'ar', name: 'العربية' }
  ];

  const handleLanguageChange = (code: string) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div 
      className={`
        ${isMobile ? 'relative w-full' : 'absolute right-0 mt-2 w-48'}
        bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 py-1 overflow-hidden
      `}
    >
      <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
        {t.selectLanguage}
      </div>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`
            flex items-center w-full px-4 py-2 text-sm text-left
            ${
              language === lang.code
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
        >
          {lang.name}
          {language === lang.code && (
            <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
};

export default LanguageDropdown;
