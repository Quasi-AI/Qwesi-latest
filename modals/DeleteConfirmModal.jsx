"use client"
import { AlertTriangle, X } from "lucide-react"

const DeleteConfirmModal = ({ employer, onConfirm, onClose, loading }) => {
  if (!employer) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Employer</h3>
              <p className="text-sm text-slate-600">This action cannot be undone</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <img 
                src={employer.logo || "/logo.png"} 
                alt={employer.name} 
                className="w-10 h-10 object-contain rounded border" 
              />
              <div>
                <div className="font-medium text-slate-900">{employer.name}</div>
                <div className="text-sm text-slate-600">{employer.contactName}</div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-red-800 mb-2">Warning</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• All job postings will be removed</li>
              <li>• Application data will be permanently deleted</li>
              <li>• Interview schedules will be cancelled</li>
              <li>• This action cannot be reversed</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </div>
              ) : (
                'Delete Employer'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal