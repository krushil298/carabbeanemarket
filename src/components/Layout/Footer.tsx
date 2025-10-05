import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github as GitHub } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white pt-12 pb-8 mt-16 transition-colors">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <Logo size="md" showText={true} className="text-white" />
            </Link>
            <p className="text-gray-300 mb-4">
              The premier marketplace connecting buyers and sellers across the Caribbean islands.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
                <GitHub size={20} />
              </a>
            </div>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Popular Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=Cars" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Cars for Sale
                </Link>
              </li>
              <li>
                <Link to="/products?category=Real Estate" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Real Estate
                </Link>
              </li>
              <li>
                <Link to="/products?category=Electronics" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=Jobs" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Jobs
                </Link>
              </li>
              <li>
                <Link to="/products?category=Services" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Services
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Islands */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Popular Islands</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?location=Jamaica" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Jamaica
                </Link>
              </li>
              <li>
                <Link to="/products?location=Barbados" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Barbados
                </Link>
              </li>
              <li>
                <Link to="/products?location=Trinidad and Tobago" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Trinidad & Tobago
                </Link>
              </li>
              <li>
                <Link to="/products?location=Bahamas" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Bahamas
                </Link>
              </li>
              <li>
                <Link to="/products?location=Dominican Republic" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Dominican Republic
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Account */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">My Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/signup" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-teal-400 transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/my-products" className="text-gray-300 hover:text-teal-400 transition-colors">
                  My Listings
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/forgot-password" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Reset Password
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Caribbean eMarket. All rights reserved.</p>
          <p className="mt-2">
            <Link to="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link>
            {' • '}
            <Link to="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
            {' • '}
            <Link to="/safety" className="hover:text-teal-400 transition-colors">Safety Tips</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;