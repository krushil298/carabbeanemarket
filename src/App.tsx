import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { CurrencyProvider } from './context/CurrencyContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProfilePage from './pages/ProfilePage';
import SearchResultsPage from './pages/SearchResultsPage';
import EventsPage from './pages/EventsPage';
import ForumPage from './pages/ForumPage';
import MessagesPage from './pages/MessagesPage';
import OrdersPage from './pages/OrdersPage';
import AddProductPage from './pages/AddProductPage';
import SellerProfilePage from './pages/SellerProfilePage';
import FavoritesPage from './pages/FavoritesPage';

const App: React.FC = () => {
  return (
    <AccessibilityProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <CurrencyProvider>
              <ProductProvider>
                <Router>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/seller-profile" element={<SellerProfilePage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/forum" element={<ForumPage />} />
                    <Route path="/messages" element={<MessagesPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/add-product" element={<AddProductPage />} />
                    <Route path="/sell" element={<AddProductPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    
                    {/* Fallback */}
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </Router>
              </ProductProvider>
            </CurrencyProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AccessibilityProvider>
  );
};

export default App;