'use client'
import Loading from "@/components/Loading"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Calendar, Star, ShoppingCart } from "lucide-react"

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

export default function StorePage() {
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [store, setStore] = useState(null)
    const [products, setProducts] = useState([])
    const [error, setError] = useState(null)

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    useEffect(() => {
        const fetchStoreData = async () => {
            if (!id) return

            try {
                setLoading(true)
                setError(null)

                // Fetch store details
                const storeResponse = await fetch(`${API_BASE_URL}/stores/${id}`)
                if (!storeResponse.ok) {
                    throw new Error('Store not found')
                }
                const storeData = await storeResponse.json()
                setStore(storeData)

                // Fetch store products
                const productsResponse = await fetch(`${API_BASE_URL}/stores/${id}/products`)
                if (productsResponse.ok) {
                    const productsData = await productsResponse.json()
                    setProducts(productsData)
                }

            } catch (err) {
                console.error('Error fetching store data:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchStoreData()
    }, [id])

    if (loading) return <Loading />

    if (error || !store) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center text-center">
                <div>
                    <h1 className="text-2xl sm:text-4xl font-semibold text-red-500 mb-4">
                        {error || 'Store not found'}
                    </h1>
                    <p className="text-slate-600 mb-4">The store you're looking for doesn't exist or has been removed.</p>
                    <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Go Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Store Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Store Logo/Avatar */}
                        <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                            <ShoppingCart size={32} className="text-slate-600" />
                        </div>

                        {/* Store Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-slate-800 mb-2">{store.name}</h1>
                            {store.description && (
                                <p className="text-slate-600 mb-4">{store.description}</p>
                            )}

                            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                {store.address && (
                                    <div className="flex items-center gap-1">
                                        <MapPin size={16} />
                                        <span>{store.address}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    <span>Created {new Date(store.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star size={16} />
                                    <span>{products.length} products</span>
                                </div>
                            </div>
                        </div>

                        {/* Store Status */}
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                store.isActive
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {store.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Products</h2>
                    <p className="text-slate-600">Browse all products from {store.name}</p>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-slate-200">
                                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                                    <Image
                                        src={product.images?.[0] || '/placeholder-product.jpg'}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">{product.name}</h3>

                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-lg font-bold text-slate-800">
                                            {currency}{product.price}
                                        </span>
                                        {product.stock > 0 ? (
                                            <span className="text-sm text-green-600 font-medium">
                                                In Stock ({product.stock})
                                            </span>
                                        ) : (
                                            <span className="text-sm text-red-600 font-medium">
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>

                                    {product.description && (
                                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                            {product.description}
                                        </p>
                                    )}

                                    <Link
                                        href={`/shop?store=${store._id}&product=${product._id}`}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-center block"
                                    >
                                        View Product
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <ShoppingCart size={48} className="mx-auto text-slate-400 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">No products yet</h3>
                        <p className="text-slate-600">This store hasn't added any products yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
