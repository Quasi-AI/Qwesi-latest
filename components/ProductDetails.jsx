'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon, MessageCircle, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

const ProductDetails = ({ productId: initialProductId }) => {
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [mainImage, setMainImage] = useState('')
    const [showRatingForm, setShowRatingForm] = useState(false)
    const [ratingForm, setRatingForm] = useState({
        rating: 5,
        comment: '',
        reviewerName: ''
    })
    const [submittingRating, setSubmittingRating] = useState(false)

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const cart = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();
    const router = useRouter()

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch(`${API_BASE_URL}/products/${initialProductId}`)
                
                if (response.ok) {
                    const result = await response.json()
                    
                    if (result.success) {
                        setProduct(result.data)
                        setMainImage(result.data.images?.[0] || '/placeholder-image.jpg')
                    } else {
                        throw new Error(result.message || 'Product not found')
                    }
                } else if (response.status === 404) {
                    throw new Error('Product not found')
                } else {
                    throw new Error(`Failed to fetch product details`)
                }

            } catch (error) {
                console.error('Error fetching product:', error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        if (initialProductId) {
            fetchProduct()
        }
    }, [initialProductId])

    const addToCartHandler = () => {
        dispatch(addToCart({ productId: product.id }))
    }

    const submitRating = async (e) => {
        e.preventDefault()
        
        try {
            setSubmittingRating(true)

            const response = await fetch(`${API_BASE_URL}/products/${product.id}/rating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ratingForm),
            })

            if (response.ok) {
                const result = await response.json()
                
                if (result.success) {
                    // Update product with new rating data
                    setProduct(result.data)
                    setShowRatingForm(false)
                    setRatingForm({ rating: 5, comment: '', reviewerName: '' })
                } else {
                    throw new Error(result.message || 'Failed to submit rating')
                }
            } else {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to submit rating')
            }

        } catch (error) {
            console.error('Error submitting rating:', error)
            alert('Failed to submit rating: ' + error.message)
        } finally {
            setSubmittingRating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex max-lg:flex-col gap-12 animate-pulse">
                <div className="flex max-sm:flex-col-reverse gap-3">
                    <div className="flex sm:flex-col gap-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="bg-gray-200 size-26 rounded-lg"></div>
                        ))}
                    </div>
                    <div className="h-100 sm:size-113 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="flex-1">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                    <div className="h-12 bg-gray-200 rounded w-40"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button 
                    onClick={() => router.back()} 
                    className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded transition-colors"
                >
                    Go Back
                </button>
            </div>
        )
    }

    if (!product) return null

    // Calculate average rating
    const ratings = product.rating || []
    const averageRating = ratings.length > 0 
        ? ratings.reduce((acc, item) => acc + item.rating, 0) / ratings.length 
        : 0

    // Calculate discount percentage
    const originalPrice = product.originalPrice || product.price * 1.2
    const discountPercentage = originalPrice > product.price 
        ? ((originalPrice - product.price) / originalPrice * 100).toFixed(0)
        : 0

    return (
        <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                <div className="flex sm:flex-col gap-3">
                    {(product.images || []).map((image, index) => (
                        <div 
                            key={index} 
                            onClick={() => setMainImage(image)} 
                            className={`bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer border-2 ${
                                mainImage === image ? 'border-slate-400' : 'border-transparent'
                            }`}
                        >
                            <Image 
                                src={image} 
                                className="group-hover:scale-103 group-active:scale-95 transition" 
                                alt={`${product.name} image ${index + 1}`} 
                                width={45} 
                                height={45} 
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg">
                    <Image 
                        src={mainImage} 
                        alt={product.name}
                        width={250} 
                        height={250} 
                    />
                </div>
            </div>
            
            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-800">{product.name}</h1>
                
                {/* Rating Display */}
                <div className='flex items-center mt-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon 
                            key={index} 
                            size={14} 
                            className='text-transparent mt-0.5' 
                            fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"} 
                        />
                    ))}
                    <p className="text-sm ml-3 text-slate-500">
                        {ratings.length} Review{ratings.length !== 1 ? 's' : ''}
                        {averageRating > 0 && (
                            <span className="ml-2">({averageRating.toFixed(1)})</span>
                        )}
                    </p>
                </div>

                {/* SKU Display */}
                {product.sku && (
                    <p className="text-sm text-slate-500 mt-1">SKU: {product.sku}</p>
                )}
                
                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
                    <p>{currency}{product.price}</p>
                    {originalPrice > product.price && (
                        <p className="text-xl text-slate-500 line-through">{currency}{originalPrice}</p>
                    )}
                </div>
                
                {discountPercentage > 0 && (
                    <div className="flex items-center gap-2 text-slate-500">
                        <TagIcon size={14} />
                        <p>Save {discountPercentage}% right now</p>
                    </div>
                )}

                {/* Stock Status */}
                <div className="mt-4">
                    {product.stock > 0 ? (
                        <p className="text-green-600 text-sm">✓ In Stock ({product.stock} available)</p>
                    ) : (
                        <p className="text-red-600 text-sm">✗ Out of Stock</p>
                    )}
                </div>

                {/* Description */}
                {product.description && (
                    <div className="mt-6">
                        <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
                    </div>
                )}
                
                <div className="flex items-end gap-5 mt-10">
                    {cart[product.id] && (
                        <div className="flex flex-col gap-3">
                            <p className="text-lg text-slate-800 font-semibold">Quantity</p>
                            <Counter productId={product.id} />
                        </div>
                    )}
                    <button 
                        onClick={() => !cart[product.id] ? addToCartHandler() : router.push('/cart')} 
                        className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition disabled:opacity-50"
                        disabled={product.stock === 0}
                    >
                        {product.stock === 0 ? 'Out of Stock' : 
                         !cart[product.id] ? 'Add to Cart' : 'View Cart'}
                    </button>
                </div>

                <hr className="border-gray-300 my-5" />
                
                <div className="flex flex-col gap-4 text-slate-500">
                    <p className="flex gap-3"><EarthIcon className="text-slate-400" /> Free shipping worldwide</p>
                    <p className="flex gap-3"><CreditCardIcon className="text-slate-400" /> 100% Secured Payment</p>
                    <p className="flex gap-3"><UserIcon className="text-slate-400" /> Trusted by top brands</p>
                </div>

                {/* Rating Section */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">Customer Reviews</h3>
                        <button 
                            onClick={() => setShowRatingForm(!showRatingForm)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded transition-colors"
                        >
                            Write Review
                        </button>
                    </div>

                    {/* Rating Form */}
                    {showRatingForm && (
                        <form onSubmit={submitRating} className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        value={ratingForm.reviewerName}
                                        onChange={(e) => setRatingForm({...ratingForm, reviewerName: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                                    <div className="flex gap-1">
                                        {Array(5).fill('').map((_, index) => (
                                            <StarIcon
                                                key={index}
                                                size={24}
                                                className={`cursor-pointer transition-colors ${
                                                    index < ratingForm.rating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                                fill={index < ratingForm.rating ? '#F59E0B' : '#D1D5DB'}
                                                onClick={() => setRatingForm({...ratingForm, rating: index + 1})}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Comment (Optional)</label>
                                    <textarea
                                        value={ratingForm.comment}
                                        onChange={(e) => setRatingForm({...ratingForm, comment: e.target.value})}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Share your experience with this product..."
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={submittingRating}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Send size={16} />
                                        {submittingRating ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowRatingForm(false)}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 text-sm rounded transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {ratings.length > 0 ? (
                            ratings.slice().reverse().map((review, index) => (
                                <div key={index} className="border-b border-gray-200 pb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex">
                                            {Array(5).fill('').map((_, starIndex) => (
                                                <StarIcon
                                                    key={starIndex}
                                                    size={14}
                                                    fill={starIndex < review.rating ? "#F59E0B" : "#D1D5DB"}
                                                    className="text-transparent"
                                                />
                                            ))}
                                        </div>
                                        <span className="font-medium text-slate-800">
                                            {review.reviewerName || 'Anonymous'}
                                        </span>
                                        <span className="text-sm text-slate-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {review.comment && (
                                        <p className="text-slate-600 text-sm">{review.comment}</p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-center py-4">No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails