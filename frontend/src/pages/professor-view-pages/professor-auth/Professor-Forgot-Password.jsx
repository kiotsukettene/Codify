import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useprofAuthStore } from "@/store/profAuthStore";
import ProfPasswordResetConfirmation from "@/components/professor-view/Prof-Password-reset";
import toast from "react-hot-toast";
import ProfBg2 from "@/components/Auth/Prof-Bg-2";

const ProfForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [validationError, setValidationError] = useState(""); // Add state for validation errors
  const { isLoading, forgotPassword, error, clearError } = useprofAuthStore(); // Include error from store

  useEffect(() => {
    clearError();
  }, [clearError]);

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

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setValidationError(emailError);
      return;
    }

    setValidationError("");

    try {
      await forgotPassword(email);
      // Only set emailSent to true if the API call succeeds
      setEmailSent(true);
      toast.success("Password reset link sent to your email");
    } catch (error) {
      // Error is handled in forgotPassword (sets error state and shows toast)
      // No need to set emailSent to true here
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F5EBFF] flex items-center justify-center overflow-hidden p-4">
      <ProfBg2 />

      {emailSent ? (
        // Success message
        <div className="text-center">
          <ProfPasswordResetConfirmation />
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
                    setValidationError(""); // Clear validation error on change
                    clearError(); // Clear API error on change
                  }}
                  className="h-10 sm:h-12 px-4 bg-white placeholder:text-sm lg:placeholder:text-base"
                />
                {/* Reserve space for the error message */}
                <div className="min-h-[24px]">
                  {validationError && (
                    <p className="text-red-500 text-sm">{validationError}</p>
                  )}
                  {error && !validationError && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}
                </div>
                <p className="text-xs py-2 text-gray-500 text-center">
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
            <Link to="/professor/login" className="underline">
              Go back to login
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProfForgotPassword;