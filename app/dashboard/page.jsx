'use client'
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon, TrendingUp, Users, BarChart3 } from "lucide-react"
import { useEffect, useState } from "react"
import PageHeader from '@/components/dashboard/PageHeader'
import { API_ROUTES } from '@/lib/apiRoutes'
import { authFetch } from '@/lib/auth'

export default function AdminDashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        allOrders: [],
    })

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await authFetch(API_ROUTES.DASHBOARD_SUMMARY)
                if (response.ok) {
                    const data = await response.json()
                    setDashboardData(data)
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    const dashboardCardsData = [
        { 
            title: 'Total Products', 
            value: dashboardData.products, 
            icon: ShoppingBasketIcon,
            gradient: 'from-[#5C3AEB] to-[#342299]',
            bgGradient: 'from-[#5C3AEB]/10 to-[#342299]/10'
        },
        { 
            title: 'Total Revenue', 
            value: currency + dashboardData.revenue, 
            icon: CircleDollarSignIcon,
            gradient: 'from-[#00C4A7] to-[#00A085]',
            bgGradient: 'from-[#00C4A7]/10 to-[#00A085]/10'
        },
        { 
            title: 'Total Orders', 
            value: dashboardData.orders, 
            icon: TagsIcon,
            gradient: 'from-[#FF6B6B] to-[#EE5A24]',
            bgGradient: 'from-[#FF6B6B]/10 to-[#EE5A24]/10'
        },
        { 
            title: 'Total Stores', 
            value: dashboardData.stores, 
            icon: StoreIcon,
            gradient: 'from-[#8B5CF6] to-[#7C3AED]',
            bgGradient: 'from-[#8B5CF6]/10 to-[#7C3AED]/10'
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
            {/* Header */}
            <PageHeader title="Dashboard" subtitle={`Monitor your platform's performance and key metrics`} />

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {dashboardCardsData.map((card, index) => (
                    <div 
                        key={index} 
                        className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                        {/* Background gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                        
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                                    {card.title}
                                </p>
                                <p className="text-2xl sm:text-3xl font-black text-gray-900 truncate">
                                    {card.value.toLocaleString ? card.value.toLocaleString() : card.value}
                                </p>
                            </div>
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ml-4`}>
                                <card.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </div>
                        </div>

                        {/* Hover effect indicator */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl"></div>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        Orders Analytics
                    </h2>
                    <p className="text-gray-600 text-sm">Track your order trends and performance over time</p>
                </div>
                
                {/* Chart Container - Make it responsive */}
                <div className="w-full">
                    <OrdersAreaChart allOrders={dashboardData.allOrders} />
                </div>
            </div>

            {/* Additional Quick Stats */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-[#00C4A7] mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Growth Rate</p>
                    <p className="text-lg font-bold text-[#00C4A7]">+12.5%</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 text-center">
                    <Users className="w-8 h-8 text-[#5C3AEB] mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Active Users</p>
                    <p className="text-lg font-bold text-[#5C3AEB]">2,847</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 text-center">
                    <BarChart3 className="w-8 h-8 text-[#FF6B6B] mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Conversion Rate</p>
                    <p className="text-lg font-bold text-[#FF6B6B]">3.2%</p>
                </div>
            </div>
        </div>
    )
}
