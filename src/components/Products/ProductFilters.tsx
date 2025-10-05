import React, { useState } from 'react';
import { Sliders, X } from 'lucide-react';
import { categories, caribbeanLocations } from '../../data/mockData';

interface FilterOptions {
  category: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  condition: string;
  sortBy: string;
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: Partial<FilterOptions>;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ 
  onFilterChange,
  initialFilters = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: initialFilters.category || '',
    location: initialFilters.location || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    condition: initialFilters.condition || '',
    sortBy: initialFilters.sortBy || 'newest',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const clearFilters = () => {
    const resetFilters = {
      category: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      sortBy: 'newest',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden p-4 border-b">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full"
        >
          <span className="font-medium text-gray-800 dark:text-white">Filters</span>
          <Sliders size={20} />
        </button>
      </div>

      {/* Filter Form - Hidden on mobile unless opened */}
      <form 
        onSubmit={handleSubmit}
        className={`p-4 space-y-6 ${isOpen || window.innerWidth >= 768 ? 'block' : 'hidden md:block'}`}
      >
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Filter Products</h3>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Island/Country
          </label>
          <select
            id="location"
            name="location"
            value={filters.location}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Islands</option>
            {caribbeanLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range</h4>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="minPrice" className="sr-only">Min Price</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleInputChange}
                  placeholder="Min"
                  className="pl-7 p-2 block w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex-1">
              <label htmlFor="maxPrice" className="sr-only">Max Price</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleInputChange}
                  placeholder="Max"
                  className="pl-7 p-2 block w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Condition */}
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Condition
          </label>
          <select
            id="condition"
            name="condition"
            value={filters.condition}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="good">Good</option>
            <option value="used">Used</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="newest">Recently Added</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
            <option value="trending">Trending</option>
          </select>
        </div>

        {/* Filter Actions */}
        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md transition-colors"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFilters;