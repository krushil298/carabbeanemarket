import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Calendar, MessageCircle, ArrowLeft, DollarSign, Shield, Star, Eye } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import ContactSellerModal from '../components/Messaging/ContactSellerModal';
import ReviewSystem from '../components/Reviews/ReviewSystem';
import { useProducts } from '../context/ProductContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import ProductGrid from '../components/Products/ProductGrid';
import { getMockSellerData } from '../data/mockData';
import { Review, Offer } from '../types';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, products, toggleFavorite, favoriteProducts } = useProducts();
  const { convertPrice, formatPrice } = useCurrency();
  const { isAuthenticated, currentUser } = useAuth();
  const [product, setProduct] = useState(id ? getProduct(id) : undefined);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState(products.slice(0, 4));
  const [showContactModal, setShowContactModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);

  const isFavorite = product ? favoriteProducts.some(p => p.id === product.id) : false;

  useEffect(() => {
    if (id) {
      const fetchedProduct = getProduct(id);
      setProduct(fetchedProduct);
      
      if (fetchedProduct) {
        // Get related products (same category, excluding current product)
        const related = products
          .filter(p => p.category === fetchedProduct.category && p.id !== fetchedProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);

        // Mock reviews for the product
        setReviews([
          {
            id: 'review-1',
            userId: 'user-2',
            targetId: fetchedProduct.id,
            targetType: 'product',
            rating: 5,
            comment: 'Excellent product! Exactly as described and fast delivery.',
            createdAt: new Date('2023-06-01'),
            helpful: 3,
            verified: true
          },
          {
            id: 'review-2',
            userId: 'user-3',
            targetId: fetchedProduct.id,
            targetType: 'product',
            rating: 4,
            comment: 'Good quality, would recommend to others.',
            createdAt: new Date('2023-05-28'),
            helpful: 1,
            verified: false
          }
        ]);
      }
    }
  }, [id, getProduct, products]);

  if (!id || !product) {
    return <Navigate to="/products" />;
  }

  const displayPrice = convertPrice(product.price, product.currency);
  const displayNegotiablePrice = product.negotiablePrice 
    ? convertPrice(product.negotiablePrice, product.currency)
    : null;

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    setShowContactModal(true);
  };

  const handleMakeOffer = () => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    setShowOfferModal(true);
  };

  const handleSendMessage = async (message: string) => {
    console.log('Sending message to seller:', product.userId, message);
  };

  const handleSubmitOffer = async () => {
    if (!offerAmount || parseFloat(offerAmount) <= 0) return;
    
    const offer: Omit<Offer, 'id'> = {
      productId: product.id,
      buyerId: currentUser?.id || '',
      sellerId: product.userId,
      amount: parseFloat(offerAmount),
      currency: 'USD',
      message: offerMessage,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };

    console.log('Submitting offer:', offer);
    setShowOfferModal(false);
    setOfferAmount('');
    setOfferMessage('');
  };

  const handleAddReview = (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => {
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}`,
      createdAt: new Date(),
      helpful: 0
    };
    setReviews([...reviews, newReview]);
  };

  // Mock seller data with verification badges
  const seller = getMockSellerData(product.userId);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/products" className="hover:text-teal-600 flex items-center">
            <ArrowLeft size={16} className="mr-1" />
            Back to Products
          </Link>
          <span className="mx-2">/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-teal-600">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className={`bg-gray-100 rounded-xl overflow-hidden mb-4 h-96 flex items-center justify-center relative ${
              product.sold ? 'opacity-60' : ''
            }`}>
              <img 
                src={product.images[selectedImage]} 
                alt={product.title} 
                className={`w-full h-full object-contain ${product.sold ? 'filter grayscale' : ''}`}
              />
              {product.sold && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="bg-red-600 text-white px-8 py-3 text-2xl font-bold transform -rotate-12 shadow-lg">
                    SOLD
                  </div>
                </div>
              )}
              {/* Trending/Local Gem Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.trending && (
                  <div className="trending-badge text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                    🔥 Trending
                  </div>
                )}
                {product.localGem && (
                  <div className="local-gem-badge text-white px-3 py-1 rounded-full text-sm font-bold">
                    ⭐ Local Gem
                  </div>
                )}
              </div>
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-gray-100 rounded-lg overflow-hidden h-24 transition-all ${
                      selectedImage === index ? 'ring-2 ring-teal-500' : ''
                    } ${product.sold ? 'opacity-60' : ''}`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.title} - View ${index + 1}`}
                      className={`w-full h-full object-cover ${product.sold ? 'filter grayscale' : ''}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className={`text-3xl font-bold ${
                product.sold ? 'text-gray-500' : 'text-gray-800 dark:text-white'
              }`}>
                {product.title}
              </h1>
              {!product.sold && (
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className={`p-2 rounded-full transition-all ${isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                >
                  <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                </button>
              )}
            </div>
            
            <div className={`text-3xl font-bold mb-6 ${
              product.sold ? 'text-gray-500' : 'text-teal-600'
            }`}>
              {formatPrice(displayPrice)}
              {product.negotiable && displayNegotiablePrice && (
                <div className="text-lg text-gray-500 mt-1">
                  Negotiable: {formatPrice(displayNegotiablePrice)}
                </div>
              )}
            </div>

            {/* Seller Info with Verification Badges */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{seller.name}</h3>
                    {seller.islandVerified && (
                      <div className="island-badge verification-pulse text-yellow-800 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                        <Shield size={12} className="mr-1" />
                        Island Verified
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-500 mr-1" />
                      <span>{seller.rating} ({seller.totalRatings} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {seller.phoneVerified && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" title="Phone Verified"></div>
                      )}
                      {seller.emailVerified && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" title="Email Verified"></div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>Member since</div>
                  <div>{formatDate(seller.joinedDate)}</div>
                </div>
              </div>
            </div>

            {product.sold && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
                <div className="font-semibold">This item has been sold</div>
                <div className="text-sm">
                  Sold on {product.soldAt ? formatDate(product.soldAt) : 'Recently'}
                </div>
              </div>
            )}
            
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                <MapPin size={18} className="mr-2" />
                <span>{product.location}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                <Calendar size={18} className="mr-2" />
                <span>Listed on {formatDate(product.createdAt)}</span>
              </div>
              {product.views && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Eye size={18} className="mr-2" />
                  <span>{product.views} views</span>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Condition:</span>
                  <span className="ml-2 font-medium text-gray-800 dark:text-white">{product.condition}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Category:</span>
                  <span className="ml-2 font-medium text-gray-800 dark:text-white">{product.category}</span>
                </div>
                {product.make && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Make:</span>
                    <span className="ml-2 font-medium text-gray-800 dark:text-white">{product.make}</span>
                  </div>
                )}
                {product.model && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Model:</span>
                    <span className="ml-2 font-medium text-gray-800 dark:text-white">{product.model}</span>
                  </div>
                )}
                {product.year && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Year:</span>
                    <span className="ml-2 font-medium text-gray-800 dark:text-white">{product.year}</span>
                  </div>
                )}
                {product.salesCount !== undefined && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Sales:</span>
                    <span className="ml-2 font-medium text-gray-800 dark:text-white">{product.salesCount}</span>
                  </div>
                )}
              </div>
            </div>
            
            {!product.sold && (
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={handleContactSeller}
                  className="flex-1 btn-tropical text-white py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center"
                >
                  <MessageCircle size={20} className="mr-2" />
                  Contact Seller
                </button>
                <button 
                  onClick={handleMakeOffer}
                  className="flex-1 offer-button py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center"
                >
                  <DollarSign size={20} className="mr-2" />
                  Make an Offer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-12">
          <ReviewSystem
            reviews={reviews}
            targetId={product.id}
            targetType="product"
            onAddReview={handleAddReview}
            canReview={isAuthenticated && currentUser?.id !== product.userId}
          />
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Related Products</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}

        {/* Contact Seller Modal */}
        <ContactSellerModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          onSend={handleSendMessage}
          productTitle={product.title}
          sellerName={seller.name}
        />

        {/* Make Offer Modal */}
        {showOfferModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Make an Offer
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    For "{product.title}"
                  </p>
                </div>
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Offer (USD)
                  </label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="number"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      placeholder="Enter your offer"
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Listed price: {formatPrice(displayPrice)}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    placeholder="Add a message to your offer..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitOffer}
                  disabled={!offerAmount || parseFloat(offerAmount) <= 0}
                  className={`px-6 py-2 offer-button rounded-lg font-medium transition-all ${
                    !offerAmount || parseFloat(offerAmount) <= 0
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  Send Offer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetailPage;