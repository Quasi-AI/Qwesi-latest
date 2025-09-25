'use client'
import { ArrowRight, StarIcon, User, Calendar, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

const ProductDescription = ({ product }) => {
    const [selectedTab, setSelectedTab] = useState('Description')
    const [storeInfo, setStoreInfo] = useState(null)
    const [loadingStore, setLoadingStore] = useState(false)

    // Fetch store information
    useEffect(() => {
        const fetchStoreInfo = async () => {
            if (!product?.storeId) return

            try {
                setLoadingStore(true)
                const response = await fetch(`${API_BASE_URL}/stores/${product.storeId}`)
                
                if (response.ok) {
                    const result = await response.json()
                    if (result.success) {
                        setStoreInfo(result.data)
                    }
                }
            } catch (error) {
                console.error('Error fetching store info:', error)
            } finally {
                setLoadingStore(false)
            }
        }

        fetchStoreInfo()
    }, [product?.storeId])

    if (!product) return null

    // Handle rating data - your backend format vs legacy format
    const ratings = product.rating || []
    const hasReviews = ratings.length > 0

    return (
        <div className="my-18 text-sm text-slate-600">

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 max-w-2xl">
                {['Description', 'Reviews'].map((tab, index) => (
                    <button 
                        className={`${tab === selectedTab ? 'border-b-[1.5px] font-semibold text-slate-800' : 'text-slate-400'} px-3 py-2 font-medium hover:text-slate-600 transition-colors`} 
                        key={index} 
                        onClick={() => setSelectedTab(tab)}
                    >
                        {tab}
                        {tab === 'Reviews' && (
                            <span className="ml-1 text-xs">({ratings.length})</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Description */}
            {selectedTab === "Description" && (
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-slate-800 mb-2">Product Details</h3>
                        <p className="max-w-xl leading-relaxed">
                            {product.description || 'No description available for this product.'}
                        </p>
                    </div>

                    {/* Additional Product Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-slate-50 rounded-lg">
                        {product.sku && (
                            <div>
                                <span className="font-medium text-slate-700">SKU:</span>
                                <span className="ml-2">{product.sku}</span>
                            </div>
                        )}
                        <div>
                            <span className="font-medium text-slate-700">Stock:</span>
                            <span className={`ml-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-slate-700">Currency:</span>
                            <span className="ml-2 uppercase">{product.currency || 'USD'}</span>
                        </div>
                        <div>
                            <span className="font-medium text-slate-700">Added:</span>
                            <span className="ml-2">{new Date(product.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews */}
            {selectedTab === "Reviews" && (
                <div className="space-y-6">
                    {hasReviews ? (
                        <div className="flex flex-col gap-6">
                            {ratings.slice().reverse().map((item, index) => (
                                <div key={index} className="border-b border-slate-100 pb-6 last:border-b-0">
                                    <div className="flex gap-4">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            {item.user?.image ? (
                                                <Image 
                                                    src={item.user.image} 
                                                    alt={item.user.name || 'Reviewer'} 
                                                    className="size-10 rounded-full object-cover" 
                                                    width={40} 
                                                    height={40} 
                                                />
                                            ) : (
                                                <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center">
                                                    <User size={16} className="text-slate-500" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Review Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Rating Stars */}
                                            <div className="flex items-center mb-2">
                                                {Array(5).fill('').map((_, starIndex) => (
                                                    <StarIcon 
                                                        key={starIndex} 
                                                        size={16} 
                                                        className='text-transparent' 
                                                        fill={item.rating >= starIndex + 1 ? "#F59E0B" : "#D1D5DB"} 
                                                    />
                                                ))}
                                                <span className="ml-2 text-sm font-medium text-slate-700">
                                                    {item.rating}/5
                                                </span>
                                            </div>

                                            {/* Review Text */}
                                            {(item.review || item.comment) && (
                                                <p className="text-sm text-slate-700 leading-relaxed mb-3 max-w-2xl">
                                                    {item.review || item.comment}
                                                </p>
                                            )}

                                            {/* Reviewer Info */}
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <span className="font-medium text-slate-600">
                                                    {item.user?.name || item.reviewerName || 'Anonymous'}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    <span>{new Date(item.createdAt).toDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-slate-300 mb-4">
                                <MessageCircle size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Reviews Yet</h3>
                            <p className="text-slate-500">Be the first to share your experience with this product!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Store Information */}
            <div className="flex gap-4 mt-14 p-4 bg-slate-50 rounded-lg">
                {loadingStore ? (
                    <div className="flex gap-4 items-center">
                        <div className="size-12 bg-slate-200 rounded-full animate-pulse"></div>
                        <div>
                            <div className="h-4 bg-slate-200 rounded w-32 mb-2 animate-pulse"></div>
                            <div className="h-3 bg-slate-200 rounded w-24 animate-pulse"></div>
                        </div>
                    </div>
                ) : storeInfo ? (
                    <>
                        <div className="flex-shrink-0">
                            <div className="size-12 bg-slate-200 rounded-full flex items-center justify-center ring-2 ring-slate-300">
                                <span className="text-slate-600 font-semibold">
                                    {storeInfo.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-slate-700">
                                Product by <span className="text-slate-800">{storeInfo.name}</span>
                            </p>
                            <p className="text-xs text-slate-500 mb-2">
                                {storeInfo.description || 'Trusted seller'}
                            </p>
                            <Link 
                                href={`/stores/${storeInfo._id}`} 
                                className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                            > 
                                View Store <ArrowRight size={14} />
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="flex gap-4 items-center">
                        <div className="size-12 bg-slate-200 rounded-full flex items-center justify-center">
                            <span className="text-slate-600 text-xs">Store</span>
                        </div>
                        <div>
                            <p className="font-medium text-slate-600">Product by Store</p>
                            <p className="text-xs text-slate-500">Store information unavailable</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductDescription