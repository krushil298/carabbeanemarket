import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Car, Wrench, Home, Calendar, Smartphone, Sofa, Shirt, Gem, Music, Briefcase, Heart as PetIcon, Hammer, Building, TrendingUp, Star, Shield, Phone, Mail, MessageCircle } from 'lucide-react';
import { Product } from '../../types';
import { useProducts } from '../../context/ProductContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';
import { getMockSellerData } from '../../data/mockData';

interface ProductCardProps {
  product: Product;
  showSellerContact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showSellerContact = false }) => {
  const { toggleFavorite, favoriteProducts } = useProducts();
  const { convertPrice, formatPrice } = useCurrency();
  const { isAuthenticated } = useAuth();
  
  const isFavorite = favoriteProducts.some(p => p.id === product.id);
  const isRealEstate = product.category.startsWith('Real Estate');
  const isCar = product.category === 'Automotive - Cars';
  const isCarPart = product.category === 'Automotive - Parts';
  
  // Convert price to user's preferred currency
  const displayPrice = convertPrice(product.price, product.currency);
  const displayNegotiablePrice = product.negotiablePrice 
    ? convertPrice(product.negotiablePrice, product.currency)
    : null;

  // Get seller information
  const seller = getMockSellerData(product.userId);
  
  const getCategoryIcon = () => {
    const iconClass = "w-4 h-4 mr-1";
    
    switch (product.category) {
      case 'Automotive - Cars':
      case 'Automotive - Motorcycles':
        return <Car className={iconClass} />;
      case 'Automotive - Parts':
      case 'Car Accessories':
        return <Wrench className={iconClass} />;
      case 'Real Estate - Sale':
      case 'Real Estate - Rent':
      case 'Mobile Home':
        return <Home className={iconClass} />;
      case 'Electronics':
      case 'Computers':
        return <Smartphone className={iconClass} />;
      case 'Furniture':
        return <Sofa className={iconClass} />;
      case 'Apparel':
        return <Shirt className={iconClass} />;
      case 'Jewelry':
        return <Gem className={iconClass} />;
      case 'Musical Instruments':
        return <Music className={iconClass} />;
      case 'Office Supplies':
        return <Briefcase className={iconClass} />;
      case 'Pet Supplies':
        return <PetIcon className={iconClass} />;
      case 'Tools':
      case 'Equipment':
        return <Hammer className={iconClass} />;
      case 'Building Materials':
        return <Building className={iconClass} />;
      default:
        return <div className="w-4 h-4 bg-teal-600 rounded mr-1"></div>;
    }
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl card-hover relative ${
      product.sold ? 'opacity-60' : ''
    }`}>
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-2">
        {product.trending && (
          <div className="trending-badge text-yellow-800 px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </div>
        )}
        {product.localGem && (
          <div className="local-gem-badge text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <Star className="w-3 h-3 mr-1" />
            Local Gem
          </div>
        )}
      </div>

      <Link to={`/products/${product.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.title} 
            className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
              product.sold ? 'filter grayscale' : ''
            }`}
          />
          {product.sold && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="bg-red-600 text-white px-6 py-2 text-lg font-bold transform -rotate-12 shadow-lg">
                SOLD
              </div>
            </div>
          )}
          {!product.sold && (isRealEstate || isCar) && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="text-white">
                <span className="font-bold text-xl">
                  {formatPrice(displayPrice)}
                  {product.category.includes('Rent') ? '/month' : ''}
                </span>
                {product.negotiable && displayNegotiablePrice && (
                  <div className="text-sm opacity-90">
                    Negotiable: {formatPrice(displayNegotiablePrice)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <Link to={`/products/${product.id}`} className="block flex-1">
            <h3 className={`text-lg font-semibold hover:text-teal-600 transition-colors line-clamp-1 ${
              product.sold ? 'text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'
            }`}>
              {product.title}
            </h3>
          </Link>
          {!product.sold && (
            <button 
              onClick={() => toggleFavorite(product.id)}
              className={`ml-2 p-1.5 rounded-full transition-all duration-200 ${
                isFavorite 
                  ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          )}
        </div>
        
        {!isRealEstate && !isCar && (
          <p className={`mt-1 text-xl font-bold ${
            product.sold ? 'text-gray-500' : 'text-teal-600'
          }`}>
            {formatPrice(displayPrice)}
            {product.negotiable && displayNegotiablePrice && (
              <span className="text-sm text-gray-500 ml-2">
                (Negotiable: {formatPrice(displayNegotiablePrice)})
              </span>
            )}
          </p>
        )}
        
        {/* Car specific info */}
        {isCar && (
          <div className={`mt-2 ${product.sold ? 'text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
            <div className="text-sm">
              {product.year} {product.make} {product.model}
            </div>
            {product.mileage && (
              <div className="text-sm">
                {product.mileage.toLocaleString()} miles
              </div>
            )}
          </div>
        )}
        
        {/* Car parts specific info */}
        {isCarPart && (
          <div className={`mt-2 ${product.sold ? 'text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
            <div className="text-sm">
              {product.partName} - {product.partCategory}
            </div>
            {product.compatibleMake && (
              <div className="text-sm">
                Fits: {product.compatibleYear} {product.compatibleMake} {product.compatibleModel}
              </div>
            )}
          </div>
        )}
        
        {/* Real estate specific info */}
        {isRealEstate && product.propertyType && (
          <div className={`mt-2 flex items-center space-x-4 ${
            product.sold ? 'text-gray-500' : 'text-gray-600 dark:text-gray-400'
          }`}>
            {product.bedrooms && (
              <div className="flex items-center text-sm">
                <span>{product.bedrooms} bed</span>
              </div>
            )}
            {product.bathrooms && (
              <div className="flex items-center text-sm">
                <span>{product.bathrooms} bath</span>
              </div>
            )}
            {product.squareFeet && (
              <div className="flex items-center text-sm">
                <span>{product.squareFeet.toLocaleString()} sqft</span>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-3 flex flex-wrap gap-2">
          <span className={`inline-flex items-center text-xs px-3 py-1 rounded-full ${
            product.sold 
              ? 'bg-gray-300 text-gray-600' 
              : 'bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
          }`}>
            {getCategoryIcon()}
            {product.category}
          </span>
          <span className={`inline-block text-xs px-3 py-1 rounded-full ${
            product.sold 
              ? 'bg-gray-300 text-gray-600' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}>
            {product.condition}
          </span>
        </div>
        
        <p className={`mt-2 text-sm line-clamp-2 ${
          product.sold ? 'text-gray-500' : 'text-gray-600 dark:text-gray-400'
        }`}>
          {product.description}
        </p>
        
        <div className={`mt-3 flex justify-between items-center text-sm ${
          product.sold ? 'text-gray-500' : 'text-gray-500 dark:text-gray-400'
        }`}>
          <div className="flex items-center">
            <MapPin size={14} className="mr-1" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(product.createdAt)}</span>
            </div>
            {product.views && (
              <div className="text-xs text-gray-400">
                {product.views} views
              </div>
            )}
          </div>
        </div>

        {/* Seller Contact Details */}
        {showSellerContact && seller && !product.sold && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <img
                  src={seller.profilePicture}
                  alt={seller.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-800 dark:text-white text-sm">
                    {seller.username}
                  </div>
                  <div className="flex items-center space-x-1">
                    {seller.isVerified && (
                      <Shield size={12} className="text-teal-600" />
                    )}
                    {seller.phoneVerified && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" title="Phone Verified" />
                    )}
                    {seller.emailVerified && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" title="Email Verified" />
                    )}
                    {seller.islandVerified && (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Island Verified" />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star size={12} className="text-yellow-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {seller.ratings.toFixed(1)}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Link
                to={`/products/${product.id}`}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs py-2 px-3 rounded-md transition-colors flex items-center justify-center"
              >
                <MessageCircle size={12} className="mr-1" />
                Contact
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`px-3 py-2 rounded-md text-xs transition-colors ${
                    isFavorite
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={12} fill={isFavorite ? "currentColor" : "none"} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;