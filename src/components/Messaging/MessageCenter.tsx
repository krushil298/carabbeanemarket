import React, { useState } from 'react';
import { Send, Paperclip, Image, MoreVertical, Search } from 'lucide-react';
import { Message } from '../../types';
import { formatDate } from '../../utils/formatters';

interface MessageCenterProps {
  conversations: { [key: string]: Message[] };
  currentConversation: string | null;
  onSendMessage: (receiverId: string, content: string, attachments?: string[]) => void;
  onSelectConversation: (conversationId: string) => void;
}

const MessageCenter: React.FC<MessageCenterProps> = ({
  conversations,
  currentConversation,
  onSendMessage,
  onSelectConversation
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() && currentConversation) {
      onSendMessage(currentConversation, newMessage);
      setNewMessage('');
    }
  };

  const filteredConversations = Object.entries(conversations).filter(([id, messages]) =>
    messages.some(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="flex h-96 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-600">
        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto h-full">
          {filteredConversations.map(([conversationId, messages]) => {
            const lastMessage = messages[messages.length - 1];
            const isActive = currentConversation === conversationId;
            
            return (
              <button
                key={conversationId}
                onClick={() => onSelectConversation(conversationId)}
                className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 ${
                  isActive ? 'bg-teal-50 dark:bg-teal-900/20' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {conversationId.slice(-2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 dark:text-white text-sm">
                      User {conversationId.slice(-4)}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {lastMessage?.content || 'No messages'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {lastMessage && formatDate(lastMessage.timestamp)}
                    </div>
                  </div>
                  {!lastMessage?.read && (
                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Message Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {currentConversation.slice(-2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    User {currentConversation.slice(-4)}
                  </div>
                  <div className="text-xs text-gray-500">Online</div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversations[currentConversation]?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === 'current-user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === 'current-user'
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {formatDate(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <Paperclip size={20} />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Image size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-full transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCenter;