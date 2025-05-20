import React, { useState, useEffect } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Particles } from "@/components/ui/particles";
import axios from "axios";
import toast from "react-hot-toast";

function PaymentSummary() {
  const navigate = useNavigate();
  const { institution, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [paymongoReady, setPaymongoReady] = useState(false);

  useEffect(() => {
    const checkPaymongo = () => {
      if (window.Paymongo) {
        setPaymongoReady(true);
        console.log("Paymongo SDK loaded");
      } else {
        console.log("Paymongo SDK not loaded yet");
        setTimeout(checkPaymongo, 100);
      }
    };
    checkPaymongo();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handlePayment = async () => {
    setLoading(true);

    const baseUrl =
      import.meta.env.MODE === "development"
        ? "http://localhost:3000"
        : import.meta.env.VITE_API_URL;

    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/initiate-payment`,
        {
          institutionId: institution._id,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Checkout initiation failed");
      }

      window.location.href = response.data.checkoutUrl;
    } catch (error) {
      toast.error("Checkout initiation failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative bg-gradient-to-b from-[#4C1D95] via-[#6B21A8] to-[#A855F7] w-full min-h-screen flex items-center justify-center py-12">
      <div className="absolute inset-0 z-0">
        <Particles
          className="w-full h-full"
          quantity={300}
          ease={60}
          color="#8A2BE2"
          refresh
        />
      </div>
      <div className="w-full max-w-4xl relative z-10 flex justify-center">
        <Card className="overflow-hidden bg-white w-full max-w-2xl">
          <div className="absolute inset-0 opacity-50" />
          <CardHeader className="relative text-center">
            <div className="mb-2 flex justify-center">
              <div className="animate-bounce rounded-full bg-yellow-100 p-3">
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-rose-300 bg-clip-text">
              You're One Step Away from LMS Power-Up!
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Confirm Your Purchase & Unlock Codify!
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-6">
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-6">
              <div className="space-y-2 gap-6">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    Billed To:
                  </p>
                  <p className="font-semibold text-gray-700">
                    {institution.name}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">Email:</p>
                  <p className="font-semibold text-gray-700">
                    {institution.email}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    Institution:
                  </p>
                  <p className="font-semibold text-gray-700">
                    {institution.institutionName}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">Address:</p>
                  <p className="font-semibold text-gray-700">
                    {institution.address}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-500">Contact:</p>
                  <p className="font-semibold text-gray-700">
                    {institution.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between">
              <p className="text-xl font-semibold text-gray-700">Total:</p>
              <p className="text-2xl font-bold text-primary text-blue-800">
                ₱ 50,000
              </p>
            </div>
            <div className="flex justify-between gap-4">
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="px-10 py-4"
              >
                Cancel
              </Button>
              <Button
                className="w-full px-6 py-4"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed to Payment"}{" "}
                <ChevronRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default PaymentSummary;
