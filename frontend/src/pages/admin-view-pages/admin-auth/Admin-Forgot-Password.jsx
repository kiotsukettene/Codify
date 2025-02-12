import React, { useState } from "react";
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

import union from "../../../assets/picture/random background/union.png";
import pinkFlower from "../../../assets/picture/random background/pink-flower.png";
import blueFlower from "../../../assets/picture/random background/blue-flower.png";
import purpleFlower from "../../../assets/picture/random background/purple-flower.png";
import arrow from "../../../assets/picture/random background/arrow.png";
import mascot from "../../../assets/picture/random background/mascot.png";
import logo from "../../../assets/picture/logos/logo.png";

function AdminForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const { isLoading, forgotPassword, error } = useAuthStore();

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setEmailSent(true);
    toast.success("Password reset link sent to your email");
  };
  return (
    <div className="relative min-h-screen w-full bg-[#F5EBFF] flex items-center justify-center overflow-hidden p-4">
      {/* Background Images */}
      <Link to="/">
        <img
          src={logo}
          alt="Logo"
          className="absolute top-7 left-24 lg:left-10 lg:w-28"
        />
      </Link>
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
          <PasswordResetConfirmation />
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
