import React from 'react';
import { Navigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import ProductGrid from '../components/Products/ProductGrid';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

const FavoritesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { favoriteProducts } = useProducts();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Heart className="text-red-500 mr-3" size={32} />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              My Favorites
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {favoriteProducts.length} saved items
          </p>
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <div key={product.id} className="relative">
                <ProductGrid products={[product]} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 caribbean-bg-light rounded-lg">
            <Heart size={64} className="mx-auto text-gray-300 mb-6" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
              No favorites yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start browsing products and click the heart icon to save items you're interested in.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                <ShoppingBag size={20} className="mr-2" />
                Browse Products
              </a>
              <a
                href="/products?sortBy=trending"
                className="border border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                View Trending Items
              </a>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FavoritesPage;