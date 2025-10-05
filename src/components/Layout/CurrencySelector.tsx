import React, { useState } from 'react';
import { DollarSign, ChevronDown } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

interface CurrencySelectorProps {
  activeDropdown: string | null;
  setActiveDropdown: (dropdown: string | null) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  activeDropdown, 
  setActiveDropdown 
}) => {
  const { currentCurrency, setCurrency, availableCurrencies } = useCurrency();
  const isOpen = activeDropdown === 'currency';

  return (
    <div className="relative">
      <button
        onClick={() => setActiveDropdown(isOpen ? null : 'currency')}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors"
      >
        <DollarSign size={16} />
        <span className="text-sm">{currentCurrency.code}</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {availableCurrencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => {
                setCurrency(currency);
                setActiveDropdown(null);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
                currentCurrency.code === currency.code ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{currency.symbol} {currency.code}</div>
                  <div className="text-xs text-gray-500">{currency.name}</div>
                </div>
                {currency.countries.length <= 3 && (
                  <div className="text-xs text-gray-400">
                    {currency.countries.join(', ')}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;