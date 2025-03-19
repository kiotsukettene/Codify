//import React from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useprofAuthStore } from "@/store/profAuthStore";
import ProfPasswordResetConfirmation from "@/components/professor-view/Prof-Password-reset";
import toast from "react-hot-toast";
import Astro from "@/assets/picture/random-background/Astro.png";
import FiveStar from "@/assets/picture/random-background/FiveStar.png";
import FourStar from "@/assets/picture/random-background/FourStar.png";
import PinkStar from "@/assets/picture/random-background/PinkStar.png";
import VioletStar from "@/assets/picture/random-background/VioletStar.png";
import SpaceShip from "@/assets/picture/random-background/Spaceship.png";
import Waves from "@/assets/picture/random-background/Waves.png";
import ProfBg2 from "@/components/Auth/Prof-Bg-2";

const ProfForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const { isLoading, forgotPassword } = useprofAuthStore();

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setEmailSent(true);
    toast.success("Password reset link sent to your email");
  };
  return (
    <div className="relative min-h-screen w-full bg-[#F5EBFF] flex items-center justify-center overflow-hidden p-4">
    <ProfBg2 />
    
      {emailSent ? (
        //success message
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
          <form onSubmit={handleSendResetLink}>
            <CardContent className="space-y-4 p-0 mt-6 sm:mt-8">
              <div className="space-y-3 sm:space-y-4 relative">
                <Input
                  icon={Mail}
                  type="email"
                  value={email}
                  placeholder="Email Address"
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 sm:h-12 px-4 bg-white placeholder:text-sm lg:placeholder:text-base"
                />
                <p className="text-xs py-2 text-gray-500 text-center">
                  A password reset link will be sent to the provided email
                  address.
                </p>
              </div>
              <div className="pt-2 space-y-3">
                <Button type="submit" className="w-full">
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