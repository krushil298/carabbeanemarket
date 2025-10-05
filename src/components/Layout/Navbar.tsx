import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, User, ShoppingBag, Heart, MessageCircle, Sun, Moon, Settings, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import Logo from './Logo';
import LocationSelector from './LocationSelector';
import LanguageSelector from './LanguageSelector';
import CurrencySelector from './CurrencySelector';
import AccessibilityMenu from '../Accessibility/AccessibilityMenu';

const Navbar: React.FC = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveDropdown(null); // Close any open dropdowns when mobile menu toggles
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      if (selectedLocation) params.set('location', selectedLocation);
      window.location.href = `/search?${params.toString()}`;
    }
  };

  return (
    <header ref={navRef} className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          {/* Location Selector - Desktop */}
          <div className="hidden lg:block">
            <LocationSelector 
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />
          </div>

          {/* Search Bar - Hidden on mobile, visible on desktop */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-md mx-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full"
          >
            <input
              type="text"
              placeholder={t('search.placeholder')}
              className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="text-gray-500 hover:text-teal-600">
              <Search size={20} />
            </button>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/products" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors">
              {t('nav.explore')}
            </Link>
            
            <Link to="/events" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors">
              {t('nav.events')}
            </Link>
            
            <Link to="/forum" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors">
              {t('nav.forum')}
            </Link>
            
            {/* Currency Selector */}
            <CurrencySelector 
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />
            
            {/* Language Selector */}
            <LanguageSelector 
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />
            
            {/* Accessibility Menu */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'accessibility' ? null : 'accessibility')}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors"
              >
                <Settings size={20} />
              </button>
              {activeDropdown === 'accessibility' && (
                <div className="absolute right-0 mt-2 z-50">
                  <AccessibilityMenu />
                </div>
              )}
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {isAuthenticated ? (
              <>
                <Link to="/favorites" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors">
                  <Heart size={20} />
                </Link>
                <Link to="/messages" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors">
                  <MessageCircle size={20} />
                </Link>
                <div className="relative group">
                  <button 
                    onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')}
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors"
                  >
                    {currentUser?.profilePicture ? (
                      <img 
                        src={currentUser.profilePicture} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                  </button>
                  {activeDropdown === 'profile' && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      {t('nav.profile')}
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      {t('nav.orders')}
                    </Link>
                    <Link to="/seller-profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Seller Profile
                    </Link>
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                    </div>
                  )}
                </div>
                <Link 
                  to="/add-product" 
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors font-medium whitespace-nowrap"
                >
                  {t('nav.sell')}
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors">
                  {t('nav.login')}
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors whitespace-nowrap"
                >
                  {t('nav.signup')}
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none" 
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Search & Location */}
        <div className="mt-4 md:hidden space-y-3">
          <LocationSelector 
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
          />
          <form 
            onSubmit={handleSearch}
            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full"
          >
            <input
              type="text"
              placeholder={t('search.placeholder')}
              className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="text-gray-500 hover:text-teal-600">
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/products" 
                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.explore')}
              </Link>
              
              <Link 
                to="/events" 
                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar size={20} className="mr-2" />
                <span>{t('nav.events')}</span>
              </Link>
              
              <Link 
                to="/forum" 
                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.forum')}
              </Link>
              
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false);
                }}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors"
              >
                {isDarkMode ? <Sun size={20} className="mr-2" /> : <Moon size={20} className="mr-2" />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/favorites" 
                    className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart size={20} className="mr-2" />
                    <span>{t('nav.favorites')}</span>
                  </Link>
                  <Link 
                    to="/messages" 
                    className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MessageCircle size={20} className="mr-2" />
                    <span>{t('nav.messages')}</span>
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={20} className="mr-2" />
                    <span>{t('nav.profile')}</span>
                  </Link>
                  <Link 
                    to="/orders" 
                    className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingBag size={20} className="mr-2" />
                    <span>{t('nav.orders')}</span>
                  </Link>
                  <Link 
                    to="/seller-profile" 
                    className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Seller Profile
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors"
                  >
                    Sign Out
                  </button>
                  <Link 
                    to="/add-product" 
                    className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors text-center font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.sell')}
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.signup')}
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;