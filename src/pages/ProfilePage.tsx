import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Upload, MapPin, Calendar, Trash2, BarChart3 } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';
import ProductGrid from '../components/Products/ProductGrid';
import { useProducts } from '../context/ProductContext';

const ProfilePage: React.FC = () => {
  const { currentUser, isAuthenticated, updateProfile, loading } = useAuth();
  const { userProducts, updateProduct } = useProducts();
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    bio: currentUser?.bio || '',
    location: currentUser?.location || '',
    phone: currentUser?.phone || '',
    profilePicture: currentUser?.profilePicture || '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-pulse">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewImage(result);
      setFormData(prev => ({ ...prev, profilePicture: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsSold = async (productId: string) => {
    try {
      await updateProduct(productId, { 
        sold: true, 
        soldAt: new Date(),
        salesCount: (userProducts.find(p => p.id === productId)?.salesCount || 0) + 1
      });
    } catch (error) {
      console.error('Failed to mark product as sold:', error);
    }
  };

  const handleDeleteAccount = async () => {
    // In a real app, this would call an API to delete the account
    console.log('Deleting account...');
    // For demo purposes, we'll just log out
    // logout();
    setShowDeleteConfirm(false);
  };

  const totalSales = userProducts.reduce((sum, product) => sum + (product.salesCount || 0), 0);
  const totalRevenue = userProducts
    .filter(product => product.sold)
    .reduce((sum, product) => sum + product.price, 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-900 to-teal-800 p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
              <div className="w-32 h-32 rounded-full bg-white p-1 overflow-hidden mb-4 sm:mb-0 sm:mr-6">
                <img
                  src={currentUser.profilePicture || '/api/placeholder/150/150'}
                  alt={currentUser.username}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="text-white flex-1">
                <h1 className="text-3xl font-bold">{currentUser.username}</h1>
                <div className="flex flex-col sm:flex-row items-center sm:items-start mt-2 text-gray-200">
                  <div className="flex items-center mb-2 sm:mb-0 sm:mr-4">
                    <MapPin size={16} className="mr-1" />
                    <span>{currentUser.location || 'No location set'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span>Joined {formatDate(currentUser.joinedDate)}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="bg-white text-teal-700 hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      Edit Profile
                    </button>
                  )}
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Statistics */}
          <div className="caribbean-bg-light dark:bg-gray-700 p-6 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center mb-4">
              <BarChart3 size={20} className="mr-2 text-teal-600" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Sales Statistics</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-teal-600">{userProducts.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Listings</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{totalSales}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Items Sold</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">${totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden flex items-center justify-center">
                      {previewImage ? (
                        <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
                      ) : (
                        <img src={currentUser.profilePicture || '/api/placeholder/150/150'} alt={currentUser.username} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md transition-colors flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      <span>Change Image</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-md font-medium transition-colors ${
                      saving ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-2 px-6 rounded-md font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">About</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    {currentUser.bio || 'No bio provided yet.'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">My Listings</h2>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Manage your inventory and track sales
                    </div>
                  </div>
                  
                  {userProducts.length > 0 ? (
                    <div className="space-y-4">
                      {userProducts.map((product) => (
                        <div key={product.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h3 className="font-medium text-gray-800 dark:text-white">{product.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">${product.price}</p>
                              <p className="text-xs text-gray-500">Sales: {product.salesCount || 0}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {!product.sold && (
                              <button
                                onClick={() => handleMarkAsSold(product.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                Mark as Sold
                              </button>
                            )}
                            {product.sold && (
                              <span className="bg-gray-500 text-white px-3 py-1 rounded text-sm">
                                Sold
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 caribbean-bg-light dark:bg-gray-700 rounded-lg">
                      <User size={48} className="mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No listings yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">You haven't listed any products for sale</p>
                      <a 
                        href="/add-product" 
                        className="mt-4 inline-block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Sell an Item
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Delete Account
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data, listings, and messages.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;