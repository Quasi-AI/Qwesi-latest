import React, { useState } from 'react'
import Title from './Title'
import { CheckCircle, Mail, AlertCircle } from 'lucide-react'

const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com/api'

const Newsletter = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState('') // 'success', 'error', ''
    const [message, setMessage] = useState('')

    const validateEmail = (email) => {
        return /^(?:[a-zA-Z0-9_'^&\-])+(?:\.(?:[a-zA-Z0-9_'^&\-])+)*@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/.test(email)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Reset status
        setStatus('')
        setMessage('')

        // Validation
        if (!email.trim()) {
            setStatus('error')
            setMessage('Please enter your email address')
            return
        }

        if (!validateEmail(email)) {
            setStatus('error')
            setMessage('Please enter a valid email address')
            return
        }

        try {
            setLoading(true)

            const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.toLowerCase().trim(),
                    source: 'qwesi_website',
                    metadata: {
                        subscribedAt: new Date().toISOString(),
                        userAgent: navigator.userAgent,
                        page: 'newsletter_component'
                    }
                }),
            })

            const result = await response.json()

            if (response.ok && result.success) {
                setStatus('success')
                setMessage('Successfully subscribed! Welcome to Qwesi AI updates.')
                setEmail('') // Clear the input
            } else {
                throw new Error(result.message || 'Failed to subscribe')
            }

        } catch (error) {
            console.error('Newsletter subscription error:', error)
            setStatus('error')
            
            // Handle specific error cases
            if (error.message.includes('already')) {
                setMessage('You are already subscribed to our newsletter!')
            } else {
                setMessage('Failed to subscribe. Please try again later.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e)
        }
    }

    return (
        <div className='flex flex-col items-center mx-4 my-36'>
            <Title 
                title="Stay Connected with Qwesi AI" 
                description="Subscribe to get job alerts, career tips, AI updates, and exclusive features delivered straight to your inbox every week." 
                visibleButton={false} 
            />
            
            <form onSubmit={handleSubmit} className='w-full max-w-xl my-10'>
                <div className={`flex bg-white text-sm p-1 rounded-full w-full border shadow-sm transition-all duration-200 ${
                    status === 'error' ? 'border-red-300' : 
                    status === 'success' ? 'border-green-300' : 
                    'border-[#5C3AEB] hover:shadow-md'
                }`}>
                    <div className='flex-1 flex items-center pl-5'>
                        <Mail size={16} className='text-gray-400 mr-2' />
                        <input 
                            className='flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent' 
                            type="email" 
                            placeholder='Enter your email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading || status === 'success'}
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={loading || status === 'success'}
                        className='font-medium bg-[#5C3AEB] text-white px-7 py-3 rounded-full hover:bg-[#342299] hover:scale-103 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2'
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Subscribing...
                            </>
                        ) : status === 'success' ? (
                            <>
                                <CheckCircle size={16} />
                                Subscribed!
                            </>
                        ) : (
                            'Get Updates'
                        )}
                    </button>
                </div>
            </form>

            {/* Status Messages */}
            {status && (
                <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg max-w-md ${
                    status === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    {status === 'success' ? (
                        <CheckCircle size={16} className="flex-shrink-0" />
                    ) : (
                        <AlertCircle size={16} className="flex-shrink-0" />
                    )}
                    <p className='text-sm'>{message}</p>
                </div>
            )}

            <p className='text-xs text-gray-500 max-w-md text-center'>
                Join thousands of professionals using Qwesi AI for career growth. Unsubscribe anytime.
            </p>

            {/* Privacy Notice */}
            <div className='text-xs text-gray-400 text-center mt-4 max-w-lg'>
                <p>
                    We respect your privacy. Your email will only be used for Qwesi AI updates and will never be shared with third parties.
                </p>
            </div>

            {/* Success Features List */}
            {status === 'success' && (
                <div className='mt-6 p-4 bg-blue-50 rounded-lg max-w-md'>
                    <h4 className='font-semibold text-blue-900 mb-2'>What's next?</h4>
                    <ul className='text-sm text-blue-800 space-y-1'>
                        <li>• Weekly job alerts and career opportunities</li>
                        <li>• Latest AI updates and features</li>
                        <li>• Exclusive career tips and resources</li>
                        <li>• Early access to new Qwesi AI tools</li>
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Newsletter