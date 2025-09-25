'use client'
import Loading from "@/components/Loading"
import PersonalActivityChart from "@/components/PersonalActivityChart"
import { 
    MessageSquare,
    Users, 
    Award, 
    TrendingUp, 
    Target,
    Phone,
    Calendar,
    Star,
    Gift,
    Flame,
    Trophy,
    Clock,
    Briefcase,
    MapPin,
    Globe,
    Mail,
    User,
    Zap,
    CheckCircle
} from "lucide-react"
import { useEffect, useState } from "react"
import PageHeader from '@/components/dashboard/PageHeader'
import Image from 'next/image'

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

export default function QwesiPersonalDashboard() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [userIdentifier, setUserIdentifier] = useState('233247000000') // Get from auth context - phone, email, or id
    const [dashboardData, setDashboardData] = useState({
        profile: {
            name: '',
            userType: '',
            phone: '',
            email: '',
            profileImage: '',
            country: '',
            website: '',
            profileCompleteness: 0,
            createdAt: null
        },
        flags: {},
        activity: {
            conversationCount: 0,
            pitchCount: 0,
            lastConversationAt: null,
            lastPitchAt: null,
            last30DaysConversations: []
        },
        usage: {
            dailyMessages: 0,
            dailyCallMinutes: 0,
            dailyfacebookMessages: 0
        },
        referrals: {
            referralCode: '',
            referredCount: 0,
            stats: {
                totalReferrals: 0,
                successfulReferrals: 0,
                totalPointsEarned: 0
            },
            dynamic: {
                recentReferred: []
            }
        },
        points: {
            total: 0,
            available: 0,
            redeemed: 0,
            recentHistory: []
        }
    })

    useEffect(() => {
        const fetchPersonalDashboard = async () => {
            try {
                setError(null)
                // Use phone as identifier - adjust based on your auth system
                const response = await fetch(`${API_BASE_URL}/dashboard/qwesi/personal?phone=${userIdentifier}`)
                
                if (response.ok) {
                    const result = await response.json()
                    if (result.success) {
                        setDashboardData(result.data)
                    } else {
                        throw new Error(result.message || 'Failed to fetch dashboard data')
                    }
                } else {
                    throw new Error('Failed to fetch dashboard data')
                }

            } catch (error) {
                console.error('Failed to fetch dashboard data:', error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        if (userIdentifier) {
            fetchPersonalDashboard()
        }
    }, [userIdentifier])

    if (loading) return <Loading />

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 flex items-center justify-center">
                <div className="bg-white rounded-lg p-8 shadow-sm border border-red-200">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <X className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const getUserTypeIcon = (userType) => {
        switch (userType) {
            case 'seeker': return Target
            case 'employer': return Briefcase
            case 'investor': return TrendingUp
            default: return Users
        }
    }

    const getUserTypeColor = (userType) => {
        switch (userType) {
            case 'seeker': return 'from-[#00C4A7] to-[#00A085]'
            case 'employer': return 'from-[#FF6B6B] to-[#EE5A24]'
            case 'investor': return 'from-[#8B5CF6] to-[#7C3AED]'
            default: return 'from-[#5C3AEB] to-[#342299]'
        }
    }

    // Calculate activity streak from last 30 days data
    const calculateStreak = () => {
        const conversations = dashboardData.activity.last30DaysConversations || []
        if (conversations.length === 0) return 0

        // Sort by date descending and count consecutive days
        const sortedDates = conversations.sort((a, b) => new Date(b.date) - new Date(a.date))
        let streak = 0
        let currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)

        for (const conv of sortedDates) {
            const convDate = new Date(conv.date)
            convDate.setHours(0, 0, 0, 0)
            
            const daysDiff = Math.floor((currentDate - convDate) / (1000 * 60 * 60 * 24))
            
            if (daysDiff === streak) {
                streak++
                currentDate = convDate
            } else {
                break
            }
        }

        return streak
    }

    const currentStreak = calculateStreak()

    const dashboardCardsData = [
        { 
            title: 'Total Conversations', 
            value: dashboardData.activity.conversationCount, 
            subtitle: `Last: ${dashboardData.activity.lastConversationAt ? new Date(dashboardData.activity.lastConversationAt).toLocaleDateString() : 'Never'}`,
            icon: MessageSquare,
            gradient: 'from-[#5C3AEB] to-[#342299]',
            bgGradient: 'from-[#5C3AEB]/10 to-[#342299]/10'
        },
        { 
            title: 'Current Streak', 
            value: currentStreak, 
            subtitle: `${currentStreak} consecutive days`,
            icon: Flame,
            gradient: 'from-[#FF6B6B] to-[#EE5A24]',
            bgGradient: 'from-[#FF6B6B]/10 to-[#EE5A24]/10'
        },
        { 
            title: 'Total Points', 
            value: dashboardData.points.total, 
            subtitle: `${dashboardData.points.available} available`,
            icon: Award,
            gradient: 'from-[#FFD700] to-[#FFA500]',
            bgGradient: 'from-[#FFD700]/10 to-[#FFA500]/10'
        },
        { 
            title: 'Referrals Made', 
            value: dashboardData.referrals.dynamic.referredCount, 
            subtitle: `${dashboardData.referrals.stats.totalPointsEarned} points earned`,
            icon: Users,
            gradient: getUserTypeColor(dashboardData.profile.userType),
            bgGradient: `${getUserTypeColor(dashboardData.profile.userType).replace('from-', 'from-').replace('to-', 'to-')}/10`
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
            {/* Header with User Info */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        {dashboardData.profile.profileImage ? (
                            <Image 
                                src={dashboardData.profile.profileImage} 
                                alt={dashboardData.profile.name}
                                width={80}
                                height={80}
                                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5C3AEB] to-[#342299] flex items-center justify-center">
                                <User className="w-10 h-10 text-white" />
                            </div>
                        )}
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${getUserTypeColor(dashboardData.profile.userType)} flex items-center justify-center`}>
                            {(() => {
                                const IconComponent = getUserTypeIcon(dashboardData.profile.userType)
                                return <IconComponent className="w-3 h-3 text-white" />
                            })()}
                        </div>
                    </div>
                    
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Welcome back, {dashboardData.profile.name || 'User'}!
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className="capitalize font-medium">
                                {dashboardData.profile.userType} Account
                            </span>
                            <span>•</span>
                            <span>Member since {new Date(dashboardData.profile.createdAt).toLocaleDateString()}</span>
                            {dashboardData.referrals.referralCode && (
                                <>
                                    <span>•</span>
                                    <span>Code: <strong>{dashboardData.referrals.referralCode}</strong></span>
                                </>
                            )}
                        </div>
                        
                        {/* Profile Completeness */}
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                                <div 
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${dashboardData.profile.profileCompleteness}%` }}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-500">
                                Profile {dashboardData.profile.profileCompleteness}% complete
                            </span>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="hidden md:flex flex-col gap-2 text-sm">
                        {dashboardData.profile.phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{dashboardData.profile.phone}</span>
                            </div>
                        )}
                        {dashboardData.profile.email && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span>{dashboardData.profile.email}</span>
                            </div>
                        )}
                        {dashboardData.profile.country && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>{dashboardData.profile.country}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
                                <p className="text-2xl sm:text-3xl font-black text-gray-900 truncate mb-1">
                                    {card.value.toLocaleString ? card.value.toLocaleString() : card.value}
                                </p>
                                <p className="text-xs text-gray-500">{card.subtitle}</p>
                            </div>
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ml-4`}>
                                <card.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Activity Chart */}
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#5C3AEB]" />
                        Activity Trend (30 Days)
                    </h3>
                    {dashboardData.activity.last30DaysConversations.length > 0 ? (
                        <PersonalActivityChart data={dashboardData.activity.last30DaysConversations} />
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No activity in the last 30 days</p>
                        </div>
                    )}
                </div>

                {/* Daily Usage Stats */}
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-[#FF6B6B]" />
                        Today's Usage
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-gray-900">Messages</span>
                            </div>
                            <span className="text-lg font-bold text-blue-600">
                                {dashboardData.usage.dailyMessages}
                            </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-gray-900">Call Minutes</span>
                            </div>
                            <span className="text-lg font-bold text-green-600">
                                {dashboardData.usage.dailyCallMinutes}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-purple-600" />
                                <span className="font-medium text-gray-900">Facebook Messages</span>
                            </div>
                            <span className="text-lg font-bold text-purple-600">
                                {dashboardData.usage.dailyfacebookMessages}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Points History */}
            {dashboardData.points.recentHistory.length > 0 && (
                <div className="mt-8 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        Recent Points Activity
                    </h3>
                    <div className="space-y-3">
                        {dashboardData.points.recentHistory.slice(0, 5).map((point, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        point.type === 'earned' ? 'bg-green-100' :
                                        point.type === 'redeemed' ? 'bg-red-100' :
                                        point.type === 'referral' ? 'bg-blue-100' :
                                        'bg-yellow-100'
                                    }`}>
                                        {point.type === 'earned' && <TrendingUp className="w-4 h-4 text-green-600" />}
                                        {point.type === 'redeemed' && <Gift className="w-4 h-4 text-red-600" />}
                                        {point.type === 'referral' && <Users className="w-4 h-4 text-blue-600" />}
                                        {point.type === 'bonus' && <Star className="w-4 h-4 text-yellow-600" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 capitalize">{point.type}</p>
                                        <p className="text-sm text-gray-600">{point.description}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(point.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-lg font-bold ${
                                    point.amount > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {point.amount > 0 ? '+' : ''}{point.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Referred Users */}
            {dashboardData.referrals.dynamic.recentReferred.length > 0 && (
                <div className="mt-8 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#00C4A7]" />
                        People You've Referred ({dashboardData.referrals.dynamic.referredCount})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dashboardData.referrals.dynamic.recentReferred.slice(0, 6).map((user, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <p className="font-medium text-gray-900">{user.name || 'Anonymous'}</p>
                                <p className="text-sm text-gray-600 capitalize">{user.userType}</p>
                                <p className="text-xs text-gray-500">
                                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}