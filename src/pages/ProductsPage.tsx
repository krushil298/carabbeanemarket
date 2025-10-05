import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, Filter } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import ProductCard from '../components/Products/ProductCard';
import ProductFilters from '../components/Products/ProductFilters';
import GoogleAds from '../components/Ads/GoogleAds';
import { useProducts } from '../context/ProductContext';
import { useCurrency } from '../context/CurrencyContext';

const ProductsPage: React.FC = () => {
  const { products } = useProducts();
  const { convertPrice } = useCurrency();
  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);

  // Get initial filters from URL params
  const initialCategory = searchParams.get('category') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialCondition = searchParams.get('condition') || '';
  const initialSortBy = searchParams.get('sortBy') || 'newest';

  useEffect(() => {
    // Apply filters from URL on initial load
    applyFilters({
      category: initialCategory,
      location: initialLocation,
      minPrice: initialMinPrice,
      maxPrice: initialMaxPrice,
      condition: initialCondition,
      sortBy: initialSortBy,
    });

    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [products, initialCategory, initialMinPrice, initialMaxPrice, initialCondition]);

  const applyFilters = (filters: any) => {
    let result = [...products];

    // Filter by category
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }

    // Filter by location
    if (filters.location) {
      result = result.filter(product => product.location === filters.location);
    }
    // Filter by min price
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      if (!isNaN(minPrice)) {
        result = result.filter(product => {
          const convertedPrice = convertPrice(product.price, product.currency);
          return convertedPrice >= minPrice;
        });
      }
    }

    // Filter by max price
    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      if (!isNaN(maxPrice)) {
        result = result.filter(product => {
          const convertedPrice = convertPrice(product.price, product.currency);
          return convertedPrice <= maxPrice;
        });
      }
    }

    // Filter by condition
    if (filters.condition) {
      result = result.filter(product => product.condition === filters.condition);
    }

    // Sort products
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => {
          const priceA = convertPrice(a.price, a.currency);
          const priceB = convertPrice(b.price, b.currency);
          return priceA - priceB;
        });
        break;
      case 'price-high':
        result.sort((a, b) => {
          const priceA = convertPrice(a.price, a.currency);
          const priceB = convertPrice(b.price, b.currency);
          return priceB - priceA;
        });
        break;
      case 'popular':
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'trending':
        result.sort((a, b) => {
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;
          return (b.views || 0) - (a.views || 0);
        });
        break;
    }
    setFilteredProducts(result);

    // Update URL with filter params
    const url = new URL(window.location.href);
    if (filters.category) url.searchParams.set('category', filters.category);
    else url.searchParams.delete('category');
    
    if (filters.location) url.searchParams.set('location', filters.location);
    else url.searchParams.delete('location');
    
    if (filters.minPrice) url.searchParams.set('minPrice', filters.minPrice);
    else url.searchParams.delete('minPrice');
    
    if (filters.maxPrice) url.searchParams.set('maxPrice', filters.maxPrice);
    else url.searchParams.delete('maxPrice');
    
    if (filters.condition) url.searchParams.set('condition', filters.condition);
    else url.searchParams.delete('condition');
    
    if (filters.sortBy) url.searchParams.set('sortBy', filters.sortBy);
    else url.searchParams.delete('sortBy');
    
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {initialCategory ? `${initialCategory}` : 'All Products'}
                {initialLocation && ` in ${initialLocation}`}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Browse our selection of {filteredProducts.length} products
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 text-teal-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-teal-600'
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 text-teal-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-teal-600'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
              
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden bg-teal-600 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Filter size={16} className="mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:block mb-6`}>
              <ProductFilters 
                onFilterChange={applyFilters}
                initialFilters={{
                  category: initialCategory,
                  location: initialLocation,
                  minPrice: initialMinPrice,
                  maxPrice: initialMaxPrice,
                  condition: initialCondition,
                  sortBy: initialSortBy,
                }}
              />
            </div>
            
            {/* Sidebar Ad */}
            <GoogleAds type="sidebar" className="hidden lg:block" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 caribbean-bg-light rounded-lg">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gradient-to-br from-teal-100 to-coral-100"></div>
                    <div className="p-4">
                      <div className="h-6 bg-teal-100 rounded w-3/4 mb-2"></div>
                      <div className="h-5 bg-coral-100 rounded w-1/4 mb-4"></div>
                      <div className="h-4 bg-yellow-100 rounded w-full mb-2"></div>
                      <div className="h-4 bg-blue-100 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <React.Fragment key={product.id}>
                    {/* Inline ad after every 5 products */}
                    {index > 0 && index % 5 === 0 && (
                      <div className="sm:col-span-2 lg:col-span-3">
                        <GoogleAds type="inline" />
                      </div>
                    )}
                    <ProductCard product={product} showSellerContact={true} />
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 caribbean-bg-light rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No products found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;