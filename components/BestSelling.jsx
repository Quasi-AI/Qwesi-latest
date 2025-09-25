'use client'
import React, { useEffect, useState } from 'react'
import Title from './Title'
import ProductCard from './ProductCard'

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

const BestSelling = ({ displayQuantity = 8, storeId = null, days = 180 }) => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [meta, setMeta] = useState({ showing: 0, total: 0, limit: displayQuantity, days })

    useEffect(() => {
        const fetchBestSellingProducts = async () => {
            try {
                setLoading(true)
                setError(null)

                // Build query parameters
                const params = new URLSearchParams({
                    limit: displayQuantity.toString(),
                    days: days.toString()
                })
                
                if (storeId) {
                    params.append('storeId', storeId)
                }

                const response = await fetch(`${API_BASE_URL}/products/best-selling?${params}`)
                
                if (response.ok) {
                    const result = await response.json()
                    
                    if (result.success) {
                        setProducts(result.data)
                        setMeta(result.meta)
                    } else {
                        throw new Error(result.message || 'Failed to fetch best-selling products')
                    }
                } else {
                    throw new Error(`HTTP ${response.status}: Failed to fetch best-selling products`)
                }

            } catch (error) {
                console.error('Error fetching best-selling products:', error)
                setError(error.message)
                setProducts([])
                setMeta({ showing: 0, total: 0, limit: displayQuantity, days })
            } finally {
                setLoading(false)
            }
        }

        fetchBestSellingProducts()
    }, [displayQuantity, storeId, days])

    if (loading) {
        return (
            <div className='px-6 my-30 max-w-6xl mx-auto'>
                <Title 
                    title='Best Selling' 
                    description='Loading best-selling products...' 
                    href='/shop' 
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: displayQuantity }).map((_, index) => (
                        <div 
                            key={index} 
                            className="bg-gray-200 animate-pulse rounded-lg h-64 flex items-center justify-center"
                        >
                            <div className="text-gray-400">Loading...</div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='px-6 my-30 max-w-6xl mx-auto'>
                <Title 
                    title='Best Selling' 
                    description='Failed to load best-selling products' 
                    href='/shop' 
                />
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <div className="text-red-600 mb-2">⚠️ Error Loading Products</div>
                    <p className="text-red-700 text-sm mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    const getTimeFrameText = (days) => {
        if (days <= 7) return 'this week'
        if (days <= 30) return 'this month'
        if (days <= 90) return 'the last 3 months'
        if (days <= 180) return 'the last 6 months'
        if (days <= 365) return 'this year'
        return `the last ${Math.round(days/365)} years`
    }

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title 
                title='Best Selling' 
                description={`Showing ${meta.showing} of ${meta.total} products based on sales from ${getTimeFrameText(meta.days)}`} 
                href='/shop' 
            />
            
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map((product, index) => (
                        <div key={product.id || product._id} className="relative">
                            <ProductCard product={product} />
                            
                            {/* Best Seller Badge */}
                            {index < 3 && (
                                <div className="absolute top-2 left-2 z-10">
                                    <div className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                                        index === 0 ? 'bg-yellow-500' :
                                        index === 1 ? 'bg-gray-400' :
                                        'bg-orange-400'
                                    }`}>
                                        #{index + 1} Bestseller
                                    </div>
                                </div>
                            )}

                            {/* Sales Metrics (if you want to display them) */}
                            {product.metrics && (
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                    {product.metrics.totalQty} sold
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📈</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Best Sellers Found</h3>
                    <p className="text-gray-500">
                        {storeId 
                            ? `This store has no sales data from ${getTimeFrameText(days)}.`
                            : `No sales data found from ${getTimeFrameText(days)}.`
                        }
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        Try adjusting the time frame or check back later.
                    </p>
                </div>
            )}

            {/* Optional: Time frame selector */}
            <div className="mt-6 flex justify-center">
                <div className="text-sm text-gray-500">
                    Sales data from {getTimeFrameText(meta.days)}
                </div>
            </div>
        </div>
    )
}

export default BestSelling