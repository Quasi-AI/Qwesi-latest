'use client'
import Link from "next/link"
import { Menu } from "lucide-react"
import Image from 'next/image'

const AdminNavbar = ({ onMenuClick }) => {
    return (
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
                {/* Mobile menu button */}
                <button 
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                    aria-label="Open menu"
                >
                    <Menu size={20} className="text-slate-600" />
                </button>

                {/* Logo */}
                <Link href="/" className="relative text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800">
                   <Image 
                        width={120}
                        height={40}
                        className='h-8 lg:h-10 w-auto' 
                        src="/logo.png" 
                        alt="Company Logo" 
                        priority
                    />
                </Link>

                {/* User info */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:block">
                        <p className="text-sm md:text-base text-slate-700">Hi, Admin</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">A</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default AdminNavbar