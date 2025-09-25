"use client"
import { useState, useEffect, useMemo, useRef } from "react"
import Loading from "@/components/Loading"
import toast from "react-hot-toast"
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Eye,
  Check,
  X,
  Clock,
  Users,
  Building,
  Mail,
  Phone,
  BadgeCheck,
  MapPin,
  Calendar,
  ExternalLink,
  Download,
  MessageSquare,
  Trash2,
  MoreHorizontal,
  Star,
  Building2,
  Globe,
  FileText,
  UserCheck,
  AlertTriangle,
  ChevronDown,
  Briefcase,
  User
} from "lucide-react"
import { API_ROUTES } from '@/lib/apiRoutes'
import { useAuthStore } from '@/stores/authStore'
import CreateEmployerModal from '@/modals/CreateEmployerModal'
import EditEmployerModal from '@/modals/EditEmployerModal'
import EmployerDetailModal from '@/modals/EmployerDetailModal'
import ApprovalModal from '@/modals/ApprovalModal'
import DeleteConfirmModal from '@/modals/DeleteConfirmModal'

export default function AdminEmployers({ employerId }) {
  const authStore = useAuthStore()
  
  // State management
  const [employers, setEmployers] = useState([])
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [scheduledInterviews, setScheduledInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showJobsModal, setShowJobsModal] = useState(false)
  const [showApplicationsModal, setShowApplicationsModal] = useState(false)
  const [showInterviewsModal, setShowInterviewsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Selected items
  const [selectedEmployer, setSelectedEmployer] = useState(null)
  const [selectedJobs, setSelectedJobs] = useState([])
  const [selectedApplications, setSelectedApplications] = useState([])
  const [selectedInterviews, setSelectedInterviews] = useState([])
  
  // Tab management
  const [activeTab, setActiveTab] = useState('overview')
  
  // Form states
  const [actionLoading, setActionLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchEmployerJobs = async (employerId) => {
    try {
      const response = await fetch(`${API_ROUTES.BASE_URL}job/${employerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authStore.getToken()}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.success ? data.data || [] : []
    } catch (error) {
      console.error('Fetch employer jobs error:', error)
      return []
    }
  }

  const fetchEmployerApplications = async (jobId) => {
    try {
      const userId = authStore.user?.id
      if (!userId) {
        console.log('User ID not found for applications')
        return []
      }

      const response = await fetch(`${API_ROUTES.BASE_URL}applications/employer/${userId}/applications?jobId=${jobId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authStore.getToken()}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.success ? data.data || [] : []
    } catch (error) {
      console.error('Fetch employer applications error:', error)
      return []
    }
  }

  const fetchEmployerInterviews = async (employerId) => {
    try {
      const response = await fetch(`${API_ROUTES.BASE_URL}interviews/employer/${employerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authStore.getToken()}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.success ? data.data || [] : []
    } catch (error) {
      console.error('Fetch employer interviews error:', error)
      return []
    }
  }

  const toggleEmployerActive = async (employerId) => {
    setActionLoading(true)
    try {
      const response = await fetch(`${API_ROUTES.BASE_URL}job/employers/${employerId}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authStore.getToken()}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to update employer status')
      }
      
      await fetchEmployerJobs(employerId)
      toast.success("Employer status updated successfully")
    } catch (error) {
      console.error('Error updating employer status:', error)
      toast.error("Failed to update employer status")
    } finally {
      setActionLoading(false)
    }
  }

  const updateEmployerStatus = async (employerId, newStatus) => {
    setActionLoading(true)
    try {
      const response = await fetch(`${API_ROUTES.BASE_URL}employers/${employerId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authStore.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        await fetchEmployerJobs(employerId)
        setShowApprovalModal(false)
        toast.success(`Employer ${newStatus} successfully`)
      } else {
        toast.error(data.message || `Failed to ${newStatus} employer`)
      }
    } catch (error) {
      console.error('Update employer status error:', error)
      toast.error(`Failed to ${newStatus} employer`)
    } finally {
      setActionLoading(false)
    }
  }

  const deleteEmployer = async (jobId) => {
    setDeleteLoading(true)
    try {
      const response = await fetch(`${API_ROUTES.BASE_URL}job/delete/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.getToken()}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        await fetchEmployers() // Refresh the list
        setShowDeleteModal(false)
        toast.success("Job deleted successfully")
      } else {
        toast.error(data.message || "Failed to delete job")
      }
    } catch (error) {
      console.error('Delete job error:', error)
      toast.error("Failed to delete job")
    } finally {
      setDeleteLoading(false)
    }
  }

  const createEmployer = async (employerId, formData) => {
    try {
      const response = await fetch(`${API_ROUTES.BASE_URL}job/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        await fetchEmployerJobs(employerId) // Refresh the list
        toast.success("Employer created successfully!")
        return { success: true }
      } else {
        toast.error(data.message || "Failed to create employer")
        return { success: false }
      }
    } catch (error) {
      console.error('Create employer error:', error)
      toast.error("Failed to create employer")
      return { success: false }
    }
  }

  const updateEmployer = async (jobId, formData) => {
    try {
      const response = await fetch(`${API_ROUTES.BASE_URL}job/update/${jobId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authStore.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        await fetchEmployers() // Refresh the list
        toast.success("Job updated successfully!")
        return { success: true }
      } else {
        toast.error(data.message || "Failed to update job")
        return { success: false }
      }
    } catch (error) {
      console.error('Update job error:', error)
      toast.error("Failed to update job")
      return { success: false }
    }
  }

  const fetchEmployers = async () => {
    setLoading(true)
    try {
      const userId = authStore.user?.id
      if (!userId) {
        console.log('User ID not found')
        setEmployers([])
        setLoading(false)
        return
      }

      const response = await fetch(`${API_ROUTES.BASE_URL}job/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authStore.getToken()}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setEmployers(data.success ? data.data || [] : [])
    } catch (error) {
      console.error('Fetch employers error:', error)
      setEmployers([])
    } finally {
      setLoading(false)
    }
  }

  // Computed values
  const filteredEmployers = useMemo(() => {
    let filtered = employers

    if (searchTerm) {
      const query = searchTerm.toLowerCase()
      filtered = filtered.filter(emp =>
        (emp.title || '').toLowerCase().includes(query) ||
        (emp.employer || '').toLowerCase().includes(query) ||
        (emp.email || '').toLowerCase().includes(query) ||
        (emp.location || '').toLowerCase().includes(query) ||
        (emp.sector || '').toLowerCase().includes(query)
      )
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(emp => emp.status === filterStatus)
    }

    // Sort employers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt)
        case 'oldest':
          return new Date(a.created_at || a.createdAt) - new Date(b.created_at || b.createdAt)
        case 'name':
          return (a.title || '').localeCompare(b.title || '')
        case 'status':
          return (a.status || '').localeCompare(b.status || '')
        case 'jobs':
          return (b.totalJobs || 0) - (a.totalJobs || 0)
        case 'applications':
          return (b.totalApplications || 0) - (a.totalApplications || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [employers, searchTerm, filterStatus, sortBy])

  const paginatedEmployers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredEmployers.slice(start, end)
  }, [filteredEmployers, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredEmployers.length / itemsPerPage)

  const getStatusStats = () => ({
    total: employers.length,
    approved: employers.filter(e => e.status === 'approved').length,
    pending: employers.filter(e => e.status === 'pending').length,
    rejected: employers.filter(e => e.status === 'rejected').length,
    active: employers.filter(e => e.isActive).length,
  })

  // Modal handlers
  const openEmployerDetail = async (employer) => {
    console.log('Employer object:', employer)
    setSelectedEmployer(employer)
    setActiveTab('overview')
    setShowDetailModal(true)
    
    const jobId = employer._id
    if (!jobId) {
      console.error('Job ID not found:', employer)
      return
    }
    
    try {
      const [employerJobs, employerApplications, employerInterviews] = await Promise.all([
        fetchEmployerJobs(jobId),
        fetchEmployerApplications(jobId),
        fetchEmployerInterviews(jobId)
      ])
      
      setSelectedJobs(employerJobs)
      setSelectedApplications(employerApplications)
      setSelectedInterviews(employerInterviews)
    } catch (error) {
      console.error('Error fetching employer details:', error)
    }
  }

  const openApprovalModal = (employer) => {
    setSelectedEmployer(employer)
    setShowApprovalModal(true)
  }

  const openDeleteModal = (employer) => {
    setSelectedEmployer(employer)
    setShowDeleteModal(true)
  }

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <Check size={10} />
      case 'pending': return <Clock size={10} />
      case 'rejected': return <X size={10} />
      default: return null
    }
  }

  useEffect(() => {
    // Initialize auth store from localStorage
    authStore.initAuth()
  }, [])

  useEffect(() => {
    if (!authStore.isAuthenticated) {
      console.log('User not authenticated')
      return
    }
    
    const userId = authStore.user?.id
    if (!userId) {
      console.log('User ID not found')
      return
    }
    
    fetchEmployers()
  }, [authStore.isAuthenticated, authStore.user?.id])

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [currentPage, totalPages])

  if (loading) return <Loading />

  const stats = getStatusStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
            Employer <span className="text-blue-600">Management</span>
          </h1>
          <p className="text-slate-600 mt-1">Manage and verify employers on the platform.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          <span>Add Employer</span>
        </button>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total</p>
              <p className="text-xl font-bold text-slate-800">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Approved</p>
              <p className="text-xl font-bold text-slate-800">{stats.approved}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-xl font-bold text-slate-800">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <X size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Rejected</p>
              <p className="text-xl font-bold text-slate-800">{stats.rejected}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BadgeCheck size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Active</p>
              <p className="text-xl font-bold text-slate-800">{stats.active}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters and Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employers by name, contact, email, location, or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Company Name</option>
                <option value="status">Status</option>
                <option value="jobs">Total Jobs</option>
                <option value="applications">Applications</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Employers Grid */}
      {filteredEmployers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedEmployers.map((employer) => (
               <div 
                  key={employer._id} 
                  className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
                >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <img 
                        src={employer.logo || "/logo.png"} 
                        alt={employer.name} 
                        className="w-12 h-12 object-contain rounded-lg border border-slate-100 flex-shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="font-bold text-slate-800 truncate cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => openEmployerDetail(employer)}
                        >
                          {employer.name}
                        </h3>
                        <p className="text-sm text-blue-600 truncate">{employer.contactName}</p>
                        <p className="text-xs text-slate-500 truncate">{employer.industry}</p>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(employer.status)}`}>
                      {getStatusIcon(employer.status)}
                      <span className="ml-1">{employer.status.charAt(0).toUpperCase() + employer.status.slice(1)}</span>
                    </span>
                  </div>

                  {/* Company Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <MapPin size={12} className="text-blue-600 flex-shrink-0" />
                      <span className="truncate">{employer.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Users size={12} className="text-blue-600 flex-shrink-0" />
                      <span>{employer.companySize} employees</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Mail size={12} className="text-blue-600 flex-shrink-0" />
                      <span className="truncate">{employer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Phone size={12} className="text-blue-600 flex-shrink-0" />
                      <span>{employer.phone}</span>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-800">{employer.totalJobs || 0}</div>
                      <div className="text-xs text-slate-600">Total Jobs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-800">{employer.totalApplications || 0}</div>
                      <div className="text-xs text-slate-600">Applications</div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-slate-700">{employer.averageRating || 0}</span>
                      <span className="text-xs text-slate-500">rating</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Last login: {employer.lastLogin ? formatDate(employer.lastLogin) : 'Never'}
                    </div>
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-700">Active Status</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={employer.isActive}
                        onChange={() => toggleEmployerActive(employer.id)}
                        disabled={actionLoading}
                      />
                      <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                      <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEmployerDetail(employer)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Eye size={12} />
                      View Details
                    </button>
                    
                    {employer.status === 'pending' && (
                      <button
                        onClick={() => openApprovalModal(employer)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Check size={12} />
                        Review
                      </button>
                    )}
                    
                    <button
                      onClick={() => { setSelectedEmployer(employer); setShowEditModal(true) }}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Edit3 size={12} />
                    </button>
                    
                    <button
                      onClick={() => openDeleteModal(employer)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployers.length)} of {filteredEmployers.length} employers
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
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
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
          <Users size={48} className="mx-auto text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No employers found</h3>
          <p className="text-slate-600 mb-6">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first employer"
            }
          </p>
          {(!searchTerm && filterStatus === "all") && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus size={16} />
              Add Employer
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateEmployerModal 
          onClose={() => setShowCreateModal(false)} 
          onSubmit={(formData) => createEmployer(employerId, formData)}
        />
      )}
      {showEditModal && (
        <EditEmployerModal 
          employer={selectedEmployer} 
          onClose={() => setShowEditModal(false)} 
          onSubmit={(formData) => updateEmployer(selectedEmployer._id, formData)}
        />
      )}
      {showDetailModal && (
        <EmployerDetailModal 
          employer={selectedEmployer}
          jobs={selectedJobs}
          applications={selectedApplications}
          interviews={selectedInterviews}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setShowDetailModal(false)}
        />
      )}
      {showApprovalModal && (
        <ApprovalModal
          employer={selectedEmployer}
          onApprove={(id) => updateEmployerStatus(id, 'approved')}
          onReject={(id) => updateEmployerStatus(id, 'rejected')}
          onClose={() => setShowApprovalModal(false)}
          loading={actionLoading}
        />
      )}
      {showDeleteModal && (
        <DeleteConfirmModal
          employer={selectedEmployer}
          onConfirm={() => deleteEmployer(selectedEmployer._id)}
          onClose={() => setShowDeleteModal(false)}
          loading={deleteLoading}
        />
      )}
    </div>
  )
}


