//import React from 'react'
import { Button } from "@/components/ui/button";
//import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Astro from "../../assets/picture/random background/Astro.png";
import FiveStar from "../../assets/picture/random background/FiveStar.png";
import FourStar from "../../assets/picture/random background/FourStar.png";
import PinkStar from "../../assets/picture/random background/PinkStar.png";
import VioletStar from "../../assets/picture/random background/VioletStar.png";
import SpaceShip from "../../assets/picture/random background/Spaceship.png";
import Waves from "../../assets/picture/random background/Waves.png";
import logo from "../../assets/picture/logos/logo.png";
import success from "../../assets/picture/random background/success.png";

const ProfSuccessPassword = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#F5EBFF] flex items-center justify-center overflow-hidden p-4">
      {/* Background Images */}
      <div>
        <img
          src={logo}
          alt="Logo"
          className="absolute top-10 lg:top-7 left-24 lg:left-10 lg:w-28"
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

      <Card className="w-full max-w-[450px] p-8 sm:p-10 rounded-3xl shadow-sm">
        <CardHeader className="space-y-2 text-center p-0">
          <img
            src={success}
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
