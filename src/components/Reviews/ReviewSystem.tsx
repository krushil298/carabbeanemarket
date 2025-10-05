import React, { useState } from 'react';
import { Star, ThumbsUp, Flag, User } from 'lucide-react';
import { Review } from '../../types';
import { formatDate } from '../../utils/formatters';

interface ReviewSystemProps {
  reviews: Review[];
  targetId: string;
  targetType: 'product' | 'user';
  onAddReview?: (review: Omit<Review, 'id' | 'createdAt' | 'helpful'>) => void;
  canReview?: boolean;
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({
  reviews,
  targetId,
  targetType,
  onAddReview,
  canReview = false
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  const handleSubmitReview = () => {
    if (onAddReview && newReview.comment.trim()) {
      onAddReview({
        userId: 'current-user', // This would come from auth context
        targetId,
        targetType,
        rating: newReview.rating,
        comment: newReview.comment,
        verified: false
      });
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              {averageRating.toFixed(1)}
            </div>
            {renderStars(Math.round(averageRating), 'lg')}
            <div className="text-sm text-gray-500 mt-2">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center text-sm">
                <span className="w-8 text-gray-600 dark:text-gray-400">{rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current mx-1" />
                <div className="flex-1 mx-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-gray-600 dark:text-gray-400">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add Review Button */}
        {canReview && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Write a Review
            </button>
          </div>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Write Your Review
          </h3>
          
          {/* Rating Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= newReview.rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300 hover:text-yellow-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Review
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Share your experience..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleSubmitReview}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Submit Review
            </button>
            <button
              onClick={() => setShowReviewForm(false)}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-500" />
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    User {review.userId.slice(-4)}
                    {review.verified && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </div>
                </div>
              </div>
              {renderStars(review.rating, 'sm')}
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {review.comment}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <button className="flex items-center space-x-1 hover:text-teal-600">
                <ThumbsUp size={14} />
                <span>Helpful ({review.helpful})</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-red-600">
                <Flag size={14} />
                <span>Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSystem;