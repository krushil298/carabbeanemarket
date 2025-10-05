'use client';

import React from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

interface YearPickerProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

const YearPicker: React.FC<YearPickerProps> = ({ selectedYear, onYearChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  return (
    <div className="relative">
      <label htmlFor="year-select" className="sr-only">Select Year</label>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-4 h-4" />
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-10 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-32"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
      </div>
    </div>
  );
};

export default YearPicker;