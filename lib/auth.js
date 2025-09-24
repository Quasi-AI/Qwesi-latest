import { API_ROUTES } from '@/lib/apiRoutes'

export async function loginWithCredentials(identifier, password) {
  // identifier can be phone or email, backend expects `phone`
  const payload = { phone: identifier, password }

  const res = await fetch(API_ROUTES.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const msg = await safeJson(res)
    throw new Error(msg?.message || 'Invalid credentials')
  }

  const data = await res.json()

  // If login returns user directly
  if (data?.user || data?.data) {
    return normalizeAuthResult(data)
  }

  // Try to fetch user details with/without token
  const token = data?.token || data?.access_token || data?.accessToken || null

  try {
    const user = await fetchUserDetails(token)
    return { success: true, user, token, message: 'Login successful' }
  } catch (e) {
    // Return success even if user details not available
    return { success: true, user: null, token, message: 'Login successful but user details not available' }
  }
}

export async function fetchUserDetails(token) {
  const res = await fetch(API_ROUTES.USER_DETAILS, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!res.ok) {
    const msg = await safeJson(res)
    throw new Error(msg?.message || 'Failed to fetch user details')
  }
  return res.json()
}

export async function signupWithCredentials({ phone, name, dob, email, password }) {
  // Client-side validations mirroring backend
  if (!phone || !name || !dob || !email || !password) {
    throw new Error('All fields are required: phone, name, dob, email, password')
  }
  if (!String(phone).startsWith('+')) {
    throw new Error('Phone number must start with +')
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format')
  }
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/
  if (!dateRegex.test(dob)) {
    throw new Error('Date must be in DD/MM/YYYY format')
  }
  if (String(password).length < 4) {
    throw new Error('Password must be at least 4 characters long')
  }

  const res = await fetch(API_ROUTES.SIGNUP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, name, dob, email, password }),
  })

  if (!res.ok) {
    const msg = await safeJson(res)
    const message = msg?.message || msg?.error || 'Signup failed'
    throw new Error(message)
  }

  // Some backends might return body; we treat any 2xx as success
  try { await res.json() } catch {}
  return { success: true, message: 'Account created successfully' }
}

export function persistAuth({ user, token }) {
  try {
    localStorage.setItem('auth', JSON.stringify({ user, token }))
  } catch {}
}

export function clearAuth() {
  try { localStorage.removeItem('auth') } catch {}
}

export function readAuth() {
  try {
    const raw = localStorage.getItem('auth')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function logoutUser(options = {}) {
  try { clearAuth() } catch {}
  const { redirectTo } = options || {}
  if (redirectTo && typeof window !== 'undefined') {
    window.location.assign(redirectTo)
  }
}

export async function authFetch(url, options = {}) {
  const auth = readAuth()
  const token = auth?.token
  const headers = { ...(options.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  const res = await fetch(url, { ...options, headers })
  if (res.status === 401 || res.status === 403) {
    // Token invalid/expired - auto logout
    logoutUser()
    throw new Error('Unauthorized')
  }
  return res
}

export async function validateStoredToken({ onInvalid } = {}) {
  const auth = readAuth()
  const token = auth?.token
  if (!token) return { valid: false }
  try {
    await fetchUserDetails(token)
    return { valid: true }
  } catch (e) {
    logoutUser()
    if (typeof onInvalid === 'function') { try { onInvalid(e) } catch {} }
    return { valid: false }
  }
}

export async function requestPasswordReset(email) {
  if (!email) throw new Error('Email is required')
  // Attempt to call backend if route exists, else mock
  const endpoint = API_ROUTES.FORGOT_PASSWORD
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    if (!res.ok) {
      const msg = await safeJson(res)
      throw new Error(msg?.message || 'Failed to send reset instructions')
    }
    try { await res.json() } catch {}
    return { success: true, message: 'Reset instructions sent to your email' }
  }
  // Mock fallback
  await new Promise(r => setTimeout(r, 700))
  return { success: true, message: 'Reset instructions sent to your email' }
}

export async function resetPassword({ token, newPassword }) {
  if (!token || !newPassword) throw new Error('Token and new password are required')
  const endpoint = API_ROUTES.RESET_PASSWORD
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    })
    if (!res.ok) {
      const msg = await safeJson(res)
      throw new Error(msg?.message || 'Failed to reset password')
    }
    try { await res.json() } catch {}
    return { success: true, message: 'Password reset successfully' }
  }
  // Mock fallback
  await new Promise(r => setTimeout(r, 700))
  return { success: true, message: 'Password reset successfully' }
}

export function startGoogleOAuth() {
  // Basic redirect starter. Adjust to your backend Google OAuth start endpoint if different
  // Example expected backend route: BASE_URL + 'auth/google' leading to OAuth flow
  const url = `${API_ROUTES.BASE_URL}auth/google`
  if (typeof window !== 'undefined') window.location.href = url
}

async function safeJson(res) {
  try { return await res.json() } catch { return null }
}

function normalizeAuthResult(data) {
  const user = data.user || data.data || null
  const token = data.token || data.access_token || data.accessToken || null
  return { success: true, user, token, message: 'Login successful' }
}
