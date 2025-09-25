'use client'
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { 
    Plus, 
    Search, 
    Edit3, 
    Eye, 
    Trash2,
    Package,
    ShoppingCart,
    TrendingUp,
    MapPin,
    Calendar,
    Store,
    X,
    ImageIcon
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

export default function UserStores() {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedStore, setSelectedStore] = useState(null)
    const [userId, setUserId] = useState('user123') // Get from auth context

    const fetchUserStores = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/stores?ownerId=${userId}`)
            if (response.ok) {
                const data = await response.json()
                // Fetch product count for each store
                const storesWithStats = await Promise.all(
                    data.map(async (store) => {
                        try {
                            const productsResponse = await fetch(`${API_BASE_URL}/stores/${store._id}/products`)
                            const products = productsResponse.ok ? await productsResponse.json() : []
                            
                            const ordersResponse = await fetch(`${API_BASE_URL}/orders?storeId=${store._id}`)
                            const orders = ordersResponse.ok ? await ordersResponse.json() : []
                            
                            return {
                                ...store,
                                productCount: products.length,
                                orderCount: orders.length,
                                totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0)
                            }
                        } catch (error) {
                            return {
                                ...store,
                                productCount: 0,
                                orderCount: 0,
                                totalRevenue: 0
                            }
                        }
                    })
                )
                setStores(storesWithStats)
            } else {
                throw new Error('Failed to fetch stores')
            }
        } catch (error) {
            console.error('Error fetching stores:', error)
            toast.error('Failed to fetch your stores')
        } finally {
            setLoading(false)
        }
    }

    const createStore = async (storeData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/stores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...storeData,
                    ownerId: userId
                }),
            })

            if (response.ok) {
                const newStore = await response.json()
                setStores([...stores, { ...newStore, productCount: 0, orderCount: 0, totalRevenue: 0 }])
                setShowCreateModal(false)
                toast.success('Store created successfully!')
            } else {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to create store')
            }
        } catch (error) {
            console.error('Error creating store:', error)
            toast.error(error.message || 'Failed to create store')
        }
    }

    const updateStore = async (storeId, storeData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/stores/${storeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(storeData),
            })

            if (response.ok) {
                const updatedStore = await response.json()
                setStores(stores.map(store => 
                    store._id === storeId ? { ...updatedStore, ...store } : store
                ))
                setShowEditModal(false)
                toast.success('Store updated successfully!')
            } else {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to update store')
            }
        } catch (error) {
            console.error('Error updating store:', error)
            toast.error(error.message || 'Failed to update store')
        }
    }

    const deleteStore = async (storeId) => {
        if (!confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
            return
        }

        try {
            const response = await fetch(`${API_BASE_URL}/stores/${storeId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setStores(stores.filter(store => store._id !== storeId))
                toast.success('Store deleted successfully!')
            } else {
                throw new Error('Failed to delete store')
            }
        } catch (error) {
            console.error('Error deleting store:', error)
            toast.error('Failed to delete store')
        }
    }

    const toggleStoreStatus = async (storeId) => {
        const store = stores.find(s => s._id === storeId)
        if (!store) return

        try {
            const response = await fetch(`${API_BASE_URL}/stores/${storeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isActive: !store.isActive
                }),
            })

            if (response.ok) {
                const updatedStore = await response.json()
                setStores(stores.map(s => 
                    s._id === storeId ? { ...s, isActive: updatedStore.isActive } : s
                ))
                toast.success(`Store ${updatedStore.isActive ? 'activated' : 'deactivated'} successfully!`)
            } else {
                throw new Error('Failed to update store status')
            }
        } catch (error) {
            console.error('Error updating store status:', error)
            toast.error('Failed to update store status')
        }
    }

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getTotalStats = () => {
        return {
            totalStores: stores.length,
            totalProducts: stores.reduce((sum, store) => sum + store.productCount, 0),
            totalOrders: stores.reduce((sum, store) => sum + store.orderCount, 0),
            totalRevenue: stores.reduce((sum, store) => sum + store.totalRevenue, 0),
            activeStores: stores.filter(store => store.isActive).length
        }
    }

    useEffect(() => {
        fetchUserStores()
    }, [userId])

    if (loading) return <Loading />

    const stats = getTotalStats()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                        My <span className="text-blue-600">Stores</span>
                    </h1>
                    <p className="text-slate-600 mt-1">Manage your stores and track their performance</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                    <Plus size={18} />
                    <span>Create New Store</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Store size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Total Stores</p>
                            <p className="text-xl font-bold text-slate-800">{stats.totalStores}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Package size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Products</p>
                            <p className="text-xl font-bold text-slate-800">{stats.totalProducts}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <ShoppingCart size={20} className="text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Orders</p>
                            <p className="text-xl font-bold text-slate-800">{stats.totalOrders}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <TrendingUp size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Revenue</p>
                            <p className="text-xl font-bold text-slate-800">${stats.totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Eye size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Active</p>
                            <p className="text-xl font-bold text-slate-800">{stats.activeStores}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search your stores..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Stores Grid */}
            {filteredStores.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredStores.map((store) => (
                        <div key={store._id} className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6">
                                {/* Store Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                                            <Store size={24} className="text-slate-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-800 truncate">{store.name}</h3>
                                            <p className="text-sm text-slate-500 truncate">{store.description}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Status Toggle */}
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            onChange={() => toggleStoreStatus(store._id)} 
                                            checked={store.isActive} 
                                        />
                                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-200"></div>
                                        <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                    </label>
                                </div>

                                {/* Store Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-800">{store.productCount}</p>
                                        <p className="text-xs text-slate-600">Products</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-800">{store.orderCount}</p>
                                        <p className="text-xs text-slate-600">Orders</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-800">${store.totalRevenue.toFixed(0)}</p>
                                        <p className="text-xs text-slate-600">Revenue</p>
                                    </div>
                                </div>

                                {/* Store Details */}
                                <div className="space-y-2 mb-4">
                                    {store.address && (
                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                            <MapPin size={12} className="text-blue-600 flex-shrink-0" />
                                            <span className="truncate">{store.address}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <Calendar size={12} className="text-blue-600 flex-shrink-0" />
                                        <span>Created {new Date(store.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Link 
                                        href={`/dashboard/stores/${store._id}/products`}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors"
                                    >
                                        <Package size={12} />
                                        Manage
                                    </Link>
                                    
                                    <button
                                        onClick={() => {
                                            setSelectedStore(store)
                                            setShowEditModal(true)
                                        }}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                                    >
                                        <Edit3 size={12} />
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => deleteStore(store._id)}
                                        className="flex items-center justify-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                    <Store size={48} className="mx-auto text-slate-400 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                        {searchTerm ? 'No stores found' : 'No stores yet'}
                    </h3>
                    <p className="text-slate-600 mb-6">
                        {searchTerm 
                            ? "Try adjusting your search criteria" 
                            : "Create your first store to start selling"
                        }
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            <Plus size={16} />
                            Create Your First Store
                        </button>
                    )}
                </div>
            )}

            {/* Create Store Modal */}
            {showCreateModal && (
                <CreateStoreModal 
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={createStore}
                />
            )}
            
            {/* Edit Store Modal */}
            {showEditModal && selectedStore && (
                <EditStoreModal 
                    store={selectedStore}
                    onClose={() => setShowEditModal(false)}
                    onSubmit={(storeData) => updateStore(selectedStore._id, storeData)}
                />
            )}
        </div>
    )
}

// Create Store Modal Component
const CreateStoreModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: ''
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await onSubmit(formData)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Create New Store</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                        <X size={20} className="text-slate-600" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Store Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Store'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Edit Store Modal Component  
const EditStoreModal = ({ store, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: store?.name || '',
        description: store?.description || '',
        address: store?.address || ''
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await onSubmit(formData)
        } finally {
            setLoading(false)
        }
    }

    if (!store) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Edit Store</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                        <X size={20} className="text-slate-600" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Store Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Store'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}