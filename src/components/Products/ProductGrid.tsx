import React from 'react';
import ProductCard from './ProductCard';
import GoogleAds from '../Ads/GoogleAds';
import { Product } from '../../types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  showSellerContact?: boolean;
  showAds?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  loading = false, 
  showSellerContact = false,
  showAds = false 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="flex justify-between mt-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-700">No products found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {products.map((product, index) => (
        <React.Fragment key={product.id}>
          {/* Show inline ad after every 5 listings */}
          {showAds && index > 0 && index % 5 === 0 && (
            <GoogleAds type="inline" />
          )}
          
          {/* Product Card - Full width for listings page */}
          {showSellerContact ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                <div className="md:col-span-1">
                  <ProductCard product={product} showSellerContact={false} />
                </div>
                <div className="md:col-span-2">
                  <ProductCard product={product} showSellerContact={true} />
                </div>
              </div>
            </div>
          ) : (
            <ProductCard product={product} showSellerContact={showSellerContact} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProductGrid;