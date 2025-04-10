import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useStudentStore } from "@/store/studentStore";
import { Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ProfBg2 from "@/components/Auth/Prof-Bg-2";

function StudentForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { isLoading, studentForgotPassword, error, clearError } = useStudentStore();

  
  useEffect(() => {
    clearError();
  }, []);

  const validateEmail = (email) => {
    if (!email) {
      return "Please input your email address";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleSendResetLink = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setValidationError(emailError);
      return;
    }

    setValidationError("");

    try {
      await studentForgotPassword(email);
      setEmailSent(true);
    } catch (error) {
      // Error is handled in studentForgotPassword (sets error state and shows toast)
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F5EBFF] flex items-center justify-center overflow-hidden p-4">
      <ProfBg2 />

      {emailSent ? (
        <div className="text-center">
          <div className="min-h-screen flex items-center justify-center">
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
              <Button className="w-full text-white">
                <Link to="/student/login">Back to login</Link>
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
          <form onSubmit={handleSendResetLink} noValidate>
            <CardContent className="space-y-4 p-0 mt-6 sm:mt-8">
              <div className="space-y-3 sm:space-y-4 relative">
                <Input
                  icon={Mail}
                  type="email"
                  value={email}
                  placeholder="Email Address"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setValidationError("");
                  }}
                  className="h-10 sm:h-12 px-4 bg-white placeholder:text-sm lg:placeholder:text-base"
                />
                <div className="min-h-[1rem]">
                  {validationError && (
                    <p className="text-red-500 text-sm">{validationError}</p>
                  )}
                  {error && !validationError && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}
                </div>
                <p className="text-xs py-1 text-gray-500 text-center">
                  A password reset link will be sent to the provided email
                  address.
                </p>
              </div>
              <div className="pt-2 space-y-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
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
            <Link to="/student/login" className="underline">
              Go back to login
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

export default StudentForgotPasswordPage;