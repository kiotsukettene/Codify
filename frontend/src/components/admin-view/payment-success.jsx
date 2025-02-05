import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Confetti } from '../ui/confetti';

function PaymentSuccess() {
  const navigate = useNavigate();
  const { institution, setInstitution } = useAuthStore();

  useEffect(() => {
    const updatePaymentStatus = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/mark-as-paid', {
          institutionId: institution._id,
        });

        if (response.data.success) {
          toast.success('Payment confirmed! Subscription activated.');
          setInstitution({ ...institution, isPaid: true });
        } else {
          toast.error('Payment verification failed.');
        }
      } catch (error) {
        console.error('Error updating payment status:', error);
      }
    };

    updatePaymentStatus();
  }, [institution, setInstitution]);

  return (
    <div className="flex items-center min-h-screen bg-violet-500 p-6">
      <div className="relative mx-auto max-w-md">
        <Confetti className="absolute left-0 top-0 z-0 size-full" />
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          {/* Check Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
            <Check className="h-8 w-8 text-primary" />
          </div>

          {/* Thank You Message */}
          <div className="mb-8 text-center">
            <h1 className="relative mx-auto mb-2 inline-block text-4xl font-bold text-purple-800">
              THANK YOU
              <span className="absolute -left-9 -top-4 text-2xl">🌌</span>
              <span className="absolute -left-12 -top-[-9] text-2xl">✨</span>
              <span className="absolute -right-8 -top-4 text-2xl">🪐</span>
              <span className="absolute -right-12 top-2 text-2xl">💫</span>
            </h1>
            <p className="text-lg font-medium text-gray-900">Payment Successful!</p>
          </div>

          {/* What's Next Section */}
          <div className="mb-8 grid gap-8">
            <div>
              <h2 className="mb-4 text-sm font-medium text-gray-500">What's Next</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  🌠
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Instructions</h3>
                    <p className="text-sm text-gray-500">
                      Check your email for admin login details and setup guide.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  🌠
                  <div>
                    <h3 className="font-semibold text-gray-900">School & Professor Registration</h3>
                    <p className="text-sm text-gray-500">
                      Your LMS is now active! Start by registering your school and professors in the Admin Dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={() => navigate('/admin/dashboard')} 
            className="group relative w-full overflow-hidden rounded-xl bg-primary px-6 py-3 text-white transition-all hover:shadow-lg hover:shadow-violet-200"
          >
            <span className="relative z-10 flex items-center justify-center font-medium">
              Start Using Codify 
              <span className="ml-2">→</span>
            </span>
            <div className="absolute inset-0 -translate-x-full bg-white/10 transition-transform group-hover:translate-x-0" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
