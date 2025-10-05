import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { caribbeanLocations } from '../../data/mockData';

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  activeDropdown?: string | null;
  setActiveDropdown?: (dropdown: string | null) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  selectedLocation, 
  onLocationChange,
  activeDropdown,
  setActiveDropdown
}) => {
  const [isOpen, setIsOpen] = useState(false); // Keep local state for mobile version
  
  // Use centralized dropdown state if available, otherwise use local state
  const dropdownOpen = setActiveDropdown ? (activeDropdown === 'location') : isOpen;

  const handleLocationSelect = (location: string) => {
    onLocationChange(location);
    if (setActiveDropdown) {
      setActiveDropdown(null);
    } else {
      setIsOpen(false);
    }
  };

  const handleToggle = () => {
    if (setActiveDropdown) {
      setActiveDropdown(dropdownOpen ? null : 'location');
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <MapPin size={16} className="text-teal-600" />
        <span className="text-gray-700 dark:text-gray-300 max-w-32 truncate">
          {selectedLocation || 'All Caribbean'}
        </span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          <button
            onClick={() => handleLocationSelect('')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            All Caribbean Islands
          </button>
          {caribbeanLocations.map((location) => (
            <button
              key={location}
              onClick={() => handleLocationSelect(location)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
                selectedLocation === location ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300' : ''
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;