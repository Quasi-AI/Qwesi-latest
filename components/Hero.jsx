'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon, MessageCircle, Facebook, Linkedin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    return (
        <div className='mx-6'>
            {/* Original Hero Section */}
            <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>
                <div className='relative flex-1 flex flex-col bg-white border-2 border-[#432DD7] rounded-3xl xl:min-h-100 group'>
                    <div className='p-16 sm:p-16'>
                        <div className='inline-flex items-center gap-3 text-[#432DD7] pr-4 p-1 rounded-full text-xs sm:text-sm'>
                            <span className='bg-[#432DD7] px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs'>NEWS</span> Instant Connections! <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                        </div>
                        <h2 className='text-3xl sm:text-5xl font-medium text-[#432DD7] max-w-xs sm:max-w-md'>
                            Your Career & Recruitment Assistant
                        </h2>
                        <p className='text-gray-600 text-sm sm:text-base leading-relaxed mb-4 max-w-lg'>
                            Get job alerts, homework help, and connect with investors through voice, WhatsApp, and smart conversations.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6'>
                            <button className='bg-[#432DD7] text-white text-sm py-2.5 px-7 sm:py-5 sm:px-12 rounded-md hover:bg-[#342299] hover:scale-103 active:scale-95 transition'>LEARN MORE</button>
                            <Link 
                                href="https://home.qwesi.org" 
                                target="_blank"
                                className='bg-white border-2 border-[#432DD7] text-[#432DD7] text-sm py-2.5 px-7 sm:py-5 sm:px-12 rounded-md hover:bg-[#432DD7] hover:text-white hover:scale-103 active:scale-95 transition text-center'
                            >
                                Get Started
                            </Link>
                        </div>
                        
                        {/* Social Media Buttons */}
                        <div className='flex gap-3 mt-6'>
                            <Link 
                                href="https://wa.me/1234567890" 
                                target="_blank"
                                className="flex items-center gap-2 bg-[#432DD7] hover:bg-[#342299] text-white px-4 py-2 rounded-full transition-all text-xs"
                            >
                                <MessageCircle size={16} />
                                WhatsApp
                            </Link>
                            
                            <Link 
                                href="https://facebook.com/qwesi" 
                                target="_blank"
                                className="flex items-center gap-2 bg-white border border-[#432DD7] text-[#432DD7] hover:bg-[#432DD7] hover:text-white px-4 py-2 rounded-full transition-all text-xs"
                            >
                                <Facebook size={16} />
                                Facebook
                            </Link>
                            
                            <Link 
                                href="https://linkedin.com/company/qwesi" 
                                target="_blank"
                                className="flex items-center gap-2 bg-white border border-[#432DD7] text-[#432DD7] hover:bg-[#432DD7] hover:text-white px-4 py-2 rounded-full transition-all text-xs"
                            >
                                <Linkedin size={16} />
                                LinkedIn
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-gray-600'>
                    <div className='flex-1 flex items-center justify-between w-full bg-white border-2 border-[#432DD7] rounded-3xl p-6 px-8 group'>
                        <div>
                            <p className='text-3xl font-medium text-[#432DD7] max-w-40'>All Categories</p>
                            <p className='flex items-center gap-1 mt-4 text-gray-600'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
                        </div>
                        <Image className='w-35' src={assets.hero_product_img1} alt="" />
                    </div>
                    <Link href="/jobs"  className='flex-1 flex items-center justify-between w-full bg-[#432DD7] rounded-3xl p-6 px-8 group cursor-pointer'>
                        <div>
                            <p className='text-3xl font-medium text-white max-w-40'>Jobs</p>
                            <p className='flex items-center gap-1 mt-4 text-white'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
                        </div>
                        <Image className='w-35' src={assets.job_seeker} alt="" />
                    </Link >
                </div>
            </div>

            <CategoriesMarquee />
        </div>
    )
}

export default Hero