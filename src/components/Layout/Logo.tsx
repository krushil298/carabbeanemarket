import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <ShoppingBag className={`${sizeClasses[size]} text-teal-600`} />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-coral-500 rounded-full"></div>
      </div>
      {showText && (
        <span className={`ml-2 mr-8 ${textSizeClasses[size]} font-bold text-gray-800 dark:text-white`}>
          Caribbean eMarket
        </span>
      )}
    </div>
  );
};

export default Logo;