import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid2x2 as Grid, List, Filter, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import ProductCard from '../components/Products/ProductCard';
import ProductFilters from '../components/Products/ProductFilters';
import GoogleAds from '../components/Ads/GoogleAds';
import { useCurrency } from '../context/CurrencyContext';
import { getListings } from '../services/listingService';
import { ListingWithProfile } from '../types/database';

const ProductsPage: React.FC = () => {
  const { convertPrice } = useCurrency();
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState<ListingWithProfile[]>([]);
  const [filteredListings, setFilteredListings] = useState<ListingWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const initialCategory = searchParams.get('category') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialCondition = searchParams.get('condition') || '';
  const initialSortBy = searchParams.get('sortBy') || 'newest';

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilters({
      category: initialCategory,
      location: initialLocation,
      minPrice: initialMinPrice,
      maxPrice: initialMaxPrice,
      condition: initialCondition,
      sortBy: initialSortBy,
    });
  }, [listings, initialCategory, initialLocation, initialMinPrice, initialMaxPrice, initialCondition, initialSortBy]);

  const fetchListings = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await getListings({
        status: 'approved',
        limit: 100
      });

      if (fetchError) {
        throw fetchError;
      }

      setListings(data);
      setFilteredListings(data);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (filters: any) => {
    let result = [...listings];

    if (filters.category) {
      result = result.filter(listing => listing.category === filters.category);
    }

    if (filters.location) {
      result = result.filter(listing => listing.country === filters.location);
    }

    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      if (!isNaN(minPrice)) {
        result = result.filter(listing => listing.price >= minPrice);
      }
    }

    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      if (!isNaN(maxPrice)) {
        result = result.filter(listing => listing.price <= maxPrice);
      }
    }

    if (filters.condition) {
      result = result.filter(listing => listing.condition === filters.condition);
    }

    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
        break;
      case 'trending':
        result.sort((a, b) => {
          const trendingA = a.metadata?.trending ? 1 : 0;
          const trendingB = b.metadata?.trending ? 1 : 0;
          if (trendingA !== trendingB) return trendingB - trendingA;
          return (b.views_count || 0) - (a.views_count || 0);
        });
        break;
    }

    setFilteredListings(result);

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

  const convertListingToProduct = (listing: ListingWithProfile) => {
    return {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      currency: 'USD',
      category: listing.category,
      condition: listing.condition as any,
      location: listing.country,
      images: listing.images || [],
      videos: listing.videos || [],
      sellerId: listing.user_id,
      sellerName: listing.profiles?.full_name || 'Unknown',
      sellerRating: listing.profiles?.rating || 0,
      createdAt: listing.created_at,
      views: listing.views_count || 0,
      salesCount: 0,
      inventory: listing.stock_quantity || 0,
      tags: listing.tags || [],
      negotiable: listing.is_negotiable || false,
      trending: listing.metadata?.trending || false,
      localGem: listing.metadata?.localGem || false,
      verified: listing.profiles?.verified || false
    };
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {initialCategory ? `${initialCategory}` : 'All Listings'}
                {initialLocation && ` in ${initialLocation}`}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Browse our selection of {filteredListings.length} listings
              </p>
            </div>

            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 text-cyan-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-cyan-600'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 text-cyan-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-cyan-600'
                  }`}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all"
              >
                <Filter size={16} className="mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p>{error}</p>
              <button
                onClick={fetchListings}
                className="text-sm underline mt-1 hover:no-underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
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

            <GoogleAds type="sidebar" className="hidden lg:block" />
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredListings.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredListings.map((listing, index) => (
                  <React.Fragment key={listing.id}>
                    {index > 0 && index % 6 === 0 && viewMode === 'grid' && (
                      <div className="sm:col-span-2 lg:col-span-3">
                        <GoogleAds type="inline" />
                      </div>
                    )}
                    <ProductCard
                      product={convertListingToProduct(listing)}
                      showSellerContact={true}
                    />
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                <div className="max-w-md mx-auto px-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    No listings found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search filters or browse all categories
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;