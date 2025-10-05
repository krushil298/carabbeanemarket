'use client';

import React from 'react';
import { Info } from 'lucide-react';

const Legend: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex items-center mb-3">
        <Info className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Legend</h3>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
          <span className="text-gray-700 dark:text-gray-300">Historical Events</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
          <span className="text-gray-700 dark:text-gray-300">Cultural Events</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center mr-2 font-bold">
            2
          </div>
          <span className="text-gray-700 dark:text-gray-300">Multiple Events</span>
        </div>
      </div>
    </div>
  );
};

export default Legend;