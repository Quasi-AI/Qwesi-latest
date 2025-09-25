'use client'

import { Star, X } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

const RatingModal = ({ ratingModal, setRatingModal, onRatingSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [reviewerName, setReviewerName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Extract product info from ratingModal object
    const productId = ratingModal?.productId || ratingModal?.id;
    const productName = ratingModal?.name || 'this product';

    const handleSubmit = async () => {
        // Validation
        if (rating < 1 || rating > 5) {
            toast.error('Please select a rating between 1-5 stars');
            return;
        }

        if (!productId) {
            toast.error('Product information missing');
            return;
        }

        try {
            setSubmitting(true);

            const requestBody = {
                rating,
                comment: review.trim() || undefined,
                reviewerName: reviewerName.trim() || undefined
            };

            const response = await fetch(`${API_BASE_URL}/products/${productId}/rating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const result = await response.json();
                
                if (result.success) {
                    toast.success('Rating submitted successfully!');
                    
                    // Call callback function to update parent component with new product data
                    if (onRatingSubmitted && typeof onRatingSubmitted === 'function') {
                        onRatingSubmitted(result.data);
                    }
                    
                    // Reset form and close modal
                    setRating(0);
                    setReview('');
                    setReviewerName('');
                    setRatingModal(null);
                } else {
                    throw new Error(result.message || 'Failed to submit rating');
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: Failed to submit rating`);
            }

        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error(error.message || 'Failed to submit rating. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!submitting) {
            setRating(0);
            setReview('');
            setReviewerName('');
            setRatingModal(null);
        }
    };

    if (!ratingModal) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
            <div className='bg-white p-8 rounded-lg shadow-xl w-96 relative max-h-[90vh] overflow-y-auto'>
                <button 
                    onClick={handleClose} 
                    className='absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50'
                    disabled={submitting}
                >
                    <X size={20} />
                </button>

                <h2 className='text-xl font-semibold text-slate-800 mb-2'>Rate Product</h2>
                <p className='text-sm text-slate-600 mb-6'>Share your experience with {productName}</p>

                {/* Name Input */}
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                        Your Name (Optional)
                    </label>
                    <input
                        type="text"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="Enter your name"
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all'
                        disabled={submitting}
                    />
                </div>

                {/* Star Rating */}
                <div className='mb-4'>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                        Rating <span className="text-red-500">*</span>
                    </label>
                    <div className='flex items-center justify-center mb-2'>
                        {Array.from({ length: 5 }, (_, i) => (
                            <Star
                                key={i}
                                className={`size-8 cursor-pointer transition-all hover:scale-110 ${
                                    rating > i 
                                        ? "text-yellow-400 fill-current" 
                                        : "text-gray-300 hover:text-yellow-200"
                                } ${submitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                onClick={() => !submitting && setRating(i + 1)}
                            />
                        ))}
                    </div>
                    <p className='text-center text-sm text-slate-500'>
                        {rating === 0 && 'Click stars to rate'}
                        {rating === 1 && '⭐ Poor'}
                        {rating === 2 && '⭐⭐ Fair'}
                        {rating === 3 && '⭐⭐⭐ Good'}
                        {rating === 4 && '⭐⭐⭐⭐ Very Good'}
                        {rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
                    </p>
                </div>

                {/* Review Text */}
                <div className='mb-6'>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>
                        Review (Optional)
                    </label>
                    <textarea
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none transition-all'
                        placeholder='Share your thoughts about this product...'
                        rows='4'
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        disabled={submitting}
                        maxLength={500}
                    />
                    <p className='text-xs text-slate-500 mt-1'>
                        {review.length}/500 characters
                    </p>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-3'>
                    <button 
                        onClick={() => !submitting && toast.promise(
                            handleSubmit(), 
                            { 
                                loading: 'Submitting rating...', 
                                success: 'Rating submitted!',
                                error: 'Failed to submit rating'
                            }
                        )} 
                        className='flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium'
                        disabled={submitting || rating === 0}
                    >
                        {submitting ? 'Submitting...' : 'Submit Rating'}
                    </button>
                    
                    <button 
                        onClick={handleClose}
                        className='px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50'
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                </div>

                {/* Helper Text */}
                <p className='text-xs text-slate-500 text-center mt-4'>
                    Your review will help other customers make informed decisions
                </p>
            </div>
        </div>
    )
}

export default RatingModal