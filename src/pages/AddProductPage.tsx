import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import ImageUpload from '../components/Media/ImageUpload';
import ProductVariations from '../components/Products/ProductVariations';
import { useAuth } from '../context/AuthContext';
import { categories, caribbeanLocations, carMakes, carModels, carYears, carPartsCategories, serviceCategories, propertyTypes } from '../data/mockData';
import { ProductVariation } from '../types';
import { createListing } from '../services/listingService';
import { uploadMultipleImages, uploadMultipleVideos } from '../services/mediaService';

const AddProductPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'good',
    location: '',
    inventory: '1',
    tags: '',
    negotiable: false,
    negotiablePrice: '',
    
    // Real Estate
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    amenities: '',
    
    // Car
    make: '',
    model: '',
    year: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    
    // Car Parts
    partName: '',
    partCategory: '',
    compatibleMake: '',
    compatibleModel: '',
    compatibleYear: '',
    
    // Services
    serviceType: '',
    availability: '',
    hourlyRate: '',
    skills: '',
    certifications: ''
  });
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFilesChange = (images: File[], videos: File[]) => {
    setImageFiles(images);
    setVideoFiles(videos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setUploadProgress(0);

    if (!user?.id) {
      setError('You must be logged in to create a listing');
      setLoading(false);
      return;
    }

    if (imageFiles.length === 0) {
      setError('Please add at least one image');
      setLoading(false);
      return;
    }

    try {
      setUploadProgress(10);

      const { urls: imageUrls, errors: imageErrors } = await uploadMultipleImages(
        imageFiles,
        user.id,
        (progress) => setUploadProgress(10 + progress * 0.5)
      );

      if (imageErrors.length > 0) {
        throw new Error(`Failed to upload ${imageErrors.length} image(s)`);
      }

      setUploadProgress(70);

      let videoUrls: string[] = [];
      if (videoFiles.length > 0) {
        const { urls: vUrls, errors: videoErrors } = await uploadMultipleVideos(
          videoFiles,
          user.id,
          (progress) => setUploadProgress(70 + progress * 0.2)
        );

        if (videoErrors.length > 0) {
          console.warn(`Failed to upload ${videoErrors.length} video(s)`);
        }

        videoUrls = vUrls;
      }

      setUploadProgress(90);

      const listingData = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
        country: formData.location,
        parish: '',
        images: imageUrls,
        videos: videoUrls.length > 0 ? videoUrls : undefined,
        stock_quantity: parseInt(formData.inventory),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        is_negotiable: formData.negotiable,
        metadata: {
          variations: variations.length > 0 ? variations : undefined,
          negotiablePrice: formData.negotiablePrice ? parseFloat(formData.negotiablePrice) : undefined,

          ...(formData.category.startsWith('Real Estate') && {
            propertyType: formData.propertyType,
            bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
            bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : undefined,
            squareFeet: formData.squareFeet ? parseInt(formData.squareFeet) : undefined,
            amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean)
          }),

          ...(formData.category === 'Automotive - Cars' && {
            make: formData.make,
            model: formData.model,
            year: formData.year ? parseInt(formData.year) : undefined,
            mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
            fuelType: formData.fuelType,
            transmission: formData.transmission
          }),

          ...(formData.category === 'Automotive - Parts' && {
            partName: formData.partName,
            partCategory: formData.partCategory,
            compatibleMake: formData.compatibleMake,
            compatibleModel: formData.compatibleModel,
            compatibleYear: formData.compatibleYear ? parseInt(formData.compatibleYear) : undefined
          }),

          ...(formData.category === 'Services' && {
            serviceType: formData.serviceType,
            availability: formData.availability,
            hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
            certifications: formData.certifications.split(',').map(c => c.trim()).filter(Boolean)
          })
        },
        status: 'pending' as const
      };

      const { data, error: createError } = await createListing(listingData);

      if (createError || !data) {
        throw new Error(createError?.message || 'Failed to create listing');
      }

      setUploadProgress(100);
      navigate('/profile?tab=listings');
    } catch (error) {
      console.error('Error creating listing:', error);
      setError(error instanceof Error ? error.message : 'Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isRealEstate = formData.category.startsWith('Real Estate');
  const isCar = formData.category === 'Automotive - Cars';
  const isCarPart = formData.category === 'Automotive - Parts';
  const isService = formData.category === 'Services';
  const allowsVariations = ['Apparel', 'Jewelry', 'Furniture', 'Electronics'].includes(formData.category);

  // Updated condition options (removed Fair and Poor)
  const conditionOptions = isRealEstate 
    ? [
        { value: 'newly-constructed', label: 'Newly Constructed' },
        { value: 'good', label: 'Good Condition' },
        { value: 'average-condition', label: 'Average Condition' },
        { value: 'fixer-upper', label: 'Fixer Upper' }
      ]
    : [
        { value: 'new', label: 'New' },
        { value: 'like-new', label: 'Like New' },
        { value: 'good', label: 'Good' },
        { value: 'used', label: 'Used' }
      ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              List Your Item
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create a detailed listing to attract potential buyers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 caribbean-pattern">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    placeholder="Enter a descriptive title for your item"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location *
                  </label>
                  <select
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  >
                    <option value="">Select your location</option>
                    {caribbeanLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price * (USD)
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Condition *
                  </label>
                  <select
                    name="condition"
                    required
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  >
                    {conditionOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                {/* Negotiable Price */}
                <div className="md:col-span-2">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      name="negotiable"
                      checked={formData.negotiable}
                      onChange={handleInputChange}
                      className="mr-2 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Price is negotiable
                    </label>
                  </div>
                  {formData.negotiable && (
                    <input
                      type="number"
                      name="negotiablePrice"
                      min="0"
                      step="0.01"
                      value={formData.negotiablePrice}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      placeholder="Minimum acceptable price"
                    />
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={6}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    placeholder="Provide a detailed description of your item..."
                  />
                </div>
              </div>
            </div>

            {/* Category-Specific Fields */}
            {isRealEstate && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                  Property Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Property Type
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    >
                      <option value="">Select property type</option>
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      min="0"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      min="0"
                      step="0.5"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Square Feet
                    </label>
                    <input
                      type="number"
                      name="squareFeet"
                      min="0"
                      value={formData.squareFeet}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amenities (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="amenities"
                      value={formData.amenities}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      placeholder="Pool, Garden, Parking, etc."
                    />
                  </div>
                </div>
              </div>
            )}

            {isCar && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                  Vehicle Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Make
                    </label>
                    <select
                      name="make"
                      value={formData.make}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    >
                      <option value="">Select make</option>
                      {carMakes.map(make => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Model
                    </label>
                    <select
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      disabled={!formData.make}
                    >
                      <option value="">Select model</option>
                      {formData.make && carModels[formData.make]?.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Year
                    </label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    >
                      <option value="">Select year</option>
                      {carYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mileage
                    </label>
                    <input
                      type="number"
                      name="mileage"
                      min="0"
                      value={formData.mileage}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      placeholder="Miles"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fuel Type
                    </label>
                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    >
                      <option value="">Select fuel type</option>
                      <option value="Gasoline">Gasoline</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Transmission
                    </label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    >
                      <option value="">Select transmission</option>
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                      <option value="CVT">CVT</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {isCarPart && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                  Car Part Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Part Name
                    </label>
                    <input
                      type="text"
                      name="partName"
                      value={formData.partName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      placeholder="e.g., Engine Block, Brake Pads"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Part Category
                    </label>
                    <select
                      name="partCategory"
                      value={formData.partCategory}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    >
                      <option value="">Select category</option>
                      {carPartsCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Compatible Make
                    </label>
                    <select
                      name="compatibleMake"
                      value={formData.compatibleMake}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    >
                      <option value="">Select make</option>
                      {carMakes.map(make => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Compatible Model
                    </label>
                    <select
                      name="compatibleModel"
                      value={formData.compatibleModel}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      disabled={!formData.compatibleMake}
                    >
                      <option value="">Select model</option>
                      {formData.compatibleMake && carModels[formData.compatibleMake]?.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Compatible Year
                    </label>
                    <select
                      name="compatibleYear"
                      value={formData.compatibleYear}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    >
                      <option value="">Select year</option>
                      {carYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {isService && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                  Service Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Service Type
                    </label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    >
                      <option value="">Select service type</option>
                      {serviceCategories.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hourly Rate (USD)
                    </label>
                    <input
                      type="number"
                      name="hourlyRate"
                      min="0"
                      step="0.01"
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Availability
                    </label>
                    <input
                      type="text"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      placeholder="e.g., Weekdays 9AM-5PM, Weekends available"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      placeholder="e.g., Lawn Care, Tree Trimming, Garden Design"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Certifications (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                      placeholder="e.g., Licensed Electrician, Certified Plumber"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Media Upload */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                Photos & Videos
              </h2>
              {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              {loading && uploadProgress > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              <ImageUpload
                onFilesChange={handleFilesChange}
                allowVideos={true}
                maxImages={10}
                maxVideos={3}
              />
            </div>

            {/* Product Variations */}
            {allowsVariations && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <ProductVariations
                  variations={variations}
                  onVariationsChange={setVariations}
                />
              </div>
            )}

            {/* Additional Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                Additional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Inventory Quantity
                  </label>
                  <input
                    type="number"
                    name="inventory"
                    min="1"
                    value={formData.inventory}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    placeholder="e.g., vintage, handmade, luxury"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 btn-tropical text-white rounded-lg font-medium transition-all ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Creating Listing...' : 'Create Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddProductPage;