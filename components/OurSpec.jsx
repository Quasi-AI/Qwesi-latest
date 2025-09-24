import React from 'react'
import Title from './Title'
import { MessageCircle, Briefcase, TrendingUp, Shield, Clock, Users } from 'lucide-react'

const OurSpecs = () => {

    const ourSpecsData = [
        {
            title: 'Instant Connections',
            description: 'Connect instantly with buyers and sellers through our integrated chat system, WhatsApp, and voice calls.',
            icon: MessageCircle,
            accent: '#5C3AEB'
        },
        {
            title: 'Career Opportunities',
            description: 'Access thousands of job listings, career guidance, and professional networking opportunities.',
            icon: Briefcase,
            accent: '#10B981'
        },
        {
            title: 'Smart Marketing',
            description: 'Boost your product visibility with our AI-powered promotion tools and targeted advertising.',
            icon: TrendingUp,
            accent: '#F59E0B'
        },
        {
            title: 'Secure Transactions',
            description: 'Shop with confidence using our verified seller system and secure payment protection.',
            icon: Shield,
            accent: '#EF4444'
        },
        {
            title: '24/7 Support',
            description: 'Get help anytime with our round-the-clock customer support and community assistance.',
            icon: Clock,
            accent: '#8B5CF6'
        },
        {
            title: 'Real People Network',
            description: 'Connect with genuine buyers and sellers in your local community and across Ghana.',
            icon: Users,
            accent: '#06B6D4'
        }
    ]

    return (
        <div className='px-6 my-20 max-w-6xl mx-auto'>
            <Title 
                visibleButton={false} 
                title='Why Choose Our Platform' 
                description="We offer top-tier service and convenience to ensure your shopping, career, and connection experience is smooth, secure and completely hassle-free." 
            />

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-10 mt-12'>
                {
                    ourSpecsData.map((spec, index) => {
                        return (
                            <div 
                                className='relative h-44 px-8 flex flex-col items-center justify-center w-full text-center border rounded-lg group hover:shadow-lg transition-all duration-300' 
                                style={{ 
                                    backgroundColor: spec.accent + '10', 
                                    borderColor: spec.accent + '30' 
                                }} 
                                key={index}
                            >
                                <h3 className='text-slate-800 font-medium text-lg'>{spec.title}</h3>
                                <p className='text-sm text-slate-600 mt-3 leading-relaxed'>{spec.description}</p>
                                <div 
                                    className='absolute -top-5 text-white size-10 flex items-center justify-center rounded-md group-hover:scale-105 transition-transform duration-200' 
                                    style={{ backgroundColor: spec.accent }}
                                >
                                    <spec.icon size={20} />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default OurSpecs