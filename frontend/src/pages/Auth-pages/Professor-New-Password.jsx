//import React from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useprofAuthStore } from "@/store/profAuthStore";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

//bg images
import Astro from "../../assets/picture/random background/Astro.png";
import FiveStar from "../../assets/picture/random background/FiveStar.png";
import FourStar from "../../assets/picture/random background/FourStar.png";
import PinkStar from "../../assets/picture/random background/PinkStar.png";
import VioletStar from "../../assets/picture/random background/VioletStar.png";
import SpaceShip from "../../assets/picture/random background/Spaceship.png";
import Waves from "../../assets/picture/random background/Waves.png";
import logo from "../../assets/picture/logos/logo.png";

const ProfNewPassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [ConfirmNewPassword, setConfirmNewPassword] = useState("");
  const { resetPassword, error, isLoading } = useprofAuthStore();

  const { token } = useParams();

  const handleNewPassword = async (e) => {
    e.preventDefault();
    if (password !== ConfirmNewPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await resetPassword(token, password);

      toast.success("Password reset successful!");
      setTimeout(() => {
        navigate("/professor/success-reset");
      }, 2000);
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.message || "An error occurred upon resetting password");
    }
  };
  return (
    <div className="relative min-h-screen w-full bg-[#F5EBFF] flex items-center justify-center overflow-hidden p-4">
      {/* Background Images */}
      <div>
        <img
          src={logo}
          alt="Logo"
          className="absolute top-20 lg:top-7 left-24 lg:left-10 lg:w-28"
        />
        <img
          src={Astro}
          alt="Mascot"
          className="absolute top-10 right-[-120px] w-60 lg:w-96 opacity-90 -rotate-12"
        />
        <img
          src={FiveStar}
          alt="Five Star"
          className="absolute top-32 lg:top-60 left-80 lg:left-52 w-5 lg:w-12 opacity-90"
        />
        <img
          src={FiveStar}
          alt="Five Star"
          className="absolute top-20 lg:top-32 right-80 lg:right-96 w-20 lg:w-16 opacity-90"
        />
        <img
          src={FourStar}
          alt="Four Star"
          className="absolute bottom-[10px] right-0 w-20 lg:w-64 opacity-90 rotate-45"
        />
        <img
          src={PinkStar}
          alt="Star"
          className="absolute top-2/4 left-32 w-5 lg:w-10"
        />
        <img
          src={PinkStar}
          alt="Star"
          className="absolute top-2/4 right-52 w-5 lg:w-10"
        />
        <img
          src={PinkStar}
          alt="Star"
          className="absolute bottom-36 right-72 w-5 lg:w-20"
        />
        <img
          src={VioletStar}
          alt="Star"
          className="absolute top-24 left-[-90px] w-10 lg:w-52"
        />
        <img
          src={SpaceShip}
          alt="Spaceship"
          className="absolute bottom-4 lg:bottom-32 left-32 w-36 lg:w-52"
        />
        <img
          src={Waves}
          alt="wave"
          className="absolute bottom-0 left-0 w-52 lg:w-72"
        />
      </div>

      {/* Card */}

      <Card className="w-full max-w-[450px] p-8 sm:p-12 rounded-3xl shadow-sm">
        <CardHeader className="space-y-2 text-center p-0">
          <h1 className="text-2xl sm:text-[32px] font-semibold tracking-tight">
            Set new password
          </h1>
        </CardHeader>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <CardContent className="space-y-4 p-0 mt-6 sm:mt-8">
          <form onSubmit={handleNewPassword} className="space-y-4">
            <div className="relative">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                New Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your new password"
                className="h-10 sm:h-12 px-4 bg-white placeholder:text-sm lg:placeholder:text-base"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm Password
              </label>
              <Input
                id="ConfirmNewPassword"
                type="password"
                value={ConfirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="h-10 sm:h-12 px-4 bg-white placeholder:text-sm lg:placeholder:text-base"
                required
              />
            </div>

            <div className="pt-2 space-y-3">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Set New Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfNewPassword;
