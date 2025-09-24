"use client"
import { useState } from 'react'
import {
    FileText,
    BarChart3,
    ArrowLeft,
    Star,
    CheckCircle,
    Users,
    Globe,
    X,
    Loader2
} from 'lucide-react'
import PageHeader from '@/components/dashboard/PageHeader'

const PitchCompetition = () => {
    const [hasExistingSubmission, setHasExistingSubmission] = useState(false)
    const [showMySubmissions, setShowMySubmissions] = useState(false)
    const [showStats, setShowStats] = useState(false)
    const [loadingSubmissions, setLoadingSubmissions] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [userSubmissions, setUserSubmissions] = useState([])
    const [competitionStats, setCompetitionStats] = useState(null)
    const [errors, setErrors] = useState({})

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        countryCode: '+233',
        organization: '',
        projectName: '',
        industry: '',
        summary: '',
        submissionType: '',
        description: '',
        stage: '',
        fundingAmount: '',
        teamSize: '',
        websiteUrl: '',
        seeking: []
    })

    const pitchTypes = [
        { value: 'business_plan', label: 'Business Plan Competition', description: 'Submit your comprehensive business plan for review and funding opportunities' },
        { value: 'startup_pitch', label: 'Startup Pitch', description: 'Present your startup idea for early-stage funding and mentorship' },
        { value: 'innovation_challenge', label: 'Innovation Challenge', description: 'Showcase innovative solutions to real-world problems' }
    ]

    const industries = [
        'Technology', 'Healthcare', 'Education', 'Finance', 'E-commerce', 'Agriculture', 'Manufacturing', 'Energy', 'Transportation', 'Entertainment', 'Food & Beverage', 'Real Estate', 'Environmental', 'Social Impact', 'Other'
    ]

    const projectStages = ['Idea Stage', 'Concept Development', 'Prototype/MVP', 'Testing Phase', 'Market Ready', 'Early Revenue', 'Scaling']

    const validateField = (name, value) => {
        const rules = {
            name: (v) => !v ? 'Name is required' : v.length < 2 ? 'Name must be at least 2 characters' : null,
            email: (v) => {
                if (!v) return 'Email is required'
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email'
                return null
            },
            phone: (v) => !v ? 'Phone is required' : v.length < 7 ? 'Phone number is too short' : null,
            projectName: (v) => !v ? 'Project name is required' : v.length < 3 ? 'Must be at least 3 characters' : null,
            industry: (v) => !v ? 'Please select an industry' : null,
            summary: (v) => {
                if (!v) return 'Summary is required'
                if (v.length < 30) return 'Must be at least 30 characters'
                if (v.length > 500) return 'Must be less than 500 characters'
                return null
            },
            submissionType: (v) => !v ? 'Please select a competition type' : null,
            description: (v) => {
                if (!v) return 'Description is required'
                if (v.length < 50) return 'Must be at least 50 characters'
                if (v.length > 2000) return 'Must be less than 2000 characters'
                return null
            },
            stage: (v) => !v ? 'Please select project stage' : null,
            websiteUrl: (v) => v && !/^https?:\/\/.+\..+/.test(v) ? 'Please enter a valid URL' : null
        }
        return rules[name] ? rules[name](value) : null
    }

    const getFormProgress = () => {
        const required = ['name', 'email', 'phone', 'projectName', 'industry', 'summary', 'submissionType', 'description', 'stage']
        const filled = required.filter(f => formData[f]).length
        return Math.round((filled / required.length) * 100)
    }

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
    }

    const validateForm = () => {
        const newErrors = {}
        const fields = ['name', 'email', 'phone', 'projectName', 'industry', 'summary', 'submissionType', 'description', 'stage', 'websiteUrl']
        fields.forEach(f => { const e = validateField(f, formData[f]); if (e) newErrors[f] = e })
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const submitForm = async (e) => {
        e.preventDefault()
        if (!validateForm()) return alert('Please fix the errors in the form')
        setIsSubmitting(true)
        try { await new Promise(r => setTimeout(r, 700)); alert('Pitch submitted successfully!'); setHasExistingSubmission(true) } catch (err) { console.error(err); alert('Submission failed') } finally { setIsSubmitting(false) }
    }

    const formatStatus = (s) => ({ pending: 'Under Review', reviewed: 'Reviewed', approved: 'Approved', rejected: 'Not Selected' }[s] || s)
    const getStatusClass = (s) => ({ pending: 'bg-orange-100 text-orange-800', reviewed: 'bg-blue-100 text-blue-800', approved: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' }[s] || 'bg-slate-100 text-slate-800')

    return (
        <div className="min-h-screen bg-slate-50">
            <PageHeader title="Pitch Competition" subtitle="Submit your innovative ideas and compete for funding opportunities">
                <button onClick={() => setShowMySubmissions(true)} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg"> <FileText className="w-4 h-4 inline" /> <span className="hidden sm:inline ml-2">My Submissions</span></button>
                <button onClick={() => setShowStats(true)} className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg"> <BarChart3 className="w-4 h-4 inline" /> <span className="hidden sm:inline ml-2">Stats</span></button>
            </PageHeader>

            <main className="p-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    {!hasExistingSubmission && (
                        <div className="bg-blue-600 text-white rounded-2xl p-8">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center"><Star className="w-6 h-6 text-yellow-300" /></div>
                                <div>
                                    <h2 className="text-xl font-bold">Showcase Your Innovation!</h2>
                                    <p className="text-blue-100 mt-1">Submit your groundbreaking ideas, business plans, or innovative solutions to compete for funding, mentorship, and the chance to turn your vision into reality.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!hasExistingSubmission && (
                        <div className="bg-white rounded-2xl border p-8">
                            <form onSubmit={submitForm} className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Competition Submission</h3>
                                    <div className="w-full bg-slate-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${getFormProgress()}%` }} /></div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl">
                                    <h4 className="font-semibold mb-3">Personal Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm block mb-1">Full Name *</label>
                                            <input value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full px-3 py-2 border rounded" />
                                            {errors.name && <div className="text-red-600 text-xs mt-1">{errors.name}</div>}
                                        </div>

                                        <div>
                                            <label className="text-sm block mb-1">Email Address *</label>
                                            <input value={formData.email} onChange={e => handleInputChange('email', e.target.value)} type="email" className="w-full px-3 py-2 border rounded" />
                                            {errors.email && <div className="text-red-600 text-xs mt-1">{errors.email}</div>}
                                        </div>

                                        <div>
                                            <label className="text-sm block mb-1">Phone Number *</label>
                                            <div className="flex gap-2">
                                                <select value={formData.countryCode} onChange={e => handleInputChange('countryCode', e.target.value)} className="px-3 py-2 border rounded">
                                                    <option value="+233">+233</option>
                                                    <option value="+1">+1</option>
                                                    <option value="+44">+44</option>
                                                </select>
                                                <input value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} type="tel" className="flex-1 px-3 py-2 border rounded" placeholder="Your phone number" />
                                            </div>
                                            {errors.phone && <div className="text-red-600 text-xs mt-1">{errors.phone}</div>}
                                        </div>

                                        <div>
                                            <label className="text-sm block mb-1">Organization/Company</label>
                                            <input value={formData.organization} onChange={e => handleInputChange('organization', e.target.value)} className="w-full px-3 py-2 border rounded" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl">
                                    <h4 className="font-semibold mb-3">Project Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm block mb-1">Project/Idea Name *</label>
                                            <input value={formData.projectName} onChange={e => handleInputChange('projectName', e.target.value)} className="w-full px-3 py-2 border rounded" />
                                            {errors.projectName && <div className="text-red-600 text-xs mt-1">{errors.projectName}</div>}
                                        </div>

                                        <div>
                                            <label className="text-sm block mb-1">Industry/Category *</label>
                                            <select value={formData.industry} onChange={e => handleInputChange('industry', e.target.value)} className="w-full px-3 py-2 border rounded">
                                                <option value="">Select Industry</option>
                                                {industries.map(i => <option key={i} value={i}>{i}</option>)}
                                            </select>
                                            {errors.industry && <div className="text-red-600 text-xs mt-1">{errors.industry}</div>}
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <label className="text-sm block mb-1">Project Summary *</label>
                                        <textarea value={formData.summary} onChange={e => handleInputChange('summary', e.target.value)} rows={3} className="w-full px-3 py-2 border rounded resize-none" />
                                        <div className="flex justify-between text-xs text-slate-500"><div>{errors.summary ? <span className="text-red-600">{errors.summary}</span> : null}</div><div>{formData.summary.length}/500</div></div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl">
                                    <h4 className="font-semibold mb-3">Competition Type *</h4>
                                    <div className="space-y-2">
                                        {pitchTypes.map(opt => (
                                            <label key={opt.value} className={`flex items-start p-3 border rounded ${formData.submissionType === opt.value ? 'border-blue-400 bg-blue-50' : 'border-slate-200'}`}>
                                                <input type="radio" name="submissionType" value={opt.value} checked={formData.submissionType === opt.value} onChange={e => handleInputChange('submissionType', e.target.value)} className="mt-1 mr-3" />
                                                <div>
                                                    <div className="font-semibold">{opt.label}</div>
                                                    <div className="text-xs text-slate-600">{opt.description}</div>
                                                </div>
                                            </label>
                                        ))}
                                        {errors.submissionType && <div className="text-red-600 text-xs mt-1">{errors.submissionType}</div>}
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl">
                                    <h4 className="font-semibold mb-3">Detailed Project Description *</h4>
                                    <textarea value={formData.description} onChange={e => handleInputChange('description', e.target.value)} rows={6} className="w-full px-3 py-2 border rounded resize-none" />
                                    <div className="flex justify-between text-xs text-slate-500"><div>{errors.description ? <span className="text-red-600">{errors.description}</span> : null}</div><div>{formData.description.length}/2000</div></div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl">
                                    <h4 className="font-semibold mb-3">Project Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm block mb-1">Current Development Stage *</label>
                                            <select value={formData.stage} onChange={e => handleInputChange('stage', e.target.value)} className="w-full px-3 py-2 border rounded">
                                                <option value="">Select Stage</option>
                                                {projectStages.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            {errors.stage && <div className="text-red-600 text-xs mt-1">{errors.stage}</div>}
                                        </div>

                                        <div>
                                            <label className="text-sm block mb-1">Funding Sought</label>
                                            <input value={formData.fundingAmount} onChange={e => handleInputChange('fundingAmount', e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="e.g., $50,000 or Not Seeking Funding" />
                                        </div>

                                        <div>
                                            <label className="text-sm block mb-1">Team Size</label>
                                            <select value={formData.teamSize} onChange={e => handleInputChange('teamSize', e.target.value)} className="w-full px-3 py-2 border rounded">
                                                <option value="">Select Team Size</option>
                                                <option value="Just me">Just me (Solo founder)</option>
                                                <option value="2-3">2-3 people</option>
                                                <option value="4-10">4-10 people</option>
                                                <option value="10+">10+ people</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-sm block mb-1">Website/Demo URL</label>
                                            <input value={formData.websiteUrl} onChange={e => handleInputChange('websiteUrl', e.target.value)} type="url" className="w-full px-3 py-2 border rounded" placeholder="https://your-project.com" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div className="text-xs text-slate-500">* Required fields. All submissions will be reviewed by our expert panel.</div>
                                    <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded">
                                        {isSubmitting ? <> <Loader2 className="w-4 h-4 inline mr-2" /> Submitting...</> : 'Submit Pitch'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {showMySubmissions && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-auto">
                                <div className="flex items-center justify-between p-4 border-b"><h3 className="font-bold">My Submissions</h3><button onClick={() => setShowMySubmissions(false)} className="p-2"><X className="w-4 h-4" /></button></div>
                                <div className="p-4">
                                    {loadingSubmissions ? <div className="py-12 text-center"><Loader2 className="w-8 h-8 text-blue-600 mx-auto" /><div className="mt-3 text-slate-600">Loading...</div></div> : (
                                        userSubmissions.length === 0 ? <div className="text-center py-12"><FileText className="w-12 h-12 text-slate-400 mx-auto" /><div className="mt-3">No submissions yet</div></div> : (
                                            <div className="space-y-3">{userSubmissions.map(s => (<div key={s._id} className="p-3 border rounded"><div className="flex justify-between"><div className="font-semibold">{s.projectName}</div><div className={`px-2 py-1 text-xs rounded-full ${getStatusClass(s.status)}`}>{formatStatus(s.status)}</div></div><div className="text-sm text-slate-600 mt-2">{s.summary}</div></div>))}</div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded"> <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white mb-2">$</div><div className="font-semibold">Funding Opportunities</div><div className="text-sm text-slate-600">Win cash prizes and grants.</div></div>
                        <div className="bg-orange-50 p-4 rounded"> <div className="w-10 h-10 bg-orange-600 rounded flex items-center justify-center text-white mb-2"><Users className="w-4 h-4" /></div><div className="font-semibold">Expert Mentorship</div><div className="text-sm text-slate-600">Guidance from industry experts.</div></div>
                        <div className="bg-green-50 p-4 rounded"> <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center text-white mb-2"><Globe className="w-4 h-4" /></div><div className="font-semibold">Network Access</div><div className="text-sm text-slate-600">Connect with investors and partners.</div></div>
                    </div>

                </div>
            </main>
        </div>
    )
}

export default PitchCompetition
