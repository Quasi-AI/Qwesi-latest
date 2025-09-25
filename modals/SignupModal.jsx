'use client'
import React, { useState, useEffect } from 'react'
import { X, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { signupWithCredentials, startGoogleOAuth } from '@/lib/auth'
import { countryCodes, detectCountryByIP, formatPhoneNumber } from '@/utils/countryUtils'

const SignupModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        phone: '',
        countryCode: '+233',
        name: '',
        dob: '',
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showCountryDropdown, setShowCountryDropdown] = useState(false)

    // Auto-detect country on component mount
    useEffect(() => {
        const detectCountry = async () => {
            const detectedCode = await detectCountryByIP()
            setFormData(prev => ({ ...prev, countryCode: detectedCode }))
        }
        
        if (isOpen) {
            detectCountry()
        }
    }, [isOpen])

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose()
                setShowCountryDropdown(false)
            }
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleCountrySelect = (code) => {
        setFormData(prev => ({ ...prev, countryCode: code }))
        setShowCountryDropdown(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        try {
            // Format phone number with country code
            const fullPhoneNumber = formatPhoneNumber(formData.countryCode, formData.phone)
            
            const result = await signupWithCredentials({
                ...formData,
                phone: fullPhoneNumber
            })
            
            if (result?.success) {
                onClose()
            }
        } catch (err) {
            setError(err?.message || 'Signup failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignup = () => {
        startGoogleOAuth()
    }

    if (!isOpen) return null

    const selectedCountry = countryCodes.find(c => c.code === formData.countryCode)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => {
                    onClose()
                    setShowCountryDropdown(false)
                }}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Phone and Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone number
                            </label>
                            <div className="flex">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                        className="flex items-center gap-2 px-3 py-3 border border-gray-200 rounded-l-xl bg-gray-50 hover:bg-gray-100 transition-colors min-w-[80px]"
                                    >
                                        <span className="text-lg">{selectedCountry?.flag}</span>
                                        <span className="text-sm font-medium">{formData.countryCode}</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    
                                    {showCountryDropdown && (
                                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                                            {countryCodes.map((country) => (
                                                <button
                                                    key={`${country.code}-${country.country}`}
                                                    type="button"
                                                    onClick={() => handleCountrySelect(country.code)}
                                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left"
                                                >
                                                    <span className="text-lg">{country.flag}</span>
                                                    <span className="text-sm font-medium">{country.code}</span>
                                                    <span className="text-sm text-gray-600 truncate">{country.country}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="555 000 111"
                                    className="flex-1 px-4 py-3 border border-l-0 border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]/20 focus:border-[#5C3AEB] transition-colors"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]/20 focus:border-[#5C3AEB] transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                        <input
                            type="text"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            placeholder="DD/MM/YYYY"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]/20 focus:border-[#5C3AEB] transition-colors"
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]/20 focus:border-[#5C3AEB] transition-colors"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]/20 focus:border-[#5C3AEB] transition-colors"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#5C3AEB] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#4C2BD8] focus:outline-none focus:ring-2 focus:ring-[#5C3AEB]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                    </button>

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="text-[#5C3AEB] hover:underline font-medium"
                        >
                            Sign in
                        </button>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default SignupModal

