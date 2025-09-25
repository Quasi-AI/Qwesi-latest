'use client'
import Loading from "@/components/Loading"
import { CircleDollarSignIcon, ShoppingBasketIcon, StarIcon, TagsIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

export default function Dashboard() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalEarnings: 0,
        totalOrders: 0,
        stores: [],
        orders: [],
    })

    const dashboardCardsData = [
        { title: 'Total Stores', value: dashboardData.stores.length, icon: ShoppingBasketIcon },
        { title: 'Total Earnings', value: currency + dashboardData.totalEarnings, icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.totalOrders, icon: TagsIcon },
        { title: 'Total Products', value: dashboardData.totalProducts, icon: StarIcon },
    ]

    const fetchDashboardData = async () => {
        try {
            // Fetch stores
            const storesResponse = await fetch(`${API_BASE_URL}/stores`)
            const storesData = await storesResponse.json()
            
            // Fetch orders
            const ordersResponse = await fetch(`${API_BASE_URL}/orders`)
            const ordersData = await ordersResponse.json()

            // Calculate totals
            let totalProducts = 0
            let totalEarnings = 0

            // Count products from all stores
            for (const store of storesData) {
                const productsResponse = await fetch(`${API_BASE_URL}/stores/${store._id}/products`)
                const productsData = await productsResponse.json()
                totalProducts += productsData.length
            }

            // Calculate earnings from orders
            totalEarnings = ordersData.reduce((sum, order) => sum + (order.total || 0), 0)

            setDashboardData({
                totalProducts,
                totalEarnings,
                totalOrders: ordersData.length,
                stores: storesData,
                orders: ordersData,
            })
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    return (
        <div className=" text-slate-500 mb-28">
            <h1 className="text-2xl">Dashboard</h1>

            <div className="flex flex-wrap gap-5 my-10 mt-4">
                {
                    dashboardCardsData.map((card, index) => (
                        <div key={index} className="flex items-center gap-11 border border-slate-200 p-3 px-6 rounded-lg">
                            <div className="flex flex-col gap-3 text-xs">
                                <p>{card.title}</p>
                                <b className="text-2xl font-medium text-slate-700">{card.value}</b>
                            </div>
                            <card.icon size={50} className=" w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
                        </div>
                    ))
                }
            </div>

            <h2>Recent Orders</h2>

            <div className="mt-5">
                {
                    dashboardData.orders.slice(0, 5).map((order, index) => (
                        <div key={order._id} className="flex max-sm:flex-col gap-5 sm:items-center justify-between py-6 border-b border-slate-200 text-sm text-slate-600 max-w-4xl">
                            <div>
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                        <TagsIcon size={16} />
                                    </div>
                                    <div>
                                        <p className="font-medium">{order.contact?.name || 'Unknown Customer'}</p>
                                        <p className="font-light text-slate-500">{new Date(order.createdAt).toDateString()}</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-slate-500 max-w-xs leading-6">
                                    {order.items.length} item(s) - {order.status}
                                </p>
                            </div>
                            <div className="flex flex-col justify-between gap-6 sm:items-end">
                                <div className="flex flex-col sm:items-end">
                                    <p className="text-slate-400">{order.currency}</p>
                                    <p className="font-medium">{currency}{order.total}</p>
                                    <div className="flex items-center">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => router.push(`/orders/${order._id}`)} 
                                    className="bg-slate-100 px-5 py-2 hover:bg-slate-200 rounded transition-all"
                                >
                                    View Order
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}