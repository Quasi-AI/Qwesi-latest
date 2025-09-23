'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { 
  Search, 
  Filter, 
  MapPin, 
  Building, 
  Zap, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Briefcase, 
  ArrowRight, 
  Heart, 
  User, 
  FileText, 
  Upload, 
  Plus, 
  MessageSquare, 
  Send, 
  Globe 
} from 'lucide-react'
import toast from 'react-hot-toast'

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

  // Filter states
  const [filters, setFilters] = useState({
    location: '',
    country: '',
    sector: '',
    experience_level: ''
  })

  // Application form states
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [applicationLoading, setApplicationLoading] = useState(false)
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
  const [resumeFile, setResumeFile] = useState(null)
  const [newSkill, setNewSkill] = useState('')
  const [applicationErrors, setApplicationErrors] = useState({})

  // Helper function to extract country from location
  const extractCountryFromLocation = (location) => {
    if (!location) return ''
    
    const countryPatterns = [
      'Ghana', 'Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Morocco', 'Tunisia',
      'Ethiopia', 'Uganda', 'Tanzania', 'Rwanda', 'Botswana', 'Zambia', 'Zimbabwe',
      'United Kingdom', 'UK', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands',
      'United States', 'USA', 'US', 'Canada', 'Mexico',
      'India', 'China', 'Japan', 'Singapore', 'Malaysia', 'Thailand', 'Vietnam',
      'Australia', 'New Zealand', 'Brazil', 'Argentina', 'Chile'
    ]
    
    for (const country of countryPatterns) {
      if (location.toLowerCase().includes(country.toLowerCase())) {
        if (country.toLowerCase() === 'uk') return 'United Kingdom'
        if (country.toLowerCase() === 'usa' || country.toLowerCase() === 'us') return 'United States'
        return country
      }
    }
    
    const parts = location.split(',').map(part => part.trim())
    if (parts.length >= 2) {
      const lastPart = parts[parts.length - 1]
      for (const country of countryPatterns) {
        if (lastPart.toLowerCase() === country.toLowerCase()) {
          return country
        }
      }
      return lastPart
    }
    
    return ''
  }

  // Computed values
  const uniqueLocations = useMemo(() => {
    const locations = jobs.map(job => job.location).filter(Boolean)
    return [...new Set(locations)].sort()
  }, [jobs])

  const uniqueCountries = useMemo(() => {
    const countries = jobs.map(job => extractCountryFromLocation(job.location || '')).filter(Boolean)
    return [...new Set(countries)].sort()
  }, [jobs])

  const uniqueSectors = useMemo(() => {
    const sectors = jobs.map(job => job.sector).filter(Boolean)
    return [...new Set(sectors)].sort()
  }, [jobs])

  const uniqueExperienceLevels = useMemo(() => {
    const levels = jobs.map(job => job.experience_level).filter(Boolean)
    return [...new Set(levels)].sort()
  }, [jobs])

  const filteredJobs = useMemo(() => {
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

  const visiblePages = useMemo(() => {
    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }, [currentPage, totalPages])

  // API functions
  const fetchJobs = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const queryParams = new URLSearchParams()
      
      if (searchQuery) queryParams.append('search', searchQuery)
      if (filters.country) queryParams.append('country', filters.country)
      if (filters.location) queryParams.append('location', filters.location)
      if (filters.sector) queryParams.append('sector', filters.sector)
      if (filters.experience_level) queryParams.append('experience_level', filters.experience_level)
      if (sortBy) queryParams.append('sort', sortBy)
      if (currentPage) queryParams.append('page', currentPage.toString())
      queryParams.append('limit', jobsPerPage.toString())

      const queryString = queryParams.toString()
      const url = `https://dark-caldron-448714-u5.appspot.com/getjobs${queryString ? '?' + queryString : ''}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setJobs(data.data || [])
      } else {
        throw new Error('Failed to fetch jobs')
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs')
      toast.error('Failed to load job opportunities')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserApplications = async () => {
    // Mock function - replace with actual API call
    try {
      setUserApplications([])
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  // Event handlers
  const handleSearch = () => {
    setCurrentPage(1)
    fetchJobs()
  }

  const applyFilters = () => {
    setCurrentPage(1)
    fetchJobs()
  }

  const applySorting = () => {
    setCurrentPage(1)
    fetchJobs()
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      country: '',
      sector: '',
      experience_level: ''
    })
    setCurrentPage(1)
    fetchJobs()
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
    setShowApplicationModal(false)
    setSelectedJob(null)
    setViewingJob(job)
  }

  const closeJobDetailsModal = () => {
    setViewingJob(null)
  }

  const openApplicationModal = (job) => {
    setViewingJob(null)
    setSelectedJob(job)
    setApplicationForm(prev => ({
      ...prev,
      jobId: job._id
    }))
    setShowApplicationModal(true)
  }

  const closeApplicationModal = () => {
    setShowApplicationModal(false)
    setSelectedJob(null)
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
  }

  const applyToJob = (job) => {
    const existingApplication = userApplications.find(
      app => app.jobId === job._id && app.status !== 'withdrawn'
    )
    
    if (existingApplication) {
      toast.error('You have already applied for this position')
      return
    }

    openApplicationModal(job)
  }

  const submitApplication = async (e) => {
    e.preventDefault()
    setApplicationLoading(true)
    setApplicationErrors({})

    try {
      // Mock submission - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Application submitted successfully! We will review your submission and get back to you within 5-7 business days.')
      closeApplicationModal()
      await fetchUserApplications()
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Failed to submit application. Please try again.')
    } finally {
      setApplicationLoading(false)
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setResumeFile(file)
      setApplicationErrors(prev => ({ ...prev, resume: '' }))
    }
  }

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

  const hasAppliedToJob = (jobId) => {
    return userApplications.some(app => app.jobId === jobId && app.status !== 'withdrawn')
  }

  const getApplyButtonText = (job) => {
    if (hasAppliedToJob(job._id)) {
      return 'Applied'
    }
    return 'Apply Now'
  }

  const getApplyButtonClass = (job) => {
    if (hasAppliedToJob(job._id)) {
      return 'bg-green-600 text-white px-4 py-2 rounded-xl cursor-default'
    }
    return 'bg-[#432DD7] text-white px-4 py-2 rounded-xl hover:bg-[#342299] transition-colors'
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

  // Effects
  useEffect(() => {
    fetchJobs()
    fetchUserApplications()
  }, [])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages))
    }
  }, [filteredJobs.length, totalPages, currentPage])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-[#432DD7]">Job Opportunities</h1>
              <p className="text-gray-600 mt-1">
                Discover your next <span className="font-semibold text-[#432DD7]">career opportunity</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search Input */}
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  type="text"
                  placeholder="Search jobs..."
                  className="w-72 pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-2xl focus:ring-4 focus:ring-[#432DD7]/20 focus:outline-none focus:border-[#432DD7] placeholder-gray-500 font-medium text-gray-700"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>

              {/* Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 bg-white border border-[#432DD7] text-[#432DD7] rounded-2xl hover:bg-[#432DD7] hover:text-white transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              
              {/* Country Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Country</label>
                <div className="relative">
                  <select 
                    value={filters.country} 
                    onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-2xl px-4 py-3 pl-12 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-[#432DD7]/20 focus:outline-none focus:border-[#432DD7]"
                  >
                    <option value="">All Countries</option>
                    {uniqueCountries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  <Globe className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Location</label>
                <div className="relative">
                  <select 
                    value={filters.location} 
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-2xl px-4 py-3 pl-12 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-[#432DD7]/20 focus:outline-none focus:border-[#432DD7]"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Sector Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Sector</label>
                <div className="relative">
                  <select 
                    value={filters.sector} 
                    onChange={(e) => setFilters(prev => ({ ...prev, sector: e.target.value }))}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-2xl px-4 py-3 pl-12 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-[#432DD7]/20 focus:outline-none focus:border-[#432DD7]"
                  >
                    <option value="">All Sectors</option>
                    {uniqueSectors.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                  <Building className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Experience Level Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Experience Level</label>
                <div className="relative">
                  <select 
                    value={filters.experience_level} 
                    onChange={(e) => setFilters(prev => ({ ...prev, experience_level: e.target.value }))}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-2xl px-4 py-3 pl-12 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-[#432DD7]/20 focus:outline-none focus:border-[#432DD7]"
                  >
                    <option value="">All Levels</option>
                    {uniqueExperienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  <Zap className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-6 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <span className="font-bold text-gray-900">
                {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
              </span>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Updated {new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-600">Sort by:</span>
              <div className="relative">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:ring-4 focus:ring-[#432DD7]/20 focus:outline-none focus:border-[#432DD7]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Job Title A-Z</option>
                  <option value="company">Company A-Z</option>
                </select>
                <ChevronRight className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#432DD7] rounded-full animate-spin"></div>
            <p className="text-gray-600 font-semibold text-lg">Discovering opportunities...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-red-50 rounded-3xl border border-red-200">
            <div className="p-3 bg-red-100 rounded-full">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-red-700">Error Loading Jobs</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchJobs}
              className="px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl"></div>
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <Briefcase className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery || Object.values(filters).some(f => f) 
                ? 'Try adjusting your search criteria or filters to find more opportunities.' 
                : 'No job listings available at the moment. Check back soon for new opportunities!'}
            </p>
            {(searchQuery || Object.values(filters).some(f => f)) && (
              <button
                onClick={clearAllFilters}
                className="px-6 py-3 bg-[#432DD7] text-white rounded-2xl hover:bg-[#342299] transition-colors font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && filteredJobs.length > 0 && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {paginatedJobs.map(job => (
                <div key={job._id} className="group bg-white border border-gray-200 rounded-3xl p-6 hover:border-[#432DD7] hover:shadow-lg transition-all duration-300">
                  
                  {/* Job Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#432DD7] transition-colors">
                        {job.title || 'Untitled Position'}
                      </h3>
                      <p className="text-[#432DD7] font-semibold">{job.employer || 'Company Name'}</p>
                    </div>
                    {job.salary && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        {job.salary}
                      </div>
                    )}
                  </div>

                  {/* Job Details */}
                  <div className="space-y-2 mb-4">
                    {job.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span>{job.location}</span>
                        {extractCountryFromLocation(job.location) && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {extractCountryFromLocation(job.location)}
                          </span>
                        )}
                      </div>
                    )}
                    {job.sector && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span>{job.sector}</span>
                      </div>
                    )}
                    {job.experience_level && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Zap className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span>{job.experience_level}</span>
                      </div>
                    )}
                    {job.posted && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span>Posted {formatDate(job.posted)}</span>
                      </div>
                    )}
                  </div>

                  {/* Job Description Preview */}
                  {job.job_description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-3">{job.job_description}</p>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.field && (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">
                        {job.field}
                      </span>
                    )}
                    {job.experience_length && (
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                        {job.experience_length}
                      </span>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => openJobDetailsModal(job)}
                      className="flex items-center text-sm font-semibold text-[#432DD7] hover:text-[#342299] transition-colors space-x-2"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => saveJob(job)}
                        className={`p-2 rounded-full transition-colors ${
                          savedJobs.includes(job._id) 
                            ? 'text-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                        title={savedJobs.includes(job._id) ? 'Remove from saved' : 'Save job'}
                      >
                        <Heart 
                          fill={savedJobs.includes(job._id) ? 'currentColor' : 'none'} 
                          className="w-4 h-4" 
                        />
                      </button>
                      
                      <button
                        onClick={() => applyToJob(job)}
                        className={getApplyButtonClass(job)}
                        disabled={hasAppliedToJob(job._id)}
                        title={hasAppliedToJob(job._id) ? 'You have already applied for this position' : 'Apply for this position'}
                      >
                        {getApplyButtonText(job)}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredJobs.length > jobsPerPage && (
              <div className="flex items-center justify-between mt-8 p-6 bg-white rounded-3xl border border-gray-200">
                <div className="text-sm font-medium text-gray-600">
                  Showing {((currentPage - 1) * jobsPerPage) + 1} to {Math.min(currentPage * jobsPerPage, filteredJobs.length)} of {filteredJobs.length} jobs
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {visiblePages.map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm font-bold rounded-xl transition-colors ${
                          page === currentPage
                            ? 'bg-[#432DD7] text-white'
                            : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {viewingJob && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={closeJobDetailsModal}>
          <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-200">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">{viewingJob.title || 'Job Details'}</h3>
                <p className="text-lg font-semibold text-[#432DD7]">{viewingJob.employer || 'Company'}</p>
                <div className="w-16 h-1 bg-gradient-to-r from-[#432DD7] to-purple-500 rounded-full"></div>
              </div>
              <button 
                onClick={closeJobDetailsModal} 
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="h-96 overflow-y-auto p-8 space-y-8">
              
              {/* Basic Info */}
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                <h4 className="text-lg font-bold text-gray-900">Job Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingJob.location && (
                    <div className="flex items-center space-x-3 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="font-semibold text-gray-700">Location:</span>
                      <span className="text-gray-600">{viewingJob.location}</span>
                    </div>
                  )}
                  {viewingJob.sector && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Building className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="font-semibold text-gray-700">Sector:</span>
                      <span className="text-gray-600">{viewingJob.sector}</span>
                    </div>
                  )}
                  {viewingJob.experience_level && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Zap className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="font-semibold text-gray-700">Experience Level:</span>
                      <span className="text-gray-600">{viewingJob.experience_level}</span>
                    </div>
                  )}
                  {viewingJob.salary && (
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="text-gray-500 flex-shrink-0">💰</span>
                      <span className="font-semibold text-gray-700">Salary:</span>
                      <span className="text-gray-600">{viewingJob.salary}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description */}
              {viewingJob.job_description && (
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Job Description</h4>
                  <div className="text-gray-700 leading-relaxed text-sm space-y-3">
                    <p className="whitespace-pre-line">{viewingJob.job_description}</p>
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingJob.field && (
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="font-semibold text-gray-700">Field:</span>
                      <span className="text-gray-600">{viewingJob.field}</span>
                    </div>
                  )}
                  {viewingJob.experience_length && (
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="font-semibold text-gray-700">Experience Required:</span>
                      <span className="text-gray-600">{viewingJob.experience_length}</span>
                    </div>
                  )}
                  {viewingJob.posted && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="font-semibold text-gray-700">Posted:</span>
                      <span className="text-gray-600">{formatDate(viewingJob.posted)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={closeJobDetailsModal}
                  className="px-8 py-3 bg-white text-gray-700 font-bold rounded-2xl border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => applyToJob(viewingJob)}
                  className={getApplyButtonClass(viewingJob)}
                  disabled={hasAppliedToJob(viewingJob._id)}
                >
                  {getApplyButtonText(viewingJob)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={closeApplicationModal}>
          <div className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-200">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Apply for Position</h3>
                <p className="text-lg font-semibold text-[#432DD7]">{selectedJob?.title || 'Position'} at {selectedJob?.employer || 'Company'}</p>
                <div className="w-16 h-1 bg-gradient-to-r from-[#432DD7] to-purple-500 rounded-full"></div>
              </div>
              <button 
                onClick={closeApplicationModal} 
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="h-96 overflow-y-auto p-8">
              <form onSubmit={submitApplication} className="space-y-6">
                
                {/* Personal Information Section */}
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <h4 className="flex items-center space-x-3 text-lg font-bold text-gray-900">
                    <User className="w-5 h-5 text-[#432DD7]" />
                    Personal Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">First Name *</label>
                      <input
                        value={applicationForm.applicantDetails.firstName}
                        onChange={(e) => setApplicationForm(prev => ({
                          ...prev,
                          applicantDetails: { ...prev.applicantDetails, firstName: e.target.value }
                        }))}
                        type="text"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#432DD7]/20 focus:border-[#432DD7] transition-colors"
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Last Name *</label>
                      <input
                        value={applicationForm.applicantDetails.lastName}
                        onChange={(e) => setApplicationForm(prev => ({
                          ...prev,
                          applicantDetails: { ...prev.applicantDetails, lastName: e.target.value }
                        }))}
                        type="text"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#432DD7]/20 focus:border-[#432DD7] transition-colors"
                        placeholder="Enter your last name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Email Address *</label>
                      <input
                        value={applicationForm.applicantDetails.email}
                        onChange={(e) => setApplicationForm(prev => ({
                          ...prev,
                          applicantDetails: { ...prev.applicantDetails, email: e.target.value }
                        }))}
                        type="email"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#432DD7]/20 focus:border-[#432DD7] transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Phone Number *</label>
                      <input
                        value={applicationForm.applicantDetails.phone}
                        onChange={(e) => setApplicationForm(prev => ({
                          ...prev,
                          applicantDetails: { ...prev.applicantDetails, phone: e.target.value }
                        }))}
                        type="tel"
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#432DD7]/20 focus:border-[#432DD7] transition-colors"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Resume Upload Section */}
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <h4 className="flex items-center space-x-3 text-lg font-bold text-gray-900">
                    <FileText className="w-5 h-5 text-[#432DD7]" />
                    Resume/CV
                  </h4>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Upload Resume *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#432DD7] hover:bg-blue-50/50 transition-colors">
                      <input
                        type="file"
                        id="resume-upload"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="block text-sm font-medium text-gray-700 mb-1">
                          {resumeFile?.name || 'Click to upload resume'}
                        </span>
                        <span className="text-xs text-gray-500">
                          PDF, DOC, or DOCX (Max 5MB)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <h4 className="flex items-center space-x-3 text-lg font-bold text-gray-900">
                    <Zap className="w-5 h-5 text-[#432DD7]" />
                    Skills
                  </h4>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Add Skills</label>
                    <div className="flex space-x-2">
                      <input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        type="text"
                        className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#432DD7]/20 focus:border-[#432DD7] transition-colors"
                        placeholder="Enter a skill"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-4 py-2 bg-[#432DD7] text-white rounded-lg hover:bg-[#342299] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {applicationForm.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {applicationForm.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full border border-blue-200"
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
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <h4 className="flex items-center space-x-3 text-lg font-bold text-gray-900">
                    <MessageSquare className="w-5 h-5 text-[#432DD7]" />
                    Cover Letter
                  </h4>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Cover Letter (Optional)</label>
                    <textarea
                      value={applicationForm.coverLetter}
                      onChange={(e) => setApplicationForm(prev => ({
                        ...prev,
                        coverLetter: e.target.value
                      }))}
                      rows="6"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#432DD7]/20 focus:border-[#432DD7] transition-colors"
                      placeholder="Write a personalized cover letter for this position..."
                      maxLength="5000"
                    />
                    <div className="text-xs text-gray-500 text-right">
                      {applicationForm.coverLetter.length}/5000 characters
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeApplicationModal}
                    className="px-8 py-3 bg-white text-gray-700 font-bold rounded-2xl border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={applicationLoading}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="flex items-center justify-center px-8 py-3 bg-[#432DD7] text-white font-bold rounded-2xl hover:bg-[#342299] focus:outline-none focus:ring-4 focus:ring-[#432DD7]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={applicationLoading}
                  >
                    {applicationLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="w-4 h-4" />
                        <span>Submit Application</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobsPage