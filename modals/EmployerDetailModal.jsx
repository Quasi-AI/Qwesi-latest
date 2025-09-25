"use client"
import { X, Building2, Briefcase, Users, Calendar, FileText, Mail, Phone, MapPin, Globe, ExternalLink, Download, Star } from "lucide-react"

const EmployerDetailModal = ({ employer, jobs, applications, interviews, activeTab, setActiveTab, onClose }) => {
  if (!employer) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': case 'active': case 'hired': return 'text-green-600 bg-green-100'
      case 'pending': case 'interview_scheduled': return 'text-orange-600 bg-orange-100' 
      case 'rejected': case 'declined': return 'text-red-600 bg-red-100'
      case 'under_review': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={employer.logo || "/logo.png"} 
                alt={employer.name} 
                className="w-12 h-12 object-contain rounded-lg border" 
              />
              <div>
                <h2 className="text-xl font-bold text-slate-800">{employer.name}</h2>
                <p className="text-slate-600">{employer.contactName} • {employer.industry}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Building2 },
              { id: 'jobs', label: `Jobs (${jobs.length})`, icon: Briefcase },
              { id: 'applications', label: `Applications (${applications.length})`, icon: Users },
              { id: 'interviews', label: `Interviews (${interviews.length})`, icon: Calendar },
              { id: 'documents', label: 'Documents', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Company Information */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Company Information</h3>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-slate-600">Status</span>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(employer.status)}`}>
                          {employer.status.charAt(0).toUpperCase() + employer.status.slice(1)}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-600">Active</span>
                        <div className={`text-sm mt-1 ${employer.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {employer.isActive ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-blue-600" />
                        <span className="text-sm">{employer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-blue-600" />
                        <span className="text-sm">{employer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-blue-600" />
                        <span className="text-sm">{employer.location}</span>
                      </div>
                      {employer.website && (
                        <div className="flex items-center gap-2">
                          <Globe size={16} className="text-blue-600" />
                          <a 
                            href={employer.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Website <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-blue-600" />
                        <span className="text-sm">{employer.companySize} employees</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-blue-600" />
                        <span className="text-sm">Joined {formatDate(employer.createdAt)}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-600">Description</span>
                      <p className="text-sm text-slate-700 mt-1">{employer.description}</p>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">{employer.totalJobs || 0}</div>
                      <div className="text-sm text-blue-700">Total Jobs Posted</div>
                      <div className="text-xs text-blue-600 mt-1">{employer.activeJobs || 0} currently active</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">{employer.totalApplications || 0}</div>
                      <div className="text-sm text-green-700">Total Applications</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-600">{employer.totalInterviews || 0}</div>
                      <div className="text-sm text-purple-700">Interviews Conducted</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Star size={16} className="text-orange-500 fill-current" />
                        <span className="text-2xl font-bold text-orange-600">{employer.averageRating || 0}</span>
                      </div>
                      <div className="text-sm text-orange-700">Average Rating</div>
                    </div>
                    <div className="text-xs text-slate-500">
                      Last login: {employer.lastLogin ? formatDate(employer.lastLogin) : 'Never'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Job Postings</h3>
              {jobs.length > 0 ? (
                <div className="grid gap-4">
                  {jobs.map((job) => (
                    <div key={job.id || job._id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-slate-800">{job.title}</h4>
                          <p className="text-sm text-slate-600">{job.location} • {job.salary}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-slate-500">Posted {formatDate(job.createdAt)}</span>
                            <span className="text-xs text-slate-500">{job.applications || 0} applications</span>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Briefcase size={48} className="mx-auto mb-2 text-slate-300" />
                  <p>No job postings found</p>
                </div>
              )}
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Job Applications</h3>
              {applications.length > 0 ? (
                <div className="grid gap-4">
                  {applications.map((application) => (
                    <div key={application.id || application._id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-slate-800">{application.candidateName}</h4>
                          <p className="text-sm text-slate-600">{application.candidateEmail}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-slate-500">Applied {formatDate(application.appliedAt)}</span>
                            {application.resume && (
                              <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                <Download size={12} />
                                Resume
                              </button>
                            )}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Users size={48} className="mx-auto mb-2 text-slate-300" />
                  <p>No applications found</p>
                </div>
              )}
            </div>
          )}

          {/* Interviews Tab */}
          {activeTab === 'interviews' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Scheduled Interviews</h3>
              {interviews.length > 0 ? (
                <div className="grid gap-4">
                  {interviews.map((interview) => (
                    <div key={interview.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-slate-800">{interview.candidateName}</h4>
                          <p className="text-sm text-slate-600">{interview.jobTitle}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-slate-500">
                              {formatDate(interview.date)} at {interview.time}
                            </span>
                            <span className="text-xs text-slate-500">{interview.duration} minutes</span>
                            <span className="text-xs text-slate-500">{interview.type} interview</span>
                          </div>
                          {interview.notes && (
                            <p className="text-xs text-slate-600 mt-1">{interview.notes}</p>
                          )}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                          {interview.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Calendar size={48} className="mx-auto mb-2 text-slate-300" />
                  <p>No interviews scheduled</p>
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company Documents</h3>
              {employer.documents && employer.documents.length > 0 ? (
                <div className="grid gap-3">
                  {employer.documents.map((document, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-slate-700">{document}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <Download size={14} />
                        <span className="text-sm">Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <FileText size={48} className="mx-auto mb-2 text-slate-300" />
                  <p>No documents uploaded</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployerDetailModal



