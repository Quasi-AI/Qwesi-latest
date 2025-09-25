'use client'
import { Suspense, useState, useEffect } from "react"
import ProductCard from "@/components/ProductCard"
import Categories from "@/components/Categories"
import { MoveLeftIcon, FilterIcon, XIcon, SlidersHorizontalIcon, Grid3X3Icon, ListIcon, RefreshCcwIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

function ShopContent() {
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const subcategory = searchParams.get('sub')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sort')
    const storeId = searchParams.get('store')
    
    const router = useRouter()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showFilters, setShowFilters] = useState(false)
    const [totalProducts, setTotalProducts] = useState(0)
    const [stores, setStores] = useState([])
    
    const [localFilters, setLocalFilters] = useState({
        category: category || '',
        subcategory: subcategory || '',
        minPrice: minPrice || '',
        maxPrice: maxPrice || '',
        sortBy: sortBy || 'newest',
        storeId: storeId || ''
    })
    const [viewMode, setViewMode] = useState('grid')

    // Fetch all active products from backend
    const fetchProducts = async () => {
        try {
            setLoading(true)
            setError(null)

            // Build query parameters
            const params = new URLSearchParams()
            if (search) params.append('search', search)
            if (category) params.append('category', category)
            if (minPrice) params.append('minPrice', minPrice)
            if (maxPrice) params.append('maxPrice', maxPrice)
            if (storeId) params.append('storeId', storeId)
            params.append('limit', '100') // Adjust as needed
            
            const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`)
            
            if (response.ok) {
                const result = await response.json()
                if (result.success) {
                    // Map _id to id for compatibility
                    const productsWithId = result.data.map(product => ({
                        ...product,
                        id: product._id
                    }))
                    setProducts(productsWithId)
                    setTotalProducts(result.meta?.total || productsWithId.length)
                } else {
                    throw new Error(result.message || 'Failed to fetch products')
                }
            } else {
                throw new Error('Failed to fetch products')
            }

        } catch (error) {
            console.error('Error fetching products:', error)
            setError(error.message)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    // Fetch stores for filter dropdown
    const fetchStores = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/stores`)
            if (response.ok) {
                const result = await response.json()
                if (result.success) {
                    setStores(result.data)
                }
            }
        } catch (error) {
            console.error('Error fetching stores:', error)
        }
    }

    // Update local filters when URL params change
    useEffect(() => {
        setLocalFilters({
            category: category || '',
            subcategory: subcategory || '',
            minPrice: minPrice || '',
            maxPrice: maxPrice || '',
            sortBy: sortBy || 'newest',
            storeId: storeId || ''
        })
    }, [searchParams])

    useEffect(() => {
        fetchProducts()
        fetchStores()
    }, [searchParams])

    const applyFilters = () => {
        const params = new URLSearchParams()
        
        if (search) params.set('search', search)
        if (localFilters.category) params.set('category', localFilters.category)
        if (localFilters.subcategory) params.set('sub', localFilters.subcategory)
        if (localFilters.minPrice) params.set('minPrice', localFilters.minPrice)
        if (localFilters.maxPrice) params.set('maxPrice', localFilters.maxPrice)
        if (localFilters.sortBy !== 'newest') params.set('sort', localFilters.sortBy)
        if (localFilters.storeId) params.set('store', localFilters.storeId)
        
        router.push(`/shop?${params.toString()}`)
        setShowFilters(false)
    }

    const clearFilters = () => {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        router.push(`/shop?${params.toString()}`)
        setLocalFilters({
            category: '',
            subcategory: '',
            minPrice: '',
            maxPrice: '',
            sortBy: 'newest',
            storeId: ''
        })
    }

    // Filter and sort products locally for additional client-side filtering
    const processedProducts = products
        .sort((a, b) => {
            switch (localFilters.sortBy) {
                case 'price-low':
                    return a.price - b.price
                case 'price-high':
                    return b.price - a.price
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'rating':
                    const avgA = a.rating?.length ? a.rating.reduce((acc, r) => acc + r.rating, 0) / a.rating.length : 0
                    const avgB = b.rating?.length ? b.rating.reduce((acc, r) => acc + r.rating, 0) / b.rating.length : 0
                    return avgB - avgA
                default: // newest
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            }
        })

    const hasActiveFilters = category || subcategory || minPrice || maxPrice || storeId || (sortBy && sortBy !== 'newest')

    // Dynamic categories from products
    const availableCategories = [...new Set(products.map(p => p.category).filter(Boolean))]

    // Quick access categories
    const quickCategories = [
        { id: 'Electronics', name: 'Electronics', count: products.filter(p => p.category === 'Electronics').length },
        { id: 'Clothing', name: 'Clothing', count: products.filter(p => p.category === 'Clothing').length },
        { id: 'Home & Kitchen', name: 'Home & Kitchen', count: products.filter(p => p.category === 'Home & Kitchen').length },
        { id: 'Beauty & Health', name: 'Beauty & Health', count: products.filter(p => p.category === 'Beauty & Health').length },
        { id: 'Sports & Outdoors', name: 'Sports & Outdoors', count: products.filter(p => p.category === 'Sports & Outdoors').length },
        { id: 'Books & Media', name: 'Books & Media', count: products.filter(p => p.category === 'Books & Media').length }
    ].filter(cat => cat.count > 0)

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <div key={index} className="bg-gray-200 rounded-lg h-64"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <SlidersHorizontalIcon size={48} className="mx-auto text-red-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading products</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="bg-[#5C3AEB] text-white px-6 py-2 rounded-lg hover:bg-[#3525b8] transition-colors flex items-center gap-2 mx-auto"
                    >
                        <RefreshCcwIcon size={16} />
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl text-slate-500 flex items-center gap-2">
                            All <span className="text-slate-700 font-medium">Products</span>
                            {search && <span className="text-sm text-slate-400 ml-2">for "{search}"</span>}
                        </h1>
                        
                        {hasActiveFilters && (
                            <button 
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
                            >
                                <XIcon size={16} />
                                Clear Filters
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* View Mode Toggle */}
                        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 ${viewMode === 'grid' ? 'bg-[#5C3AEB] text-white' : 'bg-white text-gray-600'}`}
                            >
                                <Grid3X3Icon size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 ${viewMode === 'list' ? 'bg-[#5C3AEB] text-white' : 'bg-white text-gray-600'}`}
                            >
                                <ListIcon size={16} />
                            </button>
                        </div>

                        {/* Sort By */}
                        <select 
                            value={localFilters.sortBy}
                            onChange={(e) => {
                                const newSortBy = e.target.value
                                setLocalFilters(prev => ({...prev, sortBy: newSortBy}))
                                
                                const params = new URLSearchParams(window.location.search)
                                if (newSortBy !== 'newest') {
                                    params.set('sort', newSortBy)
                                } else {
                                    params.delete('sort')
                                }
                                router.push(`/shop?${params.toString()}`)
                            }}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name: A to Z</option>
                            <option value="rating">Highest Rated</option>
                        </select>

                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 bg-[#5C3AEB] text-white px-4 py-2 rounded-lg hover:bg-[#3525b8] transition-colors"
                        >
                            <FilterIcon size={16} />
                            Filters
                            {hasActiveFilters && (
                                <span className="bg-white text-[#5C3AEB] rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                    {[category, subcategory, minPrice, maxPrice, storeId].filter(Boolean).length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Quick Categories Navigation */}
                {quickCategories.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">Browse Categories</h3>
                            <button 
                                onClick={() => document.getElementById('full-categories')?.scrollIntoView({ behavior: 'smooth' })}
                                className="text-sm text-[#5C3AEB] hover:text-[#3525b8]"
                            >
                                View All Categories
                            </button>
                        </div>
                        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                            {quickCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        const params = new URLSearchParams(window.location.search)
                                        params.set('category', cat.id)
                                        router.push(`/shop?${params.toString()}`)
                                    }}
                                    className={`flex-shrink-0 px-4 py-2 rounded-lg border transition-all ${
                                        category === cat.id 
                                            ? 'bg-[#5C3AEB] text-white border-[#5C3AEB]' 
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#5C3AEB] hover:text-[#5C3AEB]'
                                    }`}
                                >
                                    <span className="font-medium">{cat.name}</span>
                                    <span className="text-xs ml-2 opacity-80">({cat.count})</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {category && (
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                Category: {category}
                                <XIcon 
                                    size={14} 
                                    className="cursor-pointer" 
                                    onClick={() => {
                                        const params = new URLSearchParams(window.location.search)
                                        params.delete('category')
                                        router.push(`/shop?${params.toString()}`)
                                    }}
                                />
                            </span>
                        )}
                        {storeId && (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                Store: {stores.find(s => s._id === storeId)?.name || storeId}
                                <XIcon 
                                    size={14} 
                                    className="cursor-pointer" 
                                    onClick={() => {
                                        const params = new URLSearchParams(window.location.search)
                                        params.delete('store')
                                        router.push(`/shop?${params.toString()}`)
                                    }}
                                />
                            </span>
                        )}
                        {(minPrice || maxPrice) && (
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                Price: ${minPrice || '0'} - ${maxPrice || '∞'}
                                <XIcon 
                                    size={14} 
                                    className="cursor-pointer" 
                                    onClick={() => {
                                        const params = new URLSearchParams(window.location.search)
                                        params.delete('minPrice')
                                        params.delete('maxPrice')
                                        router.push(`/shop?${params.toString()}`)
                                    }}
                                />
                            </span>
                        )}
                    </div>
                )}

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={localFilters.minPrice}
                                        onChange={(e) => setLocalFilters(prev => ({...prev, minPrice: e.target.value}))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={localFilters.maxPrice}
                                        onChange={(e) => setLocalFilters(prev => ({...prev, maxPrice: e.target.value}))}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select 
                                    value={localFilters.category}
                                    onChange={(e) => setLocalFilters(prev => ({...prev, category: e.target.value}))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                                >
                                    <option value="">All Categories</option>
                                    {availableCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Store */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Store</label>
                                <select 
                                    value={localFilters.storeId}
                                    onChange={(e) => setLocalFilters(prev => ({...prev, storeId: e.target.value}))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                                >
                                    <option value="">All Stores</option>
                                    {stores.filter(store => store.isActive).map(store => (
                                        <option key={store._id} value={store._id}>{store.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-end gap-2">
                                <button
                                    onClick={applyFilters}
                                    className="flex-1 bg-[#5C3AEB] text-white px-4 py-2 rounded-lg hover:bg-[#3525b8] transition-colors"
                                >
                                    Apply Filters
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="mb-4">
                    <p className="text-gray-600">
                        Showing {processedProducts.length} of {totalProducts} products
                        {search && ` for "${search}"`}
                        {category && ` in ${category}`}
                    </p>
                </div>

                {/* Products Grid */}
                {processedProducts.length > 0 ? (
                    <div className={`grid gap-6 ${
                        viewMode === 'grid' 
                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                            : 'grid-cols-1'
                    }`}>
                        {processedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <SlidersHorizontalIcon size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                        <button
                            onClick={clearFilters}
                            className="bg-[#5C3AEB] text-white px-6 py-2 rounded-lg hover:bg-[#3525b8] transition-colors"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}

                {/* Full Categories Section */}
                <div id="full-categories" className="mt-12 pt-8 border-t">
                    <Categories />
                </div>
            </div>
        </div>
    )
}

export default function Shop() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading shop...</div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    )
}