import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Calendar, MessageCircle, ArrowLeft, Shield, Star, Eye, Share2, AlertCircle, Package, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import ContactSellerModal from '../components/Messaging/ContactSellerModal';
import ReviewSystem from '../components/Reviews/ReviewSystem';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import { getListing } from '../services/listingService';
import { ListingWithProfile } from '../types/database';
import { toggleFavorite as toggleFavoriteService, isFavorited } from '../services/favoriteService';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { isAuthenticated, user } = useAuth();

  const [listing, setListing] = useState<ListingWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchListing();
    }
  }, [id]);

  useEffect(() => {
    if (listing && user?.id) {
      checkIsFavorite();
    }
  }, [listing, user]);

  const fetchListing = async () => {
    if (!id) return;

    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await getListing(id);

      if (fetchError || !data) {
        throw new Error(fetchError?.message || 'Listing not found');
      }

      setListing(data);
    } catch (err) {
      console.error('Error fetching listing:', err);
      setError(err instanceof Error ? err.message : 'Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const checkIsFavorite = async () => {
    if (!listing?.id || !user?.id) return;

    try {
      const { isFavorited: fav } = await isFavorited(user.id, listing.id);
      setIsFavorite(fav);
    } catch (err) {
      console.error('Error checking favorite:', err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !user?.id) {
      navigate('/login');
      return;
    }

    if (!listing?.id) return;

    setFavoriteLoading(true);

    try {
      const { isFavorited: newFavoriteState, error } = await toggleFavoriteService(user.id, listing.id);

      if (error) {
        throw error;
      }

      setIsFavorite(newFavoriteState);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowContactModal(true);
  };

  const handleShare = async () => {
    if (navigator.share && listing) {
      try {
        await navigator.share({
          title: listing.title,
          text: listing.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !listing) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Listing Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'The listing you are looking for does not exist or has been removed.'}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <ArrowLeft size={20} className="mr-2" />
              Browse All Listings
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const images = listing.images || [];
  const videos = listing.videos || [];
  const allMedia = [...images, ...videos];
  const isOwner = user?.id === listing.user_id;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center">
            <Link to="/products" className="hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center transition-colors">
              <ArrowLeft size={16} className="mr-1" />
              Back to Listings
            </Link>
            <span className="mx-2">/</span>
            <Link to={`/products?category=${listing.category}`} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              {listing.category}
            </Link>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden mb-4 h-96 flex items-center justify-center relative">
              {allMedia.length > 0 ? (
                <>
                  {allMedia[selectedImage]?.endsWith('.mp4') || allMedia[selectedImage]?.endsWith('.webm') ? (
                    <video
                      src={allMedia[selectedImage]}
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={allMedia[selectedImage]}
                      alt={listing.title}
                      className="w-full h-full object-contain"
                    />
                  )}

                  {listing.metadata?.trending && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                      <TrendingUp size={16} />
                      Trending
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-400 dark:text-gray-600">
                  <Package size={64} />
                </div>
              )}
            </div>

            {allMedia.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {allMedia.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden h-20 transition-all ${
                      selectedImage === index ? 'ring-2 ring-cyan-500' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={media}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white pr-4">
                {listing.title}
              </h1>
              {!isOwner && (
                <button
                  onClick={handleToggleFavorite}
                  disabled={favoriteLoading}
                  className={`p-2 rounded-full transition-all flex-shrink-0 ${
                    isFavorite
                      ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              )}
            </div>

            <div className="text-4xl font-bold text-cyan-600 dark:text-cyan-400 mb-6">
              {formatPrice(listing.price)}
              {listing.is_negotiable && (
                <span className="text-lg text-gray-500 dark:text-gray-400 ml-3">
                  (Negotiable)
                </span>
              )}
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-lg">
                      {listing.profiles?.full_name || 'Unknown Seller'}
                    </h3>
                    {listing.profiles?.verified && (
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Shield size={12} />
                        Verified
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{listing.profiles?.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={16} />
                      <span>{listing.views_count || 0} views</span>
                    </div>
                  </div>
                </div>

                {!isOwner && (
                  <Link
                    to={`/seller/${listing.user_id}`}
                    className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    View Profile
                  </Link>
                )}
              </div>

              {!isOwner && (
                <button
                  onClick={handleContactSeller}
                  className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  <MessageCircle size={20} />
                  Contact Seller
                </button>
              )}

              {isOwner && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center text-sm text-blue-700 dark:text-blue-300">
                  This is your listing
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin size={20} className="text-cyan-600 dark:text-cyan-400" />
                <span>{listing.country}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar size={20} className="text-cyan-600 dark:text-cyan-400" />
                <span>Listed {formatDate(listing.created_at)}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Package size={20} className="text-cyan-600 dark:text-cyan-400" />
                <span>
                  {listing.stock_quantity || 0} available • {listing.condition}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {listing.description}
              </p>
            </div>

            {listing.tags && listing.tags.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <ReviewSystem
              targetId={listing.id}
              targetType="listing"
              currentUserId={user?.id}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Details</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Category</dt>
                  <dd className="text-gray-800 dark:text-white font-medium">{listing.category}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Condition</dt>
                  <dd className="text-gray-800 dark:text-white font-medium capitalize">{listing.condition}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Location</dt>
                  <dd className="text-gray-800 dark:text-white font-medium">{listing.country}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Status</dt>
                  <dd className="text-gray-800 dark:text-white font-medium capitalize">{listing.status}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {showContactModal && (
        <ContactSellerModal
          sellerId={listing.user_id}
          sellerName={listing.profiles?.full_name || 'Seller'}
          productTitle={listing.title}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </Layout>
  );
};

export default ProductDetailPage;