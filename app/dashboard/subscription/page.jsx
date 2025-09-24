'use client'
import { useState } from 'react'
import { Star, Calendar, Clock, CreditCard, Check, X, Zap, MessageCircle, FileText, Code, Users2 } from 'lucide-react'

export default function SubscriptionPage() {
    const [isPro, setIsPro] = useState(false)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false)
    const [loading, setLoading] = useState(false)

    // Minimal mock user info for display
    const user = {
        name: 'Admin User',
        email: 'admin@qwesi.com',
        createdAt: '2024-01-15T10:30:00Z',
        subscription: { currentPeriodEnd: '2025-01-15T10:30:00Z' },
        paymentMethod: { last4: '4242' }
    }

    const formatDate = (d) => new Date(d).toLocaleDateString()

    const handleUpgrade = () => {
        setLoading(true)
        // Mock upgrade - replace with real checkout flow
        setTimeout(() => {
            setIsPro(true)
            setShowUpgradeModal(false)
            setLoading(false)
            alert('Upgraded to Pro (mock)')
        }, 700)
    }

    const handleCancel = () => {
        setLoading(true)
        setTimeout(() => {
            setIsPro(false)
            setShowCancelModal(false)
            setLoading(false)
            alert('Subscription cancelled (mock)')
        }, 700)
    }

    const handleUpdatePayment = (data) => {
        setLoading(true)
        setTimeout(() => {
            setShowUpdatePaymentModal(false)
            setLoading(false)
            alert('Payment method updated (mock)')
        }, 700)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-slate-800">Subscription</h1>
                    <p className="text-sm text-slate-600">Manage billing and plan settings for your account.</p>
                </div>

                {/* Summary Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="col-span-2 bg-white border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-100 rounded-md"><Star className="w-5 h-5 text-slate-700" /></div>
                                <div>
                                    <div className="text-sm text-slate-500">Current Plan</div>
                                    <div className="text-lg font-bold text-slate-900">{isPro ? 'Pro' : 'Free'}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-extrabold">{isPro ? '$4.99' : '$0'}</div>
                                <div className="text-sm text-slate-500">per month</div>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-slate-600">
                            {isPro ? (
                                <>Next billing: <strong className="text-slate-900">{formatDate(user.subscription.currentPeriodEnd)}</strong></>
                            ) : (
                                <>Upgrade to Pro for advanced features and priority support.</>
                            )}
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between">
                        <div>
                            <div className="text-sm text-slate-500">Payment Method</div>
                            <div className="font-medium text-slate-900">VISA •••• {user.paymentMethod.last4}</div>
                        </div>
                        <div className="mt-4">
                            <button onClick={() => setShowUpdatePaymentModal(true)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md text-sm hover:bg-slate-50">Update</button>
                        </div>
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
                            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-600 mt-1"/> Core AI features</li>
                            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-600 mt-1"/> 10 queries / day</li>
                            <li className="flex items-start gap-3 opacity-60"><X className="w-4 h-4 text-slate-400 mt-1"/> No API access</li>
                        </ul>

                        <div className="mt-6">
                            <button disabled={!isPro} className={`w-full px-4 py-2 rounded-md font-medium ${!isPro ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white border'}`}>Current Plan</button>
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
                            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-600 mt-1"/> Unlimited queries</li>
                            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-600 mt-1"/> Advanced models</li>
                            <li className="flex items-start gap-3"><Check className="w-4 h-4 text-green-600 mt-1"/> API access & integrations</li>
                        </ul>

                        <div className="mt-6">
                            <button onClick={() => isPro ? setShowCancelModal(true) : setShowUpgradeModal(true)} className={`w-full px-4 py-2 rounded-md font-medium ${isPro ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-orange-600 text-white hover:bg-orange-700'}`}>
                                {isPro ? 'Cancel Subscription' : 'Upgrade to Pro'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals (minimal backdrops) */}
            {showUpgradeModal && (
                <Modal title="Upgrade to Pro" onClose={() => setShowUpgradeModal(false)} loading={loading}>
                    <div className="space-y-4 text-sm text-slate-700">
                        <p>Upgrade to Pro to unlock advanced AI models, API access, and priority support.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowUpgradeModal(false)} className="flex-1 px-4 py-2 border rounded-md">Cancel</button>
                            <button onClick={handleUpgrade} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md">{loading ? 'Processing...' : 'Confirm Upgrade'}</button>
                        </div>
                    </div>
                </Modal>
            )}

            {showCancelModal && (
                <Modal title="Cancel Subscription" onClose={() => setShowCancelModal(false)} loading={loading}>
                    <div className="space-y-4 text-sm text-slate-700">
                        <p>Are you sure you want to cancel? You will retain access until the end of your billing period.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowCancelModal(false)} className="flex-1 px-4 py-2 border rounded-md">Keep Plan</button>
                            <button onClick={handleCancel} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md">Confirm Cancel</button>
                        </div>
                    </div>
                </Modal>
            )}

            {showUpdatePaymentModal && (
                <Modal title="Update Payment Method" onClose={() => setShowUpdatePaymentModal(false)} loading={loading}>
                    <div className="space-y-3">
                        <input type="text" placeholder="Card number" className="w-full px-3 py-2 border rounded-md" />
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="MM/YY" className="px-3 py-2 border rounded-md" />
                            <input type="text" placeholder="CVC" className="px-3 py-2 border rounded-md" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowUpdatePaymentModal(false)} className="flex-1 px-4 py-2 border rounded-md">Cancel</button>
                            <button onClick={() => handleUpdatePayment({})} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md">Update</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

const Modal = ({ title, children, onClose, loading }) => (
    <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-lg w-full shadow-lg">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-900">{title}</h3>
                <button onClick={onClose} className="p-1 rounded-md" disabled={loading}><X className="w-4 h-4 text-slate-600"/></button>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    </div>
)