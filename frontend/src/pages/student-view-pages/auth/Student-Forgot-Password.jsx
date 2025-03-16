import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Astro from "@/assets/picture/random-background/Astro.png"
import FiveStar from "@/assets/picture/random-background/FiveStar.png"
import FourStar from "@/assets/picture/random-background/FourStar.png"
import PinkStar from "@/assets/picture/random-background/PinkStar.png"
import VioletStar from "@/assets/picture/random-background/VioletStar.png"
import SpaceShip from "@/assets/picture/random-background/Spaceship.png"
import Waves from "@/assets/picture/random-background/Waves.png"
import logo from "@/assets/picture/logos/Logo.png"
import { useStudentStore } from '@/store/studentStore'
import { Form } from '@/components/ui/form'
import { ArrowLeft, CheckIcon, Loader, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import PasswordResetConfirmation from '@/components/Auth/Password-reset-confirmation'


function StudentForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false)

    const {isLoading, studentForgotPassword} = useStudentStore()

    const handleSendResetLink = async (e) => {
        e.preventDefault();
        await studentForgotPassword(email);
        setEmailSent(true);
        toast.success("Password reset link sent to your email");

    };
    
    


   return(
    <div className="relative min-h-screen w-full bg-[#F5EBFF] flex items-center justify-center overflow-hidden p-4">
    <div>
      {/* Background Images */}
         <Link to="/">
                <img 
                  src={logo}
                  alt="Logo" 
                  className="absolute top-7 left-24 lg:left-10 lg:w-28" 
                />
                </Link>
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
    {emailSent ? (
      //success message
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
          <Link to="/student/login" className="underline">
            Go back to login
          </Link>
        </div>
      </Card>
    )}
  </div>
   )
}

export default StudentForgotPasswordPage


