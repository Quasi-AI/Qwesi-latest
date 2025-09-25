'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import { useAuthStore } from '@/stores/authStore'
import { authFetch } from '@/lib/auth'

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

export default function StoreManageProducts() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const { user } = useAuthStore()

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [stores, setStores] = useState([])
    const [selectedStore, setSelectedStore] = useState('')

    const fetchStores = async () => {
        if (!user?.id) {
            setLoading(false)
            return
        }

        try {
            const response = await authFetch(`${API_BASE_URL}/stores?userId=${user.id}`)
            if (response.ok) {
                const result = await response.json()
                const data = result.data || result
                const storesArray = Array.isArray(data) ? data : []
                setStores(storesArray)
                if (storesArray.length > 0) {
                    setSelectedStore(storesArray[0]._id)
                }
            } else {
                throw new Error('Failed to fetch stores')
            }
        } catch (error) {
            console.error('Error fetching stores:', error)
            toast.error('Failed to fetch stores')
        } finally {
            if (!selectedStore) {
                setLoading(false)
            }
        }
    }

    const fetchProducts = async () => {
        if (!selectedStore) return

        try {
            const response = await authFetch(`${API_BASE_URL}/stores/${selectedStore}/products`)
            if (response.ok) {
                const result = await response.json()
                const data = result.data || result
                setProducts(Array.isArray(data) ? data : [])
            } else {
                throw new Error('Failed to fetch products')
            }
        } catch (error) {
            console.error('Error fetching products:', error)
            toast.error('Failed to fetch products')
        } finally {
            setLoading(false)
        }
    }

    const toggleStock = async (productId) => {
        try {
            const product = products.find(p => p._id === productId)
            const newStockStatus = product.stock > 0 ? 0 : 10 // Toggle between 0 and 10

            const response = await authFetch(`${API_BASE_URL}/stores/${selectedStore}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stock: newStockStatus }),
            })

            if (response.ok) {
                const updatedProduct = await response.json()
                setProducts(products.map(p => 
                    p._id === productId ? updatedProduct : p
                ))
                toast.success('Product stock updated successfully')
            } else {
                throw new Error('Failed to update product stock')
            }
        } catch (error) {
            console.error('Error updating product stock:', error)
            toast.error('Failed to update product stock')
        }
    }

    useEffect(() => {
        fetchStores()
    }, [user?.id])

    useEffect(() => {
        if (selectedStore) {
            fetchProducts()
        }
    }, [selectedStore])

    if (loading) return <Loading />

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">Manage <span className="text-slate-800 font-medium">Products</span></h1>
            
            {/* Store Selection */}
            {stores.length > 1 && (
                <div className="mb-5">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Store</label>
                    <select
                        value={selectedStore}
                        onChange={(e) => setSelectedStore(e.target.value)}
                        className="border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {stores.map((store) => (
                            <option key={store._id} value={store._id}>
                                {store.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {products.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-slate-500">No products found for this store</p>
                </div>
            ) : (
                <table className="w-full max-w-4xl text-left ring ring-slate-200 rounded overflow-hidden text-sm">
                    <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3 hidden md:table-cell">Description</th>
                            <th className="px-4 py-3 hidden md:table-cell">SKU</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        {products.map((product) => (
                            <tr key={product._id} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex gap-2 items-center">
                                        {product.images && product.images.length > 0 ? (
                                            <Image 
                                                width={40} 
                                                height={40} 
                                                className='p-1 shadow rounded cursor-pointer' 
                                                src={product.images[0]} 
                                                alt={product.name}
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center">
                                                <span className="text-xs">No img</span>
                                            </div>
                                        )}
                                        {product.name}
                                    </div>
                                </td>
                                <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate">
                                    {product.description || 'No description'}
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                    {product.sku || 'N/A'}
                                </td>
                                <td className="px-4 py-3">
                                    {currency} {(product.price || 0).toLocaleString()}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {product.stock} in stock
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            onChange={() => toast.promise(toggleStock(product._id), { loading: "Updating stock..." })} 
                                            checked={product.stock > 0} 
                                        />
                                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                        <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    )
}
