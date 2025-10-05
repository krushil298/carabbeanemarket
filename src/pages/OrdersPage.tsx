import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { formatDate, formatPrice } from '../utils/formatters';

const OrdersPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'buying' | 'selling'>('buying');
  
  // Mock orders data
  const [orders] = useState<Order[]>([
    {
      id: 'order-1',
      buyerId: 'current-user',
      sellerId: 'user-2',
      productId: 'product-1',
      quantity: 1,
      totalPrice: 25000,
      status: 'confirmed',
      createdAt: new Date('2024-01-10'),
      shippingAddress: '123 Main St, Kingston, Jamaica'
    },
    {
      id: 'order-2',
      buyerId: 'user-3',
      sellerId: 'current-user',
      productId: 'product-3',
      quantity: 1,
      totalPrice: 1200,
      status: 'pending',
      createdAt: new Date('2024-01-12')
    }
  ]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const buyingOrders = orders.filter(order => order.buyerId === 'current-user');
  const sellingOrders = orders.filter(order => order.sellerId === 'current-user');

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'disputed':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'disputed':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const currentOrders = activeTab === 'buying' ? buyingOrders : sellingOrders;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            My Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your purchases and sales
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('buying')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'buying'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Buying ({buyingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('selling')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'selling'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Selling ({sellingOrders.length})
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Order #{order.id.slice(-6)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      Product ID: {order.productId}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <span className="font-medium">Quantity:</span> {order.quantity}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> {formatPrice(order.totalPrice)}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {formatDate(order.createdAt)}
                      </div>
                    </div>
                    
                    {order.shippingAddress && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Shipping to:</span> {order.shippingAddress}
                      </div>
                    )}
                    
                    {order.trackingNumber && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Tracking:</span> {order.trackingNumber}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {order.status === 'pending' && activeTab === 'selling' && (
                      <>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                          Confirm Order
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                          Cancel Order
                        </button>
                      </>
                    )}
                    
                    {order.status === 'confirmed' && activeTab === 'selling' && (
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                        Mark as Shipped
                      </button>
                    )}
                    
                    {order.status === 'shipped' && activeTab === 'buying' && (
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                        Confirm Delivery
                      </button>
                    )}
                    
                    <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 caribbean-bg-light dark:bg-gray-800 rounded-lg">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                No {activeTab} orders yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {activeTab === 'buying' 
                  ? "You haven't made any purchases yet" 
                  : "You haven't received any orders yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;