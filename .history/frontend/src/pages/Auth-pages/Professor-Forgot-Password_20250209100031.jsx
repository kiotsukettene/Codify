//import React from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { mail } from "lucide-react";
import Astro from "../../assets/picture/random background/Astro.png";
import FiveStar from "../../assets/picture/random background/FiveStar.png";
import FourStar from "../../assets/picture/random background/FourStar.png";
import PinkStar from "../../assets/picture/random background/PinkStar.png";
import VioletStar from "../../assets/picture/random background/VioletStar.png";
import SpaceShip from "../../assets/picture/random background/Spaceship.png";
import Waves from "../../assets/picture/random background/Waves.png";
import logo from "../../assets/picture/logos/logo.png";

const ProfForgotPassword = () => {
  {
    /* connection to backend */
  }

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isLoading, forgotPasswrod } = useprofAuthStore();

  const handleSubmit = async (e) => {};

  return (
    <div className="relative min-h-screen w-full bg-[#F5EBFF] flex items-center justify-center overflow-hidden p-4">
      <div>
        {/* Background Images */}
        <img
          src={logo}
          alt="Logo"
          className="absolute top-28 lg:top-7 left-24 lg:left-10 lg:w-28"
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

      <Card className="w-full max-w-[450px] p-8 sm:p-12 rounded-3xl shadow-sm">
        <CardHeader className="space-y-2 text-center p-0">
          <h1 className="text-2xl sm:text-[32px] font-semibold tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-sm sm:text-[15px] text-muted-foreground">
            Enter your email for instructions.
          </p>
        </CardHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 p-0 mt-6 sm:mt-8">
              <div className="space-y-3 sm:space-y-4 relative">
                <Input
                  icon={mail}
                  type="email"
                  value={email}
                  placeholder="Email Address"
                  onchange={(e) => setEmail(e.target.value)}
                  className="h-10 sm:h-12 px-4 bg-white placeholder:text-sm lg:placeholder:text-base"
                />
              </div>

              <div className="pt-2 space-y-3">
                <Button className="w-full h-10 sm:h-12 text-sm sm:text-[15px] bg-[#7C3AED] hover:bg-[#6D28D9]">
                  Verify
                </Button>
              </div>
            </CardContent>
          </form>
        ) : (
        )}
      </Card>
    </div>
  );
};

export default ProfForgotPassword;
