import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { supportedLanguages } from '../../data/languages';

interface LanguageSelectorProps {
  activeDropdown: string | null;
  setActiveDropdown: (dropdown: string | null) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  activeDropdown, 
  setActiveDropdown 
}) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const isOpen = activeDropdown === 'language';

  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setActiveDropdown(isOpen ? null : 'language')}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors"
      >
        <Globe size={16} />
        <span className="text-sm">{currentLang?.nativeName}</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50">
          {supportedLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                setLanguage(language.code);
                setActiveDropdown(null);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
                currentLanguage === language.code ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300' : ''
              }`}
            >
              <div>
                <div className="font-medium">{language.nativeName}</div>
                <div className="text-xs text-gray-500">{language.name}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;