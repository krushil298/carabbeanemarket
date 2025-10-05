import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Car, Home, Smartphone, Wrench, Sofa, Shirt, Gem, Music, Briefcase, Heart as PetIcon, Hammer, Building, TrendingUp, Star, MapPin, Briefcase as JobsIcon, Utensils, Gift, HelpCircle } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import ProductCard from '../components/Products/ProductCard';
import SubscriptionPlans from '../components/Subscription/SubscriptionPlans';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { categories, caribbeanLocations } from '../data/mockData';

const HomePage: React.FC = () => {
  const { products } = useProducts();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState(products.slice(0, 8));
  const [trendingProducts, setTrendingProducts] = useState(products.filter(p => p.trending).slice(0, 6));
  const [localGems, setLocalGems] = useState(products.filter(p => p.localGem && p.location === currentUser?.location).slice(0, 4));
  
  useEffect(() => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    setFeaturedProducts(shuffled.slice(0, 8));
    setTrendingProducts(products.filter(p => p.trending).slice(0, 6));
    
    // Filter local gems based on user's location
    if (currentUser?.location) {
      setLocalGems(products.filter(p => p.localGem && p.location === currentUser.location).slice(0, 4));
    }
  }, [products, currentUser?.location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      if (selectedLocation) params.set('location', selectedLocation);
      window.location.href = `/search?${params.toString()}`;
    }
  };

  const categoryIcons: { [key: string]: React.ReactNode } = {
    'Cars': <Car size={24} className="text-teal-600" />,
    'Real Estate': <Home size={24} className="text-coral-500" />,
    'Jobs': <JobsIcon size={24} className="text-blue-600" />,
    'Electronics': <Smartphone size={24} className="text-blue-500" />,
    'Furniture': <Sofa size={24} className="text-amber-600" />,
    'Fashion': <Shirt size={24} className="text-purple-500" />,
    'Phones': <Smartphone size={24} className="text-green-500" />,
    'Services': <Wrench size={24} className="text-orange-500" />,
    'Home & Garden': <Home size={24} className="text-green-600" />,
    'Food & Dining': <Utensils size={24} className="text-red-500" />,
    'Pets': <PetIcon size={24} className="text-pink-500" />,
    'Sports & Recreation': <Building size={24} className="text-blue-700" />,
    'Arts & Crafts': <Gem size={24} className="text-purple-600" />,
    'Toys & Games': <Gift size={24} className="text-yellow-500" />,
    'Musical Instruments': <Music size={24} className="text-indigo-500" />,
    'Events': <Star size={24} className="text-yellow-600" />,
    'Lost & Found': <HelpCircle size={24} className="text-gray-500" />,
    'Free Items': <Gift size={24} className="text-green-500" />,
    'Miscellaneous': <Building size={24} className="text-gray-600" />,
  };

  return (
    <Layout>
      {/* Hero Section with Caribbean Artwork Background */}
      <section className="relative caribbean-hero-bg caribbean-hero-section text-white py-16 md:py-24">
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-shadow-lg">
              Caribbean's Premier eMarketplace
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95 text-shadow">
              Buy and sell across all Caribbean islands. From cars to real estate, electronics to services - find everything you need.
            </p>
            
            {/* Glass Morphism Search Form */}
            <form 
              onSubmit={handleSearch}
              className="max-w-4xl mx-auto glass-search-form rounded-2xl p-2 shadow-2xl"
            >
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="flex-1 px-6 py-4 text-gray-800 focus:outline-none rounded-xl bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-6 py-4 text-gray-800 focus:outline-none rounded-xl bg-gray-50 min-w-48"
                >
                  <option value="">All Islands</option>
                  {caribbeanLocations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <button 
                  type="submit"
                  className="btn-coral text-white px-8 py-4 rounded-xl transition-all flex items-center justify-center font-semibold"
                >
                  <Search size={20} className="mr-2" />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Local Gems Section */}
      {currentUser?.location && localGems.length > 0 && (
        <section className="py-16 caribbean-bg-light dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Star className="text-coral-500 mr-2" size={32} />
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Local Gems from {currentUser.location}</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover unique treasures from your island community
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {localGems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link 
                to={`/products?location=${encodeURIComponent(currentUser.location)}`}
                className="btn-coral text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center"
              >
                View All from {currentUser.location}
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Trending Items */}
      {trendingProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-blue-50 to-teal-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="text-yellow-500 mr-2" size={32} />
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Trending Now</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Hot items that everyone's talking about across the Caribbean
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Categories */}
      <section className="py-16 caribbean-bg-medium dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Popular Categories</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore our most popular categories across the Caribbean
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 18).map((category) => (
              <Link 
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 group card-hover"
              >
                <div className="mb-3 group-hover:scale-110 transition-transform">
                  {categoryIcons[category] || <div className="w-6 h-6 bg-teal-600 rounded"></div>}
                </div>
                <div className="text-gray-800 dark:text-white font-medium text-sm">{category}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 caribbean-sand dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Featured Listings</h2>
            <Link 
              to="/products" 
              className="text-teal-600 hover:text-teal-700 font-medium flex items-center"
            >
              View All
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Island Highlights */}
      <section className="py-16 caribbean-ocean dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Shop by Island</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover unique products from across the Caribbean
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {caribbeanLocations.slice(0, 12).map((location) => (
              <Link 
                key={location}
                to={`/products?location=${encodeURIComponent(location)}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md p-4 text-center transition-all duration-300 hover:-translate-y-1 card-hover"
              >
                <div className="flex items-center justify-center mb-2">
                  <MapPin size={16} className="text-teal-600" />
                </div>
                <div className="text-gray-800 dark:text-white font-medium text-sm">{location}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <SubscriptionPlans />

      {/* CTA Section */}
      <section className="py-16 coral-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to start selling?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of Caribbean sellers and turn your items into cash today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/signup" 
                className="bg-white text-coral-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Sign Up Free
              </Link>
              <Link 
                to="/products" 
                className="border border-white text-white hover:bg-white hover:text-coral-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Listings
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 caribbean-bg-light dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Simple, secure, and trusted by Caribbean communities
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 teal-gradient text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Create Your Profile</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sign up with your Caribbean location and start building your reputation
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 coral-gradient text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">List Your Items</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upload photos, set your price, and reach buyers across the Caribbean
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Connect & Sell</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Chat with buyers, arrange safe meetups, and complete your sale
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;