export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Exchange rate to USD (1 USD = rate in local currency)
  countries: string[];
}

export const currencies: Currency[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rate: 1.0,
    countries: ['US Virgin Islands', 'Puerto Rico', 'British Virgin Islands', 'Turks and Caicos']
  },
  {
    code: 'JMD',
    name: 'Jamaican Dollar',
    symbol: 'J$',
    rate: 155.0,
    countries: ['Jamaica']
  },
  {
    code: 'BBD',
    name: 'Barbadian Dollar',
    symbol: 'Bds$',
    rate: 2.0,
    countries: ['Barbados']
  },
  {
    code: 'TTD',
    name: 'Trinidad and Tobago Dollar',
    symbol: 'TT$',
    rate: 6.8,
    countries: ['Trinidad and Tobago']
  },
  {
    code: 'BSD',
    name: 'Bahamian Dollar',
    symbol: 'B$',
    rate: 1.0,
    countries: ['Bahamas']
  },
  {
    code: 'XCD',
    name: 'East Caribbean Dollar',
    symbol: 'EC$',
    rate: 2.7,
    countries: [
      'Antigua and Barbuda',
      'Dominica',
      'Grenada',
      'Saint Kitts and Nevis',
      'Saint Lucia',
      'Saint Vincent and the Grenadines',
      'Anguilla',
      'Montserrat'
    ]
  },
  {
    code: 'DOP',
    name: 'Dominican Peso',
    symbol: 'RD$',
    rate: 58.0,
    countries: ['Dominican Republic']
  },
  {
    code: 'HTG',
    name: 'Haitian Gourde',
    symbol: 'G',
    rate: 135.0,
    countries: ['Haiti']
  },
  {
    code: 'CUP',
    name: 'Cuban Peso',
    symbol: '₱',
    rate: 24.0,
    countries: ['Cuba']
  },
  {
    code: 'AWG',
    name: 'Aruban Florin',
    symbol: 'ƒ',
    rate: 1.8,
    countries: ['Aruba']
  },
  {
    code: 'ANG',
    name: 'Netherlands Antillean Guilder',
    symbol: 'ƒ',
    rate: 1.8,
    countries: ['Curaçao', 'Sint Maarten']
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rate: 0.92,
    countries: ['Guadeloupe', 'Martinique']
  },
  {
    code: 'GYD',
    name: 'Guyanese Dollar',
    symbol: 'GY$',
    rate: 210.0,
    countries: ['Guyana']
  },
  {
    code: 'SRD',
    name: 'Surinamese Dollar',
    symbol: 'Sr$',
    rate: 36.0,
    countries: ['Suriname']
  },
  {
    code: 'BZD',
    name: 'Belize Dollar',
    symbol: 'BZ$',
    rate: 2.0,
    countries: ['Belize']
  },
  {
    code: 'KYD',
    name: 'Cayman Islands Dollar',
    symbol: 'CI$',
    rate: 0.83,
    countries: ['Cayman Islands']
  }
];

export const getDefaultCurrency = (location: string): Currency => {
  const currency = currencies.find(c => c.countries.includes(location));
  return currency || currencies[0]; // Default to USD if not found
};

export const convertPrice = (price: number, fromCurrency: string, toCurrency: string): number => {
  const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1;
  const toRate = currencies.find(c => c.code === toCurrency)?.rate || 1;
  
  // Convert to USD first, then to target currency
  const usdPrice = price / fromRate;
  return usdPrice * toRate;
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = currencies.find(c => c.code === currencyCode);
  if (!currency) return `$${amount.toFixed(2)}`;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace(currencyCode, currency.symbol);
};