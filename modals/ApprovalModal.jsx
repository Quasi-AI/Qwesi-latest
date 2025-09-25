"use client"
import { X, Check, AlertTriangle } from "lucide-react"

const ApprovalModal = ({ employer, onApprove, onReject, onClose, loading }) => {
  if (!employer) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Review Employer Application</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Company Overview */}
          <div className="flex items-start gap-4">
            <img 
              src={employer.logo || "/logo.png"} 
              alt={employer.name} 
              className="w-16 h-16 object-contain rounded-lg border" 
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">{employer.name}</h3>
              <p className="text-slate-600">{employer.industry} • {employer.companySize} employees</p>
              <p className="text-sm text-slate-600 mt-1">{employer.location}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 mb-3">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <User size={16} className="text-slate-400" />
                <span className="text-sm">{employer.contactName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-slate-400" />
                <span className="text-sm">{employer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-slate-400" />
                <span className="text-sm">{employer.phone}</span>
              </div>
              {employer.website && (
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-slate-400" />
                  <a 
                    href={employer.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {employer.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Company Description */}
          <div>
            <h4 className="font-medium text-slate-900 mb-2">Company Description</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{employer.description}</p>
          </div>

          {/* Documents */}
          {employer.documents && employer.documents.length > 0 && (
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Uploaded Documents</h4>
              <div className="space-y-2">
                {employer.documents.map((document, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-blue-600" />
                      <span className="text-sm">{document}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Download size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Application Date */}
          <div className="text-xs text-slate-500">
            Application submitted on {new Date(employer.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          {/* Warning Message */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-amber-800">Review Carefully</h5>
                <p className="text-sm text-amber-700 mt-1">
                  Please verify all company information and documents before approving. 
                  Approved employers will be able to post jobs and access candidate profiles.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => onReject(employer.id)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <X size={18} />
              {loading ? 'Processing...' : 'Reject Application'}
            </button>
            <button
              onClick={() => onApprove(employer.id)}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Check size={18} />
              {loading ? 'Processing...' : 'Approve Employer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApprovalModal