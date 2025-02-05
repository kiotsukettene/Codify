import React, { useRef } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader } from '../ui/card'

import { Confetti } from '../ui/confetti'
import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function PaymentSuccess() {
  const navigate = useNavigate()

  return (
    
    <div className="flex items-center min-h-screen bg-violet-500 p-6">
     

      {/* Main Content */}
      <div className="relative mx-auto max-w-md">
        
     <Confetti
      className="absolute left-0 top-0 z-0 size-full"
    />

        <div className="rounded-3xl bg-white p-8 shadow-lg">
          {/* Check Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
            <Check className="h-8 w-8 text-primary" />
          </div>

          {/* Thank You Message */}
          <div className="mb-8 text-center">
            <h1 className="relative mx-auto mb-2 inline-block text-4xl font-bold text-purple-800">
              THANK YOU
              {/* Decorative Animals */}
              <span className="absolute -left-9 -top-4 text-2xl">🌌</span>
              <span className="absolute -left-12 -top-[-9] text-2xl">✨</span>
              <span className="absolute -right-8 -top-4 text-2xl">🪐</span>
              <span className="absolute -right-12 top-2 text-2xl">💫</span>
            </h1>
            <p className="text-lg font-medium text-gray-900">Payment Successful!</p>
          </div>

          {/* Content Sections */}
          <div className="mb-8 grid gap-8">
            {/* Summary Section */}
            <div>
              <h2 className="mb-4 text-sm font-medium text-gray-500">Your Summary</h2>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="mb-2 flex items-start gap-3">
                  <div className="mt-1 " />🌠
                  <div>
                    <h3 className="font-semibold text-gray-900">Codify
                    </h3>
                    <p className="text-sm text-primary">Lifetime Access 🔥
                    </p>
                    <p className="text-xs text-gray-500">Unlock full access to your LMS—no renewals, just one payment.</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between text-sm">
                  <div className="text-gray-500">17 Apr, 2025</div>
                  <div className="font-medium text-gray-900">₱ 70,000</div>
                </div>
                <div className="mt-2 text-xs text-gray-500">Mastercard **** 3456</div>
              </div>
            </div>

            {/* What's Next Section */}
            <div>
              <h2 className="mb-4 text-sm font-medium text-gray-500">What's Next</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="mt-1 h-5 w-5 " />
                  🌠
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Instructions</h3>
                    <p className="text-sm text-gray-500">
                    Check your email for your admin login details and setup guide.
                   </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1 h-5 w-5 " />🌠
                  <div>
                    <h3 className="font-semibold text-gray-900">School & Professor Registration</h3>
                    <p className="text-sm text-gray-500">
                    Your institution’s LMS is now active! You can start by registering your school and professors through the Admin Dashboard.                     </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button onClick={() => navigate('/admin/admin-login')} className="group relative w-full overflow-hidden rounded-xl bg-primary px-6 py-3 text-white transition-all hover:shadow-lg hover:shadow-violet-200">
            <span className="relative z-10 flex items-center justify-center font-medium">
            Start Using Codify 
              <span className="ml-2">→</span>
            </span>
            <div className="absolute inset-0 -translate-x-full bg-white/10 transition-transform group-hover:translate-x-0" />
          </button>
        </div>
      </div>
    </div>
   
  )
}

export default PaymentSuccess
