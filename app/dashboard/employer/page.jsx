"use client"
import { useState, useEffect } from "react"
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
  BadgeCheck
} from "lucide-react"

export default function AdminEmployers() {
  const [employers, setEmployers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEmployer, setSelectedEmployer] = useState(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)

  const employersDummyData = [
    {
      id: 1,
      name: "Qwesi Tech",
      contactName: "Ama K.",
      email: "hiring@qwesi.com",
      phone: "+233 555 123 456",
      status: "approved",
      isActive: true,
      createdAt: "2024-05-10",
      description: "Leading tech company hiring across multiple roles.",
      logo: "/logo.png",
      location: "Accra, Ghana"
    },
    {
      id: 2,
      name: "Green Agro Ltd",
      contactName: "Kojo M.",
      email: "careers@greenagro.com",
      phone: "+233 277 000 111",
      status: "pending",
      isActive: false,
      createdAt: "2024-06-21",
      description: "Agri-tech startup focused on sustainable farming.",
      logo: "/logo.png",
      location: "Kumasi, Ghana"
    },
    {
      id: 3,
      name: "North Star Bank",
      contactName: "Abena T.",
      email: "talent@northstar.com",
      phone: "+233 244 222 333",
      status: "rejected",
      isActive: false,
      createdAt: "2024-04-02",
      description: "Financial services and digital banking.",
      logo: "/logo.png",
      location: "Tema, Ghana"
    }
  ]

  const fetchEmployers = async () => {
    setEmployers(employersDummyData)
    setLoading(false)
  }

  const toggleIsActive = async (employerId) => {
    const updated = employers.map(emp =>
      emp.id === employerId ? { ...emp, isActive: !emp.isActive } : emp
    )
    setEmployers(updated)
    toast.success("Employer status updated successfully")
  }

  const updateEmployerStatus = async (employerId, newStatus) => {
    const updated = employers.map(emp =>
      emp.id === employerId ? { ...emp, status: newStatus } : emp
    )
    setEmployers(updated)
    setShowApprovalModal(false)
    toast.success(`Employer ${newStatus} successfully`)
  }

  const filteredEmployers = employers.filter(emp => {
    const q = searchTerm.toLowerCase()
    const matchesSearch = emp.name.toLowerCase().includes(q) || (emp.contactName || "").toLowerCase().includes(q) || (emp.email || "").toLowerCase().includes(q)
    const matchesFilter = filterStatus === "all" || emp.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusStats = () => ({
    total: employers.length,
    approved: employers.filter(e => e.status === 'approved').length,
    pending: employers.filter(e => e.status === 'pending').length,
    rejected: employers.filter(e => e.status === 'rejected').length,
    active: employers.filter(e => e.isActive).length,
  })

  useEffect(() => { fetchEmployers() }, [])

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
          <p className="text-slate-600 mt-1">Manage and verify employers on qwesi.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          <span>Add Employer</span>
        </button>
      </div>

      {/* Stats Cards */}
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

      {/* Filters and Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employers by name, contact or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* Status Filter */}
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
        </div>
      </div>

      {/* Employers List */}
      {filteredEmployers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredEmployers.map((emp) => (
            <div key={emp.id} className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <img src={emp.logo} alt={emp.name} className="w-12 h-12 object-contain rounded-lg border border-slate-100" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">{emp.name}</h3>
                    <p className="text-sm text-blue-600">{emp.contactName}</p>
                  </div>
                </div>
                {/* Status Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      emp.status === 'pending'
                        ? 'bg-orange-100 text-orange-800 border border-orange-200'
                        : emp.status === 'rejected'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-green-100 text-green-800 border border-green-200'
                    }`}
                  >
                    {emp.status === 'pending' && <Clock size={10} className="mr-1" />}
                    {emp.status === 'approved' && <Check size={10} className="mr-1" />}
                    {emp.status === 'rejected' && <X size={10} className="mr-1" />}
                    {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                  </span>
                </div>
                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Building size={12} className="text-blue-600 flex-shrink-0" />
                    <span className="truncate">{emp.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Phone size={12} className="text-blue-600 flex-shrink-0" />
                    <span>{emp.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Mail size={12} className="text-blue-600 flex-shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                </div>
                {/* Active Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-700">Active</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      onChange={() => toast.promise(toggleIsActive(emp.id), {
                        loading: "Updating...",
                        success: "Updated successfully!",
                        error: "Failed to update"
                      })}
                      checked={emp.isActive}
                    />
                    <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                    <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                  </label>
                </div>
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedEmployer(emp); setShowEditModal(true) }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    <Edit3 size={12} />
                    Edit
                  </button>
                  {emp.status === 'pending' && (
                    <button
                      onClick={() => { setSelectedEmployer(emp); setShowApprovalModal(true) }}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Eye size={12} />
                      Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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
      {showCreateModal && <CreateEmployerModal onClose={() => setShowCreateModal(false)} />}
      {showEditModal && <EditEmployerModal employer={selectedEmployer} onClose={() => setShowEditModal(false)} />}
      {showApprovalModal && (
        <ApprovalModal
          employer={selectedEmployer}
          onApprove={(id) => updateEmployerStatus(id, 'approved')}
          onReject={(id) => updateEmployerStatus(id, 'rejected')}
          onClose={() => setShowApprovalModal(false)}
        />
      )}
    </div>
  )
}

// Create Employer Modal
const CreateEmployerModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    location: '',
    description: '',
    logo: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success("Employer created successfully!")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Add Employer</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Add Employer</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Employer Modal
const EditEmployerModal = ({ employer, onClose }) => {
  const [formData, setFormData] = useState({
    name: employer?.name || '',
    contactName: employer?.contactName || '',
    email: employer?.email || '',
    phone: employer?.phone || '',
    location: employer?.location || '',
    description: employer?.description || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success("Employer updated successfully!")
    onClose()
  }

  if (!employer) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Edit Employer</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Update Employer</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Approval Modal
const ApprovalModal = ({ employer, onApprove, onReject, onClose }) => {
  if (!employer) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Review Employer</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <img src={employer.logo} alt={employer.name} className="w-12 h-12 object-contain rounded-lg border" />
            <div>
              <div className="font-semibold text-slate-900">{employer.name}</div>
              <div className="text-sm text-slate-600">Contact: {employer.contactName}</div>
              <div className="text-sm text-slate-600">Email: {employer.email}</div>
              <div className="text-sm text-slate-600">Phone: {employer.phone}</div>
              <div className="text-sm text-slate-600">Location: {employer.location}</div>
            </div>
          </div>

          <div className="text-sm text-slate-700">{employer.description}</div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => onReject(employer.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
            >
              <X size={18} />
              Reject Employer
            </button>
            <button
              onClick={() => onApprove(employer.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Check size={18} />
              Approve Employer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}