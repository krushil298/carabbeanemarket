import React from 'react';

interface GoogleAdsProps {
  type: 'sidebar' | 'inline';
  className?: string;
}

const GoogleAds: React.FC<GoogleAdsProps> = ({ type, className = '' }) => {
  // In a real implementation, this would contain actual Google AdSense code
  const adContent = type === 'sidebar' ? (
    <div className={`bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 text-center ${className}`}>
      <div className="text-xs text-gray-500 mb-2">Advertisement</div>
      <div className="bg-white dark:bg-gray-600 rounded-md p-6 mb-3">
        <div className="w-full h-32 bg-gradient-to-br from-teal-100 to-coral-100 rounded flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-teal-700">Caribbean Business</div>
            <div className="text-sm text-gray-600">Advertise Here</div>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-400">
        Reach Caribbean customers
      </div>
    </div>
  ) : (
    <div className={`bg-gradient-to-r from-yellow-50 to-coral-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 my-6 ${className}`}>
      <div className="text-xs text-gray-500 mb-3 text-center">Advertisement</div>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
            Grow Your Caribbean Business
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Reach thousands of potential customers across the Caribbean islands
          </p>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
            Learn More
          </button>
        </div>
        <div className="w-24 h-24 bg-gradient-to-br from-teal-200 to-coral-200 rounded-lg flex items-center justify-center ml-4">
          <div className="text-center">
            <div className="text-xs font-bold text-teal-700">Your Ad</div>
            <div className="text-xs text-gray-600">Here</div>
          </div>
        </div>
      </div>
    </div>
  );

  return adContent;
};

export default GoogleAds;