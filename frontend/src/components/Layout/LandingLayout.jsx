import React from 'react'
import { motion } from 'framer-motion'
import Navigation from '../Layout/N'

const LandingLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Rest of the background and content remains the same */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* ... background elements ... */}
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default Navigation