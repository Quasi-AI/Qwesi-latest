import { Star } from "lucide-react";
import React from "react";

const Rating = ({ 
    value = 0, 
    maxRating = 5,
    size = 4,
    showValue = false,
    reviewCount = null,
    interactive = false,
    onChange = null,
    className = "",
    emptyColor = "text-gray-300",
    fillColor = "text-yellow-400"
}) => {
    const handleStarClick = (rating) => {
        if (interactive && onChange) {
            onChange(rating);
        }
    };

    const getStarClassName = (index) => {
        const baseClass = `shrink-0 fill-current transition-colors`;
        const sizeClass = size === 'sm' ? 'size-3' : 
                         size === 'lg' ? 'size-6' : 
                         size === 'xl' ? 'size-8' : 
                         `size-${size}`;
        
        const colorClass = value > index ? fillColor : emptyColor;
        const interactiveClass = interactive ? 'cursor-pointer hover:scale-110 transition-transform' : '';
        
        return `${baseClass} ${sizeClass} ${colorClass} ${interactiveClass}`;
    };

    // Calculate average rating display
    const displayValue = typeof value === 'number' ? value : 0;
    const roundedValue = Math.round(displayValue * 2) / 2; // Round to nearest 0.5

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <div className="flex items-center">
                {Array.from({ length: maxRating }, (_, i) => {
                    const starIndex = i + 1;
                    const isFilled = roundedValue >= starIndex;
                    const isHalfFilled = roundedValue >= starIndex - 0.5 && roundedValue < starIndex;
                    
                    return (
                        <div key={i} className="relative" onClick={() => handleStarClick(starIndex)}>
                            <Star
                                className={getStarClassName(i)}
                            />
                            {/* Half-star overlay for more precise ratings */}
                            {isHalfFilled && (
                                <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                                    <Star
                                        className={`shrink-0 fill-current ${
                                            size === 'sm' ? 'size-3' : 
                                            size === 'lg' ? 'size-6' : 
                                            size === 'xl' ? 'size-8' : 
                                            `size-${size}`
                                        } ${fillColor}`}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {/* Rating value display */}
            {showValue && (
                <span className="text-sm font-medium text-gray-600 ml-1">
                    {displayValue > 0 ? displayValue.toFixed(1) : '0.0'}
                </span>
            )}
            
            {/* Review count */}
            {reviewCount !== null && reviewCount >= 0 && (
                <span className="text-sm text-gray-500 ml-1">
                    ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                </span>
            )}
        </div>
    );
};

// Utility function to calculate average rating from rating array
Rating.calculateAverage = (ratings = []) => {
    if (!Array.isArray(ratings) || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + (rating.rating || 0), 0);
    return sum / ratings.length;
};

// Utility function to get rating distribution
Rating.getDistribution = (ratings = []) => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(rating => {
        const ratingValue = rating.rating || 0;
        if (ratingValue >= 1 && ratingValue <= 5) {
            distribution[Math.round(ratingValue)]++;
        }
    });
    return distribution;
};

export default Rating;