'use client'
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { toast } from "react-hot-toast"

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

export default function StoreOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`)
            if (response.ok) {
                const data = await response.json()
                setOrders(data)
            } else {
                throw new Error('Failed to fetch orders')
            }
        } catch (error) {
            console.error('Error fetching orders:', error)
            toast.error('Failed to fetch orders')
        } finally {
            setLoading(false)
        }
    }

    const updateOrderStatus = async (orderId, status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            })

            if (response.ok) {
                setOrders(orders.map(order => 
                    order._id === orderId ? { ...order, status } : order
                ))
                toast.success('Order status updated successfully')
            } else {
                throw new Error('Failed to update order status')
            }
        } catch (error) {
            console.error('Error updating order status:', error)
            toast.error('Failed to update order status')
        }
    }

    const openModal = (order) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedOrder(null)
        setIsModalOpen(false)
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    if (loading) return <Loading />

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">Store <span className="text-slate-800 font-medium">Orders</span></h1>
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <div className="overflow-x-auto max-w-4xl rounded-md shadow border border-gray-200">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
                            <tr>
                                {["Sr. No.", "Customer", "Total", "Currency", "Items", "Status", "Date"].map((heading, i) => (
                                    <th key={i} className="px-4 py-3">{heading}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order, index) => (
                                <tr
                                    key={order._id}
                                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                    onClick={() => openModal(order)}
                                >
                                    <td className="pl-6 text-green-600">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3">{order.contact?.name || order.contact?.email || 'Unknown'}</td>
                                    <td className="px-4 py-3 font-medium text-slate-800">${order.total}</td>
                                    <td className="px-4 py-3">{order.currency}</td>
                                    <td className="px-4 py-3">{order.items?.length || 0}</td>
                                    <td className="px-4 py-3" onClick={(e) => { e.stopPropagation() }}>
                                        <select
                                            value={order.status}
                                            onChange={e => updateOrderStatus(order._id, e.target.value)}
                                            className="border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="refunded">Refunded</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && selectedOrder && (
                <div onClick={closeModal} className="fixed inset-0 flex items-center justify-center bg-black/50 text-slate-700 text-sm backdrop-blur-xs z-50">
                    <div onClick={e => e.stopPropagation()} className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4 text-center">
                            Order Details
                        </h2>

                        {/* Customer Details */}
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Customer Details</h3>
                            <p><span className="text-green-700">Name:</span> {selectedOrder.contact?.name || 'N/A'}</p>
                            <p><span className="text-green-700">Email:</span> {selectedOrder.contact?.email || 'N/A'}</p>
                            <p><span className="text-green-700">Phone:</span> {selectedOrder.contact?.phone || 'N/A'}</p>
                            <p><span className="text-green-700">Address:</span> {selectedOrder.contact?.address || 'N/A'}</p>
                        </div>

                        {/* Products */}
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Products</h3>
                            <div className="space-y-2">
                                {selectedOrder.items?.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 border border-slate-100 shadow rounded p-2">
                                        <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center">
                                            <span className="text-xs">Product</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-slate-800">{item.name}</p>
                                            <p>Qty: {item.quantity}</p>
                                            <p>Unit Price: ${item.unitPrice}</p>
                                            <p>Subtotal: ${item.subtotal}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment & Status */}
                        <div className="mb-4">
                            <p><span className="text-green-700">Payment Provider:</span> {selectedOrder.payment?.provider || 'N/A'}</p>
                            <p><span className="text-green-700">Subtotal:</span> ${selectedOrder.subtotal}</p>
                            <p><span className="text-green-700">Discount:</span> ${selectedOrder.discount}</p>
                            <p><span className="text-green-700">Tax:</span> ${selectedOrder.tax}</p>
                            <p><span className="text-green-700">Shipping:</span> ${selectedOrder.shipping}</p>
                            <p><span className="text-green-700">Total:</span> ${selectedOrder.total}</p>
                            {selectedOrder.couponCode && (
                                <p><span className="text-green-700">Coupon:</span> {selectedOrder.couponCode}</p>
                            )}
                            <p><span className="text-green-700">Status:</span> {selectedOrder.status}</p>
                            <p><span className="text-green-700">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end">
                            <button onClick={closeModal} className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}