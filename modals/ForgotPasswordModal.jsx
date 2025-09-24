'use client'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { requestPasswordReset } from '@/lib/auth'

export default function ForgotPasswordModal({ isOpen, onClose, onSwitchToReset }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setError('')
      setSent(false)
      setLoading(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"><X size={20}/></button>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Forgot password</h2>
        <p className="text-sm text-slate-600 mb-6">Enter your email to receive reset instructions.</p>
        <form onSubmit={async (e) => {
          e.preventDefault(); setLoading(true); setError('')
          try {
            const res = await requestPasswordReset(email)
            setSent(true)
          } catch (err) {
            setError(err?.message || 'Failed to send reset instructions')
          } finally { setLoading(false) }
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
            <input type="email" className="w-full px-4 py-3 border rounded-xl" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-xl py-3">{loading ? 'Sending...' : 'Send reset link'}</button>
        </form>
        {sent && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
            Reset instructions sent. If you already have a reset token, you can
            <button className="ml-1 text-blue-700 underline" onClick={() => onSwitchToReset && onSwitchToReset()}>reset now</button>.
          </div>
        )}
      </div>
    </div>
  )
}
