'use client'
import { useEffect, useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { resetPassword } from '@/lib/auth'

export default function ResetPasswordModal({ isOpen, onClose }) {
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { if (!isOpen) { setToken(''); setPassword(''); setError(''); setSuccess(''); setLoading(false) } }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"><X size={20}/></button>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Reset password</h2>
        <p className="text-sm text-slate-600 mb-6">Enter your reset token and new password.</p>
        <form onSubmit={async (e) => {
          e.preventDefault(); setLoading(true); setError(''); setSuccess('')
          try {
            const res = await resetPassword({ token, newPassword: password })
            setSuccess(res?.message || 'Password reset successfully')
          } catch (err) {
            setError(err?.message || 'Failed to reset password')
          } finally { setLoading(false) }
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Reset token</label>
            <input className="w-full px-4 py-3 border rounded-xl" value={token} onChange={(e)=>setToken(e.target.value)} required/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">New password</label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} className="w-full px-4 py-3 pr-12 border rounded-xl" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
              <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{show ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
            </div>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">{success}</div>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-xl py-3">{loading ? 'Resetting...' : 'Reset Password'}</button>
        </form>
      </div>
    </div>
  )
}
