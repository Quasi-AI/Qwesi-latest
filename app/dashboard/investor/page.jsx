"use client"
import { useState, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon, UserIcon, BanknotesIcon, BoltIcon, QuestionMarkCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const InvestorRegistration = () => {
  // State management
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [investorForm, setInvestorForm] = useState({
    name: '',
    phone: '',
    countryCode: '+233',
    email: '',
    investorDetails: [],
    description: ''
  });

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    profileImage: null
  };

  const userInitials = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  // Form options
  const investorOptions = [
    { 
      value: 'I am an investor', 
      label: 'I am an investor', 
      description: 'Looking for investment opportunities and startups to fund'
    },
    { 
      value: 'I\'m looking for investors', 
      label: 'I\'m seeking investors', 
      description: 'Entrepreneur or startup founder looking for funding and investment partners'
    }
  ];

  // Country codes
  const countryCodes = [
    { code: '+233', country: 'Ghana' },
    { code: '+1', country: 'US/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+234', country: 'Nigeria' }
  ];

  // Form validation
  const isFormValid = investorForm.name.trim() !== '' &&
    investorForm.email.trim() !== '' &&
    investorForm.phone.trim() !== '' &&
    investorForm.description.trim() !== '' &&
    investorForm.investorDetails.length > 0;

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setInvestorForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (value) => {
    setInvestorForm(prev => ({
      ...prev,
      investorDetails: prev.investorDetails.includes(value)
        ? prev.investorDetails.filter(item => item !== value)
        : [...prev.investorDetails, value]
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isFormValid) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Investment profile completed successfully! We will connect you with relevant opportunities.');
      
      // Reset form
      setInvestorForm({
        name: '',
        phone: '',
        countryCode: '+233',
        email: '',
        investorDetails: [],
        description: ''
      });
      
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-emerald-600 bg-clip-text text-transparent">
                  Investor Registration
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Connect with investment opportunities or showcase your offerings
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <BanknotesIcon className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Investment Opportunities Await!</h2>
              <p className="text-green-100 mt-1 leading-relaxed">
                Whether you're an investor seeking opportunities or an entrepreneur looking for funding, 
                complete your profile to connect with the right partners and grow your network.
              </p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-2">
              <h3 className="text-xl font-bold text-slate-800">Investment Profile</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-emerald-300"></div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={investorForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email *</label>
                <input
                  type="email"
                  value={investorForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={investorForm.countryCode}
                  onChange={(e) => handleInputChange('countryCode', e.target.value)}
                  className="w-full sm:w-32 px-3 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {countryCodes.map(({ code, country }) => (
                    <option key={code} value={code}>{code} {country}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={investorForm.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Your phone number"
                  className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Investor Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">What describes you? *</label>
              <div className="grid grid-cols-1 gap-3">
                {investorOptions.map((option) => (
                  <label 
                    key={option.value}
                    className="flex items-start p-4 bg-white/70 border border-slate-200 rounded-xl hover:bg-white hover:border-emerald-200 transition-all duration-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={investorForm.investorDetails.includes(option.value)}
                      onChange={() => handleCheckboxChange(option.value)}
                      className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 mr-3 mt-1"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-900">{option.label}</span>
                      <p className="text-xs text-slate-500 mt-1">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Investment Details */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Investment Details *</label>
              <textarea
                value={investorForm.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows="6"
                placeholder="Describe your investment interests, opportunities, or what you're looking for. Include details such as:&#10;- Investment sectors or industries of interest&#10;- Investment range or funding amount&#10;- Stage preferences (seed, series A, etc.)&#10;- Geographic focus&#10;- Any specific requirements or criteria"
                className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all duration-300"
                required
              />
              <p className="text-xs text-slate-500 mt-2">Be specific to help us match you with the right opportunities or partners</p>
            </div>

            {/* Submit Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-4 sm:mb-0">
                * Required fields. Your information will be kept confidential and used only for matching purposes.
              </p>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid}
                className="relative px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-green-700 opacity-0 hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    'Complete Registration'
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Tips Modal */}
      {showTipsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowTipsModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Investment Registration Tips</h3>
                <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mt-2"></div>
              </div>
              <button
                onClick={() => setShowTipsModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-600 font-bold text-xs">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Be Clear About Your Role</h4>
                    <p className="text-sm text-slate-600">Specify whether you're seeking investment or offering it. This helps us match you with the right partners.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-xs">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Include Specific Details</h4>
                    <p className="text-sm text-slate-600">Mention investment amounts, sectors of interest, stage preferences, and geographic focus for better matching.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-xs">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Highlight Your Unique Value</h4>
                    <p className="text-sm text-slate-600">Share what makes you or your opportunity special - experience, connections, market insights, or innovative solutions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorRegistration;