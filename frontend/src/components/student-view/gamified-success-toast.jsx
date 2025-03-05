import React from 'react'
import { Toast } from '../ui/toast'
import astronaut from '@/assets/picture/random background/toastAstronaut.png'
import { X } from 'lucide-react'

function GamifiedToast({ open, onOpenChange, title, description }) {
    return (
        <Toast
          open={open}
          onOpenChange={onOpenChange}
          className="bg-[#c6ffc6] border-none shadow-none rounded-xl relative flex items-center min-w-[350px] min-h-[80px] pl-20 pr-12 py-4"
        >
          {/* Astronaut Image - Position Unchanged */}
          <div className="absolute left-4 top-4 w-24 h-24 -translate-x-6 -translate-y-2">
            <img
              src={astronaut}
              alt="Astronaut"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Content - Adjusted for Better Spacing */}
          <div className="flex flex-col justify-center">
            <div className="text-xl font-semibold text-neutral-800 leading-tight">{title}</div>
            <div className="text-sm text-neutral-700">{description}</div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-6 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </Toast>
    )
}



export default GamifiedToast
