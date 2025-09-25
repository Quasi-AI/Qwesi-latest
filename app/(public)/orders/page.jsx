'use client'
import { useSelector } from "react-redux"
import PageTitle from "@/components/PageTitle"
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { useAuthStore } from '@/stores/authStore'
import Loading from "@/components/Loading"

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

export default function Orders() {
    const { user } = useAuthStore()
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserOrders = async () => {
            if (user?.id) {
                setLoading(true)
                try {
                    const res = await fetch(`${API_BASE_URL}/orders/user/${user.id}`);
                    const data = await res.json();
                    setOrders(data);
                } catch (err) {
                    console.log(err);
                }
                setLoading(false)
            }
        }
        fetchUserOrders();
    }, [user?.id]);

    if (loading) return <Loading />

    return (
        <div className="min-h-[70vh] mx-6" >
            {orders && orders.length > 0 ?
                <div className="my-20 max-w-7xl mx-auto">
                    <PageTitle heading="My Orders" text={`Showing total ${orders.length} orders`} linkText={'Go to home'} />

                    <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
                        <thead>
                            <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                                <th className="text-left">Product</th>
                                <th className="text-center">Total Price</th>
                                <th className="text-left">Address</th>
                                <th className="text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => {
                                return (
                                    <OrderItem order={order} key={order._id} />
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                :
                <div className="min-h-[80vh] mx-6 flex items-center justify-center">
                    <div>
                        <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400 mb-2">You have no orders</h1>
                        <p className="text-slate-600">All your orders will show up here</p>
                    </div>
                </div>
            }
        </div>
    )
}