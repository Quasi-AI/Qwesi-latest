'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { 
  Search, Filter, MapPin, Building, Zap, Clock, ChevronRight, 
  ChevronLeft, X, Briefcase, ArrowRight, Heart, User, FileText, 
  Upload, Plus, MessageSquare, Send, Globe, Loader2, ExternalLink,
  Building2, Users, DollarSign, Calendar, Target, Award, Star
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { API_ROUTES } from '@/lib/apiRoutes'

const JobsPage = () => {
  // State management
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [viewingJob, setViewingJob] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [jobsPerPage] = useState(12)
  const [sortBy, setSortBy] = useState('newest')
  const [savedJobs, setSavedJobs] = useState([])
  const [userApplications, setUserApplications] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [applicationErrors, setApplicationErrors] = useState({})

  // Filter states
  const [filters, setFilters] = useState({
    location: '',
    country: '',
    sector: '',
    experience_level: '',
    salary_range: ''
  })

  // Application form states
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [applicationLoading, setApplicationLoading] = useState(false)


  // Add state for file handling
  const [resumeFile, setResumeFile] = useState(null)
  const fileInputRef = useRef(null)

  // Add file handling functions
  const handleFileUpload = (event) => {
    const target = event.target
    const file = target.files?.[0]
    
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF, DOC, or DOCX file')
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      
      setResumeFile(file)
      // Clear any previous resume errors
      setApplicationErrors(prev => ({ ...prev, resume: '' }))
      toast.success('Resume uploaded successfully')
    }
  }

  const removeFile = () => {
    setResumeFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Add these state variables for the comprehensive form
  const [applicationForm, setApplicationForm] = useState({
    jobId: '',
    applicantDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      portfolio: ''
    },
    coverLetter: '',
    skills: [],
    experience: {
      years: 0,
      description: ''
    }
  })
  const [newSkill, setNewSkill] = useState('')

  // Helper function to extract country from location
  const extractCountryFromLocation = (location) => {
    if (!location) return ''
    
    const countryPatterns = [
      'Ghana', 'Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Morocco', 'Tunisia',
      'Ethiopia', 'Uganda', 'Tanzania', 'Rwanda', 'Botswana', 'Zambia', 'Zimbabwe',
      'United Kingdom', 'UK', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands',
      'United States', 'USA', 'US', 'Canada', 'Mexico', 'India', 'China', 'Japan'
    ]
    
    for (const country of countryPatterns) {
      if (location.toLowerCase().includes(country.toLowerCase())) {
        if (country.toLowerCase() === 'uk') return 'United Kingdom'
        if (country.toLowerCase() === 'usa' || country.toLowerCase() === 'us') return 'United States'
        return country
      }
    }
    
    const parts = location.split(',').map(part => part.trim())
    return parts.length >= 2 ? parts[parts.length - 1] : ''
  }

  // Computed values
  const uniqueLocations = useMemo(() => {
    if (!Array.isArray(jobs)) return []
    const locations = jobs.map(job => job.location).filter(Boolean)
    return [...new Set(locations)].sort()
  }, [jobs])

  const uniqueCountries = useMemo(() => {
    if (!Array.isArray(jobs)) return []
    const countries = jobs.map(job => extractCountryFromLocation(job.location || '')).filter(Boolean)
    return [...new Set(countries)].sort()
  }, [jobs])

  const uniqueSectors = useMemo(() => {
    if (!Array.isArray(jobs)) return []
    const sectors = jobs.map(job => job.sector).filter(Boolean)
    return [...new Set(sectors)].sort()
  }, [jobs])

  const uniqueExperienceLevels = useMemo(() => {
    if (!Array.isArray(jobs)) return []
    const levels = jobs.map(job => job.experience_level).filter(Boolean)
    return [...new Set(levels)].sort((a, b) => {
      const order = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive']
      return order.indexOf(a) - order.indexOf(b)
    })
  }, [jobs])

  const filteredJobs = useMemo(() => {
    if (!Array.isArray(jobs)) return []
    let filtered = jobs

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(job =>
        (job.title?.toLowerCase() || '').includes(query) ||
        (job.employer?.toLowerCase() || '').includes(query) ||
        (job.job_description?.toLowerCase() || '').includes(query) ||
        (job.location?.toLowerCase() || '').includes(query) ||
        (job.sector?.toLowerCase() || '').includes(query)
      )
    }

    if (filters.country) {
      filtered = filtered.filter(job => {
        const jobCountry = extractCountryFromLocation(job.location || '')
        return jobCountry === filters.country
      })
    }

    if (filters.location) {
      filtered = filtered.filter(job => job.location === filters.location)
    }
    if (filters.sector) {
      filtered = filtered.filter(job => job.sector === filters.sector)
    }
    if (filters.experience_level) {
      filtered = filtered.filter(job => job.experience_level === filters.experience_level)
    }

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        case 'oldest':
          return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
        case 'title':
          return (a.title || '').localeCompare(b.title || '')
        case 'company':
          return (a.employer || '').localeCompare(b.employer || '')
        default:
          return 0
      }
    })

    return filtered
  }, [jobs, searchQuery, filters, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage))
  
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * jobsPerPage
    const end = start + jobsPerPage
    return filteredJobs.slice(start, end)
  }, [filteredJobs, currentPage, jobsPerPage])

  // API functions
  const fetchJobs = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams()
      
      if (searchQuery) queryParams.append('search', searchQuery)
      if (filters.location) queryParams.append('location', filters.location)
      if (filters.country) queryParams.append('country', filters.country)
      if (filters.sector) queryParams.append('sector', filters.sector)
      if (filters.experience_level) queryParams.append('experience_level', filters.experience_level)
      if (filters.salary_range) queryParams.append('salary_range', filters.salary_range)
      if (sortBy) queryParams.append('sortBy', sortBy)
      queryParams.append('page', currentPage.toString())
      queryParams.append('limit', jobsPerPage.toString())
      
      const url = `${API_ROUTES.BASE_URL}getjobs${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()

      setJobs(data.data || [])
      
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setError(err.message || 'Failed to fetch jobs')
      toast.error('Failed to load job opportunities')
    } finally {
      setLoading(false)
      setSearchLoading(false)
    }
  }

  // Event handlers
  const handleSearch = () => {
    setSearchLoading(true)
    setCurrentPage(1)
    fetchJobs()
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      country: '',
      sector: '',
      experience_level: '',
      salary_range: ''
    })
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    clearFilters()
  }

  const saveJob = (job) => {
    const index = savedJobs.indexOf(job._id)
    if (index > -1) {
      setSavedJobs(prev => prev.filter(id => id !== job._id))
      toast.success('Job removed from saved')
    } else {
      setSavedJobs(prev => [...prev, job._id])
      toast.success('Job saved successfully')
    }
  }

  const openJobDetailsModal = (job) => {
    setViewingJob(job)
  }

  const closeJobDetailsModal = () => {
    setViewingJob(null)
  }

  const openApplicationModal = (job) => {
    const authRaw = localStorage.getItem('auth')
    const auth = authRaw ? JSON.parse(authRaw) : null
    if (!auth?.token) {
      // trigger navbar to open login
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth:open-login'))
      return
    }
    setSelectedJob(job)
    
    // Set the jobId in the form
    setApplicationForm(prev => ({
      ...prev,
      jobId: job._id
    }))
    
    setShowApplicationModal(true)
  }

  const closeApplicationModal = () => {
    setShowApplicationModal(false)
    setSelectedJob(null)
  }

  const applyToJob = (job) => {
    openApplicationModal(job)
  }

  // Add proper form validation similar to your Vue composable
  const validateApplicationForm = (formData, resumeFile) => {
    const errors = {}
    
    // Validate required fields using applicationForm state instead of FormData
    if (!applicationForm.applicantDetails.firstName?.trim()) {
      errors.firstName = 'First name is required'
    }

    if (!applicationForm.applicantDetails.lastName?.trim()) {
      errors.lastName = 'Last name is required'
    }

    if (!applicationForm.applicantDetails.email?.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(applicationForm.applicantDetails.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!applicationForm.applicantDetails.phone?.trim()) {
      errors.phone = 'Phone number is required'
    }

    // Validate resume file
    if (!resumeFile) {
      errors.resume = 'Resume is required'
    } else {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(resumeFile.type)) {
        errors.resume = 'Please upload a PDF, DOC, or DOCX file'
      }

      if (resumeFile.size > 5 * 1024 * 1024) {
        errors.resume = 'File size must be less than 5MB'
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  const submitApplication = async (e) => {
    e.preventDefault()
    
    const validation = validateApplicationForm(null, resumeFile)
    
    if (!validation.isValid) {
      setApplicationErrors(validation.errors)
      toast.error('Please correct the errors in the form')
      return
    }

    setApplicationLoading(true)
    setApplicationErrors({})

    try {
      // Get auth token from localStorage
      const authRaw = localStorage.getItem('auth')
      const auth = authRaw ? JSON.parse(authRaw) : null
      const token = auth?.token

      // Create FormData for API submission
      const applicationData = new FormData()
      applicationData.append('jobId', selectedJob._id) // Use selectedJob._id directly
      applicationData.append('applicantDetails', JSON.stringify(applicationForm.applicantDetails))
      applicationData.append('coverLetter', applicationForm.coverLetter || '')
      applicationData.append('skills', JSON.stringify(applicationForm.skills))
      applicationData.append('experience', JSON.stringify(applicationForm.experience))
      
      if (resumeFile) {
        applicationData.append('resume', resumeFile)
      }
      
      // Make actual API call
      const response = await fetch(`${API_ROUTES.BASE_URL}/applications/submit`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: applicationData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        toast.success('Application submitted successfully!')
        closeApplicationModal()
        resetApplicationForm()
      } else {
        throw new Error(result.message || 'Failed to submit application')
      }
      
    } catch (error) {
      console.error('Application error:', error)
      toast.error('Failed to submit application. Please try again.')
    } finally {
      setApplicationLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return 'yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
      if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
      
      return date.toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const getExperienceColor = (level) => {
    switch (level) {
      case 'Entry Level': return 'bg-green-100 text-green-800'
      case 'Mid Level': return 'bg-blue-100 text-blue-800'
      case 'Senior Level': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Add helper functions
  const addSkill = () => {
    if (newSkill.trim() && !applicationForm.skills.includes(newSkill.trim())) {
      setApplicationForm(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (index) => {
    setApplicationForm(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const resetApplicationForm = () => {
    setApplicationForm({
      jobId: '',
      applicantDetails: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        linkedin: '',
        portfolio: ''
      },
      coverLetter: '',
      skills: [],
      experience: {
        years: 0,
        description: ''
      }
    })
    setResumeFile(null)
    setNewSkill('')
    setApplicationErrors({})
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Effects
  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages))
    }
  }, [filteredJobs.length, totalPages, currentPage])

  // Skeleton Loader Component
  const JobCardSkeleton = () => (
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
        <div className="flex items-center space-x-3">
          <div className="h-4 bg-gray-200 rounded w-4"></div>
          <div className="h-4 bg-gray-200 rounded w-28"></div>
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
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#5C3AEB] via-[#5E43D7] to-[#7A59D7] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Dream Job
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Discover thousands of career opportunities from top companies worldwide. 
              Your next career move starts here.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  type="text"
                  placeholder="Job title, company, or keywords..."
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
            <Link href="/categories" className="text-sm text-[#432DD7] hover:text-[#3525b8] font-medium">
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
              { id: 'pets', name: '🐾 Pets', count: '3K+' },
              { id: 'baby-kids', name: '🍼 Baby & Kids', count: '3K+' },
              { id: 'sports', name: '⚽ Sports', count: '2K+' }
            ].map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-[#432DD7] hover:text-white rounded-lg border border-gray-200 hover:border-[#432DD7] transition-all text-sm font-medium whitespace-nowrap"
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
              <div className="text-2xl font-bold text-[#5C3AEB]">{jobs.length}+</div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5C3AEB]">50+</div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#5C3AEB]">15+</div>
              <div className="text-sm text-gray-600">Countries</div>
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
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Job Title A-Z</option>
                  <option value="company">Company A-Z</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <select 
                    value={filters.location} 
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Sector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sector</label>
                  <select 
                    value={filters.sector} 
                    onChange={(e) => setFilters(prev => ({ ...prev, sector: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                  >
                    <option value="">All Sectors</option>
                    {uniqueSectors.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                  <select 
                    value={filters.experience_level} 
                    onChange={(e) => setFilters(prev => ({ ...prev, experience_level: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                  >
                    <option value="">All Levels</option>
                    {uniqueExperienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-end gap-2">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                  >
                    Clear
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
              <JobCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-700 mb-2">Failed to Load Jobs</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchJobs}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || Object.values(filters).some(f => f) 
                ? 'Try adjusting your search criteria or filters' 
                : 'No job listings available at the moment'}
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

        {/* Jobs Grid */}
        {!loading && !error && filteredJobs.length > 0 && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedJobs.map(job => (
                <div key={job._id} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#5C3AEB] hover:shadow-lg transition-all duration-300">
                  
                  {/* Job Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#5C3AEB] transition-colors line-clamp-2">
                        {job.title}
                      </h3>
                      <p className="text-[#5C3AEB] font-semibold truncate">{job.employer}</p>
                    </div>
                    <button
                      onClick={() => saveJob(job)}
                      className={`p-2 rounded-lg transition-colors ${
                        savedJobs.includes(job._id) 
                          ? 'text-red-500 bg-red-50' 
                          : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
                      }`}
                    >
                      <Heart 
                        fill={savedJobs.includes(job._id) ? 'currentColor' : 'none'} 
                        className="w-4 h-4" 
                      />
                    </button>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{job.sector}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceColor(job.experience_level)}`}>
                        {job.experience_level}
                      </span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="font-semibold text-green-600">{job.salary}</span>
                      </div>
                    )}
                  </div>

                  {/* Job Description Preview */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {job.job_description}
                    </p>
                  </div>

                  {/* Posted Date */}
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Clock className="w-3 h-3 mr-1" />
                    Posted {formatDate(job.posted)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => openJobDetailsModal(job)}
                      className="text-sm font-semibold text-[#5C3AEB] hover:text-[#342299] transition-colors flex items-center gap-1"
                    >
                      View Details
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    
                    <button
                      onClick={() => applyToJob(job)}
                      className="px-4 py-2 bg-[#5C3AEB] text-white text-sm font-semibold rounded-lg hover:bg-[#342299] transition-colors"
                    >
                      Apply Now
                    </button>
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
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                          onClick={() => setCurrentPage(page)}
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
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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

      {/* Job Details Modal */}
      {viewingJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewingJob.title}</h2>
                  <p className="text-lg text-[#5C3AEB] font-semibold mt-1">{viewingJob.employer}</p>
                </div>
                <button 
                  onClick={closeJobDetailsModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid gap-6">
                {/* Job Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Location</div>
                      <div className="font-semibold">{viewingJob.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Sector</div>
                      <div className="font-semibold">{viewingJob.sector}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Experience</div>
                      <div className="font-semibold">{viewingJob.experience_level}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Salary</div>
                      <div className="font-semibold text-green-600">{viewingJob.salary}</div>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">{viewingJob.job_description}</p>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#5C3AEB] flex-shrink-0" />
                      {viewingJob.experience_length} of experience in related field
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#5C3AEB] flex-shrink-0" />
                      Strong communication and teamwork skills
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-[#5C3AEB] flex-shrink-0" />
                      Relevant certifications or degrees preferred
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={closeJobDetailsModal}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => applyToJob(viewingJob)}
                  className="px-6 py-2 bg-[#5C3AEB] text-white rounded-lg hover:bg-[#342299] transition-colors font-semibold"
                >
                  Apply for this Position
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Apply for Position</h2>
                  <p className="text-[#5C3AEB] font-semibold">{selectedJob?.title} at {selectedJob?.employer}</p>
                </div>
                <button 
                  onClick={closeApplicationModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={submitApplication} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-lg font-semibold">
                    <User className="w-5 h-5 text-blue-600" />
                    Personal Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">First Name *</label>
                      <input 
                        type="text" 
                        value={applicationForm.applicantDetails.firstName}
                        onChange={(e) => setApplicationForm(prev => ({
                          ...prev,
                          applicantDetails: { ...prev.applicantDetails, firstName: e.target.value }
                        }))}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5C3AEB] ${
                          applicationErrors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your first name"
                      />
                      {applicationErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{applicationErrors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Last Name *</label>
                      <input 
                        type="text" 
                        value={applicationForm.applicantDetails.lastName}
                        onChange={(e) => setApplicationForm(prev => ({
                          ...prev,
                          applicantDetails: { ...prev.applicantDetails, lastName: e.target.value }
                        }))}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5C3AEB] ${
                          applicationErrors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your last name"
                      />
                      {applicationErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{applicationErrors.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Email Address *</label>
                      <input 
                        type="email" 
                        value={applicationForm.applicantDetails.email}
                        onChange={(e) => setApplicationForm(prev => ({
                          ...prev,
                          applicantDetails: { ...prev.applicantDetails, email: e.target.value }
                        }))}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5C3AEB] ${
                          applicationErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                      {applicationErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{applicationErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                      <input 
                        type="tel" 
                        value={applicationForm.applicantDetails.phone}
                        onChange={(e) => setApplicationForm(prev => ({
                          ...prev,
                          applicantDetails: { ...prev.applicantDetails, phone: e.target.value }
                        }))}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5C3AEB] ${
                          applicationErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {applicationErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{applicationErrors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Resume Upload Section */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-lg font-semibold">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Resume/CV
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2">Upload Resume *</label>
                    
                    {!resumeFile ? (
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#5C3AEB] transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Click to upload resume</p>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-[#5C3AEB]" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{resumeFile.name}</p>
                              <p className="text-xs text-gray-500">
                                {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden" 
                    />
                    
                    {applicationErrors.resume && (
                      <p className="text-red-500 text-xs mt-1">{applicationErrors.resume}</p>
                    )}
                  </div>
                </div>

                {/* Skills Section */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-lg font-semibold">
                    <Zap className="w-5 h-5 text-blue-600" />
                    Skills
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2">Add Skills</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                        placeholder="Enter a skill"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {applicationForm.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {applicationForm.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(index)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cover Letter Section */}
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-lg font-semibold">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    Cover Letter
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2">Cover Letter (Optional)</label>
                    <textarea
                      value={applicationForm.coverLetter}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                      rows={6}
                      maxLength={5000}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]"
                      placeholder="Write a personalized cover letter for this position..."
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {applicationForm.coverLetter.length}/5000 characters
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeApplicationModal}
                  disabled={applicationLoading}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applicationLoading}
                  className="flex-1 px-4 py-2 bg-[#5C3AEB] text-white rounded-lg hover:bg-[#342299] disabled:opacity-50 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  {applicationLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobsPage























