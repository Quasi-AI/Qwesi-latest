'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon, MessageCircle, Facebook, Linkedin, Star, Users, TrendingUp, Search, Play, Phone, MessageCircleMore, Briefcase } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    return (
        <div className='relative z-10'>
            {/* Modern Hero Section */}
            <div className='relative overflow-hidden bg-gradient-to-br from-[#5C3AEB]/5 via-white to-[#5C3AEB]/10'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20'>
                    
                    {/* Main Hero Content */}
                    <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
                        
                        {/* Left Column - Content */}
                        <div className='space-y-8'>
                            
                            {/* Badge */}
                            <div className='inline-flex items-center gap-2 bg-[#5C3AEB] text-white px-4 py-2 rounded-full text-sm font-medium'>
                                <Star className='w-4 h-4 fill-current' />
                                #1 Marketplace in Ghana
                            </div>
                            
                            {/* Main Heading */}
                            <div className='space-y-4'>
                                <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight'>
                                    Buy, Sell & Find 
                                    <span className='text-[#5C3AEB] block'>Anything Locally</span>
                                </h1>
                                <p className='text-xl text-gray-600 leading-relaxed max-w-lg'>
                                    Connect with real people in your area. From cars to jobs, electronics to services - discover thousands of opportunities.
                                </p>
                            </div>
                            
                            {/* Stats */}
                            <div className='flex flex-wrap gap-8 text-sm'>
                                <div className='flex items-center gap-2'>
                                    <Users className='w-5 h-5 text-[#5C3AEB]' />
                                    <span className='text-gray-600'>4M+ Users</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <TrendingUp className='w-5 h-5 text-[#5C3AEB]' />
                                    <span className='text-gray-600'>50K+ Daily Ads</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Star className='w-5 h-5 text-[#5C3AEB]' />
                                    <span className='text-gray-600'>4.8 Rating</span>
                                </div>
                            </div>
                            
                            {/* Search Bar */}
                            <div className='relative max-w-lg'>
                                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                                <input
                                    type='text'
                                    placeholder='What are you looking for?'
                                    className='w-full pl-12 pr-32 py-4 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:border-[#5C3AEB] focus:ring-2 focus:ring-[#5C3AEB]/20'
                                />
                                <button className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#5C3AEB] text-white px-6 py-2 rounded-lg hover:bg-[#342299]'>
                                    Search
                                </button>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className='flex flex-col sm:flex-row gap-4'>
                                <Link 
                                    href="/categories"
                                    className='relative z-20 flex items-center justify-center gap-2 bg-[#5C3AEB] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#342299] transition-all cursor-pointer'
                                >
                                    Browse Categories
                                    <ArrowRightIcon className='w-5 h-5' />
                                </Link>
                                <Link 
                                    href="/dashboard"
                                    className='relative z-20 flex items-center justify-center gap-2 bg-white border-2 border-[#5C3AEB] text-[#5C3AEB] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#5C3AEB] hover:text-white transition-all cursor-pointer'
                                >
                                    <Play className='w-5 h-5' />
                                    Post Free Ad
                                </Link>
                            </div>

                            {/* Instant Connection Section */}
                            <div className='pt-6 border-t border-gray-200'>
                                <p className='text-sm text-gray-600 mb-4'>Get instant help:</p>
                                <div className='flex flex-wrap items-center gap-4'>
                                    {/* WhatsApp */}
                                    <a 
                                        href="https://api.whatsapp.com/send/?phone=12019790148&text&type=phone_number&app_absent=0" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all cursor-pointer"
                                    >
                                        <MessageCircleMore className='w-4 h-4' />
                                        <span>WhatsApp</span>
                                    </a>
                                    
                                    {/* Facebook */}
                                    <a 
                                        href="https://m.me/61577053655499" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
                                    >
                                        <MessageCircleMore className='w-4 h-4' />
                                        <span>Messenger</span>
                                    </a>
                                    
                                    {/* LinkedIn */}
                                    <a 
                                        href="https://www.linkedin.com/company/108025422" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-all cursor-pointer"
                                    >
                                        <Linkedin className='w-4 h-4' />
                                        <span>LinkedIn</span>
                                    </a>
                                    
                                    {/* Phone Call */}
                                    <a 
                                        href="tel:+12019790148" 
                                        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-all cursor-pointer"
                                    >
                                        <Phone className='w-4 h-4' />
                                        <span>Call Now</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Column - Visual Content */}
                        <div className='relative z-10'>
                            
                            {/* Main Hero Image Area */}
                            <div className='relative bg-gradient-to-br from-[#5C3AEB] to-[#342299] rounded-3xl p-8 lg:p-12'>
                                <div className='text-center text-white space-y-6'>
                                    <h3 className='text-2xl lg:text-3xl font-bold'>Start Selling Today!</h3>
                                    <p className='text-white/70'>Join thousands of successful sellers</p>
                                    
                                    {/* Quick Stats Cards */}
                                    <div className='grid grid-cols-2 gap-4 mt-8'>
                                        <div className='bg-white/10 backdrop-blur rounded-xl p-4'>
                                            <div className='text-2xl font-bold'>89K+</div>
                                            <div className='text-sm opacity-80'>Active Listings</div>
                                        </div>
                                        <div className='bg-white/10 backdrop-blur rounded-xl p-4'>
                                            <div className='text-2xl font-bold'>24/7</div>
                                            <div className='text-sm opacity-80'>Support</div>
                                        </div>
                                    </div>

                                    {/* Social Proof */}
                                    <div className='pt-6'>
                                        <p className='text-sm text-white/80 mb-3'>Connect with us:</p>
                                        <div className='flex justify-center space-x-3'>
                                            <a href="#" className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all'>
                                                <MessageCircleMore className='w-4 h-4 text-white' />
                                            </a>
                                            <a href="#" className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all'>
                                                <Facebook className='w-4 h-4 text-white' />
                                            </a>
                                            <a href="#" className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all'>
                                                <Linkedin className='w-4 h-4 text-white' />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Floating Elements */}
                                <div className='absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg'>
                                    <MessageCircle className='w-6 h-6 text-[#5C3AEB]' />
                                </div>
                                <div className='absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg'>
                                    <Star className='w-6 h-6 text-yellow-500 fill-current' />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Horizontally Scrollable Quick Access Cards */}
                    <div className='mt-16 relative z-20'>
                        <div className='overflow-x-auto pb-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400'>
                            <div className='flex gap-4 min-w-max'>
                                <Link href="/shop?category=vehicles" className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border[#5C3AEB]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        🚗
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>Vehicles</h4>
                                    <p className='text-sm text-gray-600'>12K+ listings</p>
                                </Link>
                                
                                <Link href="/shop?category=property" className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#5C3AEB]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        🏠
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>Property</h4>
                                    <p className='text-sm text-gray-600'>8K+ listings</p>
                                </Link>
                                
                                <Link href="/shop?category=electronics" className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#5C3AEB]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        📱
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>Electronics</h4>
                                    <p className='text-sm text-gray-600'>15K+ listings</p>
                                </Link>
                                
                                <Link href="/talent-pool" className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#00C4A7]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        👥
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>Find Talent</h4>
                                    <p className='text-sm text-gray-600'>15K+ freelancers</p>
                                </Link>

                                <Link href="/investors" className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#00C4A7]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        💰
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>Find Investors</h4>
                                    <p className='text-sm text-gray-600'>15K+ investors</p>
                                </Link>

                                <Link href="/jobs" className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#FF6B6B]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        🔍
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>Job Seeker</h4>
                                    <p className='text-sm text-gray-600'>2.5K+ opportunities</p>
                                </Link>

                                <Link href="/shop?category=services" className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#5C3AEB]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        🔧
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>Services</h4>
                                    <p className='text-sm text-gray-600'>9K+ providers</p>
                                </Link>

                                <Link href="/shop?category=furniture" className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#5C3AEB]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        🪑
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>Furniture</h4>
                                    <p className='text-sm text-gray-600'>4K+ listings</p>
                                </Link>

                                <Link href="/shop?category=books" className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#5C3AEB]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        📚
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>Books & Education</h4>
                                    <p className='text-sm text-gray-600'>3K+ listings</p>
                                </Link>

                                <Link href="/shop?category=sports" className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#5C3AEB]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        ⚽
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>Sports & Fitness</h4>
                                    <p className='text-sm text-gray-600'>2K+ listings</p>
                                </Link>

                                <Link href="/shop?category=pets" className='relative z-20 group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 hover:border-[#5C3AEB]/30 transition-all cursor-pointer min-w-[200px]'>
                                    <div className='w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                        🐕
                                    </div>
                                    <h4 className='font-semibold text-gray-900 mb-1'>Pets & Animals</h4>
                                    <p className='text-sm text-gray-600'>1.5K+ listings</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Background Elements - Ensure they're behind content */}
                <div className='absolute top-0 right-0 w-96 h-96 bg-[#5C3AEB]/5 rounded-full blur-3xl -z-10'></div>
                <div className='absolute bottom-0 left-0 w-96 h-96 bg-[#5C3AEB]/5 rounded-full blur-3xl -z-10'></div>
            </div>

            <CategoriesMarquee />
        </div>
    )
}

export default Hero