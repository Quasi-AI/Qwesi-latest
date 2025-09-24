'use client'
import React from 'react'

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-4 ${className}`}>
      {children}
    </div>
  )
}

export default Card
