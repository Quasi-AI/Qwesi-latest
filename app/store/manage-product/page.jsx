'use client'
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

export default function StoreAddProduct() {

    const [stores, setStores] = useState([])
    const [selectedStore, setSelectedStore] = useState('')
    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        price: 0,
        sku: "",
        stock: 0,
        currency: "USD",
        attributes: {}
    })
    const [loading, setLoading] = useState(false)

    const fetchStores = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/stores`)
            if (response.ok) {
                const data = await response.json()
                setStores(data)
                if (data.length > 0) {
                    setSelectedStore(data[0]._id)
                }
            } else {
                throw new Error('Failed to fetch stores')
            }
        } catch (error) {
            console.error('Error fetching stores:', error)
            toast.error('Failed to fetch stores')
        }
    }

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const uploadImages = async () => {
        const imageUrls = []
        // In a real implementation, you would upload images to a cloud service like Cloudinary, AWS S3, etc.
        // For now, we'll just return placeholder URLs
        
        for (let key of Object.keys(images)) {
            if (images[key]) {
                // Simulate image upload - replace with actual upload logic
                const imageUrl = `https://via.placeholder.com/400x400?text=Product+Image+${key}`
                imageUrls.push(imageUrl)
            }
        }
        
        return imageUrls
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        
        if (!selectedStore) {
            toast.error('Please select a store')
            return
        }

        setLoading(true)
        
        try {
            // Upload images first (in a real app, you'd upload to cloud storage)
            const imageUrls = await uploadImages()

            const productData = {
                ...productInfo,
                storeId: selectedStore,
                price: parseFloat(productInfo.price),
                stock: parseInt(productInfo.stock),
                images: imageUrls,
            }

            const response = await fetch(`${API_BASE_URL}/stores/${selectedStore}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            })

            if (response.ok) {
                const newProduct = await response.json()
                
                // Reset form
                setProductInfo({
                    name: "",
                    description: "",
                    price: 0,
                    sku: "",
                    stock: 0,
                    currency: "USD",
                    attributes: {}
                })
                setImages({ 1: null, 2: null, 3: null, 4: null })
                
                toast.success('Product added successfully!')
            } else {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to add product')
            }
        } catch (error) {
            console.error('Error adding product:', error)
            toast.error(error.message || 'Failed to add product')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStores()
    }, [])

    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })} className="text-slate-500 mb-28">
            <h1 className="text-2xl">Add New <span className="text-slate-800 font-medium">Products</span></h1>
            
            {/* Store Selection */}
            {stores.length > 1 && (
                <div className="my-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Store *</label>
                    <select
                        value={selectedStore}
                        onChange={(e) => setSelectedStore(e.target.value)}
                        className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded"
                        required
                    >
                        <option value="">Select a store</option>
                        {stores.map((store) => (
                            <option key={store._id} value={store._id}>
                                {store.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <p className="mt-7">Product Images</p>

            <div className="flex gap-3 mt-4">
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`images${key}`}>
                        <Image 
                            width={300} 
                            height={300} 
                            className='h-15 w-auto border border-slate-200 rounded cursor-pointer' 
                            src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area} 
                            alt="" 
                        />
                        <input 
                            type="file" 
                            accept='image/*' 
                            id={`images${key}`} 
                            onChange={e => setImages({ ...images, [key]: e.target.files[0] })} 
                            hidden 
                        />
                    </label>
                ))}
            </div>

            <label className="flex flex-col gap-2 my-6">
                Name *
                <input 
                    type="text" 
                    name="name" 
                    onChange={onChangeHandler} 
                    value={productInfo.name} 
                    placeholder="Enter product name" 
                    className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" 
                    required 
                />
            </label>

            <label className="flex flex-col gap-2 my-6">
                Description *
                <textarea 
                    name="description" 
                    onChange={onChangeHandler} 
                    value={productInfo.description} 
                    placeholder="Enter product description" 
                    rows={5} 
                    className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none" 
                    required 
                />
            </label>

            <label className="flex flex-col gap-2 my-6">
                SKU (Optional)
                <input 
                    type="text" 
                    name="sku" 
                    onChange={onChangeHandler} 
                    value={productInfo.sku} 
                    placeholder="Enter product SKU" 
                    className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" 
                />
            </label>

            <div className="flex gap-5">
                <label className="flex flex-col gap-2">
                    Price ($) *
                    <input 
                        type="number" 
                        name="price" 
                        onChange={onChangeHandler} 
                        value={productInfo.price} 
                        placeholder="0.00" 
                        min="0" 
                        step="0.01"
                        className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded" 
                        required 
                    />
                </label>
                <label className="flex flex-col gap-2">
                    Stock Quantity *
                    <input 
                        type="number" 
                        name="stock" 
                        onChange={onChangeHandler} 
                        value={productInfo.stock} 
                        placeholder="0" 
                        min="0"
                        className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded" 
                        required 
                    />
                </label>
            </div>

            <label className="flex flex-col gap-2 my-6">
                Currency
                <select
                    name="currency"
                    onChange={onChangeHandler}
                    value={productInfo.currency}
                    className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded"
                >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                </select>
            </label>

            <button 
                disabled={loading || !selectedStore} 
                className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Adding Product...' : 'Add Product'}
            </button>
        </form>
    )
}