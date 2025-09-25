'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Search, 
  Filter, 
  MapPin, 
  User, 
  Briefcase, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  ArrowRight, 
  Heart, 
  MessageCircle,
  Mail,
  Calendar, 
  Globe, 
  Loader2, 
  Award, 
  Star,
  Users,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Phone
} from 'lucide-react'
import ChatComponent from '@/components/chat'
import { toast } from 'react-toastify'

const TalentPool = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State management
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [talents, setTalents] = useState([])
  const [popularSkills, setPopularSkills] = useState([])
  const [viewingTalent, setViewingTalent] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [talentsPerPage] = useState(12)
  const [sortBy, setSortBy] = useState('createdAt')
  const [savedTalents, setSavedTalents] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedTalent, setSelectedTalent] = useState(null)
  const [isSubmittingContact, setIsSubmittingContact] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [auth, setAuth] = useState(null)

  useEffect(() => {
    try {
      const authRaw = localStorage.getItem('auth')
      if (authRaw) {
        setAuth(JSON.parse(authRaw))
      }
    } catch (error) {
      console.error('Error parsing auth:', error)
    }
  }, [])

  // Stats
  const [totalTalents, setTotalTalents] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // Filter states
  const [filters, setFilters] = useState({
    skills: '',
    experience: '',
    location: '',
    availability: ''
  })

  // Contact form state
  const [contactForm, setContactForm] = useState({
    requesterName: '',
    requesterEmail: '',
    requesterPhone: '',
    jobTitle: '',
    message: ''
  })

  // Computed values
  const filteredTalents = useMemo(() => {
    let result = [...talents]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(talent => 
        talent.name?.toLowerCase().includes(query) ||
        talent.experience?.toLowerCase().includes(query) ||
        talent.skills?.some(skill => skill.toLowerCase().includes(query)) ||
        talent.goals?.toLowerCase().includes(query)
      )
    }

    // Apply other filters
    if (filters.skills) {
      const skillQuery = filters.skills.toLowerCase()
      result = result.filter(talent => 
        talent.skills?.some(skill => skill.toLowerCase().includes(skillQuery))
      )
    }
    if (filters.experience) {
      result = result.filter(t => t.experience?.toLowerCase().includes(filters.experience.toLowerCase()))
    }
    if (filters.availability) {
      result = result.filter(t => {
        if (filters.availability === 'available') return t.contactAvailable
        if (filters.availability === 'unavailable') return !t.contactAvailable
        return true
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '')
        case 'experience':
          return (b.experience || '').localeCompare(a.experience || '')
        case 'createdAt':
        default:
          const dateA = new Date(a.joinedDate || a.created_at || '1970-01-01').getTime()
          const dateB = new Date(b.joinedDate || b.created_at || '1970-01-01').getTime()
          return dateB - dateA
      }
    })

    return result
  }, [talents, searchQuery, filters, sortBy])

  const paginatedTalents = useMemo(() => {
    const start = (currentPage - 1) * talentsPerPage
    const end = start + talentsPerPage
    return filteredTalents.slice(start, end)
  }, [filteredTalents, currentPage, talentsPerPage])

  const computedTotalPages = Math.max(1, Math.ceil(filteredTalents.length / talentsPerPage))

  const uniqueExperienceLevels = useMemo(() => {
    return [...new Set(talents.map(t => t.experience).filter(Boolean))].sort()
  }, [talents])

  // Utility functions
  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase()
  }

  const truncateText = (text, length) => {
    if (!text) return ''
    return text.length > length ? text.substring(0, length) + '...' : text
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    })
  }

  // API functions
  const fetchTalents = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      
      if (searchQuery) params.append('search', searchQuery)
      if (filters.skills) params.append('skills', filters.skills)
      if (filters.experience) params.append('experience', filters.experience)
      if (sortBy) params.append('sortBy', sortBy)
      params.append('page', currentPage.toString())
      params.append('limit', talentsPerPage.toString())
      
      const response = await fetch(`https://dark-caldron-448714-u5.appspot.com/api/talent/pool?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setTalents(data.data.talents || [])
        setTotalTalents(data.data.stats?.totalTalents || 0)
        setPopularSkills(data.data.stats?.popularSkills || [])
        setTotalPages(data.data.pagination?.totalPages || 1)
      } else {
        throw new Error(data.error || 'Failed to fetch talents')
      }
    } catch (err) {
      console.error('Error fetching talents:', err)
      setError(err.message || 'Failed to fetch talents')
      
      // Fallback to mock data for development
      const mockTalents = Array.from({ length: 24 }, (_, i) => ({
        id: `talent-${i + 1}`,
        name: ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim', 'Lisa Wang'][i % 5],
        experience: ['Senior Developer', 'UI/UX Designer', 'Data Scientist', 'Product Manager', 'DevOps Engineer'][i % 5],
        skills: [
          ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
          ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
          ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Pandas'],
          ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
          ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform']
        ][i % 5],
        goals: [
          'Looking to lead innovative projects in fintech and contribute to scalable solutions.',
          'Passionate about creating intuitive user experiences for mobile applications.',
          'Interested in applying AI/ML to solve real-world healthcare challenges.',
          'Focused on building products that make a meaningful impact on users.',
          'Dedicated to improving development workflows and system reliability.'
        ][i % 5],
        helpOptions: [
          ['Mentorship', 'Job Opportunities'],
          ['Portfolio Review', 'Networking'],
          ['Research Collaboration', 'Job Opportunities'],
          ['Career Guidance', 'Project Collaboration'],
          ['Technical Consulting', 'Job Opportunities']
        ][i % 5],
        contactAvailable: Math.random() > 0.3,
        profileImage: null,
        joinedDate: new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)).toISOString(),
        location: ['San Francisco, CA', 'New York, NY', 'Toronto, CA', 'London, UK', 'Berlin, DE'][i % 5]
      }))
      
      const mockPopularSkills = [
        { skill: 'JavaScript', count: 45 },
        { skill: 'Python', count: 38 },
        { skill: 'React', count: 32 },
        { skill: 'Node.js', count: 28 },
        { skill: 'AWS', count: 25 }
      ]
      
      setTalents(mockTalents)
      setPopularSkills(mockPopularSkills)
      setTotalTalents(mockTalents.length)
      setTotalPages(Math.ceil(mockTalents.length / talentsPerPage))
      setError(null) // Clear error when using fallback data
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  // Debounce function
  const debounce = useCallback((func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }, [])

  // Create debounced search functions
  const debouncedSearch = useCallback(
    debounce(() => {
      setCurrentPage(1)
      fetchTalents()
    }, 500),
    [searchQuery, filters, sortBy]
  )

  // Event handlers
  const handleSearch = () => {
    setSearchLoading(true)
    setCurrentPage(1)
    fetchTalents()
  }

  const clearFilters = () => {
    setFilters({
      skills: '',
      experience: '',
      location: '',
      availability: ''
    })
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    clearFilters()
  }

  const saveTalent = (talent) => {
    // Check authentication first
    try {
      const authRaw = localStorage.getItem('auth')
      const auth = authRaw ? JSON.parse(authRaw) : null
      if (!auth?.token) {
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth:open-login'))
        return
      }
    } catch {}

    const talentId = talent.id
    if (!talentId) return

    setSavedTalents(prev => {
      const newSaved = prev.includes(talentId) 
        ? prev.filter(id => id !== talentId)
        : [...prev, talentId]
      
      localStorage.setItem('savedTalents', JSON.stringify(newSaved))
      return newSaved
    })
  }

  const filterBySkill = (skill) => {
    setFilters(prev => ({ ...prev, skills: skill }))
    setCurrentPage(1)
    handleSearch()
  }

  const openTalentModal = (talent) => {
    setViewingTalent(talent)
  }

  const closeTalentModal = () => {
    setViewingTalent(null)
  }

  const contactTalent = (talent) => {
    // Check authentication first
    try {
      const authRaw = localStorage.getItem('auth')
      const auth = authRaw ? JSON.parse(authRaw) : null
      if (!auth?.token) {
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth:open-login'))
        return
      }
    } catch {}

    if (!talent?.contactAvailable) {
      alert('Contact information is not available for this talent.')
      return
    }
    
    setSelectedTalent(talent)
    setShowContactModal(true)
    
    // Pre-fill form
    setContactForm(prev => ({
      ...prev,
      requesterName: '',
      requesterEmail: ''
    }))
  }

  const closeContactModal = () => {
    setShowContactModal(false)
    setSelectedTalent(null)
    setContactForm({
      requesterName: '',
      requesterEmail: '',
      requesterPhone: '',
      jobTitle: '',
      message: ''
    })
  }

  const submitContactRequest = async (e) => {
    e.preventDefault()
    setIsSubmittingContact(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success(`Contact request sent to ${selectedTalent.name}!`)
      closeContactModal()
    } catch (error) {
      toast.error('Failed to send contact request. Please try again.')
    } finally {
      setIsSubmittingContact(false)
    }
  }

  const startChat = (talent) => {
    // Check authentication first
    try {
      const authRaw = localStorage.getItem('auth')
      const auth = authRaw ? JSON.parse(authRaw) : null
      if (!auth?.token) {
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth:open-login'))
        return
      }
    } catch {}

    if (!talent?.contactAvailable) {
      alert('This talent is not available for chat.')
      return
    }
    
    setSelectedTalent(talent)
    setShowChat(true)
  }

  const handleChatClose = () => {
    setShowChat(false)
    setSelectedTalent(null)
  }

  const handleMeetingScheduled = (meetingData) => {
    console.log('Meeting scheduled:', meetingData)
    // Handle meeting scheduled event
  }

  // Pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= computedTotalPages) {
      setCurrentPage(page)
    }
  }

  const nextPage = () => {
    if (currentPage < computedTotalPages) {
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
    fetchTalents()
  }, [])

  useEffect(() => {
    if (currentPage > computedTotalPages) {
      setCurrentPage(Math.max(1, computedTotalPages))
    }
  }, [filteredTalents.length, computedTotalPages, currentPage])

  // Load saved talents from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedTalents')
    if (saved) {
      setSavedTalents(JSON.parse(saved))
    }
  }, [])

  // Skeleton Loader
  const TalentCardSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-18"></div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded w-8"></div>
          <div className="h-8 bg-gray-200 rounded w-8"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#5C3AEB] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Talent Pool
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Discover skilled professionals ready to contribute to your projects. 
              Connect with top talent and build your dream team.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  type="text"
                  placeholder="Search talents, skills, or experience..."
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
              <div className="text-2xl font-bold text-[#5C3AEB]">{totalTalents}+</div>
              <div className="text-sm text-gray-600">Total Talents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5C3AEB]">{popularSkills.length}+</div>
              <div className="text-sm text-gray-600">Popular Skills</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5C3AEB]">98%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5C3AEB]">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
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
                  <option value="experience">Experience</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredTalents.length} of {talents.length} talents
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Skills */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Skills</label>
                  <input
                    type="text"
                    value={filters.skills} 
                    onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="e.g., JavaScript, Python"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                  />
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                  <select 
                    value={filters.experience} 
                    onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                  >
                    <option value="">All Levels</option>
                    {uniqueExperienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                  <select 
                    value={filters.availability} 
                    onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                  >
                    <option value="">All Talents</option>
                    <option value="available">Available for Contact</option>
                    <option value="unavailable">Private Profile</option>
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
                  <button
                    onClick={handleSearch}
                    className="flex-1 px-4 py-2 bg-[#5C3AEB] text-white rounded-lg hover:bg-[#342299] transition-colors text-sm font-semibold"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Popular Skills */}
        {popularSkills.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Skills</h3>
            <div className="flex flex-wrap gap-3">
              {popularSkills.slice(0, 10).map((skill) => (
                <button 
                  key={skill.skill}
                  onClick={() => filterBySkill(skill.skill)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    filters.skills.includes(skill.skill)
                      ? 'bg-[#5C3AEB] text-white shadow-lg'
                      : 'bg-[#5C3AEB]/10 text-[#5C3AEB] hover:bg-[#5C3AEB]/20 hover:scale-105'
                  }`}
                >
                  {skill.skill}
                  <span className="ml-1 opacity-80">({skill.count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <TalentCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-700 mb-2">Failed to Load Talents</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchTalents}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredTalents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Talents Found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || Object.values(filters).some(f => f) 
                ? 'Try adjusting your search criteria or filters' 
                : 'No talent profiles available at the moment'}
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

        {/* Talents Grid */}
        {!loading && !error && filteredTalents.length > 0 && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedTalents.map(talent => (
                <div key={talent.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#5C3AEB] hover:shadow-lg transition-all duration-300">
                  
                  {/* Talent Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        {talent.profileImage ? (
                          <img 
                            src={talent.profileImage} 
                            alt={talent.name}
                            className="w-14 h-14 rounded-xl object-cover border-2 border-[#5C3AEB]/20"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-[#5C3AEB] to-[#00C4A7] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {getInitials(talent.name)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{talent.name}</h3>
                        <p className="text-gray-600 text-sm font-medium truncate">{talent.experience}</p>
                        {talent.location && (
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="truncate">{talent.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => saveTalent(talent)}
                        className={`p-2 rounded-lg transition-colors ${
                          savedTalents.includes(talent.id || '') 
                            ? 'text-red-500 bg-red-50' 
                            : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
                        }`}
                      >
                        <Heart 
                          fill={savedTalents.includes(talent.id || '') ? 'currentColor' : 'none'} 
                          className="w-4 h-4" 
                        />
                      </button>
                      
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                        talent.contactAvailable 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {talent.contactAvailable && <CheckCircle className="w-3 h-3" />}
                        <span>{talent.contactAvailable ? 'Available' : 'Private'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  {talent.skills && talent.skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {talent.skills.slice(0, 4).map((skill, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-[#5C3AEB]/10 text-[#5C3AEB] text-xs font-medium rounded-lg border border-[#5C3AEB]/20"
                          >
                            {skill}
                          </span>
                        ))}
                        {talent.skills.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                            +{talent.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Goals */}
                  {talent.goals && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Career Goals</h4>
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {truncateText(talent.goals, 120)}
                      </p>
                    </div>
                  )}

                  {/* Help Options */}
                  {talent.helpOptions && talent.helpOptions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Looking For</h4>
                      <div className="flex flex-wrap gap-1">
                        {talent.helpOptions.slice(0, 2).map((option, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-lg border border-purple-200"
                          >
                            {option.replace('AI Coach (Interview Prep)', 'Interview Prep')}
                          </span>
                        ))}
                        {talent.helpOptions.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                            +{talent.helpOptions.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>Joined {formatDate(talent.joinedDate)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => startChat(talent)}
                        disabled={!talent.contactAvailable}
                        className="p-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                        title="Start Chat"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      
                      <button 
                        onClick={() => contactTalent(talent)}
                        disabled={!talent.contactAvailable}
                        className="p-2 bg-gradient-to-r from-[#5C3AEB] to-[#342299] text-white rounded-lg hover:from-[#342299] hover:to-[#5C3AEB] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => openTalentModal(talent)}
                        className="text-sm font-semibold text-[#5C3AEB] hover:text-[#342299] transition-colors flex items-center gap-1"
                      >
                        View
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {computedTotalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {computedTotalPages}
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
                    {Array.from({ length: Math.min(5, computedTotalPages) }, (_, i) => {
                      const page = currentPage <= 3 ? i + 1 : 
                                 currentPage >= computedTotalPages - 2 ? computedTotalPages - 4 + i :
                                 currentPage - 2 + i
                      return page > 0 && page <= computedTotalPages ? (
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
                    disabled={currentPage === computedTotalPages}
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

      {/* Contact Modal */}
      {showContactModal && selectedTalent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200/50">
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Contact {selectedTalent.name}</h3>
                <div className="w-12 h-1 bg-gradient-to-r from-[#5C3AEB] to-[#00C4A7] rounded-full mt-2"></div>
              </div>
              <button 
                onClick={closeContactModal}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <form onSubmit={submitContactRequest} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Your Name *</label>
                    <input 
                      type="text" 
                      value={contactForm.requesterName}
                      onChange={(e) => setContactForm(prev => ({ ...prev, requesterName: e.target.value }))}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#5C3AEB] focus:ring-2 focus:ring-[#5C3AEB]/20 bg-white/80 backdrop-blur-sm transition-all"
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Your Email *</label>
                    <input 
                      type="email" 
                      value={contactForm.requesterEmail}
                      onChange={(e) => setContactForm(prev => ({ ...prev, requesterEmail: e.target.value }))}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#5C3AEB] focus:ring-2 focus:ring-[#5C3AEB]/20 bg-white/80 backdrop-blur-sm transition-all"
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Your Phone</label>
                  <input 
                    type="tel" 
                    value={contactForm.requesterPhone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, requesterPhone: e.target.value }))}
                    placeholder="Your phone number"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#5C3AEB] focus:ring-2 focus:ring-[#5C3AEB]/20 bg-white/80 backdrop-blur-sm transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Job Title/Position</label>
                  <input 
                    type="text" 
                    value={contactForm.jobTitle}
                    onChange={(e) => setContactForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                    placeholder="e.g., Software Developer, Marketing Manager"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#5C3AEB] focus:ring-2 focus:ring-[#5C3AEB]/20 bg-white/80 backdrop-blur-sm transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Message *</label>
                  <textarea 
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder={`Tell ${selectedTalent.name} about the opportunity, your company, or why you'd like to connect...`}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#5C3AEB] focus:ring-2 focus:ring-[#5C3AEB]/20 bg-white/80 backdrop-blur-sm transition-all resize-none"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={closeContactModal}
                    className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:border-gray-300 hover:text-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmittingContact}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5C3AEB] to-[#342299] text-white rounded-xl font-medium hover:from-[#342299] hover:to-[#5C3AEB] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex-1"
                  >
                    {isSubmittingContact ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Contact Request</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Talent Details Modal */}
      {viewingTalent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    {viewingTalent.profileImage ? (
                      <img 
                        src={viewingTalent.profileImage} 
                        alt={viewingTalent.name}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-[#5C3AEB]/20"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-[#5C3AEB] to-[#00C4A7] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {getInitials(viewingTalent.name)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{viewingTalent.name}</h2>
                    <p className="text-lg text-[#5C3AEB] font-semibold mt-1">{viewingTalent.experience}</p>
                    {viewingTalent.location && (
                      <div className="flex items-center text-gray-600 mt-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{viewingTalent.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={closeTalentModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid gap-6">
                {/* Skills Section */}
                {viewingTalent.skills && viewingTalent.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingTalent.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-[#5C3AEB]/10 text-[#5C3AEB] text-sm font-medium rounded-lg border border-[#5C3AEB]/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Career Goals */}
                {viewingTalent.goals && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Career Goals</h3>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed">{viewingTalent.goals}</p>
                    </div>
                  </div>
                )}

                {/* Looking For */}
                {viewingTalent.helpOptions && viewingTalent.helpOptions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Looking For</h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingTalent.helpOptions.map((option, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg border border-purple-200"
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Availability */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Availability</h3>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    viewingTalent.contactAvailable 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {viewingTalent.contactAvailable ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Available for contact and collaboration
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        Private profile - contact not available
                      </>
                    )}
                  </div>
                </div>

                {/* Join Date */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Member Since</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(viewingTalent.joinedDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={closeTalentModal}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => startChat(viewingTalent)}
                    disabled={!viewingTalent.contactAvailable}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                  >
                    Start Chat
                  </button>
                  <button
                    onClick={() => {
                      closeTalentModal()
                      contactTalent(viewingTalent)
                    }}
                    disabled={!viewingTalent.contactAvailable}
                    className="px-6 py-2 bg-gradient-to-r from-[#5C3AEB] to-[#342299] text-white rounded-lg hover:from-[#342299] hover:to-[#5C3AEB] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                  >
                    Contact Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Component */}
      {showChat && selectedTalent && (
        <ChatComponent
          isOpen={showChat}
          talent={selectedTalent}
          currentUserId={auth?.user?.id || 'current-user-id'}
          onClose={handleChatClose}
          onMeetingScheduled={handleMeetingScheduled}
        />
      )}
    </div>
  )
}

export default TalentPool
