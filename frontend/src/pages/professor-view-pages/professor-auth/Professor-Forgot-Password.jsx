import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { useprofAuthStore } from "@/store/profAuthStore";
import toast from "react-hot-toast";
import ProfPasswordResetConfirmation from "@/components/Auth/Password-reset-confirmation";
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

      {/* Background Images */}
          <ProfBg2 />
      


    <Card className="w-full max-w-[450px] p-8 sm:p-12 rounded-3xl shadow-sm">
      <CardHeader className="space-y-2 text-center p-0">
        <h1 className="text-2xl sm:text-[32px] font-semibold tracking-tight">
          Forgot Password?
        </h1>
        <p className="text-sm sm:text-[15px] text-muted-foreground">
          Enter your email for instructions.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 p-0 mt-6 sm:mt-8">
        <div className="space-y-3 sm:space-y-4 relative">
          <Input 
          type="email" 
          name= "email"
          placeholder="Email Address" 
          className="h-10 sm:h-12 px-4 bg-white placeholder:text-sm lg:placeholder:text-base" 
          />
          </div>

        <div className="pt-2 space-y-3">
          <Button className="w-full h-10 sm:h-12 text-sm sm:text-[15px] bg-[#7C3AED] hover:bg-[#6D28D9]">
            Verify
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}

export default ProfForgotPassword;