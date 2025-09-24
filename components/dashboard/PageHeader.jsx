'use client'
import React from 'react'

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 mb-6">
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
          </div>
          {children && <div className="flex items-center gap-3">{children}</div>}
        </div>
      </div>
    </header>
  )
}

export default PageHeader
