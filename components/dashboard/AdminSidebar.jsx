'use client'
import { usePathname } from "next/navigation"
import { 
    HomeIcon, 
    ShieldCheckIcon, 
    StoreIcon, 
    TicketPercentIcon,
    UsersIcon,
    PresentationIcon,
    TrendingUpIcon,
    Briefcase,
    CreditCardIcon,
    UserIcon,
    Menu,
    X
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { assets } from "@/assets/assets"

const AdminSidebar = () => {
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const sidebarLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Stores', href: '/dashboard/stores', icon: StoreIcon },
        { name: 'Post Job', href: '/dashboard/employer', icon: Briefcase },
        { name: 'Pitch', href: '/dashboard/pitch', icon: PresentationIcon },
        { name: 'Investor', href: '/dashboard/investor', icon: TrendingUpIcon },
        { name: 'Subscription', href: '/dashboard/subscription', icon: CreditCardIcon }
    ]

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 bg-white rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition-colors"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <X size={20} className="text-slate-600" />
                    ) : (
                        <Menu size={20} className="text-slate-600" />
                    )}
                </button>
            </div>

            {/* Mobile Overlay (transparent to avoid darkening background but still allow tap-to-close) */}
            {isMobileMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-transparent z-40"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-40
                w-64 lg:w-60 xl:w-64
                bg-white border-r border-slate-200
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex flex-col h-full
            `}>
                {/* Header */}
                <div className="flex flex-col gap-3 justify-center items-center pt-6 pb-6 border-b border-slate-100">
                    <Image 
                        className="w-12 h-12 rounded-full border-2 border-blue-100" 
                        src={assets.qwesi_head} 
                        alt="Qwesi Logo" 
                        width={80} 
                        height={80} 
                    />
                    <div className="text-center">
                        <p className="text-slate-800 font-semibold text-sm">Qwesi</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {sidebarLinks.map((link, index) => {
                            const isActive = pathname === link.href
                            return (
                                <li key={index}>
                                    <Link 
                                        href={link.href} 
                                        onClick={closeMobileMenu}
                                        className={`
                                            relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                                            text-slate-600 hover:bg-slate-50 hover:text-slate-900
                                            transition-all duration-200 group text-sm
                                            ${isActive ? 'bg-blue-50 text-blue-900 font-medium border border-blue-100' : ''}
                                        `}
                                        aria-current={isActive ? 'page' : undefined}
                                    >
                                        <link.icon 
                                            size={18} 
                                            className={`
                                                flex-shrink-0 transition-colors
                                                ${isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'}
                                            `}
                                        />
                                        <span className="truncate font-medium">{link.name}</span>
                                        {isActive && (
                                            <span 
                                                className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-l-full"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 mt-auto">
                    <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1">Dashboard</div>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default AdminSidebar