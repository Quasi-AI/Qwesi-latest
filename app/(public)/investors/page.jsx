'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { 
  Search, Filter, MapPin, Building, Globe, Phone, 
  ChevronRight, ChevronLeft, X, ArrowRight, Heart, DollarSign, 
  Calendar, Mail, Loader2, Briefcase, Award, Star, User,
  ExternalLink, Users, TrendingUp, BarChart3, RefreshCw
} from 'lucide-react'
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

const InvestorsPage = () => {
  const router = useRouter()
  
  // State management
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [investors, setInvestors] = useState([])
  const [viewingInvestor, setViewingInvestor] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [investorsPerPage] = useState(12)
  const [sortBy, setSortBy] = useState('createdAt')
  const [savedInvestors, setSavedInvestors] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  // Filter states
  const [filters, setFilters] = useState({
    country: '',
    role: '',
    companyType: ''
  })

  // Computed values
  const filteredInvestors = useMemo(() => {
    let result = [...investors]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(investor => 
        investor.name?.toLowerCase().includes(query) ||
        investor.email?.toLowerCase().includes(query) ||
        investor.companyName?.toLowerCase().includes(query) ||
        investor.investmentDescription?.toLowerCase().includes(query) ||
        investor.investorDetails?.pitch?.toLowerCase().includes(query)
      )
    }

    // Apply other filters
    if (filters.country) {
      result = result.filter(i => i.country === filters.country)
    }
    if (filters.role) {
      result = result.filter(i => 
        i.investorDetails?.role?.includes(filters.role)
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '')
        case 'company':
          return (a.companyName || '').localeCompare(b.companyName || '')
        case 'country':
          return (a.country || '').localeCompare(b.country || '')
        case 'createdAt':
        default:
          const dateA = new Date(a.createdAt || '1970-01-01').getTime()
          const dateB = new Date(b.createdAt || '1970-01-01').getTime()
          return dateB - dateA
      }
    })

    return result
  }, [investors, searchQuery, filters, sortBy])

  const paginatedInvestors = useMemo(() => {
    const start = (currentPage - 1) * investorsPerPage
    const end = start + investorsPerPage
    return filteredInvestors.slice(start, end)
  }, [filteredInvestors, currentPage, investorsPerPage])

  const totalPages = Math.max(1, Math.ceil(filteredInvestors.length / investorsPerPage))

  const uniqueCountries = useMemo(() => {
    return [...new Set(investors.map(i => i.country).filter(Boolean))].sort()
  }, [investors])

  const uniqueRoles = useMemo(() => {
    const roles = investors.flatMap(i => i.investorDetails?.role || [])
    return [...new Set(roles)].sort()
  }, [investors])

  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatWebsiteUrl = (website) => {
    if (!website) return '#'
    if (website.startsWith('http://') || website.startsWith('https://')) {
      return website
    }
    return `https://${website}`
  }

  // API functions
  const fetchInvestors = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('https://dark-caldron-448714-u5.appspot.com/getallinvestor')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setInvestors(data.investors || [])
    } catch (err) {
      console.error('Error fetching investors:', err)
      setError('Failed to fetch investors. Please try again later.')
      
      // Fallback to mock data for development
      const mockInvestors = Array.from({ length: 24 }, (_, i) => ({
        _id: `investor-${i + 1}`,
        name: ['John Smith', 'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim'][i % 5],
        email: ['john.smith@venture.com', 'sarah@techfund.io', 'michael@globalcap.com', 'emily@innovation.vc', 'david@startup.fund'][i % 5],
        companyName: ['Venture Capital LLC', 'Tech Fund Investments', 'Global Capital Partners', 'Innovation Ventures', 'Startup Fund Group'][i % 5],
        country: ['United States', 'United Kingdom', 'Canada', 'Singapore', 'Germany'][i % 5],
        phone: '+1-555-0' + String(100 + i).padStart(3, '0'),
        website: ['venture-capital.com', 'techfund.io', 'globalcap.com', 'innovation.vc', 'startup.fund'][i % 5],
        investmentDescription: [
          'Focused on early-stage tech startups with strong growth potential and innovative solutions.',
          'Investing in fintech, healthtech, and AI companies with proven market traction.',
          'Supporting B2B SaaS companies in their Series A and Series B funding rounds.',
          'Specializing in sustainable technology and green energy investment opportunities.',
          'Backing exceptional founders building the next generation of consumer technology.'
        ][i % 5],
        investmentDescription2: 'Additional investment criteria and portfolio information.',
        investorDetails: {
          role: [['Angel Investor', 'Advisor'], ['Venture Capitalist', 'Board Member'], ['Private Equity', 'Mentor'], ['Seed Investor', 'Angel'], ['VC Partner', 'Strategist']][i % 5],
          pitch: [
            'Experienced investor with 15+ years in tech startups, focusing on disruptive technologies.',
            'Former entrepreneur turned investor, passionate about supporting the next generation of innovators.',
            'Strategic investor with deep industry connections and operational expertise.',
            'Hands-on investor providing both capital and mentorship to portfolio companies.',
            'Global investment perspective with focus on scalable business models.'
          ][i % 5]
        },
        createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString()
      }))
      
      setInvestors(mockInvestors)
      setError(null) // Clear error when using fallback data
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  // Event handlers
  const handleSearch = () => {
    setSearchLoading(true)
    setCurrentPage(1)
    fetchInvestors()
  }

  const refreshInvestors = () => {
    fetchInvestors()
  }

  const clearFilters = () => {
    setFilters({
      country: '',
      role: '',
      companyType: ''
    })
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    clearFilters()
  }

  const saveInvestor = (investor) => {
    const investorId = investor._id
    if (!investorId) return

    setSavedInvestors(prev => {
      const newSaved = prev.includes(investorId) 
        ? prev.filter(id => id !== investorId)
        : [...prev, investorId]
      
      localStorage.setItem('savedInvestors', JSON.stringify(newSaved))
      return newSaved
    })
  }

  const openInvestorModal = (investor) => {
    setViewingInvestor(investor)
  }

  const closeInvestorModal = () => {
    setViewingInvestor(null)
  }

  const contactInvestor = (investor) => {
    if (investor.email) {
      window.open(`mailto:${investor.email}?subject=Investment Inquiry&body=Dear ${investor.name || 'Investor'},`, '_blank')
    }
  }

  // Pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  // Effects
  useEffect(() => {
    fetchInvestors()
  }, [])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages))
    }
  }, [filteredInvestors.length, totalPages, currentPage])

  // Load saved investors from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedInvestors')
    if (saved) {
      setSavedInvestors(JSON.parse(saved))
    }
  }, [])

  // Skeleton Loader
  const InvestorCardSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-4 bg-gray-200 rounded w-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="h-4 bg-gray-200 rounded w-4"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="h-12 bg-gray-200 rounded mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded w-8"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative border-b border-gray-200/60 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-[#5C3AEB]/5"></div>
        
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-1 h-1 bg-[#5C3AEB]/20 rounded-full top-4 right-8 animate-pulse"></div>
          <div className="absolute w-1 h-1 bg-[#00C4A7]/20 rounded-full top-8 right-4 animate-pulse delay-1000"></div>
          <div className="absolute w-1 h-1 bg-[#FF6B6B]/20 rounded-full top-6 right-12 animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-[#5C3AEB] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Connect with Investors
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Discover funding opportunities from verified investors. 
              Connect with the right partners for your business growth.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  type="text"
                  placeholder="Search investors, companies, or investment focus..."
                  className="w-full pl-12 pr-32 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
                <button
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-[#5C3AEB] px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  {searchLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Categories Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Browse Categories</h3>
            <Link href="/categories" className="text-sm text-[#5C3AEB] hover:text-[#342299] font-medium">
              View All Categories →
            </Link>
          </div>
          
          <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-hide">
            {[
              { id: 'vehicles', name: '🚗 Vehicles', count: '12K+' },
              { id: 'electronics', name: '📱 Electronics', count: '15K+' },
              { id: 'property', name: '🏠 Property', count: '8K+' },
              { id: 'fashion', name: '👕 Fashion', count: '7K+' },
              { id: 'jobs', name: '💼 Jobs', count: '5K+' },
              { id: 'services', name: '🔧 Services', count: '4K+' },
              { id: 'furniture', name: '🛋️ Home', count: '6K+' },
              { id: 'pets', name: '🐾 Pets', count: '3K+' }
            ].map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-[#5C3AEB] hover:text-white rounded-lg border border-gray-200 hover:border-[#5C3AEB] transition-all text-sm font-medium whitespace-nowrap"
              >
                <span>{cat.name}</span>
                <span className="text-xs opacity-75">{cat.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5C3AEB]">{investors.length}+</div>
              <div className="text-sm text-gray-600">Active Investors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5C3AEB]">{uniqueCountries.length}+</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5C3AEB]">$50M+</div>
              <div className="text-sm text-gray-600">Total Capital</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5C3AEB]">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${
                  showFilters 
                    ? 'bg-[#5C3AEB] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                >
                  <option value="createdAt">Newest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="company">Company A-Z</option>
                  <option value="country">Country A-Z</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredInvestors.length} of {investors.length} investors
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                  <select 
                    value={filters.country} 
                    onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                  >
                    <option value="">All Countries</option>
                    {uniqueCountries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <select 
                    value={filters.role} 
                    onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                  >
                    <option value="">All Roles</option>
                    {uniqueRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-end gap-2 md:col-span-2 lg:col-span-2">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <InvestorCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-700 mb-2">Failed to Load Investors</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchInvestors}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredInvestors.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Investors Found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || Object.values(filters).some(f => f) 
                ? 'Try adjusting your search criteria or filters' 
                : 'No investors have been registered yet'}
            </p>
            {(searchQuery || Object.values(filters).some(f => f)) && (
              <button
                onClick={clearAllFilters}
                className="px-6 py-2 bg-[#5C3AEB] text-white rounded-lg hover:bg-[#342299] transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Investors Grid */}
        {!loading && !error && filteredInvestors.length > 0 && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedInvestors.map(investor => (
                <div key={investor._id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#5C3AEB] hover:shadow-lg transition-all duration-300">
                  
                  {/* Investor Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                        {investor.name || 'Unnamed Investor'}
                      </h3>
                      <p className="text-[#5C3AEB] font-semibold truncate">{investor.email}</p>
                    </div>
                    <button
                      onClick={() => saveInvestor(investor)}
                      className={`p-2 rounded-lg transition-colors ${
                        savedInvestors.includes(investor._id || '') 
                          ? 'text-red-500 bg-red-50' 
                          : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
                      }`}
                    >
                      <Heart 
                        fill={savedInvestors.includes(investor._id || '') ? 'currentColor' : 'none'} 
                        className="w-4 h-4" 
                      />
                    </button>
                  </div>

                  {/* Investor Details */}
                  <div className="space-y-3 mb-4">
                    {investor.companyName && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{investor.companyName}</span>
                      </div>
                    )}
                    {investor.website && (
                      <div className="flex items-center text-sm text-gray-600">
                        <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" />
                        <a 
                          href={formatWebsiteUrl(investor.website)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#5C3AEB] hover:text-[#342299] truncate transition-colors"
                        >
                          {investor.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Investment Focus */}
                  {investor.investmentDescription && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Investment Focus</h4>
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {investor.investmentDescription}
                      </p>
                    </div>
                  )}

                  {/* Roles */}
                  {investor.investorDetails?.role && investor.investorDetails.role.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {investor.investorDetails.role.slice(0, 2).map((role, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-[#00C4A7]/10 text-[#00C4A7] text-xs font-medium rounded-lg border border-[#00C4A7]/20"
                          >
                            {role}
                          </span>
                        ))}
                        {investor.investorDetails.role.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                            +{investor.investorDetails.role.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>Joined {formatDate(investor.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openInvestorModal(investor)}
                        className="text-sm font-semibold text-[#5C3AEB] hover:text-[#342299] transition-colors flex items-center gap-1"
                      >
                        View
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      
                      <button
                        onClick={() => contactInvestor(investor)}
                        className="px-3 py-1.5 bg-gradient-to-r from-[#5C3AEB] to-[#342299] text-white text-xs font-semibold rounded-lg hover:from-[#342299] hover:to-[#5C3AEB] transition-all duration-300 hover:scale-105"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = currentPage <= 3 ? i + 1 : 
                                 currentPage >= totalPages - 2 ? totalPages - 4 + i :
                                 currentPage - 2 + i
                      return page > 0 && page <= totalPages ? (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            page === currentPage
                              ? 'bg-[#5C3AEB] text-white'
                              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ) : null
                    })}
                  </div>
                  
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Investor Details Modal */}
      {viewingInvestor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewingInvestor.name || 'Unnamed Investor'}</h2>
                  <p className="text-lg text-[#5C3AEB] font-semibold mt-1">{viewingInvestor.email}</p>
                  {viewingInvestor.companyName && (
                    <p className="text-gray-600 mt-1">{viewingInvestor.companyName}</p>
                  )}
                </div>
                <button 
                  onClick={closeInvestorModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid gap-6">
                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  {viewingInvestor.country && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Country</div>
                        <div className="font-semibold">{viewingInvestor.country}</div>
                      </div>
                    </div>
                  )}
                  {viewingInvestor.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Phone</div>
                        <div className="font-semibold">{viewingInvestor.phone}</div>
                      </div>
                    </div>
                  )}
                  {viewingInvestor.website && (
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Website</div>
                        <a 
                          href={formatWebsiteUrl(viewingInvestor.website)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-semibold text-[#5C3AEB] hover:text-[#342299] transition-colors"
                        >
                          {viewingInvestor.website}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Member Since</div>
                      <div className="font-semibold">{formatDate(viewingInvestor.createdAt)}</div>
                    </div>
                  </div>
                </div>

                {/* Roles */}
                {viewingInvestor.investorDetails?.role && viewingInvestor.investorDetails.role.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Investor Roles</h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingInvestor.investorDetails.role.map((role, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-[#00C4A7]/10 text-[#00C4A7] text-sm font-medium rounded-lg border border-[#00C4A7]/20"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Investor Pitch */}
                {viewingInvestor.investorDetails?.pitch && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">{viewingInvestor.investorDetails.pitch}</p>
                    </div>
                  </div>
                )}

                {/* Investment Focus */}
                {viewingInvestor.investmentDescription && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Investment Focus</h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">{viewingInvestor.investmentDescription}</p>
                    </div>
                  </div>
                )}

                {/* Additional Investment Info */}
                {viewingInvestor.investmentDescription2 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">{viewingInvestor.investmentDescription2}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={closeInvestorModal}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <div className="flex gap-3">
                  {viewingInvestor.website && (
                    <a
                      href={formatWebsiteUrl(viewingInvestor.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-gradient-to-r from-[#00C4A7] to-[#00A085] text-white rounded-lg hover:from-[#00A085] hover:to-[#00C4A7] transition-colors font-semibold"
                    >
                      Visit Website
                    </a>
                  )}
                  <button
                    onClick={() => {
                      closeInvestorModal()
                      contactInvestor(viewingInvestor)
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-[#5C3AEB] to-[#342299] text-white rounded-lg hover:from-[#342299] hover:to-[#5C3AEB] transition-colors font-semibold"
                  >
                    Contact Investor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvestorsPage