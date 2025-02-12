import React, { useState } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Particles } from "@/components/ui/particles";

import toast from 'react-hot-toast';

function PaymentSummary() {
  const navigate = useNavigate();
  const { institution, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const LEMON_CHECKOUT_URL = "https://codifyproduct.lemonsqueezy.com/buy/ae6446ba-0b46-48a5-91f1-9c64e2424699";

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  }
  const handlePayment = () => {
    setLoading(true);
    window.location.href = LEMON_CHECKOUT_URL;
  };

  return (
    <main className="relative bg-gradient-to-b from-[#4C1D95] via-[#6B21A8] to-[#A855F7] w-full min-h-screen flex flex-col items-center py-12">
       <div className="absolute inset-0 z-0">
        <Particles
          className="w-full h-full"
          quantity={300}
          ease={60}
          color="#8A2BE2"
          refresh
        />
      </div>

    <div className="flex items-center absolute justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-3xl">
        <Card className="overflow-hidden bg-white/80">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-blue-100/50 to-pink-100/50 opacity-50" />
          <CardHeader className="relative text-center">
            <div className="mb-2 flex justify-center">
              <div className="animate-bounce rounded-full bg-yellow-100 p-3">
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <CardTitle className="space-y-2 text-3xl font-bold">
              <div className="bg-gradient-to-r from-purple-600 to-rose-300 bg-clip-text text-transparent">
                You're One Step Away from LMS Power-Up!
              </div>
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Confirm Your Purchase & Unlock Codify!
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-6">
            {/* Institution Details */}
            <div className="rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 p-6">
              <p className="text-sm font-medium text-gray-500">Billed To:</p>
              <p className="font-semibold text-gray-700">{institution.name}</p>
              <p className="text-sm font-medium text-gray-500">Email:</p>
              <p className="font-semibold text-gray-700">{institution.email}</p>
              <p className="text-sm font-medium text-gray-500">Institution:</p>
              <p className="font-semibold text-gray-700">{institution.institutionName}</p>
              <p className="text-sm font-medium text-gray-500">Address:</p>
              <p className="font-semibold text-gray-700">{institution.address}</p>
              <p className="text-sm font-medium text-gray-500">Contact:</p>
              <p className="font-semibold text-gray-700">{institution.phoneNumber}</p>
              <p className="text-sm font-medium text-gray-500">Payment Method:</p>
              <p className="font-semibold text-gray-700">{institution.paymentMethod}</p>
            </div>

            {/* Total Amount */}
            <div className="flex items-center justify-between rounded-lg  bg-blue-100 px-4 py-3">
              <p className="text-xl font-semibold text-gray-700">Total:</p>
              <p className="text-2xl font-bold text-primary">₱{institution.amount}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-4">
              <Button onClick={handleLogout} variant="secondary" className="px-10 py-4">
                Logout
              </Button>
              <Button className="w-full px-6 py-4" onClick={handlePayment} disabled={loading}>
                {loading ? 'Processing...' : 'Proceed to Payment'} <ChevronRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </main>
  );
}

export default PaymentSummary;