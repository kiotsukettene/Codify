import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PasswordResetConfirmation from "@/components/Auth/Password-reset-confirmation";
import { useAuthStore } from "@/store/authStore";
import { Loader, Mail } from "lucide-react";
import toast from "react-hot-toast";

import union from "@/assets/picture/random-background/union.png"
import pinkFlower from "@/assets/picture/random-background/pink-flower.png"
import blueFlower from "@/assets/picture/random-background/blue-flower.png"
import purpleFlower from "@/assets/picture/random-background/purple-flower.png"
import arrow from "@/assets/picture/random-background/arrow.png"
import mascot from "@/assets/picture/random-background/mascot.png"

function AdminForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const { isLoading, forgotPassword, error, clearError } = useAuthStore();

  useEffect(() => {
    clearError();
  }, []);

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setEmailSent(true);
    toast.success("Password reset link sent to your email");
  };
  return (
    <div className="relative min-h-screen w-full bg-[#F5EBFF] flex items-center justify-center overflow-hidden p-4">
      {/* Background Images */}

      <img
        src={pinkFlower}
        alt="Pink Flower"
        className="absolute top-16 lg:top-32 left-[-28px] w-16 lg:w-32 opacity-90"
      />
      <img
        src={purpleFlower}
        alt="Purple Flower"
        className="absolute bottom-[100px] left-[-30px] w-20 lg:w-52 opacity-90"
      />
      <img
        src={blueFlower}
        alt="Blue Flower"
        className="absolute top-[250px] right-[-30px] w-16 lg:w-56 opacity-90"
      />
      <img
        src={union}
        alt="Star"
        className="absolute top-10 right-96 w-10 lg:w-52"
      />
      <img
        src={arrow}
        alt="Arrow"
        className="absolute top-10 left-24 w-10 lg:w-52"
      />
      <img
        src={arrow}
        alt="Arrow"
        className="absolute bottom-20 left-44 w-10 lg:w-52"
      />
      <img
        src={arrow}
        alt="Arrow"
        className="absolute bottom-20 right-0 w-20 lg:w-72 rotate-180"
      />
      <img
        src={mascot}
        alt="Mascot"
        className="absolute bottom-[-150px] right-[-100px] w-72 lg:w-96"
      />

      {emailSent ? (
        //success message perd
        <div className="text-center">
          <div className="min-h-screen flex items-center justify-center ">
                <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6 space-y-6 text-center">
                  <div className="space-y-2">
                    <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-purple-600"
                      >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                      Check your email
                    </h1>
                    <p className="text-gray-500 text-sm">
                      We have sent password recovery instructions to your email.
                    </p>
                  </div>
                  <Button className="w-full   text-white">
                    <Link to="/admin/login">Back to login</Link>
                  </Button>
                </div>
              </div>
        </div>
      ) : (
        <Card className="w-full max-w-[450px] p-8 sm:p-12 rounded-3xl shadow-sm">
          <CardHeader className="space-y-2 text-center p-0">
            <h1 className="text-2xl sm:text-[32px] font-semibold tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-sm sm:text-[15px] text-muted-foreground">
              Enter your email for instructions.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendResetLink} className="space-y-4">
              <CardContent className="space-y-4 p-0 mt-6 sm:mt-8">
                <div className="space-y-3 sm:space-y-4 relative">
                  <Input
                    icon={Mail}
                    id="email"
                    type="email"
                    value={email}
                    placeholder="Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 sm:h-12 px-4 bg-white placeholder:text-sm lg:placeholder:text-base"
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <p className="text-xs py-2 text-gray-500 text-center">
                    A password reset link will be sent to the provided email
                    address.
                  </p>
                </div>
                <div className="pt-2 space-y-3">
                  <Button type="submit" className="w-full">
                    {isLoading && !error ? (
                      <Loader className="size-6 animate-spin mx-auto" />
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </div>
              </CardContent>
            </form>

            <div className="mt-4 text-center text-sm">
              Remembered your password?{" "}
              <Link to="/admin/login" className="underline">
                Go back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AdminForgotPasswordPage;
