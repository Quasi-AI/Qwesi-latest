'use client'
import { useEffect, useState } from 'react'
import Loading from '@/components/Loading'
import { readAuth, fetchUserDetails, validateStoredToken, persistAuth, authFetch } from '@/lib/auth'
import { API_ROUTES } from '@/lib/apiRoutes'
import toast from 'react-hot-toast'
import { User, Mail, Phone, Calendar, ShieldAlert } from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', dob: '' })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      setError('')
      try {
        // Ensure token is still valid, will auto-clear on invalid
        await validateStoredToken()
        const auth = readAuth()
        const token = auth?.token

        if (!token) {
          setError('Please login to view your profile.')
          setUser(null)
          return
        }

        // Fetch latest user details from backend
        const details = await fetchUserDetails(token)
        setUser(details || auth?.user || null)
      } catch (e) {
        setError(e?.message || 'Failed to load profile.')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        dob: user.dob || user.dateOfBirth || ''
      })
    }
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      // Basic client validations similar to backend
      if (!form.name || !form.email || !form.dob) {
        throw new Error('Please fill all fields')
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.email)) {
        throw new Error('Invalid email format')
      }
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/
      if (!dateRegex.test(form.dob)) {
        throw new Error('Date must be in DD/MM/YYYY format')
      }

      const res = await authFetch(API_ROUTES.EDIT_PROFILE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, dob: form.dob }),
      })

      let data = null
      try { data = await res.json() } catch {}

      const updatedUser = (data && (data.user || data.data)) ? (data.user || data.data) : { ...user, ...form }
      setUser(updatedUser)

      // persist updated user with existing token
      const auth = readAuth()
      const token = auth?.token || null
      try { persistAuth({ user: updatedUser, token }) } catch {}

      toast.success((data && data.message) ? data.message : 'Profile updated successfully')
      setEditMode(false)
    } catch (err) {
      setFormError(err?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <ShieldAlert className="w-10 h-10 text-orange-600 mx-auto mb-3" />
          <h1 className="text-xl font-semibold text-slate-800 mb-2">Authentication required</h1>
          <p className="text-slate-600 mb-6">{error || 'Please login to access your profile.'}</p>
          <a href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Go to login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user?.name || 'Your Profile'}</h1>
                <p className="text-sm text-white/80">Manage your account information</p>
              </div>
            </div>
            <button
              onClick={() => { setEditMode(!editMode); setFormError('') }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium"
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {editMode ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
                  <input
                    className="w-full px-3 py-2 border rounded-lg"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                <input
                  placeholder="DD/MM/YYYY"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                />
              </div>
              {formError && <div className="text-sm text-red-600">{formError}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setEditMode(false); setFormError('') }}
                  className="px-4 py-2 border rounded-lg"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard icon={User} label="Full name" value={user?.name || 'N/A'} />
                <InfoCard icon={Mail} label="Email" value={user?.email || 'N/A'} />
                <InfoCard icon={Phone} label="Phone" value={user?.phone || user?.mobile || 'N/A'} />
                <InfoCard icon={Calendar} label="Date of Birth" value={user?.dob || user?.dateOfBirth || 'N/A'} />
              </div>
              <details className="mt-4">
                <summary className="text-sm text-slate-600 cursor-pointer select-none">Show raw profile data</summary>
                <pre className="mt-2 p-3 bg-slate-50 rounded border text-xs overflow-x-auto">{JSON.stringify(user, null, 2)}</pre>
              </details>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white flex items-center gap-3">
      <div className="p-2 rounded-lg bg-blue-50 text-blue-700"><Icon className="w-5 h-5" /></div>
      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-sm font-medium text-slate-800">{value}</div>
      </div>
    </div>
  )
}
