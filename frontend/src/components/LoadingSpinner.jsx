import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
          {/* Spinner */}
          <motion.div
              className='w-16 h-16 border-4 border-t-4 border-t-purple-300 border-purple-200 rounded-full'
              animate={{ rotate: 360 }}
              transition = {{  duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
    </div>
  )
}

export default LoadingSpinner
