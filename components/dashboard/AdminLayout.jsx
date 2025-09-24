'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import Navbar from "../Navbar"
import AdminSidebar from "./AdminSidebar"
import { readAuth, validateStoredToken } from "@/lib/auth"

const AdminLayout = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const init = async () => {
            // Require valid token to access admin
            const auth = readAuth()
            const hasUser = !!auth?.user
            if (!hasUser) {
                setIsAdmin(false)
                setLoading(false)
                return
            }
            const valid = await validateStoredToken()
            setIsAdmin(!!valid.valid)
            setLoading(false)
        }
        init()
    }, [])

    return loading ? (
        <Loading />
    ) : isAdmin ? (
        <div className="flex flex-col h-screen bg-gray-50">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">You are not authorized to access this page</h1>
            <Link href="/" className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full hover:bg-slate-800 transition-colors">
                Go to home <ArrowRightIcon size={18} />
            </Link>
        </div>
    )
}

export default AdminLayout