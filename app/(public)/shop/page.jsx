'use client'
import { Suspense, useState, useEffect } from "react"
import ProductCard from "@/components/ProductCard"
import Categories from "@/components/Categories"
import { MoveLeftIcon, FilterIcon, XIcon, SlidersHorizontalIcon, Grid3X3Icon, ListIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"

function ShopContent() {
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const subcategory = searchParams.get('sub')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sort')
    
    const router = useRouter()
    const products = useSelector(state => state.product.list)
    const [showFilters, setShowFilters] = useState(false)
    const [localFilters, setLocalFilters] = useState({
        category: category || '',
        subcategory: subcategory || '',
        minPrice: minPrice || '',
        maxPrice: maxPrice || '',
        sortBy: sortBy || 'newest'
    })
    const [viewMode, setViewMode] = useState('grid') // grid or list

    // Update local filters when URL params change
    useEffect(() => {
        setLocalFilters({
            category: category || '',
            subcategory: subcategory || '',
            minPrice: minPrice || '',
            maxPrice: maxPrice || '',
            sortBy: sortBy || 'newest'
        })
    }, [searchParams])

    const applyFilters = () => {
        const params = new URLSearchParams()
        
        if (search) params.set('search', search)
        if (localFilters.category) params.set('category', localFilters.category)
        if (localFilters.subcategory) params.set('sub', localFilters.subcategory)
        if (localFilters.minPrice) params.set('minPrice', localFilters.minPrice)
        if (localFilters.maxPrice) params.set('maxPrice', localFilters.maxPrice)
        if (localFilters.sortBy !== 'newest') params.set('sort', localFilters.sortBy)
        
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
            sortBy: 'newest'
        })
    }

    // Filter products based on all criteria
    const filteredProducts = products.filter(product => {
        // Search filter
        if (search && !product.name.toLowerCase().includes(search.toLowerCase())) {
            return false
        }
        
        // Category filter
        if (category && product.category !== category) {
            return false
        }
        
        // Subcategory filter (assuming product has subcategory field)
        if (subcategory && product.subcategory !== subcategory) {
            return false
        }
        
        // Price range filter
        if (minPrice && product.price < parseFloat(minPrice)) {
            return false
        }
        if (maxPrice && product.price > parseFloat(maxPrice)) {
            return false
        }
        
        return true
    })

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (localFilters.sortBy) {
            case 'price-low':
                return a.price - b.price
            case 'price-high':
                return b.price - a.price
            case 'name':
                return a.name.localeCompare(b.name)
            case 'rating':
                return (b.rating?.length || 0) - (a.rating?.length || 0)
            default: // newest
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        }
    })

    const hasActiveFilters = category || subcategory || minPrice || maxPrice || (sortBy && sortBy !== 'newest')

    // Quick access categories for horizontal navigation
    const quickCategories = [
        { id: 'vehicles', name: '🚗 Vehicles', count: '12K+' },
        { id: 'electronics', name: '📱 Electronics', count: '15K+' },
        { id: 'property', name: '🏠 Property', count: '8K+' },
        { id: 'fashion', name: '👕 Fashion', count: '7K+' },
        { id: 'jobs', name: '💼 Jobs', count: '5K+' },
        { id: 'services', name: '🔧 Services', count: '4K+' },
        { id: 'furniture', name: '🛋️ Home', count: '6K+' },
        { id: 'pets', name: '🐾 Pets', count: '3K+' }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
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
                            onChange={(e) => setLocalFilters(prev => ({...prev, sortBy: e.target.value}))}
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
                                    {[category, subcategory, minPrice, maxPrice].filter(Boolean).length + (sortBy && sortBy !== 'newest' ? 1 : 0)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Quick Categories Navigation */}
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
                                    setLocalFilters(prev => ({...prev, category: cat.id}))
                                    const params = new URLSearchParams()
                                    if (search) params.set('search', search)
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
                                <span className="text-xs ml-2 opacity-80">{cat.count}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {category && (
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                Category: {category}
                                <XIcon 
                                    size={14} 
                                    className="cursor-pointer" 
                                    onClick={() => setLocalFilters(prev => ({...prev, category: ''}))}
                                />
                            </span>
                        )}
                        {subcategory && (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                Subcategory: {subcategory}
                                <XIcon 
                                    size={14} 
                                    className="cursor-pointer" 
                                    onClick={() => setLocalFilters(prev => ({...prev, subcategory: ''}))}
                                />
                            </span>
                        )}
                        {(minPrice || maxPrice) && (
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                Price: {minPrice || '0'} - {maxPrice || '∞'}
                                <XIcon 
                                    size={14} 
                                    className="cursor-pointer" 
                                    onClick={() => setLocalFilters(prev => ({...prev, minPrice: '', maxPrice: ''}))}
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
                                    onChange={(e) => setLocalFilters(prev => ({...prev, category: e.target.value, subcategory: ''}))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                                >
                                    <option value="">All Categories</option>
                                    {quickCategories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Subcategory */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                                <select 
                                    value={localFilters.subcategory}
                                    onChange={(e) => setLocalFilters(prev => ({...prev, subcategory: e.target.value}))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                                    disabled={!localFilters.category}
                                >
                                    <option value="">All Subcategories</option>
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
                        Showing {sortedProducts.length} of {products.length} products
                        {search && ` for "${search}"`}
                        {category && ` in ${category}`}
                    </p>
                </div>

                {/* Products Grid */}
                {sortedProducts.length > 0 ? (
                    <div className={`grid gap-6 ${
                        viewMode === 'grid' 
                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                            : 'grid-cols-1'
                    }`}>
                        {sortedProducts.map(product => (
                            <ProductCard key={product.id} product={product} viewMode={viewMode} />
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