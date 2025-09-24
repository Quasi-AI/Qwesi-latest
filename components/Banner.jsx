'use client'
import React from 'react'
import toast from 'react-hot-toast';

export default function Banner() {

    const [isOpen, setIsOpen] = React.useState(() => {
        // Check localStorage for banner state, default to true if not found
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('bannerOpen');
            return stored === null ? true : stored === 'true';
        }
        return true;
    });
    const [donationLoading, setDonationLoading] = React.useState(false);

    const handleDonation = async () => {
        setDonationLoading(true);
        
        try {
            // You can replace this with actual user email from your auth system
            const donationEmail = 'supporter@qwesi.org'; // Default or get from user context
            
            // Make API call to your backend
            const response = await fetch(`https://dark-caldron-448714-u5.appspot.com/api/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: donationEmail,
                    type: 'donation' // This tells your backend it's a donation
                })
            });

            const data = await response.json();

            if (response.ok && data.checkoutUrl) {
                // Redirect to Stripe checkout
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error(data.error || 'Failed to create donation session');
            }
        } catch (error) {
            console.error('Donation error:', error);
            
            // Show error message to user
            toast.error('Unable to process donation at this time. Please try again later.');
        } finally {
            setDonationLoading(false);
        }
    };

    return isOpen && (
        <div className="w-full px-6 py-2 font-medium text-sm text-white text-center bg-[#5C3AEB]">
            <div className='flex items-center justify-between max-w-7xl mx-auto'>
                <p>Help us keep Qwesi AI free for students and job seekers!</p>
                <div className="flex items-center space-x-6">
                    <button 
                        onClick={handleDonation} 
                        disabled={donationLoading}
                        type="button" 
                        className="font-normal text-[#5C3AEB] bg-white px-7 py-2 rounded-full max-sm:hidden hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {donationLoading ? 'Processing...' : 'Donate Now'}
                    </button>
                    <button 
                        onClick={() => {
                            setIsOpen(false);
                            localStorage.setItem('bannerOpen', 'false');
                        }} 
                        type="button" 
                        className="font-normal text-white py-2 rounded-full hover:opacity-80 transition-opacity"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect y="12.532" width="17.498" height="2.1" rx="1.05" transform="rotate(-45.74 0 12.532)" fill="#fff" />
                            <rect x="12.533" y="13.915" width="17.498" height="2.1" rx="1.05" transform="rotate(-135.74 12.533 13.915)" fill="#fff" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};