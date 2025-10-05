import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency, currencies, getDefaultCurrency, convertPrice, formatCurrency } from '../data/currencies';
import { useAuth } from './AuthContext';

interface CurrencyContextType {
  currentCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (price: number, fromCurrency: string) => number;
  formatPrice: (price: number, currency?: string) => string;
  availableCurrencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencies[0]);

  useEffect(() => {
    if (currentUser?.location) {
      const defaultCurrency = getDefaultCurrency(currentUser.location);
      setCurrentCurrency(defaultCurrency);
    }
  }, [currentUser?.location]);

  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      const currency = currencies.find(c => c.code === savedCurrency);
      if (currency) {
        setCurrentCurrency(currency);
      }
    }
  }, []);

  const setCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
    localStorage.setItem('selectedCurrency', currency.code);
  };

  const convertPriceValue = (price: number, fromCurrency: string): number => {
    return convertPrice(price, fromCurrency, currentCurrency.code);
  };

  const formatPriceValue = (price: number, currency?: string): string => {
    const currencyCode = currency || currentCurrency.code;
    return formatCurrency(price, currencyCode);
  };

  return (
    <CurrencyContext.Provider value={{
      currentCurrency,
      setCurrency,
      convertPrice: convertPriceValue,
      formatPrice: formatPriceValue,
      availableCurrencies: currencies,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};