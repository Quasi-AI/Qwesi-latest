'use client'
import { Search, ShoppingCart, Menu, X, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
    const router = useRouter();
    
    const [search, setSearch] = useState('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    
    const cartCount = useSelector(state => state.cart.total)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
                setMobileMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [mobileMenuOpen])

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
    }

    const toggleSearch = () => {
        setSearchOpen(!searchOpen)
        setMobileMenuOpen(false)
    }

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/shop', label: 'Shop' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
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
                                    className="text-gray-700 hover:text-[#432DD7] font-medium transition-colors duration-200 relative group"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#432DD7] transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Search Bar */}
                        <div className="hidden xl:block">
                            <form onSubmit={handleSearch} className="relative">
                                <div className="flex items-center w-80 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-full border border-gray-200 focus-within:border-[#432DD7] focus-within:ring-2 focus-within:ring-[#432DD7]/20">
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
                                className="xl:hidden p-2 text-gray-600 hover:text-[#432DD7] hover:bg-gray-50 rounded-full transition-all duration-200"
                            >
                                <Search size={20} />
                            </button>

                            {/* Cart */}
                            <Link 
                                href="/cart" 
                                className="relative flex items-center space-x-2 text-gray-700 hover:text-[#432DD7] transition-colors duration-200 p-2 hover:bg-gray-50 rounded-full"
                            >
                                <ShoppingCart size={20} />
                                <span className="hidden xl:inline font-medium">Cart</span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#432DD7] text-white text-xs font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center animate-pulse">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Login Button */}
                            <button className="bg-[#432DD7] hover:bg-[#3525b8] text-white px-6 py-2.5 rounded-full font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center space-x-2">
                                <User size={18} />
                                <span>Login</span>
                            </button>
                        </div>

                        {/* Mobile Actions */}
                        <div className="lg:hidden flex items-center space-x-2">
                            {/* Mobile Search */}
                            <button 
                                onClick={toggleSearch}
                                className={`p-2 rounded-full transition-all duration-200 ${
                                    searchOpen 
                                        ? 'bg-[#432DD7] text-white shadow-lg' 
                                        : 'text-gray-600 hover:text-[#432DD7] hover:bg-gray-50'
                                }`}
                            >
                                <Search size={20} />
                            </button>

                            {/* Mobile Cart */}
                            <Link 
                                href="/cart" 
                                className="relative p-2 text-gray-600 hover:text-[#432DD7] hover:bg-gray-50 rounded-full transition-all duration-200"
                            >
                                <ShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#432DD7] text-white text-xs font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Menu Button */}
                            <button 
                                onClick={toggleMobileMenu}
                                className={`mobile-menu-container p-2 rounded-full transition-all duration-200 ${
                                    mobileMenuOpen 
                                        ? 'bg-[#432DD7] text-white shadow-lg' 
                                        : 'text-gray-600 hover:text-[#432DD7] hover:bg-gray-50'
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
                                <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 focus-within:border-[#432DD7] focus-within:ring-2 focus-within:ring-[#432DD7]/20">
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
                        {/* Navigation Links */}
                        <div className="space-y-1">
                            {navLinks.map((link, index) => (
                                <Link 
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block text-lg font-medium text-gray-700 hover:text-[#432DD7] hover:bg-gray-50 transition-all duration-200 py-3 px-4 rounded-lg transform ${
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
                            <button 
                                onClick={() => {
                                    setMobileMenuOpen(false)
                                    // Add login logic here
                                }}
                                className="w-full bg-[#432DD7] hover:bg-[#3525b8] text-white py-3 px-6 rounded-full font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                            >
                                <User size={18} />
                                <span>Login</span>
                            </button>
                            
                            <div className="text-center text-sm text-gray-500">
                                <span>New customer? </span>
                                <Link 
                                    href="/register" 
                                    className="text-[#432DD7] hover:underline font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Create an account
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Spacer to prevent content from hiding behind fixed navbar */}
            <div className="h-16 lg:h-20"></div>
        </>
    )
}

export default Navbar