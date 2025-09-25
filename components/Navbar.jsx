'use client'
import { Search, ShoppingCart, Menu, X, User, ChevronDown, Settings, Package, LogOut, Plus } from "lucide-react";
import Link from "next/link";
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LoginModal from '@/modals/LoginModal'
import SignupModal from '@/modals/SignupModal'
import { readAuth, clearAuth, validateStoredToken } from '@/lib/auth'
import ForgotPasswordModal from '@/modals/ForgotPasswordModal'
import ResetPasswordModal from '@/modals/ResetPasswordModal'

const Navbar = () => {
    const router = useRouter();
    
    const [search, setSearch] = useState('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [showSignup, setShowSignup] = useState(false)
    const [userDropdownOpen, setUserDropdownOpen] = useState(false)
    const [showForgot, setShowForgot] = useState(false)
    const [showReset, setShowReset] = useState(false)
    
    const cartCount = useSelector(state => state.cart.total)
    
    // Mock user state - replace this with your actual user state management
    const [user, setUser] = useState(null)
    // Example: const user = useSelector(state => state.auth.user)
    // For demo, you can set a mock user:
    // const [user, setUser] = useState({ name: 'Rexton Itsiah', email: 'rex30818@gmail.com', avatar: null })

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Load auth and validate token on mount
    useEffect(() => {
        const auth = readAuth()
        if (auth?.user) setUser(auth.user)
        // Validate token; if invalid, user will be cleared by auto-logout
        validateStoredToken({ onInvalid: () => setUser(null) })
    }, [])

    // Listen for global login open event
    useEffect(() => {
        const handler = () => setShowLogin(true)
        window.addEventListener('auth:open-login', handler)
        return () => window.removeEventListener('auth:open-login', handler)
    }, [])

    // Intercept clicks to protected routes and show login modal if not logged in
    useEffect(() => {
        const onClick = (e) => {
            try {
                const target = e.target
                if (!target) return
                const anchor = target.closest && target.closest('a[href]')
                if (!anchor) return
                const href = anchor.getAttribute('href')
                if (!href || href.startsWith('#')) return
                // Ignore new tabs or downloads
                if (anchor.target === '_blank' || anchor.hasAttribute('download') || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
                const url = new URL(anchor.href, window.location.href)
                if (url.origin !== window.location.origin) return
                const path = url.pathname
                const isProtected = path.startsWith('/dashboard') || path.startsWith('/store')
                if (!isProtected) return
                const auth = readAuth()
                const loggedIn = !!auth?.token
                if (!loggedIn) {
                    e.preventDefault()
                    e.stopPropagation()
                    window.dispatchEvent(new Event('auth:open-login'))
                }
            } catch {}
        }
        document.addEventListener('click', onClick, true)
        return () => document.removeEventListener('click', onClick, true)
    }, [])

    // Close mobile menu and dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
                setMobileMenuOpen(false)
            }
            if (userDropdownOpen && !event.target.closest('.user-dropdown-container')) {
                setUserDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [mobileMenuOpen, userDropdownOpen])

    const handleSearch = (e) => {
        e.preventDefault()
        if (search.trim()) {
            router.push(`/shop?search=${search}`)
            setSearchOpen(false)
            setMobileMenuOpen(false)
        }
    }

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen)
        setSearchOpen(false)
        setUserDropdownOpen(false)
    }

    const toggleSearch = () => {
        setSearchOpen(!searchOpen)
        setMobileMenuOpen(false)
        setUserDropdownOpen(false)
    }

    const toggleUserDropdown = () => {
        setUserDropdownOpen(!userDropdownOpen)
        setMobileMenuOpen(false)
        setSearchOpen(false)
    }

    // Modal handlers
    const handleLoginClick = () => {
        // Check if already logged in
        const auth = readAuth()
        if (auth?.token && auth?.user) {
            setUser(auth.user)
            return
        }
        
        setShowLogin(true)
        setMobileMenuOpen(false)
        setUserDropdownOpen(false)
    }

    const handleSignupClick = () => {
        setShowSignup(true)
        setMobileMenuOpen(false)
        setUserDropdownOpen(false)
    }

    const switchToSignup = () => {
        setShowLogin(false)
        setShowSignup(true)
    }

    const switchToLogin = () => {
        setShowSignup(false)
        setShowLogin(true)
    }

    const handleLogout = () => {
        clearAuth()
        setUser(null)
        setUserDropdownOpen(false)
    }

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/shop', label: 'Shop' },
        { href: '/scholarships', label: 'Scholarships' },
        { href: '/about', label: 'About' }
    ]

    const userMenuItems = [
        { href: '/profile', label: 'Manage account', icon: Settings },
        { href: '/cart', label: 'Cart', icon: ShoppingCart },
        { href: '/orders', label: 'My Orders', icon: Package },
    ]

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
                scrolled ? 'shadow-lg backdrop-blur-md bg-white/95' : 'shadow-sm'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        
                        {/* Logo */}
                        <Link 
                            href="/" 
                            className="flex-shrink-0 transition-transform hover:scale-105 duration-200"
                        >
                            <Image 
                                width={120}
                                height={40}
                                className='h-8 lg:h-10 w-auto' 
                                src="/logo.png" 
                                alt="Company Logo" 
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.href}
                                    href={link.href}
                                    className="text-gray-700 hover:text-[#5C3AEB] font-medium transition-colors duration-200 relative group"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#5C3AEB] transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Search Bar */}
                        <div className="hidden xl:block">
                            <form onSubmit={handleSearch} className="relative">
                                <div className="flex items-center w-80 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-full border border-gray-200 focus-within:border-[#5C3AEB] focus-within:ring-2 focus-within:ring-[#5C3AEB]/20">
                                    <Search size={20} className="text-gray-400 ml-4" />
                                    <input 
                                        className="w-full bg-transparent outline-none px-4 py-3 text-sm placeholder-gray-500" 
                                        type="text" 
                                        placeholder="Search products, brands..." 
                                        value={search} 
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => setSearch('')}
                                            className="mr-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                                        >
                                            <X size={16} className="text-gray-400" />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center space-x-4">
                            {/* Search Toggle for medium screens */}
                            <button 
                                onClick={toggleSearch}
                                className="xl:hidden p-2 text-gray-600 hover:text-[#5C3AEB] hover:bg-gray-50 rounded-full transition-all duration-200"
                            >
                                <Search size={20} />
                            </button>

                            {/* Cart */}
                            <Link 
                                href="/cart" 
                                className="relative flex items-center space-x-2 text-gray-700 hover:text-[#5C3AEB] transition-colors duration-200 p-2 hover:bg-gray-50 rounded-full"
                            >
                                <ShoppingCart size={20} />
                                <span className="hidden xl:inline font-medium">Cart</span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#5C3AEB] text-white text-xs font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center animate-pulse">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* User Profile Dropdown or Login Button */}
                            {user ? (
                                <div className="user-dropdown-container relative">
                                    <button 
                                        onClick={toggleUserDropdown}
                                        className="flex items-center space-x-3 p-2 text-gray-700 hover:text-[#5C3AEB] hover:bg-gray-50 rounded-full transition-all duration-200"
                                    >
                                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                                            {user.avatar && user.avatar.trim() ? (
                                                <Image
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    width={32}
                                                    height={32}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm font-medium text-gray-600">
                                                    {user.name?.charAt(0) || 'U'}
                                                </span>
                                            )}
                                        </div>
                                        <ChevronDown 
                                            size={16} 
                                            className={`transition-transform duration-200 ${
                                                userDropdownOpen ? 'rotate-180' : 'rotate-0'
                                            }`} 
                                        />
                                    </button>

                                    {/* User Dropdown Menu */}
                                    {userDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                                                        {user.avatar && user.avatar.trim() ? (
                                                            <Image
                                                                src={user.avatar}
                                                                alt={user.name}
                                                                width={40}
                                                                height={40}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-lg font-medium text-gray-600">
                                                                {user.name?.charAt(0) || 'U'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            {userMenuItems.map((item) => {
                                                const IconComponent = item.icon
                                                return (
                                                    <Link 
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setUserDropdownOpen(false)}
                                                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                    >
                                                        <IconComponent size={16} className="text-gray-500" />
                                                        <span>{item.label}</span>
                                                    </Link>
                                                )
                                            })}

                                            {/* Sign Out */}
                                            <button 
                                                onClick={handleLogout}
                                                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <LogOut size={16} className="text-gray-500" />
                                                <span>Sign out</span>
                                            </button>

                                            <hr className="my-2 border-gray-100" />

                                            {/* Add Account */}
                                            <button className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                                                <Plus size={16} className="text-gray-500" />
                                                <span>Add account</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button 
                                    onClick={handleLoginClick}
                                    className="bg-[#5C3AEB] hover:bg-[#3525b8] text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center space-x-2"
                                >
                                    <User size={18} />
                                    <span>Login</span>
                                </button>
                            )}
                        </div>

                        {/* Mobile Actions */}
                        <div className="lg:hidden flex items-center space-x-2">
                            {/* Mobile Search */}
                            <button 
                                onClick={toggleSearch}
                                className={`p-2 rounded-full transition-all duration-200 ${
                                    searchOpen 
                                        ? 'bg-[#5C3AEB] text-white shadow-lg' 
                                        : 'text-gray-600 hover:text-[#5C3AEB] hover:bg-gray-50'
                                }`}
                            >
                                <Search size={20} />
                            </button>

                            {/* Mobile Cart */}
                            <Link 
                                href="/cart" 
                                className="relative p-2 text-gray-600 hover:text-[#5C3AEB] hover:bg-gray-50 rounded-full transition-all duration-200"
                            >
                                <ShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#5C3AEB] text-white text-xs font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Menu Button */}
                            <button 
                                onClick={toggleMobileMenu}
                                className={`mobile-menu-container p-2 rounded-full transition-all duration-200 ${
                                    mobileMenuOpen 
                                        ? 'bg-[#5C3AEB] text-white shadow-lg' 
                                        : 'text-gray-600 hover:text-[#5C3AEB] hover:bg-gray-50'
                                }`}
                            >
                                <div className="relative">
                                    <Menu 
                                        size={24} 
                                        className={`transition-all duration-300 ${
                                            mobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                                        }`} 
                                    />
                                    <X 
                                        size={24} 
                                        className={`absolute inset-0 transition-all duration-300 ${
                                            mobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                                        }`}
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {searchOpen && (
                    <div className="lg:xl:hidden border-t border-gray-200 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                            <form onSubmit={handleSearch} className="relative">
                                <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 focus-within:border-[#5C3AEB] focus-within:ring-2 focus-within:ring-[#5C3AEB]/20">
                                    <Search size={20} className="text-gray-400 ml-4" />
                                    <input 
                                        className="w-full bg-transparent outline-none px-4 py-3 text-sm placeholder-gray-500" 
                                        type="text" 
                                        placeholder="Search products, brands..." 
                                        value={search} 
                                        onChange={(e) => setSearch(e.target.value)}
                                        autoFocus
                                    />
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => setSearch('')}
                                            className="mr-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                                        >
                                            <X size={16} className="text-gray-400" />
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Mobile Menu */}
                <div className={`lg:hidden border-t border-gray-200 bg-white mobile-menu-container transition-all duration-300 overflow-hidden ${
                    mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                        {/* User Info for Mobile (if logged in) */}
                        {user && (
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                                        {user.avatar && user.avatar.trim() ? (
                                            <Image
                                                src={user.avatar}
                                                alt={user.name}
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-lg font-medium text-gray-600">
                                                {user.name?.charAt(0) || 'U'}
                                            </span>
                                        )}
                                    </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Links */}
                        <div className="space-y-1">
                            {navLinks.map((link, index) => (
                                <Link 
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block text-lg font-medium text-gray-700 hover:text-[#5C3AEB] hover:bg-gray-50 transition-all duration-200 py-3 px-4 rounded-lg transform ${
                                        mobileMenuOpen 
                                            ? 'translate-x-0 opacity-100' 
                                            : 'translate-x-4 opacity-0'
                                    }`}
                                    style={{ 
                                        transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms'
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <hr className="border-gray-200" />

                        {/* Mobile Actions */}
                        <div className={`space-y-4 transform transition-all duration-300 ${
                            mobileMenuOpen 
                                ? 'translate-y-0 opacity-100' 
                                : 'translate-y-4 opacity-0'
                        }`} style={{ transitionDelay: mobileMenuOpen ? '200ms' : '0ms' }}>
                            
                            {user ? (
                                <>
                                    {/* User Menu Items for Mobile */}
                                    {userMenuItems.map((item) => {
                                        const IconComponent = item.icon
                                        return (
                                            <Link 
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center space-x-3 text-gray-700 hover:text-[#5C3AEB] py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <IconComponent size={18} />
                                                <span>{item.label}</span>
                                            </Link>
                                        )
                                    })}
                                    
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-3 text-red-600 hover:text-red-700 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        <span>Sign out</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        onClick={handleLoginClick}
                                        className="w-full bg-[#5C3AEB] hover:bg-[#3525b8] text-white py-3 px-6 rounded-full font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                                    >
                                        <User size={18} />
                                        <span>Login</span>
                                    </button>
                                    
                                    <div className="text-center text-sm text-gray-500">
                                        <span>New customer? </span>
                                        <button 
                                            onClick={handleSignupClick}
                                            className="text-[#5C3AEB] hover:underline font-medium"
                                        >
                                            Create an account
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Spacer to prevent content from hiding behind fixed navbar */}
            <div className="h-16 lg:h-20"></div>

            {/* Login Modal */}
            <LoginModal 
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onSwitchToSignup={switchToSignup}
                onLoggedIn={(result) => { setUser(result.user || null) }}
                onForgotPassword={() => { setShowLogin(false); setShowForgot(true) }}
            />

            <ForgotPasswordModal
                isOpen={showForgot}
                onClose={() => setShowForgot(false)}
                onSwitchToReset={() => { setShowForgot(false); setShowReset(true) }}
            />
            <ResetPasswordModal
                isOpen={showReset}
                onClose={() => setShowReset(false)}
            />

            {/* Signup Modal */}
            <SignupModal 
                isOpen={showSignup}
                onClose={() => setShowSignup(false)}
                onSwitchToLogin={switchToLogin}
            />
        </>
    )
}

export default Navbar
