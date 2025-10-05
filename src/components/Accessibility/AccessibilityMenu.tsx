import React from 'react';
import { Settings, Eye, Type, Palette, Zap } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

const AccessibilityMenu: React.FC = () => {
  const { settings, updateSettings } = useAccessibility();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-80">
      <div className="flex items-center mb-4">
        <Settings size={20} className="mr-2 text-teal-600" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Accessibility Settings
        </h3>
      </div>

      <div className="space-y-4">
        {/* Color Blind Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Palette size={16} className="mr-2 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">Color Blind Mode</span>
          </div>
          <button
            onClick={() => updateSettings({ colorBlindMode: !settings.colorBlindMode })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.colorBlindMode ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.colorBlindMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Eye size={16} className="mr-2 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">High Contrast</span>
          </div>
          <button
            onClick={() => updateSettings({ highContrast: !settings.highContrast })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.highContrast ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.highContrast ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Large Text */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Type size={16} className="mr-2 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">Large Text</span>
          </div>
          <button
            onClick={() => updateSettings({ largeText: !settings.largeText })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.largeText ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.largeText ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap size={16} className="mr-2 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">Reduced Motion</span>
          </div>
          <button
            onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.reducedMotion ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
        These settings help make the site more accessible for users with different needs.
      </div>
    </div>
  );
};

export default AccessibilityMenu;