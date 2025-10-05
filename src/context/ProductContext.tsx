import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, User } from '../types';
import { mockProducts } from '../data/mockData';
import { useAuth } from './AuthContext';

interface ProductContextType {
  products: Product[];
  userProducts: Product[];
  addProduct: (product: Omit<Product, 'id' | 'userId' | 'createdAt' | 'favorites' | 'sold'>) => Promise<Product>;
  getProduct: (id: string) => Product | undefined;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string) => void;
  favoriteProducts: Product[];
  searchProducts: (query: string, category?: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const { currentUser } = useAuth();

  // Get user's products
  const userProducts = currentUser 
    ? products.filter(product => product.userId === currentUser.id)
    : [];

  // Load favorites from localStorage
  useEffect(() => {
    if (currentUser) {
      const savedFavorites = localStorage.getItem(`favorites-${currentUser.id}`);
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites) as string[];
        const favProducts = products.filter(p => favoriteIds.includes(p.id));
        setFavoriteProducts(favProducts);
      }
    }
  }, [currentUser, products]);

  // Add product
  const addProduct = async (productData: Omit<Product, 'id' | 'userId' | 'createdAt' | 'favorites' | 'sold'>): Promise<Product> => {
    if (!currentUser) throw new Error('User must be logged in to add a product');
    
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      userId: currentUser.id,
      ...productData,
      createdAt: new Date(),
      favorites: 0,
      sold: false,
    };
    
    setProducts(prevProducts => [...prevProducts, newProduct]);
    return newProduct;
  };

  // Get product by ID
  const getProduct = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  // Update product
  const updateProduct = async (id: string, updates: Partial<Product>): Promise<boolean> => {
    try {
      if (!currentUser) return false;
      
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id && product.userId === currentUser.id
            ? { ...product, ...updates }
            : product
        )
      );
      return true;
    } catch (error) {
      console.error('Update product error:', error);
      return false;
    }
  };

  // Delete product
  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      if (!currentUser) return false;
      
      setProducts(prevProducts => 
        prevProducts.filter(product => 
          !(product.id === id && product.userId === currentUser.id)
        )
      );
      return true;
    } catch (error) {
      console.error('Delete product error:', error);
      return false;
    }
  };

  // Toggle favorite
  const toggleFavorite = (id: string): void => {
    if (!currentUser) return;
    
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const isFavorite = favoriteProducts.some(p => p.id === id);
    
    if (isFavorite) {
      setFavoriteProducts(prev => prev.filter(p => p.id !== id));
    } else {
      setFavoriteProducts(prev => [...prev, product]);
    }
    
    // Save favorites to localStorage
    const favoriteIds = !isFavorite 
      ? [...favoriteProducts.map(p => p.id), id]
      : favoriteProducts.filter(p => p.id !== id).map(p => p.id);
      
    localStorage.setItem(`favorites-${currentUser.id}`, JSON.stringify(favoriteIds));
  };

  // Search products
  const searchProducts = (query: string, category?: string, location?: string): Product[] => {
    const searchLower = query.toLowerCase();
    return products.filter(product => {
      const matchesCategory = !category || product.category === category;
      const matchesLocation = !location || product.location === location;
      const matchesQuery = 
        product.title.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower);
      
      return matchesCategory && matchesLocation && matchesQuery;
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        userProducts,
        addProduct,
        getProduct,
        updateProduct,
        deleteProduct,
        toggleFavorite,
        favoriteProducts,
        searchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};