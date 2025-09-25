'use client'
import { useEffect, useState } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { DeleteIcon } from "lucide-react"

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([])

    const [newCoupon, setNewCoupon] = useState({
        code: '',
        description: '',
        discountType: 'percent',
        discountValue: '',
        validFrom: null,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        minOrderTotal: 0,
        usageLimit: null,
        isActive: true
    })

    const fetchCoupons = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/coupons`)
            if (response.ok) {
                const data = await response.json()
                const couponsData = data.data || data
                setCoupons(Array.isArray(couponsData) ? couponsData : [])
            } else {
                throw new Error('Failed to fetch coupons')
            }
        } catch (error) {
            console.error('Error fetching coupons:', error)
            toast.error('Failed to fetch coupons')
        }
    }

    const handleAddCoupon = async (e) => {
        e.preventDefault()
        try {
            const couponData = {
                ...newCoupon,
                code: newCoupon.code.toUpperCase(),
                discountValue: parseFloat(newCoupon.discountValue),
                minOrderTotal: parseFloat(newCoupon.minOrderTotal) || 0,
                usageLimit: newCoupon.usageLimit ? parseInt(newCoupon.usageLimit) : null,
            }

            const response = await fetch(`${API_BASE_URL}/coupons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(couponData),
            })

            if (response.ok) {
                const newCouponData = await response.json()
                setCoupons([...coupons, newCouponData])
                setNewCoupon({
                    code: '',
                    description: '',
                    discountType: 'percent',
                    discountValue: '',
                    validFrom: null,
                    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    minOrderTotal: 0,
                    usageLimit: null,
                    isActive: true
                })
                toast.success('Coupon added successfully!')
            } else {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to add coupon')
            }
        } catch (error) {
            console.error('Error adding coupon:', error)
            toast.error(error.message || 'Failed to add coupon')
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setNewCoupon({ 
            ...newCoupon, 
            [name]: type === 'checkbox' ? checked : value 
        })
    }

    const deleteCoupon = async (code) => {
        try {
            const response = await fetch(`${API_BASE_URL}/coupons/${code}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setCoupons(coupons.filter(coupon => coupon.code !== code))
                toast.success('Coupon deleted successfully!')
            } else {
                throw new Error('Failed to delete coupon')
            }
        } catch (error) {
            console.error('Error deleting coupon:', error)
            toast.error('Failed to delete coupon')
        }
    }

    useEffect(() => {
        fetchCoupons()
    }, [])

    return (
        <div className="text-slate-500 mb-40">

            {/* Add Coupon */}
            <form onSubmit={(e) => toast.promise(handleAddCoupon(e), { loading: "Adding coupon..." })} className="max-w-sm text-sm">
                <h2 className="text-2xl">Add <span className="text-slate-800 font-medium">Coupons</span></h2>
                
                <div className="flex gap-2 max-sm:flex-col mt-2">
                    <input 
                        type="text" 
                        placeholder="Coupon Code" 
                        className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
                        name="code" 
                        value={newCoupon.code} 
                        onChange={handleChange} 
                        required
                    />
                    <select
                        className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
                        name="discountType"
                        value={newCoupon.discountType}
                        onChange={handleChange}
                        required
                    >
                        <option value="percent">Percentage</option>
                        <option value="amount">Fixed Amount</option>
                    </select>
                </div>

                <input 
                    type="number" 
                    placeholder={`Discount ${newCoupon.discountType === 'percent' ? '(%)' : '($)'}`}
                    min={0}
                    max={newCoupon.discountType === 'percent' ? 100 : undefined}
                    className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
                    name="discountValue" 
                    value={newCoupon.discountValue} 
                    onChange={handleChange} 
                    required
                />

                <input 
                    type="text" 
                    placeholder="Coupon Description" 
                    className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
                    name="description" 
                    value={newCoupon.description} 
                    onChange={handleChange} 
                    required
                />

                <input 
                    type="number" 
                    placeholder="Minimum Order Total ($)" 
                    min={0}
                    className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
                    name="minOrderTotal" 
                    value={newCoupon.minOrderTotal} 
                    onChange={handleChange}
                />

                <input 
                    type="number" 
                    placeholder="Usage Limit (leave empty for unlimited)" 
                    min={1}
                    className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md"
                    name="usageLimit" 
                    value={newCoupon.usageLimit || ''} 
                    onChange={handleChange}
                />

                <label>
                    <p className="mt-3">Valid From (Optional)</p>
                    <input 
                        type="date" 
                        className="w-full mt-1 p-2 border border-slate-200 outline-slate-400 rounded-md"
                        name="validFrom" 
                        value={newCoupon.validFrom ? format(new Date(newCoupon.validFrom), 'yyyy-MM-dd') : ''} 
                        onChange={handleChange}
                    />
                </label>

                <label>
                    <p className="mt-3">Valid Until</p>
                    <input 
                        type="date" 
                        className="w-full mt-1 p-2 border border-slate-200 outline-slate-400 rounded-md"
                        name="validUntil" 
                        value={newCoupon.validUntil ? format(new Date(newCoupon.validUntil), 'yyyy-MM-dd') : ''} 
                        onChange={handleChange}
                        required
                    />
                </label>

                <div className="mt-5">
                    <div className="flex gap-2 mt-3">
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                            <input 
                                type="checkbox" 
                                className="sr-only peer"
                                name="isActive" 
                                checked={newCoupon.isActive}
                                onChange={handleChange}
                            />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                            <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                        </label>
                        <p>Is Active</p>
                    </div>
                </div>
                
                <button className="mt-4 p-2 px-10 rounded bg-slate-700 text-white active:scale-95 transition">
                    Add Coupon
                </button>
            </form>

            {/* List Coupons */}
            <div className="mt-14">
                <h2 className="text-2xl">List <span className="text-slate-800 font-medium">Coupons</span></h2>
                <div className="overflow-x-auto mt-4 rounded-lg border border-slate-200 max-w-6xl">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Code</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Description</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Discount</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Min Order</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Usage</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Valid Until</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Status</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {coupons.map((coupon) => (
                                <tr key={coupon._id} className="hover:bg-slate-50">
                                    <td className="py-3 px-4 font-medium text-slate-800">{coupon.code}</td>
                                    <td className="py-3 px-4 text-slate-800">{coupon.description}</td>
                                    <td className="py-3 px-4 text-slate-800">
                                        {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                                    </td>
                                    <td className="py-3 px-4 text-slate-800">${coupon.minOrderTotal}</td>
                                    <td className="py-3 px-4 text-slate-800">
                                        {coupon.usedCount || 0}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}
                                    </td>
                                    <td className="py-3 px-4 text-slate-800">
                                        {coupon.validUntil ? format(new Date(coupon.validUntil), 'yyyy-MM-dd') : 'No expiry'}
                                    </td>
                                    <td className="py-3 px-4 text-slate-800">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-800">
                                        <DeleteIcon 
                                            onClick={() => toast.promise(deleteCoupon(coupon.code), { loading: "Deleting coupon..." })} 
                                            className="w-5 h-5 text-red-500 hover:text-red-800 cursor-pointer" 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}