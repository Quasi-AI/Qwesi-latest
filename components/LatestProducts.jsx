'use client'
import React, { useEffect, useState } from 'react'
import Title from './Title'
import ProductCard from './ProductCard'

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

const LatestProducts = ({ displayQuantity = 4, storeId = null }) => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [meta, setMeta] = useState({ showing: 0, total: 0, limit: displayQuantity })

    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                setLoading(true)
                setError(null)

                // Build query parameters
                const params = new URLSearchParams({
                    limit: displayQuantity.toString()
                })
                
                if (storeId) {
                    params.append('storeId', storeId)
                }

                const response = await fetch(`${API_BASE_URL}/products/latest?${params}`)
                
                if (response.ok) {
                    const result = await response.json()
                    
                    if (result.success) {
                        setProducts(result.data)
                        setMeta(result.meta)
                    } else {
                        throw new Error(result.message || 'Failed to fetch products')
                    }
                } else {
                    throw new Error(`HTTP ${response.status}: Failed to fetch products`)
                }

            } catch (error) {
                console.error('Error fetching latest products:', error)
                setError(error.message)
                setProducts([])
                setMeta({ showing: 0, total: 0, limit: displayQuantity })
            } finally {
                setLoading(false)
            }
        }

        fetchLatestProducts()
    }, [displayQuantity, storeId])

    if (loading) {
        return (
            <div className='px-6 my-30 max-w-6xl mx-auto'>
                <Title 
                    title='Latest Products' 
                    description='Loading products...' 
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
                    title='Latest Products' 
                    description='Failed to load products' 
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

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title 
                title='Latest Products' 
                description={`Showing ${meta.showing} of ${meta.total} products`} 
                href='/shop' 
            />
            
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map(product => (
                        <ProductCard key={product.id || product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
                    <p className="text-gray-500">
                        {storeId ? 'This store has no active products yet.' : 'No products are currently available.'}
                    </p>
                </div>
            )}
        </div>
    )
}

export default LatestProducts