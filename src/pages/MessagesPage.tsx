import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import MessageCenter from '../components/Messaging/MessageCenter';
import { useAuth } from '../context/AuthContext';
import { Message } from '../types';

const MessagesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<{ [key: string]: Message[] }>({
    'user-2': [
      {
        id: 'msg-1',
        senderId: 'user-2',
        receiverId: 'current-user',
        content: 'Hi, is the Toyota Camry still available?',
        timestamp: new Date('2024-01-10T14:30:00'),
        read: true,
        productId: 'product-1',
        messageType: 'text'
      },
      {
        id: 'msg-2',
        senderId: 'current-user',
        receiverId: 'user-2',
        content: 'Yes, it is! Would you like to schedule a viewing?',
        timestamp: new Date('2024-01-10T15:45:00'),
        read: true,
        productId: 'product-1',
        messageType: 'text'
      }
    ],
    'user-3': [
      {
        id: 'msg-3',
        senderId: 'user-3',
        receiverId: 'current-user',
        content: 'Interested in your laptop. What\'s the condition?',
        timestamp: new Date('2024-01-11T10:20:00'),
        read: false,
        productId: 'product-3',
        messageType: 'text'
      }
    ]
  });
  const [currentConversation, setCurrentConversation] = useState<string | null>('user-2');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleSendMessage = (receiverId: string, content: string, attachments?: string[]) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      receiverId,
      content,
      timestamp: new Date(),
      read: false,
      attachments,
      messageType: 'text'
    };

    setConversations(prev => ({
      ...prev,
      [receiverId]: [...(prev[receiverId] || []), newMessage]
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Communicate with buyers and sellers
          </p>
        </div>

        <MessageCenter
          conversations={conversations}
          currentConversation={currentConversation}
          onSendMessage={handleSendMessage}
          onSelectConversation={setCurrentConversation}
        />
      </div>
    </Layout>
  );
};

export default MessagesPage;