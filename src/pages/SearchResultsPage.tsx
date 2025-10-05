import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ProductCard from '../components/Products/ProductCard';
import ProductFilters from '../components/Products/ProductFilters';
import GoogleAds from '../components/Ads/GoogleAds';
import { useProducts } from '../context/ProductContext';

const SearchResultsPage: React.FC = () => {
  const { searchProducts, products } = useProducts();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get initial filters from URL params
  const initialCategory = searchParams.get('category') || '';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialCondition = searchParams.get('condition') || '';
  const initialSortBy = searchParams.get('sortBy') || 'newest';
  const initialLocation = searchParams.get('location') || '';

  useEffect(() => {
    if (query) {
      // Apply search and filters
      const searchResults = searchProducts(query, initialCategory);
      let results = [...searchResults];
      
      // Apply price filters
      if (initialMinPrice) {
        const minPrice = parseFloat(initialMinPrice);
        if (!isNaN(minPrice)) {
          results = results.filter(product => product.price >= minPrice);
        }
      }
      
      if (initialMaxPrice) {
        const maxPrice = parseFloat(initialMaxPrice);
        if (!isNaN(maxPrice)) {
          results = results.filter(product => product.price <= maxPrice);
        }
      }
      
      // Apply condition filter
      if (initialCondition) {
        results = results.filter(product => product.condition === initialCondition);
      }
      
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query, products, initialCategory, initialMinPrice, initialMaxPrice, initialCondition, searchProducts]);

  const applyFilters = (filters: any) => {
    let results = searchProducts(query, filters.category);
    
    // Apply location filter
    if (filters.location) {
      results = results.filter(product => product.location === filters.location);
    }
    
    // Apply price filters
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      if (!isNaN(minPrice)) {
        results = results.filter(product => product.price >= minPrice);
      }
    }
    
    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      if (!isNaN(maxPrice)) {
        results = results.filter(product => product.price <= maxPrice);
      }
    }
    
    // Apply condition filter
    if (filters.condition) {
      results = results.filter(product => product.condition === filters.condition);
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        results.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'trending':
        results.sort((a, b) => {
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;
          return (b.views || 0) - (a.views || 0);
        });
        break;
    }
    
    setFilteredProducts(results);
    
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
          <h1 className="text-3xl font-bold text-gray-800">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600 mt-2">
            Found {filteredProducts.length} products matching your search
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters - Sidebar */}
          <div className="md:col-span-1">
            <ProductFilters 
              onFilterChange={applyFilters}
              initialFilters={{
                category: initialCategory,
                location: initialLocation,
                location: initialLocation,
                minPrice: initialMinPrice,
                maxPrice: initialMaxPrice,
                condition: initialCondition,
                sortBy: initialSortBy,
              }}
            />
          </div>

          {/* Product Grid */}
          <div className="md:col-span-3">
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
                        <div className="bg-gradient-to-r from-yellow-50 to-coral-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 my-6">
                          <div className="text-xs text-gray-500 mb-3 text-center">Advertisement</div>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                Grow Your Caribbean Business
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                Reach thousands of potential customers across the Caribbean islands
                              </p>
                              <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                                Learn More
                              </button>
                            </div>
                            <div className="w-24 h-24 bg-gradient-to-br from-teal-200 to-coral-200 rounded-lg flex items-center justify-center ml-4">
                              <div className="text-center">
                                <div className="text-xs font-bold text-teal-700">Your Ad</div>
                                <div className="text-xs text-gray-600">Here</div>
                              </div>
                            </div>
                          </div>
                        </div>
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

export default SearchResultsPage;