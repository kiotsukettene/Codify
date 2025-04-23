import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const animatedButton = ({buttonTitle}) => {
  return (
    <div>
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 space-y-4"
          >
            <button className="group relative px-8 py-4 text-lg font-medium bg-white text-gray-900 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300 overflow-hidden">
              <span className="relative z-10 flex items-center justify-center">
                {buttonTitle}
                <Sparkles className="ml-2 w-5 h-5 text-yellow-500 group-hover:rotate-12 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

           
          </motion.div>

    </div>
  )
}

export default animatedButton
