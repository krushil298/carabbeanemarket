'use client';

import React from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { getAvailableCountries } from '@/lib/events';

interface CountrySelectProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ selectedCountry, onCountryChange }) => {
  const countries = getAvailableCountries();
  const selectedCountryName = countries.find(c => c.code === selectedCountry)?.name || 'Select Country';

  return (
    <div className="relative">
      <label htmlFor="country-select" className="sr-only">Select Country</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-4 h-4" />
        <select
          id="country-select"
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-10 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-48"
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
      </div>
    </div>
  );
};

export default CountrySelect;