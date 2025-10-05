import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Eye, Plus, Search, Filter } from 'lucide-react';
import { ForumPost, ForumReply } from '../../types';
import { formatDate } from '../../utils/formatters';

interface CommunityForumProps {
  posts: ForumPost[];
  onCreatePost?: (post: Omit<ForumPost, 'id' | 'createdAt' | 'replies' | 'likes' | 'views'>) => void;
  onReplyToPost?: (postId: string, reply: Omit<ForumReply, 'id' | 'createdAt' | 'likes'>) => void;
}

const CommunityForum: React.FC<CommunityForumProps> = ({
  posts,
  onCreatePost,
  onReplyToPost
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general'
  });
  const [newReply, setNewReply] = useState('');

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'general', name: 'General Discussion' },
    { id: 'buying-selling', name: 'Buying & Selling Tips' },
    { id: 'local-events', name: 'Local Events' },
    { id: 'recommendations', name: 'Recommendations' },
    { id: 'support', name: 'Support' }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreatePost = () => {
    if (onCreatePost && newPost.title.trim() && newPost.content.trim()) {
      onCreatePost({
        userId: 'current-user',
        title: newPost.title,
        content: newPost.content,
        category: newPost.category
      });
      setNewPost({ title: '', content: '', category: 'general' });
      setShowCreateForm(false);
    }
  };

  const handleReply = (postId: string) => {
    if (onReplyToPost && newReply.trim()) {
      onReplyToPost(postId, {
        userId: 'current-user',
        content: newReply
      });
      setNewReply('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Community Forum
          </h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus size={16} className="mr-2" />
            New Post
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Create Post Form */}
      {showCreateForm && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Create New Post
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Post title..."
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {categories.slice(1).map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <textarea
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleCreatePost}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Post
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-600">
        {filteredPosts.map((post) => (
          <div key={post.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {post.title}
                  </h3>
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                    {categories.find(c => c.id === post.category)?.name}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {post.content}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>By User {post.userId.slice(-4)}</span>
                  <span>{formatDate(post.createdAt)}</span>
                  <div className="flex items-center space-x-1">
                    <Eye size={14} />
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp size={14} />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare size={14} />
                    <span>{post.replies.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Replies */}
            {selectedPost === post.id && (
              <div className="mt-6 space-y-4">
                {post.replies.map((reply) => (
                  <div key={reply.id} className="ml-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800 dark:text-white">
                        User {reply.userId.slice(-4)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(reply.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {reply.content}
                    </p>
                  </div>
                ))}
                
                {/* Reply Form */}
                <div className="ml-6 mt-4">
                  <textarea
                    placeholder="Write a reply..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleReply(post.id)}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Toggle Replies Button */}
            {post.replies.length > 0 && (
              <button
                onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                className="mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium"
              >
                {selectedPost === post.id ? 'Hide' : 'Show'} {post.replies.length} replies
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityForum;