import React from 'react';
import { Sparkles, Zap, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

function PaymentSummary() {
  const navigate = useNavigate()
  const orderDetails = {
    billedTo: "John Smith",
    email: "Johnsmith@Gmail.Com",
    institution: "University Of Caloocan City",
    address: "23J+R9M, Congressional Rd Ext, Caloocan, Metro Manila",
    contact: "09090909090",
    paymentMethod: "Visa Card",
    total: "₱70,000",
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4">
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
            {/* Achievement Card */}
            <div className="rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Object.entries(orderDetails).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </p>
                    <p className="font-semibold text-gray-700">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex items-center justify-between rounded-lg  bg-blue-100 px-4 py-3">
              <p className="text-xl font-semibold text-gray-700">Total:</p>
              <p className="text-2xl font-bold text-primary">₱70,000</p>
            </div>

            {/* Motivational Message */}
            <div className="rounded-lg bg-yellow-100 p-4 text-center text-sm text-yellow-700">
              🚀 Epic win! You're about to level up your institution's learning game!
              <br />
              Confirm your purchase to start your legendary educational journey.
            </div>

            {/* Action Button */}
           

           <div className="flex justify-between gap-4 ">
           <Button onClick={() => navigate('/email-verify')} variant='secondary' className='px-10 py-4 '>Cancel</Button>
           <Button className='w-full px-6 py-4' onClick={() => navigate('/payment-success')}>Proceed to Payment <ChevronRight/></Button>
           
           </div>
           
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PaymentSummary;