import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Success from "@/assets/picture/random-background/Success.png"
import ProfBg2 from "@/components/Auth/Prof-Bg-2";

const ProfSuccessPassword = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#F5EBFF] flex items-center justify-center overflow-hidden p-4">
      {/* Background Images */}
      <ProfBg2 />
      

      {/* Card */}

      <Card className="w-full max-w-[450px] p-8 sm:p-10 rounded-3xl shadow-sm">
        <CardHeader className="space-y-2 text-center p-0">
          <img
            src={Success}
            alt="Success"
            className="w-36 h-auto mx-auto mb-4"
          />
          <h1 className="text-xl sm:text-[20px] font-semibold tracking-tight">
            Password Changed Successfully!
          </h1>
        </CardHeader>
        <CardContent className="space-y-4 mt-2 sm:mt-4">
          <p className="text-gray-500 text-xs sm:text-sm text-center">
            Your password has been updated. You can now log in with your new
            credentials. 🚀
          </p>

          <div className="pt-2 space-y-3">
            <Button className="w-full h-10 sm:h-12 text-sm sm:text-[15px] bg-[#7C3AED] hover:bg-[#6D28D9]">
              <Link to="/professor/login">Go Back to login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfSuccessPassword;
