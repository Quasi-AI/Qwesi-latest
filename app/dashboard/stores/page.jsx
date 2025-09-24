'use client'
import { storesDummyData } from "@/assets/assets"
import StoreInfo from "@/components/dashboard/StoreInfo"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { 
    Plus, 
    Search, 
    Filter, 
    Edit3, 
    Eye, 
    Check, 
    X, 
    Clock, 
    MoreVertical,
    Store,
    Users,
    TrendingUp,
    MapPin,
    Mail,
    Phone
} from "lucide-react"

export default function AdminStores() {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedStore, setSelectedStore] = useState(null)
    const [showApprovalModal, setShowApprovalModal] = useState(false)

    const fetchStores = async () => {
        setStores(storesDummyData)
        setLoading(false)
    }

    const toggleIsActive = async (storeId) => {
        const updatedStores = stores.map(store => 
            store.id === storeId ? { ...store, isActive: !store.isActive } : store
        )
        setStores(updatedStores)
        toast.success("Store status updated successfully")
    }

    const updateStoreStatus = async (storeId, newStatus) => {
        const updatedStores = stores.map(store => 
            store.id === storeId ? { ...store, status: newStatus } : store
        )
        setStores(updatedStores)
        setShowApprovalModal(false)
        toast.success(`Store ${newStatus} successfully`)
    }

    const filteredStores = stores.filter(store => {
        const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            store.username.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterStatus === "all" || store.status === filterStatus
        return matchesSearch && matchesFilter
    })

    const getStatusStats = () => {
        return {
            total: stores.length,
            approved: stores.filter(s => s.status === 'approved').length,
            pending: stores.filter(s => s.status === 'pending').length,
            rejected: stores.filter(s => s.status === 'rejected').length,
            active: stores.filter(s => s.isActive).length
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    if (loading) return <Loading />

    const stats = getStatusStats()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                        Store <span className="text-blue-600">Management</span>
                    </h1>
                    <p className="text-slate-600 mt-1">Manage and approve stores on qwesi.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                    <Plus size={18} />
                    <span>Add New Store</span>
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
                            <p className="text-xl font-bold text-slate-800">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Check size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Approved</p>
                            <p className="text-xl font-bold text-slate-800">{stats.approved}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Clock size={20} className="text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Pending</p>
                            <p className="text-xl font-bold text-slate-800">{stats.pending}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <X size={20} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Rejected</p>
                            <p className="text-xl font-bold text-slate-800">{stats.rejected}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <TrendingUp size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Active</p>
                            <p className="text-xl font-bold text-slate-800">{stats.active}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search stores by name or username..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-slate-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stores List */}
            {filteredStores.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {filteredStores.map((store) => (
                        <div key={store.id} className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-4">
                                {/* Store Header */}
                                <div className="flex items-start gap-3 mb-4">
                                    <img 
                                        src={store.logo} 
                                        alt={store.name}
                                        className="w-12 h-12 object-contain rounded-lg border border-slate-100" 
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-800 truncate">{store.name}</h3>
                                        <p className="text-sm text-blue-600">@{store.username}</p>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="mb-4">
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                            store.status === 'pending'
                                                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                                : store.status === 'rejected'
                                                ? 'bg-red-100 text-red-800 border border-red-200'
                                                : 'bg-green-100 text-green-800 border border-green-200'
                                        }`}
                                    >
                                        {store.status === 'pending' && <Clock size={10} className="mr-1" />}
                                        {store.status === 'approved' && <Check size={10} className="mr-1" />}
                                        {store.status === 'rejected' && <X size={10} className="mr-1" />}
                                        {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                                    </span>
                                </div>

                                {/* Store Description */}
                                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{store.description}</p>

                                {/* Store Details */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <MapPin size={12} className="text-blue-600 flex-shrink-0" />
                                        <span className="truncate">{store.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <Phone size={12} className="text-blue-600 flex-shrink-0" />
                                        <span>{store.contact}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <Mail size={12} className="text-blue-600 flex-shrink-0" />
                                        <span className="truncate">{store.email}</span>
                                    </div>
                                </div>

                                {/* Owner Info */}
                                <div className="flex items-center gap-2 mb-4 p-2 bg-slate-50 rounded-lg">
                                    <img 
                                        src={store.user.image} 
                                        alt={store.user.name}
                                        className="w-6 h-6 rounded-full border border-slate-200" 
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-slate-800 truncate">{store.user.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{store.user.email}</p>
                                    </div>
                                </div>

                                {/* Active Toggle */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-slate-700">Active</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            onChange={() => toast.promise(toggleIsActive(store.id), { 
                                                loading: "Updating...",
                                                success: "Updated successfully!",
                                                error: "Failed to update"
                                            })} 
                                            checked={store.isActive} 
                                        />
                                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                        <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                    </label>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
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
                                    
                                    {store.status === 'pending' && (
                                        <button
                                            onClick={() => {
                                                setSelectedStore(store)
                                                setShowApprovalModal(true)
                                            }}
                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors"
                                        >
                                            <Eye size={12} />
                                            Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                    <Store size={48} className="mx-auto text-slate-400 mb-4" />
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">No stores found</h3>
                    <p className="text-slate-600 mb-6">
                        {searchTerm || filterStatus !== "all" 
                            ? "Try adjusting your search or filter criteria" 
                            : "Get started by creating your first store"
                        }
                    </p>
                    {(!searchTerm && filterStatus === "all") && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            <Plus size={16} />
                            Add New Store
                        </button>
                    )}
                </div>
            )}

            {/* Create Store Modal */}
            {showCreateModal && <CreateStoreModal onClose={() => setShowCreateModal(false)} />}
            
            {/* Edit Store Modal */}
            {showEditModal && <EditStoreModal store={selectedStore} onClose={() => setShowEditModal(false)} />}
            
            {/* Approval Modal */}
            {showApprovalModal && (
                <ApprovalModal 
                    store={selectedStore} 
                    onApprove={(id) => updateStoreStatus(id, 'approved')}
                    onReject={(id) => updateStoreStatus(id, 'rejected')}
                    onClose={() => setShowApprovalModal(false)} 
                />
            )}
        </div>
    )
}

// Create Store Modal Component
const CreateStoreModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        description: '',
        address: '',
        contact: '',
        email: '',
        logo: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle store creation
        toast.success("Store created successfully!")
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800">Create New Store</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                            <X size={20} className="text-slate-600" />
                        </button>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contact</label>
                            <input
                                type="tel"
                                value={formData.contact}
                                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Create Store
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Edit Store Modal Component
const EditStoreModal = ({ store, onClose }) => {
    const [formData, setFormData] = useState({
        name: store?.name || '',
        username: store?.username || '',
        description: store?.description || '',
        address: store?.address || '',
        contact: store?.contact || '',
        email: store?.email || ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        toast.success("Store updated successfully!")
        onClose()
    }

    if (!store) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800">Edit Store</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                            <X size={20} className="text-slate-600" />
                        </button>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contact</label>
                            <input
                                type="tel"
                                value={formData.contact}
                                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Update Store
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Approval Modal Component
const ApprovalModal = ({ store, onApprove, onReject, onClose }) => {
    if (!store) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800">Review Store Application</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                            <X size={20} className="text-slate-600" />
                        </button>
                    </div>
                </div>
                
                <div className="p-6">
                    <StoreInfo store={store} />
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-slate-200">
                        <button
                            onClick={() => onReject(store.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
                        >
                            <X size={18} />
                            Reject Application
                        </button>
                        <button
                            onClick={() => onApprove(store.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                            <Check size={18} />
                            Approve Store
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}