'use client'
import { useState, useEffect } from 'react'
import { useSubscriptionStore } from '@/stores/subscriptionStore'
import { Star, Calendar, Clock, CreditCard, Check, X, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

// Add the missing formatDate function
const formatDate = (dateString) => {
    if (!dateString) return 'No date specified'
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

export default function SubscriptionPage() {
    const [user, setUser] = useState({
        email: '',
        subscription: {
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        paymentMethod: {
            last4: '4242'
        }
    })

    const {
        currentSubscription,
        loading,
        error,
        isPro: isProFunction,
        fetchSubscription,
        createCheckoutSession,
        cancelSubscription,
        updatePaymentMethod,
        clearError
    } = useSubscriptionStore()

    // Call the isPro function to get the actual boolean value
    const isPro = typeof isProFunction === 'function' ? isProFunction() : false

    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)
    const [paymentForm, setPaymentForm] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: ''
    })

    // Get user data from localStorage on component mount
    useEffect(() => {
        try {
            const authData = localStorage.getItem('auth')
            if (authData) {
                const auth = JSON.parse(authData)
                if (auth.user?.email) {
                    setUser(prev => ({ ...prev, email: auth.user.email }))
                } else {
                    toast.error('User email not found. Please log in again.')
                }
            } else {
                toast.error('Authentication required. Please log in.')
            }
        } catch (error) {
            console.error('Error getting user data:', error)
            toast.error('Error loading user data.')
        }

        // Fetch subscription data
        if (fetchSubscription) {
            fetchSubscription().catch(err => {
                console.error('Error fetching subscription:', err)
                // Don't show error toast for subscription not found
                if (err?.message !== 'Subscription not found.') {
                    toast.error('Failed to load subscription data.')
                }
            })
        }
    }, [fetchSubscription])

    // Clear errors when they change
    useEffect(() => {
        if (error && clearError) {
            toast.error(error)
            clearError()
        }
    }, [error, clearError])

    const handleUpgrade = async () => {
        if (!user.email) {
            toast.error('User email not found. Please log in again.')
            return
        }

        if (!createCheckoutSession) {
            toast.error('Payment service unavailable. Please try again later.')
            return
        }

        setActionLoading(true)
        
        try {
            console.log('Creating checkout session with params:', {
                type: 'subscription',
                email: user.email,
                successUrl: `${window.location.origin}/dashboard/subscription?success=true`,
                cancelUrl: `${window.location.origin}/dashboard/subscription?canceled=true`
            })

            const result = await createCheckoutSession({
                type: 'subscription',
                email: user.email,
                successUrl: `${window.location.origin}/dashboard/subscription?success=true`,
                cancelUrl: `${window.location.origin}/dashboard/subscription?canceled=true`
            })

            // Check if we have a checkout URL directly
            if (result?.checkoutUrl) {
                toast.success('Redirecting to payment...')
                window.location.href = result.checkoutUrl
                return
            }

            // Check for success with URL property  
            if (result?.success && result?.url) {
                console.log('Found success + url, attempting redirect...')
                toast.success('Redirecting to payment...')
                window.location.href = result.url
                return
            }

            // Check if result itself is a URL string
            if (typeof result === 'string' && result.includes('checkout.stripe.com')) {
                console.log('Result is a URL string, attempting redirect...')
                toast.success('Redirecting to payment...')
                window.location.href = result
                return
            }

            // If we got here, there's no valid URL
            console.error('No checkout URL found in response:', result)
            toast.error(result?.message || result?.error || 'Unable to create payment session. Please try again.')
            
        } catch (error) {
            console.error('Upgrade failed with error:', error)
            toast.error('Failed to start upgrade process. Please try again.')
        } finally {
            setActionLoading(false)
            setShowUpgradeModal(false)
        }
    }

    const handleCancel = async () => {
        if (!user.email) {
            toast.error('User email not found. Please log in again.')
            return
        }

        if (!cancelSubscription) {
            toast.error('Service unavailable. Please try again later.')
            return
        }

        setActionLoading(true)

        try {
            const result = await cancelSubscription({
                email: user.email
            })

            if (result?.success) {
                setShowCancelModal(false)
                toast.success('Subscription cancelled successfully. You\'ll retain access until your billing period ends.')
                // Refresh subscription data
                if (fetchSubscription) {
                    await fetchSubscription()
                }
            } else if (result?.error === "Subscription not found.") {
                // Handle case where user thinks they have subscription but don't
                toast.error('No active subscription found. Your account is already on the free plan.')
                setShowCancelModal(false)
                // Refresh to correct the UI state
                if (fetchSubscription) {
                    await fetchSubscription()
                }
            } else {
                toast.error(result?.message || result?.error || 'Failed to cancel subscription')
            }
        } catch (error) {
            console.error('Cancel failed:', error)
            toast.error('Failed to cancel subscription. Please try again.')
        } finally {
            setActionLoading(false)
        }
    }

    const handleUpdatePayment = async (e) => {
        e.preventDefault()
        
        if (!user.email) {
            toast.error('User email not found. Please log in again.')
            return
        }

        // Basic validation
        const cleanCardNumber = paymentForm.cardNumber.replace(/\s/g, '')
        if (!cleanCardNumber || !paymentForm.expiryDate || !paymentForm.cvc) {
            toast.error('Please fill in all payment details.')
            return
        }

        if (cleanCardNumber.length < 13) {
            toast.error('Please enter a valid card number.')
            return
        }

        if (paymentForm.cvc.length < 3) {
            toast.error('Please enter a valid CVC.')
            return
        }

        if (!updatePaymentMethod) {
            toast.error('Service unavailable. Please try again later.')
            return
        }

        setActionLoading(true)

        try {
            const result = await updatePaymentMethod({
                email: user.email,
                cardNumber: cleanCardNumber,
                expiryDate: paymentForm.expiryDate,
                cvc: paymentForm.cvc
            })

            if (result?.success) {
                setShowUpdatePaymentModal(false)
                toast.success('Payment method updated successfully!')
                // Update user data with new last4
                setUser(prev => ({
                    ...prev,
                    paymentMethod: {
                        last4: cleanCardNumber.slice(-4)
                    }
                }))
                // Reset form
                setPaymentForm({ cardNumber: '', expiryDate: '', cvc: '' })
            } else {
                toast.error(result?.message || result?.error || 'Failed to update payment method')
            }
        } catch (error) {
            console.error('Update payment failed:', error)
            toast.error('Failed to update payment method. Please try again.')
        } finally {
            setActionLoading(false)
        }
    }

    const handlePaymentFormChange = (field, value) => {
        let formattedValue = value

        // Format card number (add spaces every 4 digits)
        if (field === 'cardNumber') {
            const cleanValue = value.replace(/\D/g, '') // Remove all non-digits
            formattedValue = cleanValue.replace(/(\d{4})/g, '$1 ').trim()
            if (cleanValue.length > 16) return // Limit to 16 digits
        }

        // Format expiry date (MM/YY)
        if (field === 'expiryDate') {
            const cleanValue = value.replace(/\D/g, '')
            if (cleanValue.length >= 2) {
                formattedValue = cleanValue.replace(/(\d{2})(\d)/, '$1/$2')
            } else {
                formattedValue = cleanValue
            }
            if (cleanValue.length > 4) return // Limit to MMYY format
        }

        // Format CVC (numbers only)
        if (field === 'cvc') {
            formattedValue = value.replace(/\D/g, '')
            if (formattedValue.length > 4) return // Limit to 4 digits
        }

        setPaymentForm(prev => ({ ...prev, [field]: formattedValue }))
    }

    // Check URL params for success/cancel messages
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.get('success') === 'true') {
            toast.success('Subscription upgraded successfully!')
            // Clean up URL
            window.history.replaceState({}, '', window.location.pathname)
        } else if (urlParams.get('canceled') === 'true') {
            toast.error('Subscription upgrade was cancelled.')
            // Clean up URL
            window.history.replaceState({}, '', window.location.pathname)
        }
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-slate-800">Subscription</h1>
                    <p className="text-sm text-slate-600">Manage billing and plan settings for your account.</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
                        <div className="inline-flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                            <span className="text-slate-600">Loading subscription data...</span>
                        </div>
                    </div>
                )}

                {/* Main Content - Only show when not loading */}
                {!loading && (
                    <>
                        {/* Summary Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="col-span-2 bg-white border border-slate-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-slate-100 rounded-md">
                                            <Star className="w-5 h-5 text-slate-700" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-500">Current Plan</div>
                                            <div className="text-lg font-bold text-slate-900">
                                                {isPro ? 'Pro' : 'Free'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-extrabold">
                                            {isPro ? '$4.99' : '$0'}
                                        </div>
                                        <div className="text-sm text-slate-500">per month</div>
                                    </div>
                                </div>
                                <div className="mt-4 text-sm text-slate-600">
                                    {isPro ? (
                                        <>
                                            Next billing: <strong className="text-slate-900">
                                                {formatDate(currentSubscription?.currentPeriodEnd || user.subscription.currentPeriodEnd)}
                                            </strong>
                                        </>
                                    ) : (
                                        <>Upgrade to Pro for advanced features and priority support.</>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
                                <div>
                                    <div className="text-sm text-slate-500">Payment Method</div>
                                    <div className="font-medium text-slate-900">
                                        {isPro ? (
                                            `VISA •••• ${currentSubscription?.paymentMethod?.last4 || user.paymentMethod.last4}`
                                        ) : (
                                            'No payment method'
                                        )}
                                    </div>
                                </div>
                                {isPro && (
                                    <div className="mt-4">
                                        <button 
                                            onClick={() => setShowUpdatePaymentModal(true)}
                                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md text-sm hover:bg-slate-50 disabled:opacity-50"
                                            disabled={actionLoading}
                                        >
                                            Update
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Plans */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className={`bg-white border ${!isPro ? 'border-slate-300 ring-2 ring-slate-200' : 'border-slate-200'} rounded-lg p-6`}> 
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">Free</h3>
                                        <p className="text-sm text-slate-500">Perfect for evaluation</p>
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900">$0</div>
                                </div>

                                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                                    <li className="flex items-start gap-3">
                                        <Check className="w-4 h-4 text-green-600 mt-1"/>
                                        Core AI features
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-4 h-4 text-green-600 mt-1"/>
                                        10 queries / day
                                    </li>
                                    <li className="flex items-start gap-3 opacity-60">
                                        <X className="w-4 h-4 text-slate-400 mt-1"/>
                                        No API access
                                    </li>
                                </ul>

                                <div className="mt-6">
                                    <button 
                                        disabled
                                        className={`w-full px-4 py-2 rounded-md font-medium ${
                                            !isPro 
                                                ? 'bg-slate-100 text-slate-500 cursor-not-allowed' 
                                                : 'bg-white border hover:bg-slate-50'
                                        }`}
                                    >
                                        {!isPro ? 'Current Plan' : 'Free Plan'}
                                    </button>
                                </div>
                            </div>

                            <div className={`bg-white border ${isPro ? 'border-orange-300 ring-2 ring-orange-100 shadow-md' : 'border-slate-200'} rounded-lg p-6`}> 
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">Pro</h3>
                                        <p className="text-sm text-slate-500">For professionals & teams</p>
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900">$4.99</div>
                                </div>

                                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                                    <li className="flex items-start gap-3">
                                        <Check className="w-4 h-4 text-green-600 mt-1"/>
                                        Unlimited queries
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-4 h-4 text-green-600 mt-1"/>
                                        Advanced models
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-4 h-4 text-green-600 mt-1"/>
                                        API access & integrations
                                    </li>
                                </ul>

                                <div className="mt-6">
                                    <button 
                                        onClick={() => (isPro && currentSubscription) ? setShowCancelModal(true) : setShowUpgradeModal(true)}
                                        disabled={actionLoading || !user.email}
                                        className={`w-full px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                            (isPro && currentSubscription)
                                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                                : 'bg-orange-600 text-white hover:bg-orange-700'
                                        }`}
                                    >
                                        {actionLoading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Processing...
                                            </div>
                                        ) : (
                                            (isPro && currentSubscription) ? 'Cancel Subscription' : 'Upgrade to Pro'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            {showUpgradeModal && (
                <Modal title="Upgrade to Pro" onClose={() => setShowUpgradeModal(false)}>
                    <div className="space-y-4 text-sm text-slate-700">
                        <p>Upgrade to Pro to unlock advanced AI models, API access, and priority support.</p>
                        <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                            <div className="font-medium text-orange-800">What you'll get:</div>
                            <ul className="text-orange-700 text-xs mt-1 space-y-1">
                                <li>• Unlimited AI queries</li>
                                <li>• Access to advanced models</li>
                                <li>• Priority customer support</li>
                                <li>• API access for integrations</li>
                            </ul>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowUpgradeModal(false)}
                                disabled={actionLoading}
                                className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleUpgrade}
                                disabled={actionLoading || !user.email}
                                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
                            >
                                {actionLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    'Confirm Upgrade'
                                )}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {showCancelModal && (
                <Modal title="Cancel Subscription" onClose={() => setShowCancelModal(false)}>
                    <div className="space-y-4 text-sm text-slate-700">
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <div className="font-medium text-red-800">Are you sure?</div>
                            <p className="text-red-700 text-xs mt-1">
                                You will retain access until the end of your billing period, but you'll lose access to Pro features after that.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowCancelModal(false)}
                                disabled={actionLoading}
                                className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                            >
                                Keep Plan
                            </button>
                            <button 
                                onClick={handleCancel}
                                disabled={actionLoading || !user.email}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                            >
                                {actionLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Cancelling...
                                    </div>
                                ) : (
                                    'Confirm Cancel'
                                )}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {showUpdatePaymentModal && (
                <Modal title="Update Payment Method" onClose={() => setShowUpdatePaymentModal(false)}>
                    <form onSubmit={handleUpdatePayment} className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Card Number
                            </label>
                            <input 
                                type="text" 
                                value={paymentForm.cardNumber}
                                onChange={(e) => handlePaymentFormChange('cardNumber', e.target.value)}
                                placeholder="1234 5678 9012 3456"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={actionLoading}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expiry Date
                                </label>
                                <input 
                                    type="text" 
                                    value={paymentForm.expiryDate}
                                    onChange={(e) => handlePaymentFormChange('expiryDate', e.target.value)}
                                    placeholder="MM/YY"
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                                    disabled={actionLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    CVC
                                </label>
                                <input 
                                    type="text" 
                                    value={paymentForm.cvc}
                                    onChange={(e) => handlePaymentFormChange('cvc', e.target.value)}
                                    placeholder="123"
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                                    disabled={actionLoading}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button 
                                type="button"
                                onClick={() => setShowUpdatePaymentModal(false)}
                                disabled={actionLoading}
                                className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={actionLoading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {actionLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Updating...
                                    </div>
                                ) : (
                                    'Update Payment'
                                )}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}

const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-lg w-full shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-900">{title}</h3>
                <button 
                    onClick={onClose} 
                    className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                    <X className="w-4 h-4 text-slate-600"/>
                </button>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    </div>
)