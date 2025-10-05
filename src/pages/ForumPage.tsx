import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import CommunityForum from '../components/Forum/CommunityForum';
import { ForumPost, ForumReply } from '../types';

const ForumPage: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: 'post-1',
      userId: 'user-1',
      title: 'Best places to sell electronics in Jamaica?',
      content: 'I have some used electronics I want to sell. What are the best platforms or locations in Jamaica for selling electronics safely?',
      category: 'buying-selling',
      createdAt: new Date('2024-01-10'),
      replies: [
        {
          id: 'reply-1',
          userId: 'user-2',
          content: 'I\'ve had good success with local Facebook groups and this marketplace. Make sure to meet in public places!',
          createdAt: new Date('2024-01-11'),
          likes: 5
        }
      ],
      likes: 12,
      views: 45
    },
    {
      id: 'post-2',
      userId: 'user-3',
      title: 'Upcoming craft fair in Barbados',
      content: 'There\'s a craft fair happening next month in Bridgetown. Great opportunity for local artisans to showcase their work!',
      category: 'local-events',
      createdAt: new Date('2024-01-12'),
      replies: [],
      likes: 8,
      views: 32
    }
  ]);

  const handleCreatePost = (newPost: Omit<ForumPost, 'id' | 'createdAt' | 'replies' | 'likes' | 'views'>) => {
    const post: ForumPost = {
      ...newPost,
      id: `post-${Date.now()}`,
      createdAt: new Date(),
      replies: [],
      likes: 0,
      views: 0
    };
    setPosts([post, ...posts]);
  };

  const handleReplyToPost = (postId: string, newReply: Omit<ForumReply, 'id' | 'createdAt' | 'likes'>) => {
    const reply: ForumReply = {
      ...newReply,
      id: `reply-${Date.now()}`,
      createdAt: new Date(),
      likes: 0
    };

    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, replies: [...post.replies, reply] }
        : post
    ));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <CommunityForum 
          posts={posts}
          onCreatePost={handleCreatePost}
          onReplyToPost={handleReplyToPost}
        />
      </div>
    </Layout>
  );
};

export default ForumPage;