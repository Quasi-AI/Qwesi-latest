import React from 'react'
import Title from './Title'

const Newsletter = () => {
    return (
        <div className='flex flex-col items-center mx-4 my-36'>
            <Title title="Stay Connected with Qwesi AI" description="Subscribe to get job alerts, career tips, AI updates, and exclusive features delivered straight to your inbox every week." visibleButton={false} />
            <div className='flex bg-white text-sm p-1 rounded-full w-full max-w-xl my-10 border-2 border-[#432DD7] shadow-sm'>
                <input 
                    className='flex-1 pl-5 outline-none text-gray-700 placeholder-gray-400' 
                    type="email" 
                    placeholder='Enter your email address' 
                />
                <button className='font-medium bg-[#432DD7] text-white px-7 py-3 rounded-full hover:bg-[#342299] hover:scale-103 active:scale-95 transition'>
                    Get Updates
                </button>
            </div>
            <p className='text-xs text-gray-500 max-w-md text-center'>
                Join thousands of professionals using Qwesi AI for career growth. Unsubscribe anytime.
            </p>
        </div>
    )
}

export default Newsletter