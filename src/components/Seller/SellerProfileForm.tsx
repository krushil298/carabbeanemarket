import React, { useState } from 'react';
import { Upload, Globe, Phone, Clock, Truck } from 'lucide-react';
import { SellerProfile } from '../../types';

interface SellerProfileFormProps {
  profile?: SellerProfile;
  onSave: (profile: Omit<SellerProfile, 'id' | 'userId' | 'createdAt'>) => void;
  onCancel: () => void;
}

const SellerProfileForm: React.FC<SellerProfileFormProps> = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    storeName: profile?.storeName || '',
    storeDescription: profile?.storeDescription || '',
    storeLogo: profile?.storeLogo || '',
    storeBanner: profile?.storeBanner || '',
    website: profile?.website || '',
    businessType: profile?.businessType || 'individual',
    businessRegistration: profile?.businessRegistration || '',
    taxId: profile?.taxId || '',
    phoneNumber: profile?.phoneNumber || '',
    whatsapp: profile?.whatsapp || '',
    facebook: profile?.socialMedia?.facebook || '',
    instagram: profile?.socialMedia?.instagram || '',
    twitter: profile?.socialMedia?.twitter || '',
    tiktok: profile?.socialMedia?.tiktok || '',
    youtube: profile?.socialMedia?.youtube || '',
    localDelivery: profile?.shippingInfo?.localDelivery || false,
    islandWideShipping: profile?.shippingInfo?.islandWideShipping || false,
    internationalShipping: profile?.shippingInfo?.internationalShipping || false,
    freeShippingThreshold: profile?.shippingInfo?.freeShippingThreshold?.toString() || '',
    returnPolicy: profile?.policies?.returnPolicy || '',
    shippingPolicy: profile?.policies?.shippingPolicy || '',
    privacyPolicy: profile?.policies?.privacyPolicy || '',
  });

  const [businessHours, setBusinessHours] = useState(profile?.businessHours || {});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBusinessHoursChange = (day: string, value: string) => {
    setBusinessHours(prev => ({ ...prev, [day]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profileData = {
      storeName: formData.storeName,
      storeDescription: formData.storeDescription,
      storeLogo: formData.storeLogo,
      storeBanner: formData.storeBanner,
      website: formData.website,
      businessType: formData.businessType as 'individual' | 'business',
      businessRegistration: formData.businessRegistration,
      taxId: formData.taxId,
      phoneNumber: formData.phoneNumber,
      whatsapp: formData.whatsapp,
      socialMedia: {
        facebook: formData.facebook,
        instagram: formData.instagram,
        twitter: formData.twitter,
        tiktok: formData.tiktok,
        youtube: formData.youtube,
      },
      businessHours,
      shippingInfo: {
        localDelivery: formData.localDelivery,
        islandWideShipping: formData.islandWideShipping,
        internationalShipping: formData.internationalShipping,
        freeShippingThreshold: formData.freeShippingThreshold ? parseFloat(formData.freeShippingThreshold) : undefined,
      },
      policies: {
        returnPolicy: formData.returnPolicy,
        shippingPolicy: formData.shippingPolicy,
        privacyPolicy: formData.privacyPolicy,
      },
      isActive: true,
    };

    onSave(profileData);
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {profile ? 'Edit Seller Profile' : 'Create Seller Profile'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Store Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Store Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Store Name *
              </label>
              <input
                type="text"
                name="storeName"
                required
                value={formData.storeName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Your store name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Store Description
              </label>
              <textarea
                name="storeDescription"
                rows={4}
                value={formData.storeDescription}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe your store and what you sell..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Type
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="individual">Individual Seller</option>
                <option value="business">Registered Business</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <div className="relative">
                <Globe size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://yourstore.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Facebook
              </label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://facebook.com/yourstore"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instagram
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://instagram.com/yourstore"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Twitter
              </label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://twitter.com/yourstore"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                TikTok
              </label>
              <input
                type="url"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://tiktok.com/@yourstore"
              />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Clock size={20} className="mr-2" />
            Business Hours
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {days.map(day => (
              <div key={day} className="flex items-center space-x-3">
                <label className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {day}:
                </label>
                <input
                  type="text"
                  value={businessHours[day] || ''}
                  onChange={(e) => handleBusinessHoursChange(day, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  placeholder="9:00 AM - 5:00 PM or Closed"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Truck size={20} className="mr-2" />
            Shipping & Delivery
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="localDelivery"
                checked={formData.localDelivery}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Local Delivery Available
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="islandWideShipping"
                checked={formData.islandWideShipping}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Island-wide Shipping
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="internationalShipping"
                checked={formData.internationalShipping}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                International Shipping
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Free Shipping Threshold (USD)
              </label>
              <input
                type="number"
                name="freeShippingThreshold"
                min="0"
                step="0.01"
                value={formData.freeShippingThreshold}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="100.00"
              />
            </div>
          </div>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Store Policies</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Return Policy
              </label>
              <textarea
                name="returnPolicy"
                rows={3}
                value={formData.returnPolicy}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe your return policy..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shipping Policy
              </label>
              <textarea
                name="shippingPolicy"
                rows={3}
                value={formData.shippingPolicy}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe your shipping policy..."
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-teal-600 text-white rounded-md font-medium hover:bg-teal-700 transition-colors"
          >
            {profile ? 'Update Profile' : 'Create Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerProfileForm;