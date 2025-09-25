'use client'
import ProductCard from "@/components/ProductCard"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { MailIcon, MapPinIcon, PhoneIcon, CalendarIcon, PackageIcon, AlertCircle, Store } from "lucide-react"
import Loading from "@/components/Loading"
import Image from "next/image"

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

export default function StoreShop() {
    const { id: storeId } = useParams() // Assuming route is /stores/[id] 
    const [products, setProducts] = useState([])
    const [storeInfo, setStoreInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [productsLoading, setProductsLoading] = useState(true)

    const fetchStoreData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Fetch store information
            const storeResponse = await fetch(`${API_BASE_URL}/stores/${storeId}`)
            
            if (storeResponse.ok) {
                const storeResult = await storeResponse.json()
                if (storeResult.success) {
                    setStoreInfo(storeResult.data)
                } else {
                    throw new Error(storeResult.message || 'Store not found')
                }
            } else if (storeResponse.status === 404) {
                throw new Error('Store not found')
            } else {
                throw new Error('Failed to load store information')
            }

        } catch (error) {
            console.error('Error fetching store data:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchStoreProducts = async () => {
        if (!storeId) return

        try {
            setProductsLoading(true)

            // Fetch products for this store
            const productsResponse = await fetch(`${API_BASE_URL}/stores/${storeId}/products`)
            
            if (productsResponse.ok) {
                const productsResult = await productsResponse.json()
                if (productsResult.success) {
                    // Add id field for compatibility with ProductCard
                    const productsWithId = productsResult.data.map(product => ({
                        ...product,
                        id: product._id
                    }))
                    setProducts(productsWithId)
                } else {
                    console.error('Failed to fetch products:', productsResult.message)
                    setProducts([])
                }
            } else {
                console.error('Failed to fetch products')
                setProducts([])
            }

        } catch (error) {
            console.error('Error fetching products:', error)
            setProducts([])
        } finally {
            setProductsLoading(false)
        }
    }

    useEffect(() => {
        if (storeId) {
            fetchStoreData()
            fetchStoreProducts()
        }
    }, [storeId])

    if (loading) return <Loading />

    if (error) {
        return (
            <div className="min-h-[70vh] mx-6 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
                    <h1 className="text-2xl font-semibold text-slate-800 mb-2">Store Not Found</h1>
                    <p className="text-slate-600 mb-6">{error}</p>
                    <button 
                        onClick={() => window.history.back()} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    // Filter active products only
    const activeProducts = products.filter(product => product.isActive !== false)

    return (
        <div className="min-h-[70vh] mx-6">

            {/* Store Info Banner */}
            {storeInfo && (
                <div className="max-w-7xl mx-auto bg-slate-50 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                    <div className="flex-shrink-0">
                        <div className="size-32 sm:size-38 bg-slate-200 border border-slate-200 rounded-md flex items-center justify-center">
                            <Store size={48} className="text-slate-400" />
                        </div>
                    </div>
                    
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-semibold text-slate-800">{storeInfo.name}</h1>
                        
                        {storeInfo.description && (
                            <p className="text-sm text-slate-600 mt-2 max-w-lg leading-relaxed">
                                {storeInfo.description}
                            </p>
                        )}

                        <div className="mt-4 space-y-2 text-sm text-slate-500">
                            {storeInfo.address && (
                                <div className="flex items-center justify-center md:justify-start">
                                    <MapPinIcon className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                                    <span>{storeInfo.address}</span>
                                </div>
                            )}
                            
                            <div className="flex items-center justify-center md:justify-start">
                                <CalendarIcon className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                                <span>Member since {new Date(storeInfo.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div className="flex items-center justify-center md:justify-start">
                                <PackageIcon className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                                <span>{activeProducts.length} products available</span>
                            </div>

                            {/* Store Status */}
                            <div className="flex items-center justify-center md:justify-start">
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                    storeInfo.isActive ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                                <span className={storeInfo.isActive ? 'text-green-600' : 'text-red-600'}>
                                    {storeInfo.isActive ? 'Active Store' : 'Inactive Store'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Products Section */}
            <div className="max-w-7xl mx-auto mb-40">
                <div className="flex items-center justify-between mt-12 mb-6">
                    <h1 className="text-2xl">
                        Shop <span className="text-slate-800 font-medium">Products</span>
                        <span className="text-slate-500 text-lg ml-2">({activeProducts.length})</span>
                    </h1>
                </div>

                {productsLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
                        ))}
                    </div>
                ) : activeProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {activeProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <PackageIcon size={64} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No Products Available</h3>
                        <p className="text-slate-500">
                            This store doesn't have any products listed yet.
                        </p>
                    </div>
                )}

                {/* Store not active notice */}
                {!storeInfo?.isActive && (
                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                            <p className="text-yellow-800 text-sm">
                                This store is currently inactive. Some products may not be available for purchase.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}