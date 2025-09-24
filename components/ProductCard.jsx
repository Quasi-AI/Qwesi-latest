'use client'
import { StarIcon, HeartIcon, MessageCircleIcon, PhoneIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const ProductCard = ({ product }) => {
    const [isWishlisted, setIsWishlisted] = useState(false)
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    // Calculate the average rating of the product
    const rating = product.rating && product.rating.length > 0 
        ? Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length)
        : 0

    // Check if product is on sale
    const originalPrice = product.originalPrice || product.price * 1.2
    const isOnSale = originalPrice > product.price

    const handleWishlistClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsWishlisted(!isWishlisted)
    }

    const handleWhatsAppContact = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const message = `Hi! I'm interested in your ${product.name} listed for ${currency}${product.price}`
        const whatsappUrl = `https://wa.me/${product.seller?.phone}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    const handlePhoneContact = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (product.seller?.phone) {
            window.location.href = `tel:${product.seller.phone}`
        }
    }

    return (
        <div className='w-full'>
            <div className='bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-[#5C3AEB] transition-colors'>
                
                {/* Image Container */}
                <div className='relative h-40 bg-gray-50 flex items-center justify-center overflow-hidden'>
                    <Link href={`/product/${product.id}`} className="flex items-center justify-center w-full h-full">
                        <Image 
                            width={300} 
                            height={300} 
                            className='max-h-32 w-auto object-contain' 
                            src={product.images?.[0] || '/placeholder-image.jpg'} 
                            alt={product.name}
                            onError={(e) => {
                                e.target.src = '/placeholder-image.jpg'
                            }}
                        />
                    </Link>
                    
                    {/* Sale Badge */}
                    {isOnSale && (
                        <div className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded'>
                            SALE
                        </div>
                    )}
                    
                    {/* Wishlist Button */}
                    <div className='absolute top-2 right-2'>
                        <button
                            onClick={handleWishlistClick}
                            className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                isWishlisted 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                            } transition-colors`}
                        >
                            <HeartIcon size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className='p-3'>
                    <Link href={`/product/${product.id}`}>
                        <h3 className='font-medium text-gray-900 text-sm line-clamp-2 leading-tight mb-1'>
                            {product.name}
                        </h3>
                    </Link>
                    
                    {/* Category */}
                    <p className='text-xs text-gray-500 uppercase tracking-wide mb-2'>
                        {product.category || 'General'}
                    </p>
                    
                    {/* Rating */}
                    <div className='flex items-center gap-1 mb-2'>
                        <div className='flex'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon 
                                    key={star} 
                                    size={12} 
                                    className='text-transparent' 
                                    fill={rating >= star ? "#5C3AEB" : "#E5E7EB"} 
                                />
                            ))}
                        </div>
                        <span className='text-xs text-gray-500'>
                            ({product.rating?.length || 0})
                        </span>
                    </div>
                    
                    {/* Price */}
                    <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center gap-1'>
                            <span className='text-base font-bold text-[#5C3AEB]'>
                                {currency}{product.price?.toFixed(2) || '0.00'}
                            </span>
                            {isOnSale && (
                                <span className='text-xs text-gray-500 line-through'>
                                    {currency}{originalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>
                        
                        {isOnSale && (
                            <span className='text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-medium'>
                                {Math.round(((originalPrice - product.price) / originalPrice) * 100)}% OFF
                            </span>
                        )}
                    </div>
                    
                    {/* Stock Status */}
                    <div className='mb-3'>
                        {product.stock > 10 ? (
                            <span className='text-xs text-green-600 font-medium'>In Stock</span>
                        ) : product.stock > 0 ? (
                            <span className='text-xs text-orange-600 font-medium'>Only {product.stock} left</span>
                        ) : (
                            <span className='text-xs text-red-600 font-medium'>Out of Stock</span>
                        )}
                    </div>

                    {/* Contact Buttons */}
                    <div className='flex gap-2'>
                        <button
                            onClick={handleWhatsAppContact}
                            className='flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-2 rounded flex items-center justify-center gap-1 transition-colors'
                        >
                            <MessageCircleIcon size={12} />
                            WhatsApp
                        </button>
                        <button
                            onClick={handlePhoneContact}
                            className='flex-1 bg-[#5C3AEB] hover:bg-[#3525b8] text-white text-xs font-medium py-2 rounded flex items-center justify-center gap-1 transition-colors'
                        >
                            <PhoneIcon size={12} />
                            Call
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard