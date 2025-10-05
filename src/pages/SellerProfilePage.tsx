import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import SellerProfileForm from '../components/Seller/SellerProfileForm';
import { useAuth } from '../context/AuthContext';
import { SellerProfile } from '../types';

const SellerProfilePage: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [showForm, setShowForm] = useState(!currentUser?.sellerProfile);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleSaveProfile = async (profileData: Omit<SellerProfile, 'id' | 'userId' | 'createdAt'>) => {
    try {
      // In a real app, this would save to the database
      console.log('Saving seller profile:', profileData);
      
      // For now, we'll just hide the form
      setShowForm(false);
    } catch (error) {
      console.error('Error saving seller profile:', error);
    }
  };

  const handleCancelForm = () => {
    if (currentUser?.sellerProfile) {
      setShowForm(false);
    }
  };

  if (showForm) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <SellerProfileForm
            profile={currentUser?.sellerProfile}
            onSave={handleSaveProfile}
            onCancel={handleCancelForm}
          />
        </div>
      </Layout>
    );
  }

  // Display existing seller profile
  const profile = currentUser?.sellerProfile;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Store Header */}
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-8">
            <div className="flex items-center">
              {profile?.storeLogo && (
                <img
                  src={profile.storeLogo}
                  alt={profile.storeName}
                  className="w-20 h-20 rounded-full bg-white p-2 mr-6"
                />
              )}
              <div className="text-white">
                <h1 className="text-3xl font-bold">{profile?.storeName || 'Your Store'}</h1>
                <p className="text-teal-100 mt-2">{profile?.storeDescription}</p>
                <div className="mt-4">
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-white text-teal-600 hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    {profile ? 'Edit Profile' : 'Create Seller Profile'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {profile ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Contact Information</h3>
                  <div className="space-y-2">
                    {profile.phoneNumber && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                        <span className="ml-2 text-gray-800 dark:text-white">{profile.phoneNumber}</span>
                      </div>
                    )}
                    {profile.whatsapp && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">WhatsApp:</span>
                        <span className="ml-2 text-gray-800 dark:text-white">{profile.whatsapp}</span>
                      </div>
                    )}
                    {profile.website && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Website:</span>
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-teal-600 hover:text-teal-700">
                          {profile.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Business Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="ml-2 text-gray-800 dark:text-white capitalize">{profile.businessType}</span>
                    </div>
                    {profile.businessRegistration && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Registration:</span>
                        <span className="ml-2 text-gray-800 dark:text-white">{profile.businessRegistration}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Media */}
              {Object.values(profile.socialMedia).some(link => link) && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Social Media</h3>
                  <div className="flex space-x-4">
                    {profile.socialMedia.facebook && (
                      <a href={profile.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                        Facebook
                      </a>
                    )}
                    {profile.socialMedia.instagram && (
                      <a href={profile.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                        Instagram
                      </a>
                    )}
                    {profile.socialMedia.twitter && (
                      <a href={profile.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                        Twitter
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Shipping Information */}
              {profile.shippingInfo && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Shipping & Delivery</h3>
                  <div className="space-y-2">
                    {profile.shippingInfo.localDelivery && (
                      <div className="text-green-600">✓ Local Delivery Available</div>
                    )}
                    {profile.shippingInfo.islandWideShipping && (
                      <div className="text-green-600">✓ Island-wide Shipping</div>
                    )}
                    {profile.shippingInfo.internationalShipping && (
                      <div className="text-green-600">✓ International Shipping</div>
                    )}
                    {profile.shippingInfo.freeShippingThreshold && (
                      <div className="text-gray-600 dark:text-gray-400">
                        Free shipping on orders over ${profile.shippingInfo.freeShippingThreshold}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your seller profile to start building your brand and attract more customers.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SellerProfilePage;